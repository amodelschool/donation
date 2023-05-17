import {
	Address,
	PPubKeyHash,
	PScriptContext,
	PaymentCredentials,
	pBool,
	Script,
	bool,
	compile,
	makeValidator,
	pfn,
	data,
} from '@harmoniclabs/plu-ts';
import { network } from '../src/offchain/config';

const contract = pfn([
	PPubKeyHash.type,
	data,
	PScriptContext.type,
], bool)
(( owner, score, ctx ) => {
	// a score of 61 or greater must be submitted for the contract to succeed
	const minimumScore = 61;
	const numericScore = Number(score); //(score.toString().slice(1));
	const signedByOwner = ctx.tx.signatories.some( owner.eqTerm );
	
	return pBool( numericScore >= minimumScore ).and( signedByOwner );
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
