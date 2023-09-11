import {
  BadRequestError,
  ListingStatus,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jjmauction/common';
import cloudinary from 'cloudinary';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import multer from 'multer';

import { store } from '../../jsClient/test/installed';
import { ListingCreatedPublisher } from '../events/publishers/listing-created-publisher';
import { Inventory, Listing, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
// local_cloudinary.config({
//         cloud_name: 'scytalelabs',
//         api_key: '432183885194623',
//         api_secret: 'mZAxNn0YNm7YxPOMAvrBP0UIUfU',
//         secure: true
//     });
const upload = multer({ storage: storage });

router.post(
  '/api/listings',
  upload.single('image'),
  requireAuth,
  [
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('title')
      .isLength({ min: 3, max: 100 })
      .withMessage('The listing title must be between 5 and 1000 characters'),
    body('expiresAt').custom((value) => {
      let enteredDate = new Date(value);
      let tommorowsDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (enteredDate <= tommorowsDate)
        throw new BadRequestError('Invalid Date');
      return true;
    }),
    body('description')
      .isLength({ min: 5, max: 500 })
      .withMessage(
        'The listing description must be between 5 and 500 characters'
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const {
        price,
        title,
        description,
        expiresAt,
        /*********/
        paymentConfirmation,
        massOfItem,
        // taxByMassOfItem, //will get this from a table that contains the tax by mass information
        // salesTax,
        // exciseRate,
        inventoryItemId,
        quantity,
        fixPrice,
        /*********/
      } = req.body;

      // @ts-ignore
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        eager: [
          { width: 225, height: 225 },
          { width: 1280, height: 1280 },
        ],
      });

      /*************/
      const taxByMassOfItem = 3;
      const salesTax = 5;
      const exciseRate = 15;

      let taxAmount;
      if (salesTax <= 0 || salesTax >= 100) {
        // Need consultancy about higher rate
        throw new BadRequestError('Invalid sales tax rate');

        // throw new BadRequestError('Sales tax ambiguous value given');
      } else {
        taxAmount = (salesTax / 100) * price; //https://propakistani.pk/how-to/how-to-calculate-sales-tax/
      }

      if (
        (taxByMassOfItem <= 0 || taxByMassOfItem >= 100) &&
        (exciseRate <= 0 || exciseRate >= 100)
      ) {
        // throw new BadRequestError('Excise Rate not specified');
        throw new BadRequestError('There must be one tax type specified');
      }
      const item = await Inventory.findOne({
        where: { id: inventoryItemId },
      });

      if (!item) {
        throw new NotFoundError();
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
      console.log('price', price);
      console.log('exciseprice', exciseprice);
      console.log('taxAmount', taxAmount);
      console.log('massprice', massprice);
      console.log('sum', sum);

      /*************/

      const blockchainResult = store(
        Date.now.toString(),
        title,
        req.currentUser.id,
        price,
        ListingStatus.Active,
        expiresAt,
        price,
        req.currentUser.id,
        inventoryItemId,
        paymentConfirmation,
        massOfItem,
        taxByMassOfItem.toString(),
        salesTax.toString(),
        exciseRate.toString(),
        sum.toString(),
        req.currentUser.id,
        fixPrice,
        quantity,
        title,
        description,
        result.public_id,
        result.eager[0].secure_url,
        result.eager[1].secure_url,
        '1'
      );

      res.status(400).send(blockchainResult);
    });
  }
);

export { router as createListingRouter };
