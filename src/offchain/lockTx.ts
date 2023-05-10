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

async function getLockTx( wallet: BrowserWallet ): Promise<Tx>
{
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

	const utxo = myUTxOs.find( u => u.resolved.value.lovelaces > 2_000_000 );

	if( utxo === undefined )
	{
		throw 'not enough ada';
	}

	return txBuilder.buildSync({
		inputs: [{ utxo }],
		outputs: [
			{ // output holding the funds that we'll spend later
				address: scriptAddr,
				// 1MM lovelace == 1 ADA
				value: Value.lovelaces( 1_000_000 ),
				// remember to include a datum
				datum: new DataB(
					// remember we set the datum to be the public key hash?
					// we can extract it from the address as follows
					myAddr.paymentCreds.hash.toBuffer()
				)
			}
		],
		// send everything left back to us
		changeAddress: myAddr
	});
}

export async function lockTx( wallet: BrowserWallet): Promise<string>
{
	const unsingedTx = await getLockTx( wallet );

	const txStr = await wallet.signTx(
		unsingedTx.toCbor().toString()
	);

	return (await koios.tx.submit( Tx.fromCbor( txStr ) as any )).toString();
}