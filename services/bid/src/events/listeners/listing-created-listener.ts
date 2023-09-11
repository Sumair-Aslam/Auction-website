import { Message } from 'node-nats-streaming';
//
import {
  Listener,
  ListingCreatedEvent,
  ListingStatus,
  Subjects,
} from 'scytalelabs-auction';

import { Listing } from '../../models';
import { queueGroupName } from './queue-group-name';

export class ListingCreatedListener extends Listener<ListingCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ListingCreated = Subjects.ListingCreated;

  async onMessage(data: ListingCreatedEvent['data'], msg: Message) {
    const {
      id,
      userId,
      inventoryItemId,
      title,
      slug,
      expiresAt,
      price,
      totalPrice,
    } = data;

    await Listing.create({
      id,
      title,
      slug,
      userId,
      inventoryItemId,
      expiresAt,
      startPrice: price,
      currentPrice: price,
      totalPrice: totalPrice,
      status: ListingStatus.Active,
    });

    msg.ack();
  }
}
