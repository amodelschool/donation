import { ProtocolParamters, TxBuilder, defaultProtocolParameters } from "@harmoniclabs/plu-ts";
import { koios } from './koios';
import { network } from './config';
 
/**
 * we don't want to do too many API calls if we already have our `txBuilder`
 * 
 * so after the first call we'll store a copy here.
 */
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
		catch { // just in case koios returns protocol parameters that don't look good
			// if that happens then use the default protocol parameters
			// !!! IMPORTANT !!! use only as fallback;
			// parameters might (and will) change from the real world
			_cachedTxBuilder = new TxBuilder(
				network,
				defaultProtocolParameters
			);
		}
	}

	return _cachedTxBuilder;
}