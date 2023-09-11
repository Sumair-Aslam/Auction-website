export enum InventoryStatus {
  // When the item is available and not listed yet
  Available = 'Available',

  // When the item is listed
  Listed = 'Listed',

  // When the item is reserved for auction
  Reserved = 'Reserved',

  // When the item is reserved for auction
  Refunded = 'Refunded',

  // The auction winner has paid for the item and the SOP has been executed
  Fulfilled = 'Fulfilled',
}
