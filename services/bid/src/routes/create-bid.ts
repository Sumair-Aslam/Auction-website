import {
  BadRequestError,
  ListingStatus,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@jjmauction/common';
import express, { Request, Response } from 'express';

import { BidCreatedPublisher } from '../events/publishers/bid-created-publisher';
import { Bid, Listing, User, db } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/bids/:listingId',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    await db.transaction(async (transaction) => {
      const { amount } = req.body;
      const listingId = req.params.listingId;
      const listing = await Listing.findOne({ where: { id: listingId } });

      /*************/
      const user = req.body.user;
      // const user = await User.findOne({ where: { id: req.currentUser?.id } });

      if (!user) {
        throw new NotFoundError();
        // throw new BadRequestError(
        //   'user not found'
        // );
      }
      if (user.isRegister === false) {
        throw new BadRequestError(
          'Non registered users cannot place bids on the listings'
        );
      }
      /*************/

      if (!listing) {
        throw new NotFoundError();
      }

      if (listing.status !== ListingStatus.Active) {
        throw new BadRequestError(
          'You can only bid on listings which are active'
        );
      }

      console.log("Amount : ", amount);
      console.log("Total Price : ", listing.totalPrice);
      
      if (listing.totalPrice >= amount) {
        throw new BadRequestError('Bids must be greater than the current bid');
      }

      if (req.currentUser!.id === listing.userId) {
        throw new BadRequestError(
          'Sellers cannot place bids on there own listings'
        );
      }

      const bid = await Bid.create(
        {
          listingId,
          amount: Math.floor(amount),
          userId: req.currentUser!.id,
        },
        { transaction }
      );

      new BidCreatedPublisher(natsWrapper.client).publish({
        listingId,
        amount,
        userId: req.currentUser!.id,
        version: bid.version!,
      });

      res.status(201).send(bid);
    });
  }
);

export { router as createBidRouter };
