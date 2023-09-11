import { NotFoundError } from '@jjmauction/common';
import { Message } from 'node-nats-streaming';
// import {
//   Listener,
//   ListingCreatedEvent,
//   ListingStatus,
//   Subjects,
// } from '@jjmauction/common';
// import { Listener } from '../../../../../common/src/events/base-listener';
// import { ListingCreatedEvent } from '../../../../../common/src/events/listing-created-event';
// import { Subjects } from '../../../../../common/src/events/subjects';
// import { InventoryStatus } from '../../../../../common/src/events/types/inventory-status';
// import { ListingStatus } from '../../../../../common/src/events/types/listing-status';
import {
  InventoryStatus,
  Listener,
  ListingCreatedEvent,
  ListingStatus,
  Subjects,
} from 'scytalelabs-auction';

import { Listing } from '../../models';
import { Inventory } from '../../models';
import { natsWrapper } from '../../nats-wrapper';
import { socketIOWrapper } from '../../socket-io-wrapper';
import { InventoryItemUpdatedPublisher } from '../publishers/inventory-item-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class ListingCreatedListener extends Listener<ListingCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ListingCreated = Subjects.ListingCreated;

  async onMessage(data: ListingCreatedEvent['data'], msg: Message) {
    const { id, userId, inventoryItemId, title, slug, expiresAt, price } = data;

    const item = await Inventory.findOne({
      where: { id: inventoryItemId },
    });
    if (!item) {
      throw new NotFoundError();
    }

    const listing = await Listing.create({
      id,
      title,
      slug,
      userId,
      inventoryItemId,
      expiresAt,
      startPrice: price,
      currentPrice: price,
      status: ListingStatus.Active,
    });

    await item.update({
      status:InventoryStatus.Listed
    });

    new InventoryItemUpdatedPublisher(natsWrapper.client).publish({
      id: inventoryItemId,
      title,
      status: InventoryStatus.Listed,
      price,
      totalPrice: item.totalPrice,
      massOfItem: item.massOfItem,
      description: item.description,
      version: item.version!,
    });

    await socketIOWrapper.io
      .of('/socket')
      .to(listing.id)
      .emit('listing', listing);

    msg.ack();
  }
}
