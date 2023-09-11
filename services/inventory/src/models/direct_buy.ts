import { BuildOptions, DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

export interface DirectBuyAttributes {
  id?: string;
  inventoryItemId: string;
  userId: string;
  title: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  version?: number;
}

export interface DirectBuyModel
  extends Model<DirectBuyAttributes>,
    DirectBuyAttributes {}

export class DirectBuy extends Model<DirectBuyModel, DirectBuyAttributes> {}

export type DirectBuyStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DirectBuyModel;
};

const DirectBuyFactory = (sequelize: Sequelize): DirectBuyStatic => {
  return <DirectBuyStatic>sequelize.define(
    'buy',
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
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

export { DirectBuyFactory };
