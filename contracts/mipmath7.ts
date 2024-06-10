import {
	Address,
	PPubKeyHash,
	PScriptContext,
	PaymentCredentials,
	Script,
	bool,
	compile,
	makeValidator,
	pfn,
	bs,
} from '@harmoniclabs/plu-ts';
import { network } from '../src/offchain/config';

const contract = pfn(
	[PPubKeyHash.type, bs, PScriptContext.type],
	bool
)((owner, score, ctx) => {
	// TODO: for testing, score is currently passed in as "true" or "false"
	// a score of 61 or greater must be submitted for the contract to succeed
	const signedByOwner = ctx.tx.signatories.some(owner.eqTerm);
	const tbPass = score.eq('true');

	return tbPass.and(signedByOwner);
});

/**
 * Utilities
 */
export const untypedValidator = makeValidator(contract);

export const compiledContract = compile(untypedValidator);

export const script = new Script('PlutusScriptV2', compiledContract);

export const scriptAddr = new Address(
	network,
	PaymentCredentials.script(script.hash)
);
