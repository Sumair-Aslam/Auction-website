import { BuildOptions, DataTypes, Model, Sequelize, UUIDV4 } from 'sequelize';

export interface KycAttributes {  
  userId: string,
  guid: string;
  status: string;
  clientId: string;
  event: string;
  recordId: string;
  refId: string;
  submitCount: string;
  blockPassID: string;
  isArchived: boolean;
  inreviewDate: Date;
  waitingDate: Date;
  approvedDate: Date;
  isPing: boolean;
  env: string;
  webhookId: string;

  createdAt?: Date;
  version?: number;
}

export interface KycModel extends Model<KycAttributes>, KycAttributes {}

export class Kyc extends Model<KycModel, KycAttributes> {}

export type KycStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): KycModel;
};

const KycFactory = (sequelize: Sequelize): KycStatic => {
  return <KycStatic>sequelize.define(
    'kyc',
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        unique: true,
        primaryKey: true,
      },
      guid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submitCount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      blockPassID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      inreviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      waitingDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isPing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      env: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      webhookId: {
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

export { KycFactory };
