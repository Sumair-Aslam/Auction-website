// import { InventoryStatus } from '../../../../common/src/events/types/inventory-status';
import { InventoryStatus } from 'scytalelabs-auction';
import { BuildOptions, DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

// import SequelizeSlugify from 'sequelize-slugify';

export interface InventoryAttributes {
  id?: string;
  // listingId: string;
  // soldOut: number;
  userId: string;
  // slug?: string;
  title: string;
  status?: InventoryStatus;
  price: number;
  totalPrice:number;
  massOfItem: number;
  quantity: number;
  paymentConfirmation: Boolean;
  location: string;
  description: string;
  imageId: string;
  smallImage: string;
  largeImage: string;
  sopDocumentId: string;
  sopDocumentName: string;
  sopDocumentUrl: string;
  labReportId: string;
  labReportName: string;
  labReportUrl: string;
  createdAt?: Date;
  version?: number;
}

export interface InventoryModel
  extends Model<InventoryAttributes>,
    InventoryAttributes {}

export class Inventory extends Model<InventoryModel, InventoryAttributes> {}

export type InventoryStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): InventoryModel;
};

const InventoryFactory = (sequelize: Sequelize): InventoryStatic => {
  return <InventoryStatic>sequelize.define(
    'inventory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // listingId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
      // soldOut: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      // slug: {
      //   type: DataTypes.STRING,
      //   unique: true,
      // },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        defaultValue: InventoryStatus.Available,
        values: Object.values(InventoryStatus),
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      massOfItem: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentConfirmation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      smallImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      largeImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sopDocumentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sopDocumentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sopDocumentUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      labReportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      labReportName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      labReportUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // indexes: [{ type: 'FULLTEXT', name: 'text_idx', fields: ['title'] }],
      version: true,
    }
  );
  // SequelizeSlugify.slugifyModel(Inventory, {
  //   source: ['title'],
  // });

  // return Inventory;
};

export { InventoryFactory };
