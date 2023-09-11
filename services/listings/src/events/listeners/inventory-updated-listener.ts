// import {
//   Listener,
//   ListingUpdatedEvent,
//   NotFoundError,
//   Subjects,
// } from '@jjmauction/common';
import {
  Listener,
  InventoryItemUpdatedEvent,
  NotFoundError,
  Subjects,
} from 'scytalelabs-auction';
import { Message } from 'node-nats-streaming';

import { Inventory } from '../../models';
import { queueGroupName } from './queue-group-name';

export class InventoryUpdatedListener extends Listener<InventoryItemUpdatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.InventoryItemUpdated = Subjects.InventoryItemUpdated;

  async onMessage(data: InventoryItemUpdatedEvent['data'], msg: Message) {
    const { id, title, status, price, totalPrice, massOfItem, description, version } = data;

    const item = await Inventory.findOne({
      where: { id: id},
    });

    if (!item) {
      throw new NotFoundError();
    }

    await item.update({ id, title, status, price, totalPrice, massOfItem, description, version });

    msg.ack();
  }
}
