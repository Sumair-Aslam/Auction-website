import { app } from './app';
import { ListingCreatedListener } from './events/listeners/listing-created-listener';
import { ListingExpiredListener } from './events/listeners/listing-expired-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { db } from './models';
import { natsWrapper } from './nats-wrapper';
import { socketIOWrapper } from './socket-io-wrapper';
import cloudinary from 'cloudinary';

(async () => {
  try {
    console.log('The inventory service has started');

    if (!process.env.INVENTORY_MYSQL_URI) {
      throw new Error('INVENTORY_MYSQL_URI must be defined');
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

    await cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME /*'scytalelabs'*/,
      api_key: process.env.CLOUDINARY_API_KEY /*'432183885194623'*/,
      api_secret: process.env.CLOUDINARY_API_SECRET /*'mZAxNn0YNm7YxPOMAvrBP0UIUfU'*/,
    });

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

    new ListingCreatedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    new ListingExpiredListener(natsWrapper.client).listen();

    console.log('The inventory service has started up successfully');
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
})();
