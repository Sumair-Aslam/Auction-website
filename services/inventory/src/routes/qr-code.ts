import { NotFoundError } from '@jjmauction/common';
import express, { Request, Response } from 'express';
import { QRCode } from 'qrcode';
import { Sequelize } from 'sequelize';

import { Inventory, User } from '../models';

const router = express.Router();

router.get('/api/inventory/:itemId', async (req: Request, res: Response) => {
  const itemId = req.params.itemId;

  const item = await Inventory.findOne({
    include: {
      model: User,
    },
    where: { id: itemId },
  });

  if (!item) {
    throw new NotFoundError();
  }
  QRCode.toDataURL(item, function (err, url) {
    console.log(url);
  });
  res.status(200).send(item);
});

export { router as qrCodeRouter };
