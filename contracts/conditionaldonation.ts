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
)((owner, fulfilled, ctx) => {
	const signedByRecipient = ctx.tx.signatories.some(owner.eqTerm);
	const tbPass = fulfilled.eq('true');

	return tbPass.and(signedByRecipient);
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
