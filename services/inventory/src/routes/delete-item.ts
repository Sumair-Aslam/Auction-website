import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@jjmauction/common';
import express, { Request, Response } from 'express';

import { InventoryItemDeletedPublisher } from '../events/publishers/inventory-item-deleted-publisher';
import { Inventory, db } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { socketIOWrapper } from '../socket-io-wrapper';

const router = express.Router();

router.delete(
  '/api/inventory/:itemId',
  requireAuth,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const itemId = req.params.itemId;

      const item = await Inventory.findOne({
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundError();
      }

      if (item.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      await Inventory.destroy({
        where: {
          id: itemId,
        },
        transaction,
      });

      new InventoryItemDeletedPublisher(natsWrapper.client).publish({
        id: itemId,
        version: item.version!,
      });

      await socketIOWrapper.io
        .of('/socket')
        .to(item.id)
        .emit('item-deleted', null);

      res.status(204).send(item);
    });
  }
);

export { router as deleteItemRouter };
