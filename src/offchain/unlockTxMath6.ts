import { Address, DataB, isData, Tx } from '@harmoniclabs/plu-ts';
import { uint8ArrayEq, fromAscii } from '@harmoniclabs/uint8array-utils';
import { BrowserWallet } from '@meshsdk/core';
import getTxBuilder from './getTxBuilder';
import { koios } from './koios';
import { toPlutsUtxo } from './mesh-utils';
import { script, scriptAddr } from '../../contracts/mipmath6';

async function getUnlockTx(wallet: BrowserWallet, score: string): Promise<Tx> {
	const myAddrs = (await wallet.getUsedAddresses()).map(Address.fromString);

	const txBuilder = await getTxBuilder();
	const myUTxOs = (await wallet.getUtxos()).map(toPlutsUtxo);
	// const scoreStr = fromAscii( 's' + score );
	const scoreInt = Number(score);

	/**
	 * Wallets may have multiple addresses;
	 *
	 * to understand which one we previously used to lock funds
	 * we'll get the address based on the utxo that keeps one of our
	 * public key hashes as datum
	 */
	let myAddr!: Address;

	// only the ones with valid datum
	const utxoToSpend = (await koios.address.utxos(scriptAddr)).find((utxo) => {
		const datum = utxo.resolved.datum;

		if (
			// datum is inline
			isData(datum) &&
			// and is only bytes
			datum instanceof DataB
		) {
			const pkh = datum.bytes.toBuffer();

			// search if it corresponds to one of my public keys
			const myPkhIdx = myAddrs.findIndex((addr) =>
				uint8ArrayEq(pkh, addr.paymentCreds.hash.toBuffer())
			);

			// not a pkh of mine; not an utxo I can unlock
			if (myPkhIdx < 0) return false;

			// else fund my locked utxo
			myAddr = myAddrs[myPkhIdx];

			return true;
		}

		return false;
	});

	if (utxoToSpend === undefined) {
		throw 'Are you sure your tx had enough time to get to the blockchain?';
	}

	// TODO: temp code for test run. this logic will ultimately live in the contract
	const scoreBoolStr = scoreInt >= 73 ? 'true' : 'false';
	return txBuilder.buildSync({
		inputs: [
			{
				utxo: utxoToSpend as any,
				// we must include the utxo that holds our script
				inputScript: {
					script,
					datum: 'inline', // the datum is present already on `utxoToSpend`
					redeemer: new DataB(fromAscii(scoreBoolStr)),
					// redeemer: scoreInt.toFixed(0), // match the redeemer
				},
			},
		],
		requiredSigners: [myAddr.paymentCreds.hash],
		// include collateral when using contracts
		collaterals: [myUTxOs[0]],
		// send everything back to us
		changeAddress: myAddr,
	});
}

export async function unlockTx(
	wallet: BrowserWallet,
	score: string
): Promise<string> {
	const unsingedTx = await getUnlockTx(wallet, score);

	const txStr = await wallet.signTx(
		unsingedTx.toCbor().toString(),
		true // partial sign because we have smart contracts in the transaction
	);

	return (await koios.tx.submit(Tx.fromCbor(txStr))).toString();
}
