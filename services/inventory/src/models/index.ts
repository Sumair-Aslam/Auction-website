import { Sequelize } from 'sequelize';

import { InventoryFactory } from './inventory';
import { ListingFactory } from './listing';
import { UserFactory } from './user';
import { DirectBuyFactory } from './direct_buy';

// import { PaymentFactory } from './payment';

const db =
  process.env.NODE_ENV == 'test'
    ? new Sequelize('sqlite::memory:', { logging: false })
    : new Sequelize('mysql', 'root', process.env.MYSQL_ROOT_PASSWORD, {
        host: 'listings-mysql-srv',
        dialect: 'mysql',
      });

const Inventory = InventoryFactory(db);
const User = UserFactory(db);
const Listing = ListingFactory(db);
const DirectBuy = DirectBuyFactory(db);

User.hasMany(Inventory);
Inventory.belongsTo(User);
Listing.belongsTo(Inventory);
DirectBuy.belongsTo(Inventory);

// const Payment = PaymentFactory(db);

export { db, Inventory, User, Listing, DirectBuy };
