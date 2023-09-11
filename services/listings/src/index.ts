/**********/
// import dotenv from 'dotenv';
// dotenv.config();
// require("dotenv").config();
// import { config } from "dotenv";
// config();
// require('dotenv').config({
//     path: '../.env'
// });
/*********/
import cloudinary from 'cloudinary';
// var cloudinary = require('cloudinary').v2;
// import cloudinary , {v2} from 'cloudinary';
// var cloudinary = require('cloudinary').v2;
// var local_cloudinary = require('cloudinary').v2;





import { app } from './app';
import { BidCreatedListener } from './events/listeners/bid-created-listener';
import { BidDeletedListener } from './events/listeners/bid-deleted-listener';
import { ListingExpiredListener } from './events/listeners/listing-expired-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { InventoryItemCreatedListener} from './events/listeners/inventory-created-listener';
import { InventoryUpdatedListener} from './events/listeners/inventory-updated-listener';
import { db } from './models';
import { natsWrapper } from './nats-wrapper';
import { socketIOWrapper } from './socket-io-wrapper';




(async () => {
  try {
    console.log('The listings service has started');

    if (!process.env.LISTINGS_MYSQL_URI) {
      throw new Error('LISTINGS_MYSQL_URI must be defined');
    }

    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    //  console.log("Cloud Name", process.env.CLOUDINARY_CLOUD_NAME);
    // console.log("Api Key", process.env.CLOUDINARY_API_KEY);
    // console.log("Api Secret", process.env.CLOUDINARY_API_SECRET);
    // @ts-ignore
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME /*'scytalelabs'*/,
      api_key: process.env.CLOUDINARY_API_KEY /*'432183885194623'*/,
      api_secret: process.env.CLOUDINARY_API_SECRET /*'mZAxNn0YNm7YxPOMAvrBP0UIUfU'*/,
    });
    // local_cloudinary.config({
    //     cloud_name: 'scytalelabs>',
    //     api_key: '432183885194623',
    //     api_secret: 'mZAxNn0YNm7YxPOMAvrBP0UIUfU',
    //     secure: true
    // });

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await db.authenticate();
    await db.query('SET FOREIGN_KEY_CHECKS = 0', {raw: true});
    await db.sync({ force: true });
    await db.query('SET FOREIGN_KEY_CHECKS = 1', {raw: true});
    console.log('Conneted to MySQL');

    const server = app.listen(3000, () =>
      console.log('Listening on port 3000!')
    );

    socketIOWrapper.listen(server);

    socketIOWrapper.io.of('/socket').on('connection', (socket) => {
      const room = socket.handshake['query']['r_var'];

      socket.on('join', () => {
        socket.join(room);
        console.log('[socket]', 'join room :', room);
      });

      socket.on('unsubscribe', (room) => {
        socket.leave(room);
        console.log('[socket]', 'left room :', room);
      });

      socket.on('disconnect', (reason) => {
        console.log('[socket]', 'disconected :', reason);
      });
    });

    new BidCreatedListener(natsWrapper.client).listen();
    new BidDeletedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    new ListingExpiredListener(natsWrapper.client).listen();
    new InventoryItemCreatedListener(natsWrapper.client).listen();
    new InventoryUpdatedListener(natsWrapper.client).listen();
    console.log('The listings service has started up successfully');
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
})();
