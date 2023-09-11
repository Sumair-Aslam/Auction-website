// import { ListingUpdatedEvent, Publisher, Subjects } from '@jjmauction/common';
import { ListingUpdatedEvent, Publisher, Subjects } from 'scytalelabs-auction';

export class ListingUpdatedPublisher extends Publisher<ListingUpdatedEvent> {
  subject: Subjects.ListingUpdated = Subjects.ListingUpdated;
}
