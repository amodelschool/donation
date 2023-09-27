import Head from 'next/head';
import { useState } from 'react';
import type { NextPage } from 'next';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { useToast } from '@chakra-ui/react';
import { lockTx } from '../src/offchain/lockTxDonation';
import { network } from '../src/offchain/config';

const Donate: NextPage = () => {
	const { connected, wallet } = useWallet();
	const [loading, setLoading] = useState<boolean>(false);
	const [amount, setAmount] = useState('');
	const [showComplete, setShowComplete] = useState<boolean>(false);
	const toast = useToast();
	const cardanoscanPrefix =
		network.toString() === 'mainnet' ? '' : 'preprod.';

	const handleAmountChange = (event: any) => {
		const value = event.target.value;
		if (!isNaN(value)) {
			setAmount(value);
		}
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

	const onLock = () => {
		localStorage.setItem('amount_penpal1', amount);
		lockTx(wallet, amount)
			// lock transaction created successfully
			.then((txHash) =>
				toast({
					title: `lock tx submitted: https://${cardanoscanPrefix}cardanoscan.io/transaction/${txHash}`,
					status: 'success',
				})
			)
			// lock transaction failed
			.catch((e) => {
				toast({
					title: `lock transaction failed`,
					status: 'error',
				});
				console.error(e);
			});
	};

	return (
		<div className="container">
			<Head>
				<title>MCA Cardano Pen Pal Donation</title>
				<link rel="shortcut icon" href="/static/favicon.ico" />
				<link
					href="https://meshjs.dev/css/template.css"
					rel="stylesheet"
					key="mesh-demo"
				/>
			</Head>

			<main className="main">
				<h1 className="title">Pen Pal Donation</h1>

				{!connected && !showComplete && (
					<>
						<h2 className="thin">
							Connect your Cardano wallet to make a donation.
						</h2>
						<p>
							A Cardano wallet extension and Chrome-based browser
							are required.
						</p>
					</>
				)}

				{connected && !showComplete && (
					<>
						<h2 className="thin">Make a donation to our school.</h2>
					</>
				)}

				{showComplete && (
					<>
						<h2 className="thin">
							Please sign the transaction. Thank you for your
							donation.
						</h2>
						<p>
							Your funds will be held in escrow until the
							appropriate conditions are met each month. Upon
							successfully meeting our requirement each month, 20%
							of your donation at a time will be sent to the
							school.
						</p>
					</>
				)}

				{!showComplete && (
					<div className="demo">
						<CardanoWallet />
					</div>
				)}

				{connected && !showComplete && (
					<div className="demo">
						<form onSubmit={handleSubmit}>
							<label>
								Please enter the amount you would like to
								donate.
								<p>
									<input
										className="amount"
										type="number"
										placeholder="ADA"
										value={amount}
										onChange={handleAmountChange}
									/>
								</p>
								{/* TODO: we will also collect the donor's email address and other contact information so the conditions of the donation can be met. */}
							</label>
							<button type="submit" onClick={onLock}>
								Donate
							</button>
						</form>
					</div>
				)}
			</main>
		</div>
	);
};

export default Donate;
