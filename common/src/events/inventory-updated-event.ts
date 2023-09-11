import { Subjects } from './subjects';
import { InventoryStatus } from './types/inventory-status';

export interface InventoryItemUpdatedEvent {
  subject: Subjects.InventoryItemUpdated;
  data: {
    id: string;
    title: string;
    status: InventoryStatus;
    price: number;
    totalPrice: number;
    massOfItem: number;
    description: string;
    version: number;
  };
}
