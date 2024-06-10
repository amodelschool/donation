import { Button, useToast } from '@chakra-ui/react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import Head from 'next/head';
import { useState } from 'react';
import { Transaction } from '@meshsdk/core';
import { unlockTx } from '../src/offchain/unlockTxMath7';
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
			const amount = localStorage.getItem('amount_mipmath7');
			const _assets = await wallet.getAssets();
			setAssets(_assets);
			setLoading(false);
			const totalLovelace = Number(amount) * 1000000;

			// testnet
			const amountTest = totalLovelace.toString();
			// teacher 5%
			const amount1 = (totalLovelace * 0.05).toString();
			// iTeam members 10% (x5)
			const amount2 = (totalLovelace * 0.02).toString();
			// students 80% (x22)
			const amount3 = (totalLovelace * (.8 / 22)).toString();
			// MCA Treasury 5%
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
					.sendLovelace(receivingAddresses.mainMath7Student1, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student2, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student3, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student4, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student5, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student6, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student7, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student8, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student9, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student10, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student11, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student12, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student13, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student14, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student15, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student16, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student17, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student18, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student19, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student20, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student21, amount3)
					.sendLovelace(receivingAddresses.mainMath7Student22, amount3)
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
				<title>Fulfill Math Improvement Program - 7th Grade</title>
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
					5th Grade
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
