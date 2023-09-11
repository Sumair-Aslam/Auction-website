// import { InventoryStatus } from '../../../../common/src/events/types/inventory-status';
import { InventoryStatus } from 'scytalelabs-auction';
import { BuildOptions, DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

// import SequelizeSlugify from 'sequelize-slugify';

export interface InventoryAttributes {
  id?: string;
  userId: string;
  title: string;
  status?: InventoryStatus;
  totalPrice: number;
  fixPrice: number;
  quantity: number;
  massOfItem: number;
  description: string;
  location: string;
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
    'inventory_table',
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        defaultValue: InventoryStatus.Available,
        values: Object.values(InventoryStatus),
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fixPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      massOfItem: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
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
      version: true,
    }
  );
};

export { InventoryFactory };
