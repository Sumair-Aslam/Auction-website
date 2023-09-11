import { config } from "dotenv";
config();
import { AUCTIONClient, utils, constants } from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import { Keys } from "casper-js-sdk";

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	WASM_PATH,
	MASTER_KEY_PAIR_PATH,
	DECLARATION_CONTRACT,
	GLOBAL_ADDRESS,
	INSTALL_PAYMENT_AMOUNT,
	CONTRACT_NAME,
	BEP20,
	UNISWAP_FACTORY,
	SYNTHETIC_HELPER,
	SYNTHETIC_TOKEN,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const test = async () => {
	const auction = new AUCTIONClient(
		NODE_ADDRESS!,
		CHAIN_NAME!,
		EVENT_STREAM_ADDRESS!
	);

	const installDeployHash = await auction.install(
		KEYS,
		// BEP20!,
		// UNISWAP_FACTORY!,
		// SYNTHETIC_HELPER!,
		// SYNTHETIC_TOKEN!,
		CONTRACT_NAME!,
		INSTALL_PAYMENT_AMOUNT!,
		WASM_PATH!
	);

	console.log(`... Contract installation deployHash: ${installDeployHash}`);

	await getDeploy(NODE_ADDRESS!, installDeployHash);

	console.log(`... Contract installed successfully.`);

	let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

	console.log(`... Account Info: `);
	console.log(JSON.stringify(accountInfo, null, 2));

	const contractHash = await utils.getAccountNamedKeyValue(
		accountInfo,
		`${CONTRACT_NAME!}_contract_hash`
	);

	console.log(`... Contract Hash: ${contractHash}`);
};

test();
