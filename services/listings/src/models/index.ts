import { Sequelize } from 'sequelize';

import { InventoryFactory } from './inventory';
import { ListingFactory } from './listing';
import { UserFactory } from './user';

const db =
  process.env.NODE_ENV == 'test'
    ? new Sequelize('sqlite::memory:', { logging: false })
    : new Sequelize('mysql', 'root', process.env.MYSQL_ROOT_PASSWORD, {
        host: 'listings-mysql-srv',
        dialect: 'mysql',
      });

const Listing = ListingFactory(db);
const User = UserFactory(db);
const Inventory = InventoryFactory(db);

User.hasMany(Listing);
Listing.belongsTo(User);
Listing.belongsTo(Inventory);
export { db, Listing, User, Inventory };
