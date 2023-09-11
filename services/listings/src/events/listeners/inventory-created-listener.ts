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
  InventoryItemCreatedEvent,
  InventoryStatus,
  Listener,
  ListingCreatedEvent,
  ListingStatus,
  Subjects,
} from 'scytalelabs-auction';

// import { Listing } from '../../models';
import { Inventory } from '../../models';
import { natsWrapper } from '../../nats-wrapper';
import { socketIOWrapper } from '../../socket-io-wrapper';
import { queueGroupName } from './queue-group-name';

export class InventoryItemCreatedListener extends Listener<InventoryItemCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.InventoryItemCreated = Subjects.InventoryItemCreated;

  async onMessage(data: InventoryItemCreatedEvent['data'], msg: Message) {
    const {
      id,
      userId,
      title,
      fixPrice,
      totalPrice,
      quantity,
      massOfItem,
      description,
      location,
      imageId,
      smallImage,
      largeImage,
      sopDocumentId,
      sopDocumentName,
      sopDocumentUrl,
      labReportId,
      labReportName,
      labReportUrl,
    } = data;

    await Inventory.create({
      id,
      userId,
      title,
      fixPrice,
      totalPrice,
      quantity,
      massOfItem,
      description,
      location,
      status: InventoryStatus.Available,
      imageId,
      smallImage,
      largeImage,
      sopDocumentId,
      sopDocumentName,
      sopDocumentUrl,
      labReportId,
      labReportName,
      labReportUrl,
    });

    // await socketIOWrapper.io
    //   .of('/socket')
    //   .to(inventory.id)
    //   .emit('inventory', inventory);

    msg.ack();
  }
}
