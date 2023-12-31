import { Subjects } from './subjects';
import { ListingStatus } from './types/listing-status';

export interface ListingUpdatedEvent {
  subject: Subjects.ListingUpdated;
  data: {
    id: string;
    status: ListingStatus;
    currentPrice: number;
    currentWinnerId: string;
    totalPrice: number;
    quantity: number;
    version: number;
  };
}
