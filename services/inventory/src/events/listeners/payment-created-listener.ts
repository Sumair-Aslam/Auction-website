import { NotFoundError } from '@jjmauction/common';
import { Message } from 'node-nats-streaming';
import {
  InventoryStatus,
  Listener,
  PaymentCreatedEvent,
  Subjects,
} from 'scytalelabs-auction';

import { Inventory } from '../../models';
import { Listing } from '../../models';
import { natsWrapper } from '../../nats-wrapper';
import { InventoryItemUpdatedPublisher } from '../publishers/inventory-item-updated-publisher';
import { queueGroupName } from './queue-group-name';

// import {
//   Listener,
//   ListingStatus,
//   NotFoundError,
//   PaymentCreatedEvent,
//   Subjects,
// } from '@jjmauction/common';
// import { Listener } from '../../../../../common/src/events/base-listener';
// import { PaymentCreatedEvent } from '../../../../../common/src/events/payment-created-event';
// import { Subjects } from '../../../../../common/src/events/subjects';
// import { InventoryStatus } from '../../../../../common/src/events/types/inventory-status';
// import { ListingStatus } from '../../../../../common/src/events/types/listing-status';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id } = data;
    const listing = await Listing.findOne({ where: { id } });

    if (!listing) {
      throw new NotFoundError();
    }

    const item = await Inventory.findOne({
      where: { id: listing.inventoryItemId },
    });
    if (!item) {
      throw new NotFoundError();
    }
    await item.update({ status: InventoryStatus.Fulfilled });

    new InventoryItemUpdatedPublisher(natsWrapper.client).publish({
      id: item.id,
      title: item.title,
      status: InventoryStatus.Fulfilled,
      price: item.price,
      totalPrice: item.totalPrice,
      massOfItem: item.massOfItem,
      description: item.description,
      version: item.version,
    });
    msg.ack();
  }
}
