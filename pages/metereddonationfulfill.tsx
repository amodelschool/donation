import { Button, useToast } from '@chakra-ui/react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import Head from 'next/head';
import { useState } from 'react';
import { Transaction } from '@meshsdk/core';
import { unlockTx } from '../src/offchain/unlockTxDonation';
import { network } from '../src/offchain/config';
import { receivingAddresses } from '../src/offchain/receivingAddresses';

export default function Home() {
	const { wallet, connected } = useWallet();
	const toast = useToast();
	const cardanoscanPrefix =
		network.toString() === 'mainnet' ? '' : 'preprod.';
	const [assets, setAssets] = useState<null | any>(null);
	const [showComplete, setShowComplete] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [fulfilled, setFulfilled] = useState<boolean>(false);

	const handleChange = (event: any) => {
		const value = event.target.value;
		setFulfilled(value === 'yes');
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		getAssets();
	};

	async function getAssets() {
		if (wallet) {
			setLoading(true);
			setShowComplete(true);
		}
	}

	async function distributeFunds() {
		if (wallet) {
			const _assets = await wallet.getAssets();
			// TODO: retrieve original funded amount from contract, not just remaining amount. This total may need to be written as metadata to the contract.
			const totalAmount = localStorage.getItem(
				'amount_conditionaldonation'
			);

			const amount = Number(totalAmount) / 5;
			setAssets(_assets);
			setLoading(false);
			const totalLovelace = (Number(amount) * 1000000).toString();

			const tx = new Transaction({ initiator: wallet }).sendLovelace(
				// receivingAddresses.mainTest,
				receivingAddresses.mainMcaTreasury,
				// receivingAddresses.testMcaTreasury,
				totalLovelace
			);

			const unsignedTx = await tx.build();
			const signedTx = await wallet.signTx(unsignedTx);
			const txHash = await wallet.submitTx(signedTx);
		}
	}

	function onUnlock() {
		unlockTx(wallet, fulfilled)
			// unlock transaction created successfully
			.then((txHash) =>
				toast({
					title: `unlock tx submitted: https://${cardanoscanPrefix}cardanoscan.io/transaction/${txHash}`,
					status: 'success',
				})
			)
			.then(() => {
				distributeFunds();
			})
			// unlock transaction failed
			.catch((e) => {
				toast({
					title: `unlock transaction failed`,
					status: 'error',
				});
				console.error(e);
			});
	}

	return (
		<div className="container">
			<Head>
				<title>Fulfill Donation</title>
				<link rel="shortcut icon" href="/static/favicon.ico" />
				<link
					href="https://meshjs.dev/css/template.css"
					rel="stylesheet"
					key="mesh-demo"
				/>
			</Head>

			<main className="main">
				<h1 className="title">Fulfill Donation Monthly Obligation</h1>

				{!connected && !showComplete && (
					<>
						<h2 className="thin">
							Connect your Cardano wallet to enter the fulfillment
							criteria.
						</h2>
					</>
				)}

				{connected && !showComplete && (
					<>
						<h2 className="thin">
							Enter the fulfillment criteria below to distribute
							the donation.
						</h2>
					</>
				)}

				{showComplete && (
					<>
						<h2 className="thin">Please sign the transaction.</h2>
					</>
				)}

				<div className="demo">{!showComplete && <CardanoWallet />}</div>
				<div className="demo">
					{connected && !showComplete && (
						<form onSubmit={handleSubmit}>
							<div>
								<p>
									Have the required documents/feedback been
									sent to the donor for this month?
								</p>
								<input
									type="radio"
									name="fulfilled"
									value="yes"
									onChange={handleChange}
								/>
								<label htmlFor="yes"> Yes</label>
								&nbsp;&nbsp;&nbsp;
								<input
									type="radio"
									name="fulfilled"
									value="no"
									onChange={handleChange}
								/>
								<label htmlFor="no"> No</label>
							</div>
							<Button type="submit" onClick={onUnlock}>
								Enter
							</Button>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
