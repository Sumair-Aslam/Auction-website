import { Subjects } from './subjects';

export interface InventoryItemDeletedEvent {
  subject: Subjects.InventoryItemDeleted;
  data: {
    id: string;
    version: number;
  };
}
