import {
	Address,
	DataB,
	Tx,
	Value,
} from '@harmoniclabs/plu-ts';
import { BrowserWallet } from '@meshsdk/core';
import getTxBuilder from './getTxBuilder';
import koios from './koios';
import { toPlutsUtxo } from './mesh-utils';
import { scriptAddr } from '../../contracts/mip';

async function getLockTx( wallet: BrowserWallet, amount: string ): Promise<Tx>
{
	const amountLovelace = parseInt( amount ) * 1000000;

	// creates an address from the bech32 form
	const myAddr = Address.fromString(
		await wallet.getChangeAddress()
	);

	const txBuilder = await getTxBuilder();
	const myUTxOs = (await wallet.getUtxos()).map( toPlutsUtxo );

	if ( myUTxOs.length === 0 )
	{
		throw new Error('Have you requested funds from the faucet?');
	}

	const utxo = myUTxOs.find( u => u.resolved.value.lovelaces > amountLovelace );

	if( utxo === undefined )
	{
		throw 'not enough ada';
	}

	return txBuilder.buildSync({
		inputs: [{ utxo }],
		outputs: [
			{ // output holding the funds that we'll spend later
				address: scriptAddr,
				value: Value.lovelaces( amountLovelace ),
				// remember to include a datum
				datum: new DataB(
					// datum set to be the public key hash
					// it can be extracted from the address
					myAddr.paymentCreds.hash.toBuffer()
				)
			}
		],
		// send everything remaining back to originator
		changeAddress: myAddr
	});
}

export async function lockTx( wallet: BrowserWallet, amount: string): Promise<string>
{
	const unsingedTx = await getLockTx( wallet, amount );

	const txStr = await wallet.signTx(
		unsingedTx.toCbor().toString()
	);

	return (await koios.tx.submit( Tx.fromCbor( txStr ) as any )).toString();
}