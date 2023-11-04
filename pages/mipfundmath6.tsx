import { Button, useToast } from '@chakra-ui/react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import Head from 'next/head';
import { useState } from 'react';
import { lockTx } from '../src/offchain/lockTxMath6';
import { network } from '../src/offchain/config';

export default function Home() {
	const { wallet, connected } = useWallet();
	const toast = useToast();
	const cardanoscanPrefix =
		network.toString() === 'mainnet' ? '' : 'preprod.';
	const [showComplete, setShowComplete] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [amount, setAmount] = useState('');

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
		localStorage.setItem('amount_mipmath6', amount);
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
				<title>Fund Math Improvement Program - 6th Grade</title>
				<link rel="shortcut icon" href="/static/favicon.ico" />
				<link
					href="https://meshjs.dev/css/template.css"
					rel="stylesheet"
					key="mesh-demo"
				/>
			</Head>

			<main className="main">
				<h1 className="title">MIP: 6th Grade</h1>

				{!connected && !showComplete && (
					<>
						<h2 className="thin">
							Connect your Cardano wallet to fund the smart
							contract.
						</h2>
					</>
				)}

				{connected && !showComplete && (
					<>
						<h2 className="thin">Enter the funding amount.</h2>
					</>
				)}

				{showComplete && (
					<>
						<h2 className="thin">
							After signing, please allow a few minutes for the
							funding to hit the blockchain.
						</h2>
					</>
				)}

				<div className="demo">
					{!showComplete && <CardanoWallet />}

					{connected && !showComplete && (
						<form onSubmit={handleSubmit}>
							<div>
								<input
									className="amount"
									type="number"
									placeholder="ADA"
									value={amount}
									onChange={handleAmountChange}
								/>
							</div>
							<Button type="submit" onClick={onLock}>
								Fund
							</Button>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
