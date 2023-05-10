import {
	Address,
	bs,
	PPubKeyHash,
	PScriptContext,
	PaymentCredentials,
	Script,
	bool,
	compile,
	makeValidator,
	pfn,
} from '@harmoniclabs/plu-ts';
import { network } from '../src/offchain/config';

const contract = pfn([
	PPubKeyHash.type,
	bs,
	PScriptContext.type
], bool)
(( owner, message, ctx ) => {
	const matchString = message.eq('test');
	const signedByOwner = ctx.tx.signatories.some( owner.eqTerm );
	return matchString.and( signedByOwner );
});

/**
 * Utilities
 */
export const untypedValidator = makeValidator( contract );

export const compiledContract = compile( untypedValidator );

export const script = new Script(
	'PlutusScriptV2',
	compiledContract
);

export const scriptAddr = new Address(
	network,
	PaymentCredentials.script( script.hash )
);
