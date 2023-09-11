import { Listing, User, db } from '../src/models';

jest.mock('../src/socket-io-wrapper.ts');
jest.mock('../src/nats-wrapper.ts');

beforeAll(async () => {
  process.env.JWT_KEY = 'test';

  await db.authenticate();
  await db.sync();
});

beforeEach(async () => {
  jest.clearAllMocks();
  // jest.useFakeTimers()
  jest.setTimeout(100000);
  await Listing.destroy({
    where: {},
    truncate: true,
  });

  await User.destroy({
    where: {},
    truncate: true,
  });
});

afterAll(async () => {
  await db.close();
});
