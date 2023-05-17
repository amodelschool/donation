import { ProtocolParamters, TxBuilder, defaultProtocolParameters } from '@harmoniclabs/plu-ts';
import { koios } from './koios';
import { network } from './config';

let _cachedTxBuilder: TxBuilder | undefined = undefined

export default async function getTxBuilder(): Promise<TxBuilder>
{
	if (!( _cachedTxBuilder instanceof TxBuilder ))
	{
		try {
			const pp = await koios.epoch.protocolParams() as Readonly<ProtocolParamters>;

			_cachedTxBuilder = new TxBuilder(
				network,
				pp
			);
		}
		catch {
			_cachedTxBuilder = new TxBuilder(
				network,
				defaultProtocolParameters
			);
		}
	}

	return _cachedTxBuilder;
}