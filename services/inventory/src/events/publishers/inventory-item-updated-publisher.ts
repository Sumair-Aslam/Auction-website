// import { ListingUpdatedEvent, Publisher, Subjects } from '@jjmauction/common';
// import { Publisher } from '../../../../../common/src/events/base-publisher';
// import { InventoryItemUpdatedEvent } from '../../../../../common/src/events/inventory-updated-event';
// import { Subjects } from '../../../../../common/src/events/subjects';

import {
  InventoryItemUpdatedEvent,
  Publisher,
  Subjects,
} from 'scytalelabs-auction';

export class InventoryItemUpdatedPublisher extends Publisher<InventoryItemUpdatedEvent> {
  subject: Subjects.InventoryItemUpdated = Subjects.InventoryItemUpdated;
}
