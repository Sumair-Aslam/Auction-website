import { ListingStatus } from '@jjmauction/common';
import { BuildOptions, DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

export interface ListingAttributes {
  createdAt?: Date;
  slug?: string;
  id?: string;
  inventoryItemId:number;
  currentPrice?: number;
  status?: ListingStatus;
  expiresAt?: Date;
  startPrice?: number;
  currentWinnerId?: string;
  /******/
  quantity?: number;
  fixPrice?: number;
  paymentConfirmation: Boolean;
  massOfItem?: number;
  // taxByMassOfItem?: number;
  // salesTax?: number;
  // exciseRate?: number;
  totalPrice?: number;
  /******/
  userId?: string;
  title?: string;
  location: string;
  description?: string;
  imageId: string;
  smallImage: string;
  largeImage: string;
  sopDocumentId: string;
  sopDocumentName: string;
  sopDocumentUrl: string;
  labReportId: string;
  labReportName: string;
  labReportUrl: string;
  version?: number;
}

export interface ListingModel
  extends Model<ListingAttributes>,
    ListingAttributes {}

export class Listing extends Model<ListingModel, ListingAttributes> {}

export type ListingStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ListingModel;
};

const ListingFactory = (sequelize: Sequelize): ListingStatic => {
  const Listing = <ListingStatic>sequelize.define(
    'my_listing',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        unique: true,
        primaryKey: true,
      },
      inventoryItemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      currentWinnerId: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      /*************/
      paymentConfirmation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      massOfItem: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // taxByMassOfItem: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },

      // salesTax: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },

      // exciseRate: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fixPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      /***************/
      status: {
        type: DataTypes.ENUM,
        defaultValue: ListingStatus.Active,
        values: Object.values(ListingStatus),
      },
      startPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currentPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      indexes: [{ type: 'FULLTEXT', name: 'text_idx', fields: ['title'] }],
      version: true,
    }
  );

  SequelizeSlugify.slugifyModel(Listing, {
    source: ['title'],
  });

  return Listing;
};

export { ListingFactory };
