import cloudinary from 'cloudinary';
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

import { ListingCreatedPublisher } from '../events/publishers/listing-created-publisher';
import { Inventory, Listing, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

// import cloudinary , {v2} from 'cloudinary';
// var local_cloudinary = require('cloudinary').v2;

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

// const sop_storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   },
// });

// const reports_storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   },
// });
// local_cloudinary.config({
//   cloud_name: 'scytalelabs',
//   api_key: '432183885194623',
//   api_secret: 'mZAxNn0YNm7YxPOMAvrBP0UIUfU',
//   secure: true,
// });
const upload = multer({ storage: storage });
// const sop = multer({ storage: sop_storage });
// const reports = multer({ storage: reports_storage });

router.post(
  '/api/listings',
  // upload.single('image'),
  // upload.fields([
  //   { name: 'image', maxCount: 1 },
  //   { name: 'sopDocument', maxCount: 1 },
  //   { name: 'labReports', maxCount: 1 },
  // ]),
  // upload.single('sopDocument'),
  // upload.single('labReports'),
  requireAuth,
  [
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    // body('title')
    //   .isLength({ min: 3, max: 100 })
    //   .withMessage('The listing title must be between 5 and 1000 characters'),
    body('expiresAt').custom((value) => {
      let enteredDate = new Date(value);
      let tommorowsDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (enteredDate <= tommorowsDate)
        throw new BadRequestError('Invalid Date');
      return true;
    }),
    // body('description')
    //   .isLength({ min: 5, max: 500 })
    //   .withMessage(
    //     'The listing description must be between 5 and 500 characters'
    //   ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const {
        price,
        // title,
        // description,
        expiresAt,
        /*********/
        paymentConfirmation,
        // massOfItem,
        // taxByMassOfItem, //will get this from a table that contains the tax by mass information
        // salesTax,
        // exciseRate,
        // location,
        // quantity,
        // fixPrice,
        inventoryItemId,
        /*********/
      } = req.body;

      const item = await Inventory.findOne({
        where: { id: inventoryItemId },
      });

      if (!item) {
        throw new NotFoundError();
      }
      // // @ts-ignore
      // console.log('FILESSSSS Result : ', req.files);
      // // @ts-ignore
      // console.log('FILESSSSS Image Result : ', req.files.image);
      // // @ts-ignore
      // console.log('FILESSSSS Image Path Result : ', req.files.image[0].path);

      // // @ts-ignore
      // const result = await cloudinary.v2.uploader.upload(req.files.image[0].path,
      //   {
      //     eager: [
      //       { width: 225, height: 225 },
      //       { width: 1280, height: 1280 },
      //     ],
      //   }
      // );

      // // @ts-ignore
      // const result1 = await cloudinary.v2.uploader.upload(req.files.sopDocument[0].path,
      //   { resource_type: 'raw' }
      // );
      // // @ts-ignore
      // const sopName = req.files.sopDocument[0].filename;
      // // @ts-ignore
      // console.log('LAB Reports Result : ', req.files.labReports);
      // // @ts-ignore
      // const result2 = await cloudinary.v2.uploader.upload(req.files.labReports[0].path,
      //   {
      //     resource_type: 'raw',
      //   }
      // );
      // // @ts-ignore
      // const reportName = req.files.labReports[0].filename;
      /*************/
      // let taxByMassOfItem;
      // let salesTax;
      // let exciseRate;
      // if (location === 'North California') {
      //   taxByMassOfItem = 3;
      //   salesTax = 5;
      //   exciseRate = 15;
      // } else {
      //   taxByMassOfItem = 30;
      //   salesTax = 25;
      //   exciseRate = 5;
      // }
      // let taxAmount;
      // if (salesTax <= 0 || salesTax >= 100) {
      //   // Need consultancy about higher rate
      //   throw new BadRequestError('Invalid sales tax rate');

      //   // throw new BadRequestError('Sales tax ambiguous value given');
      // } else {
      //   taxAmount = (salesTax / 100) * price; //https://propakistani.pk/how-to/how-to-calculate-sales-tax/
      // }

      // if (
      //   (taxByMassOfItem <= 0 || taxByMassOfItem >= 100) &&
      //   (exciseRate <= 0 || exciseRate >= 100)
      // ) {
      //   // throw new BadRequestError('Excise Rate not specified');
      //   throw new BadRequestError('There must be one tax type specified');
      // }

      // let exciseprice = (exciseRate / 100) * price;
      // console.log('exciseprice', exciseprice);
      // let massprice = (taxByMassOfItem / 100) * massOfItem;
      // console.log('massprice', massprice);
      // // console.log('price',price);
      // // console.log('exciseprice',exciseprice);
      // // console.log('taxAmount',taxAmount);
      // let sum =
      //   Number(price) +
      //   Number(exciseprice) +
      //   Number(taxAmount) +
      //   Number(massprice);
      // console.log('price', price);
      // console.log('exciseprice', exciseprice);
      // console.log('taxAmount', taxAmount);
      // console.log('massprice', massprice);
      // console.log('sum', sum);
      // console.log('Payment Confirmation : ', paymentConfirmation);
      // console.log('Mas of Item : ', massOfItem);
      // console.log('Tax by Mass of Item : ', taxByMassOfItem);
      // console.log('Fix Price : ', fixPrice);

      /*************/

      const listing = await Listing.create(
        {
          userId: req.currentUser.id,
          inventoryItemId,
          startPrice: price,
          currentPrice: price,
          paymentConfirmation,
          massOfItem:item.massOfItem,
          // taxByMassOfItem,
          // salesTax,2
          // exciseRate,
          totalPrice: price, //https://www.investopedia.com/terms/e/excisetax.asp
          quantity: item.quantity,
          fixPrice: item.fixPrice,
          title: item.title,
          location: item.location,
          description: item.description,
          expiresAt,
          imageId: item.imageId,
          smallImage: item.smallImage,
          largeImage: item.largeImage,
          sopDocumentId: item.sopDocumentId,
          sopDocumentName: item.sopDocumentName,
          sopDocumentUrl: item.sopDocumentUrl,
          labReportId: item.labReportId,
          labReportName: item.labReportName,
          labReportUrl: item.labReportUrl,
        },
        { transaction }
      );

      new ListingCreatedPublisher(natsWrapper.client).publish({
        id: listing.id,
        userId: req.currentUser.id,
        inventoryItemId,
        slug: listing.slug,
        title: listing.title,
        price,
        totalPrice: price,
        expiresAt,
        version: listing.version,
      });

      res.status(201).send(listing);
    });
  }
);

export { router as createListingRouter };
