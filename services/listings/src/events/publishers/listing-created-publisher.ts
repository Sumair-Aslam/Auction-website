// import { ListingCreatedEvent, Publisher, Subjects } from '@jjmauction/common';
import { ListingCreatedEvent, Publisher, Subjects } from 'scytalelabs-auction';

export class ListingCreatedPublisher extends Publisher<ListingCreatedEvent> {
  subject: Subjects.ListingCreated = Subjects.ListingCreated;
}
