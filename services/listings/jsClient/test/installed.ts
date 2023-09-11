import { config } from 'dotenv';
config();
import { AUCTIONClient, utils, constants } from '../src';
import { parseTokenMeta, sleep, getDeploy } from './utils';
// import { Axios } from 'axios';
const axios = require('axios').default;

import {
  CLValueBuilder,
  Keys,
  CLPublicKey,
  CLAccountHash,
  CLPublicKeyType,
} from 'casper-js-sdk';

const { AUCTIONEvents } = constants;

const {
  NODE_ADDRESS,
  EVENT_STREAM_ADDRESS,
  CHAIN_NAME,

  MASTER_KEY_PAIR_PATH,
  CONTRACT_NAME,
  RESERVE_WISE_PAYMENT_AMOUNT,

  INVENTORY_ITEM_ID,
  CURRENT_PRICE,
  STATUS,
  EXPIRES_AT,
  START_PRICE,
  CURRENT_WINNER_ID,
  QUANTITY,
  FIX_PRICE,
  PAYMENT_CONFIRMATION,
  MASS_OF_ITEM,
  TOTAL_PRICE,
  USER_ID,
  TITLE,
  LOCATION,
  DESCRIPTION,
  IMAGE_ID,
  SMALL_IMAGE,
  LARGE_IMAGE,
  SOP_DOCUMENT_ID,
  SOP_DOCUMENT_NAME,
  SOP_DOCUMENT_URL,
  LAB_REPORT_ID,
  LAB_REPORT_NAME,
  LAB_REPORT_URL,
  SIMPLE_AUCTION_CONTRACT_HASH,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
  `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
  `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const auction = new AUCTIONClient(
  NODE_ADDRESS!,
  CHAIN_NAME!,
  EVENT_STREAM_ADDRESS!
);

export const store = async (
  inventory_item_id: string,
  current_price: string,
  _status: string,
  expires_at: string,
  start_price: string,
  current_winner_id: string,
  quantity: string,
  fix_price: string,
  payment_confirmation: string,
  mass_of_item: string,
  total_price: string,
  user_id: string,
  title: string,
  location: string,
  description: string,
  image_id: string,
  small_image: string,
  large_image: string,
  sop_document_id: string,
  sop_document_name: string,
  sop_document_url: string,
  lab_report_id: string,
  lab_report_name: string,
  lab_report_url: string
  // version: string
) => {
  const store_deploy = await auction.store(
    KEYS,
    inventory_item_id,
    current_price,
    _status,
    expires_at,
    start_price,
    current_winner_id,
    quantity,
    fix_price,
    payment_confirmation,
    mass_of_item,
    total_price,
    user_id,
    title,
    location,
    description,
    image_id,
    small_image,
    large_image,
    sop_document_id,
    sop_document_name,
    sop_document_url,
    lab_report_id,
    lab_report_name,
    lab_report_url,
    RESERVE_WISE_PAYMENT_AMOUNT!
  );
  console.log('... store deploy hash: ', store_deploy);
  const result = await getDeploy(NODE_ADDRESS!, store_deploy);
  var resultData = JSON.parse(JSON.stringify(result));
  console.log('Result data : ', resultData);
  console.log('Result : ' + Object.prototype.toString.call(result));

  let axiosStatus;

  if (resultData !== 'Mint error: 0' && resultData !== 0) {
    console.log('... store created successfully');

    await axios({
      method: 'post',
      url: 'http://auctionweb.site:8080/api/listings',
      data: {
        price: start_price,
        title,
        description,
        expires_at,
        payment_confirmation,
        mass_of_item,
        inventoryItemId: inventory_item_id,
        quantity,
        fixPrice: fix_price,
      },
    })
      .then(function (response: any) {
        console.log('Data : ' + JSON.stringify(response.data));
        console.log('Status : ' + response.status);
        console.log('Status Text : ' + response.statusText);
        console.log('Header : ' + response.headers);
        // console.log(response.config);
        axiosStatus = true;
      })
      .catch(function (error: any) {
        console.log(error);
        axiosStatus = false;
      });
  }
  return axiosStatus;
};

export const update = async (
  inventory_item_id: string,
  current_price: string,
  _status: string,
  expires_at: string,
  start_price: string,
  current_winner_id: string,
  quantity: string,
  fix_price: string,
  payment_confirmation: string,
  mass_of_item: string,
  total_price: string,
  user_id: string,
  title: string,
  location: string,
  description: string,
  image_id: string,
  small_image: string,
  large_image: string,
  sop_document_id: string,
  sop_document_name: string,
  sop_document_url: string,
  lab_report_id: string,
  lab_report_name: string,
  lab_report_url: string
  // version: string
) => {
  const update_deploy = await auction.update(
    KEYS,
    inventory_item_id,
    current_price,
    _status,
    expires_at,
    start_price,
    current_winner_id,
    quantity,
    fix_price,
    payment_confirmation,
    mass_of_item,
    total_price,
    user_id,
    title,
    location,
    description,
    image_id,
    small_image,
    large_image,
    sop_document_id,
    sop_document_name,
    sop_document_url,
    lab_report_id,
    lab_report_name,
    lab_report_url,
    RESERVE_WISE_PAYMENT_AMOUNT!
  );
  console.log('... update deploy test hash: ', update_deploy);
  await getDeploy(NODE_ADDRESS!, update_deploy);
  console.log('... update created test successfully');
};

export const get_data = async (id: string) => {
  const get_data_deploy = await auction.get_data(id!);
  console.log(`... Contract get_data: ${get_data_deploy}`);
};

const test = async () => {
  await auction.setContractHash(SIMPLE_AUCTION_CONTRACT_HASH!);

  console.log('... Contract Hash:', SIMPLE_AUCTION_CONTRACT_HASH!);

  const store_deploy_test = await auction.store(
    KEYS,
    INVENTORY_ITEM_ID!,
    CURRENT_PRICE!,
    STATUS!,
    EXPIRES_AT!,
    START_PRICE!,
    CURRENT_WINNER_ID!,
    QUANTITY!,
    FIX_PRICE!,
    PAYMENT_CONFIRMATION!,
    MASS_OF_ITEM!,
    TOTAL_PRICE!,
    USER_ID!,
    TITLE!,
    LOCATION!,
    DESCRIPTION!,
    IMAGE_ID!,
    SMALL_IMAGE!,
    LARGE_IMAGE!,
    SOP_DOCUMENT_ID!,
    SOP_DOCUMENT_NAME!,
    SOP_DOCUMENT_URL!,
    LAB_REPORT_ID!,
    LAB_REPORT_NAME!,
    LAB_REPORT_URL!,
    // VERSION!,
    RESERVE_WISE_PAYMENT_AMOUNT!
  );
  console.log('... store deploy test hash: ', store_deploy_test);

  await getDeploy(NODE_ADDRESS!, store_deploy_test);
  console.log('... store created test successfully');

  const update_deploy_test = await auction.update(
    KEYS,
    INVENTORY_ITEM_ID!,
    CURRENT_PRICE!,
    STATUS!,
    EXPIRES_AT!,
    START_PRICE!,
    CURRENT_WINNER_ID!,
    QUANTITY!,
    FIX_PRICE!,
    PAYMENT_CONFIRMATION!,
    MASS_OF_ITEM!,
    TOTAL_PRICE!,
    USER_ID!,
    TITLE!,
    LOCATION!,
    DESCRIPTION!,
    IMAGE_ID!,
    SMALL_IMAGE!,
    LARGE_IMAGE!,
    SOP_DOCUMENT_ID!,
    SOP_DOCUMENT_NAME!,
    SOP_DOCUMENT_URL!,
    LAB_REPORT_ID!,
    LAB_REPORT_NAME!,
    LAB_REPORT_URL!,
    // VERSION!,
    RESERVE_WISE_PAYMENT_AMOUNT!
  );
  console.log('... update deploy test hash: ', update_deploy_test);
  await getDeploy(NODE_ADDRESS!, update_deploy_test);
  console.log('... update created test successfully');
  // /*=========================Getters=========================*/

  // const get_data_test = await auction.get_data(ID!);
  // console.log(`... Contract get_data_test: ${get_data}`);
};

test();
