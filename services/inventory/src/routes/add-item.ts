import cloudinary from 'cloudinary';
// var local_cloudinary = require('cloudinary').v2;
// local_cloudinary.config({
//   cloud_name: 'scytalelabs',
//   api_key: '432183885194623',
//   api_secret: 'mZAxNn0YNm7YxPOMAvrBP0UIUfU',
//   secure: true,
// });
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
// import {
//   BadRequestError,
//   NotFoundError,
//   requireAuth,
//   validateRequest,
// } from '@jjmauction/common';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from 'scytalelabs-auction';

import { InventoryItemCreatedPublisher } from '../events/publishers/inventory-item-created-publisher';
import { Inventory, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  '/api/inventory/addItem',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'sopDocument', maxCount: 1 },
    { name: 'labReports', maxCount: 1 },
  ]),
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
      const {
        title,
        // listingId,
        // soldOut,
        price,
        massOfItem,
        quantity,
        description,
        paymentConfirmation,
        location,
      } = req.body;

      console.log('req.body : ', req.body);
      // @ts-ignore
      console.log('req.files : ', req.files);

      // const listing = await Listing.findOne({
      //   where: { id: listingId },
      // });

      // if (!listing) {
      //   throw new NotFoundError();
      // }

      // @ts-ignore
      const result = await cloudinary.v2.uploader.upload(req.files.image[0].path,
        {
          eager: [
            { width: 225, height: 225 },
            { width: 1280, height: 1280 },
          ],
        }
      );
      console.log('result', result);

      // @ts-ignore
      const result1 = await cloudinary.v2.uploader.upload(req.files.sopDocument[0].path,
        { resource_type: 'raw' }
      );
      // @ts-ignore
      const sopName = req.files.sopDocument[0].filename;
      // @ts-ignore
      console.log('LAB Reports Result : ', req.files.labReports);
      // @ts-ignore
      const result2 = await cloudinary.v2.uploader.upload(req.files.labReports[0].path,
        {
          resource_type: 'raw',
        }
      );
      // @ts-ignore
      const reportName = req.files.labReports[0].filename;
      let taxByMassOfItem;
      let salesTax;
      let exciseRate;
      let cultivationTax;
      let extractionTax;
      let concentrateTax;

      if (location === 'North California') {
        taxByMassOfItem = 3;
        salesTax = 5;
        exciseRate = 15;
        cultivationTax = 1;
        extractionTax = 1;
        concentrateTax = 1;
      } else {
        taxByMassOfItem = 30;
        salesTax = 25;
        exciseRate = 5;
        cultivationTax = 1;
        extractionTax = 1;
        concentrateTax = 1;
      }
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

      let exciseprice = (exciseRate / 100) * price;
      console.log('exciseprice', exciseprice);

      let cultivationPrice = (cultivationTax / 100) * price;
      console.log('cultivationTax', cultivationPrice);

      let extractionPrice = (extractionTax / 100) * price;
      console.log('exciseprice', extractionPrice);

      let concentratePrice = (concentrateTax / 100) * price;
      console.log('exciseprice', concentratePrice);

      let massprice = (taxByMassOfItem / 100) * massOfItem;
      console.log('massprice', massprice);
      // console.log('price',price);
      // console.log('exciseprice',exciseprice);
      // console.log('taxAmount',taxAmount);
      let sum =
        Number(price) +
        Number(exciseprice) +
        Number(cultivationPrice) +
        Number(extractionPrice) +
        Number(concentratePrice) +
        Number(taxAmount) +
        Number(massprice);
      const item = await Inventory.create(
        {
          // listingId,
          // soldOut,
          userId: req.currentUser!.id,
          title,
          price,
          totalPrice: sum,
          massOfItem,
          quantity,
          paymentConfirmation,
          location,
          description,
          imageId: result.public_id,
          smallImage: result.eager[0].secure_url,
          largeImage: result.eager[1].secure_url,
          sopDocumentId: result1.public_id,
          sopDocumentName: sopName,
          sopDocumentUrl: result1.secure_url,
          labReportId: result2.public_id,
          labReportName: reportName,
          labReportUrl: result2.secure_url,
        },
        { transaction }
      );

      new InventoryItemCreatedPublisher(natsWrapper.client).publish({
        id: item.id!,
        userId: req.currentUser!.id,
        title,
        fixPrice: price,
        totalPrice: sum,
        quantity,
        price,
        massOfItem,
        description,
        location,
        imageId: result.public_id,
        smallImage: result.eager[0].secure_url,
        largeImage: result.eager[1].secure_url,
        sopDocumentId: result1.public_id,
        sopDocumentName: sopName,
        sopDocumentUrl: result1.secure_url,
        labReportId: result2.public_id,
        labReportName: reportName,
        labReportUrl: result2.secure_url,
        createdAt: new Date(Date.now()),
        version: item.version!,
      });

      res.status(201).send(item);
    });
  }
);

export { router as addItemRouter };
