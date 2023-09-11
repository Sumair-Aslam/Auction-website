const convertToDollars = (dollars: number) => {
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export { convertToDollars };
