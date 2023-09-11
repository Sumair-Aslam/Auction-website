import { Message } from 'node-nats-streaming';
// import {
//   Listener,
//   ListingStatus,
//   NotFoundError,
//   PaymentCreatedEvent,
//   Subjects,
// } from '@jjmauction/common';
import {
  Listener,
  ListingStatus,
  NotFoundError,
  PaymentCreatedEvent,
  Subjects,
} from 'scytalelabs-auction';

import { Listing } from '../../models';
import { natsWrapper } from '../../nats-wrapper';
import { ListingUpdatedPublisher } from '../publishers/listing-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id } = data;
    const listing = await Listing.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundError();
    }

    await listing.update({ status: ListingStatus.Complete });

    new ListingUpdatedPublisher(natsWrapper.client).publish({
      id: listing.id,
      status: listing.status,
      currentPrice: listing.currentPrice,
      currentWinnerId: listing.currentWinnerId,
      totalPrice: listing.totalPrice,
      quantity: listing.quantity,
      version: listing.version,
    });

    msg.ack();
  }
}
