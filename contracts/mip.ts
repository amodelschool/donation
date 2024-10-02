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
	bs,
} from '@harmoniclabs/plu-ts';
import { network } from '../src/offchain/config';

const contract = pfn([
	PPubKeyHash.type,
	// data,
	bs,
	PScriptContext.type,
], bool)
(( owner, score, ctx ) => {
	// TODO: for testing, score is currently passed in as "true" or "false"
	// a score of 61 or greater must be submitted for the contract to succeed
	// const minimumScore = 61;
	// const numericScore = Number(score); //(score.toString().slice(1));
	const signedByOwner = ctx.tx.signatories.some( owner.eqTerm );
	//const tbPass = score.toString() === 'true';
	const tbPass = score.eq('true');
	
	// return pBool( numericScore >= minimumScore ).and( signedByOwner );
	return tbPass.and( signedByOwner );
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
