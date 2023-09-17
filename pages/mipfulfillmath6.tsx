import { Button, useToast } from '@chakra-ui/react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import Head from 'next/head';
import { useState } from 'react';
import { Transaction } from '@meshsdk/core';
import { unlockTx } from '../src/offchain/unlockTxMath6';
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
	const [score, setAmount] = useState('');

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

	async function distributeFunds() {
		if (wallet) {
			// setLoading(true);
			// TODO: retrieve funded amount a different way because fulfill may be done from a different machine than funding
			const amount = localStorage.getItem('amount_mipmath6');
			const _assets = await wallet.getAssets();
			setAssets(_assets);
			setLoading(false);
			const totalLovelace = Number(amount) * 1000000;

			// testnet
			const amountTest = totalLovelace.toString();
			// teacher
			const amount1 = (totalLovelace * 0.05).toString();
			// iTeam members (x5)
			const amount2 = (totalLovelace * 0.02).toString();
			// students (x19)
			const amount3 = (totalLovelace * 0.0421).toString();
			// MCA Treasury
			const amount4 = (totalLovelace * 0.05).toString();
			// transaction
			let tx;

			if (network.toString() === 'testnet') {
				// testnet
				tx = new Transaction({ initiator: wallet }).sendLovelace(
					receivingAddresses.testAModelSchool,
					amountTest
				);
			} else {
				/* mainnet */
				tx = new Transaction({ initiator: wallet })
					.sendLovelace(receivingAddresses.mainTeacher, amount1)
					.sendLovelace(receivingAddresses.mainITeamMember1, amount2)
					.sendLovelace(receivingAddresses.mainITeamMember2, amount2)
					.sendLovelace(receivingAddresses.mainITeamMember3, amount2)
					.sendLovelace(receivingAddresses.mainITeamMember4, amount2)
					.sendLovelace(receivingAddresses.mainITeamMember5, amount2)
					.sendLovelace(receivingAddresses.mainMath6Student1, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student2, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student3, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student4, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student5, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student6, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student7, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student8, amount3)
					.sendLovelace(receivingAddresses.mainMath6Student9, amount3)
					.sendLovelace(
						receivingAddresses.mainMath6Student10,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student11,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student12,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student13,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student14,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student15,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student16,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student17,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student18,
						amount3
					)
					.sendLovelace(
						receivingAddresses.mainMath6Student19,
						amount3
					)
					.sendLovelace(receivingAddresses.mainMcaTreasury, amount4);
			}

			const unsignedTx = await tx.build();
			const signedTx = await wallet.signTx(unsignedTx);
			const txHash = await wallet.submitTx(signedTx);
		}
	}

	function onUnlock() {
		unlockTx(wallet, score)
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
				<title>Fulfill Math Improvement Program - 6th Grade</title>
				<link rel="shortcut icon" href="/static/favicon.ico" />
				<link
					href="https://meshjs.dev/css/template.css"
					rel="stylesheet"
					key="mesh-demo"
				/>
			</Head>

			<main className="main">
				<h1 className="title">
					Math Improvement Program
					<br />
					6th Grade
				</h1>

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
						<h2 className="thin">Enter the class test score.</h2>
					</>
				)}

				{showComplete && (
					<>
						<h2 className="thin">Sign the transaction.</h2>
					</>
				)}

				<div className="demo">
					{!showComplete && <CardanoWallet />}

					{connected && !showComplete && (
						<form onSubmit={handleSubmit}>
							<div>
								<input
									className="score"
									type="number"
									placeholder="Score"
									value={score}
									onChange={handleAmountChange}
								/>
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
