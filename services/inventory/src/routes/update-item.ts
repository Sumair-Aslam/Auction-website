// import {
//   BadRequestError,
//   NotFoundError,
//   requireAuth,
//   validateRequest,
// } from '@jjmauction/common';
import {
  BadRequestError,
  InventoryStatus,
  NotFoundError,
  requireAuth,
  validateRequest,
} from 'scytalelabs-auction';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { InventoryItemUpdatedPublisher } from '../events/publishers/inventory-item-updated-publisher';
import { Inventory, User, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/inventory/:itemId',
  requireAuth,
  [
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('massOfItem')
      .isFloat({ gt: 0 })
      .withMessage('Mass must be greater than 0'),
    body('title')
      .isLength({ min: 3, max: 100 })
      .withMessage('The item name must be between 5 and 1000 characters'),
    body('description')
      .isLength({ min: 5, max: 500 })
      .withMessage(
        'The inventory description must be between 5 and 500 characters'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const { title, price, massOfItem, quantity, description } = req.body;
      const itemId = req.params.itemId;

      console.log("ITEM ID: ", req.params.itemId);
      console.log("REQ>BODY : " , req.body);

      const item = await Inventory.findOne({
        where: { id: itemId },
      });

      console.log("ITEM DATA: " , item);

      if (!item) {
        throw new NotFoundError();
      }
      let taxByMassOfItem;
      let salesTax;
      let exciseRate;
      if (item.location === 'North California') {
        taxByMassOfItem = 3;
        salesTax = 5;
        exciseRate = 15;
      } else {
        taxByMassOfItem = 30;
        salesTax = 25;
        exciseRate = 5;
      }
      let taxAmount;
      if (salesTax <= 0 || salesTax >= 100) {
        // Need consultancy about higher rate
        throw new BadRequestError('Invalid sales tax rate');

        // throw new BadRequestError('Sales tax ambiguous value given');
      } else {
        taxAmount = (salesTax / 100) * price; //https://propakistani.pk/how-to/how-to-calculate-sales-tax/
      }
      let exciseprice = (exciseRate / 100) * price;
      console.log('exciseprice', exciseprice);
      let massprice = (taxByMassOfItem / 100) * massOfItem;
      console.log('massprice', massprice);
      // console.log('price',price);
      // console.log('exciseprice',exciseprice);
      // console.log('taxAmount',taxAmount);
      let sum =
        Number(price) +
        Number(exciseprice) +
        Number(taxAmount) +
        Number(massprice);

      await item.update(
        {
          title,
          price,
          totalPrice : sum,
          massOfItem,
          quantity,
          description,
        },
        { transaction }
      );

      new InventoryItemUpdatedPublisher(natsWrapper.client).publish({
        id: item.id!,
        // userId: req.currentUser!.id,
        // slug: item.slug!,
        title,
        status : InventoryStatus.Available,
        price,
        totalPrice:sum,
        massOfItem,
        description,
        version: item.version!,
      });

      res.status(201).send(item);
    });
  }
);

export { router as updateItemRouter };
