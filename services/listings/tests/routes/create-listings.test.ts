import fs from 'fs';

import { ListingStatus } from '@jjmauction/common';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../src/app';
import { Listing, User } from '../../src/models';
import { signup } from '../signup';

// const createListing = async (
//   userId: string = uuidv4(),
//   status: ListingStatus = ListingStatus.Active
// ) => {
//   return await Listing.create({
//     id: uuidv4(),
//     userId: userId,
//     currentWinnerId: uuidv4(),
//     paymentConfirmation: true,
//     massOfItem: 500,
//     taxByMassOfItem: 25,
//     salesTax: 5,
//     exciseRate: 5,
//     totalPrice: 1000,
//     status,
//     startPrice: 100,
//     currentPrice: 100,
//     title: 'test',
//     imageId: 'hij',
//     smallImage: 'efg',
//     largeImage: 'abc',
//     description: 'for test purposes only',
//     slug: 'test',
//     expiresAt: new Date(),
//     createdAt: new Date(),
//   });
// };

// const createUser = async (userId: string = uuidv4()) => {
//   return await User.create({
//     id: uuidv4(),
//     name: 'sumair',
//     createdAt: new Date(),
//     version: 1,
//   });
// };

// it('responds with a 401 if the user is not authenticated', async () => {
//   const listing = await createListing();

//   await request(app).post(`/api/bids/${listing.slug}`).expect(401);
// });

it('responds with a 404 if the sales tax is 0', async () => {
  const { cookie } = signup();

  await request(app)
    .post(`/api/listings`)
    .set('Cookie', cookie)
    .field({
      price: 100,
      title: 'test',
      description: 'for test purposes only',
      expiresAt: Date.now() + 25 * 60 * 60 * 1000,
      paymentConfirmation: true,
      massOfItem: 500,
      quantity: 25,
      fixPrice: 0,
      exciseRate: 5,
    })
    .attach('image', '/home/sumair/Desktop/listing_test_case.png')
    .attach('sopDocument', '/home/sumair/Desktop/OceanFalls-Demo')
    .attach('labReports', '/home/sumair/Desktop/Git instructions.txt')

    .expect(400);
});

// it('responds with a 400 if the sales tax is greater than 100', async () => {
//   const { cookie } = signup();

//   await request(app)
//     .post(`/api/listings`)
//     .set('Cookie', cookie)
//     .field({
//       price: 100,
//       title: 'test',
//       description: 'for test purposes only',
//       expiresAt: Date.now() + 25 * 60 * 60 * 1000,
//       paymentConfirmation: true,
//       massOfItem: 500,
//       quantity: 101,
//       fixPrice: 25,
//       exciseRate: 5,
//     })
//     .attach('image', '/home/sumair/Desktop/listing_test_case.png')
//     .expect(400);
// });

// it('responds with a 400 if the taxByMassOfItem and exciseRate both are 0', async () => {
//   const { cookie } = signup();

//   await request(app)
//     .post(`/api/listings`)
//     .set('Cookie', cookie)
//     .field({
//       price: 100,
//       title: 'test',
//       description: 'for test purposes only',
//       expiresAt: Date.now() + 25 * 60 * 60 * 1000,
//       paymentConfirmation: true,
//       massOfItem: 500,
//       quantity: 0,
//       fixPrice: 50,
//       exciseRate: 0,
//     })
//     .attach('image', '/home/sumair/Desktop/listing_test_case.png')
//     .expect(400);
// });

// it('responds with a 400 if the taxByMassOfItem and exciseRate both are 0', async () => {
//   const { cookie } = signup();

//   await request(app)
//     .post(`/api/listings`)
//     .set('Cookie', cookie)
//     .field({
//       price: 100,
//       title: 'test',
//       description: 'for test purposes only',
//       expiresAt: Date.now() + 25 * 60 * 60 * 1000,
//       paymentConfirmation: true,
//       massOfItem: 500,
//       taxByMassOfItem: 50,
//       salesTax: 50,
//       exciseRate: 50,
//     })
//     .attach('image', '/home/sumair/Desktop/listing_test_case.png')
//     .expect(400);
// });

