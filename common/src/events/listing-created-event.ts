import { Subjects } from './subjects';

export interface ListingCreatedEvent {
  subject: Subjects.ListingCreated;
  data: {
    id: string;
    userId: string;
    title: string;
    inventoryItemId: string;
    slug: string;
    price: number;
    totalPrice: number;
    expiresAt: Date;
    version: number;
  };
}
