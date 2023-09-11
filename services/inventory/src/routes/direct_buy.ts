import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  InventoryStatus,
  validateRequest,
} from 'scytalelabs-auction';

import { InventoryItemUpdatedPublisher } from '../../src/events/publishers/inventory-item-updated-publisher';
import { DirectBuy, Inventory, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/inventory/buy/:itemId',
  requireAuth,
  [
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0'),
    // body('quantity')
    //   .isFloat({ gt: 0 })
    //   .withMessage('Quantity must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const { amount, /*quantity,*/ user } = req.body;
      const itemId = req.params.itemId;

      const item = await Inventory.findOne({
        where: { id: itemId },
      });

      if (!item) {
        throw new NotFoundError();
      }

      // if (item.quantity < quantity) {
      //   throw new BadRequestError(
      //     'Buying quantity must be less than the listing quantity'
      //   );
      // }

      if(amount< item.totalPrice){
        throw new BadRequestError(
          'Amount less than the total price of the item'
        );
      }
      if (req.currentUser!.id === item.userId) {
        throw new BadRequestError(
          'Sellers cannot buy there own items'
        );
      }
      const direct_buy = await DirectBuy.create(
        {
          inventoryItemId: item.id,
          userId: req.currentUser.id,
          title: item.title,
          quantity: item.quantity,
          price: amount,
        },
        { transaction }
      );

      // const bought = Number(item.quantity) - Number(quantity);
      await item.update({
        userId: req.currentUser.id,
        status: InventoryStatus.Fulfilled,
      });
      new InventoryItemUpdatedPublisher(natsWrapper.client).publish({
        id: item.id,
        title: item.title,
        status: InventoryStatus.Fulfilled,
        price: item.totalPrice,
        totalPrice: item.totalPrice,
        massOfItem: item.massOfItem,
        description: item.description,
        version: item.version,
      });
      res.status(201).send(item);
    });
  }
);

export { router as directBuyRouter };
