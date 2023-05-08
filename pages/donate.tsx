import Head from "next/head";
import { useState } from "react";
import type { NextPage } from "next";
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';

const Donate: NextPage = () => {
	const { connected, wallet } = useWallet();
	const [assets, setAssets] = useState<null | any>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [amount, setAmount] = useState('');
	const [showComplete, setShowComplete] = useState<boolean>(false);

	const handleAmountChange = (event:any) => {
		const value = event.target.value;
		if (!isNaN(value)) {
			setAmount(value);
		}
	}

	const handleSubmit = (event:any) => {
		event.preventDefault();
		getAssets();
	}

	async function getAssets() {
		if (wallet) {
			setLoading(true);
			const _assets = await wallet.getAssets();
			setAssets(_assets);
			setLoading(false);
			const totalLovelace = (Number(amount) * 1000000);

			const tx = new Transaction({ initiator: wallet })
				.sendLovelace(
					// Mainnet MCA Treasury Account
					'addr1q8tytnpwzzk4u3q9vg2gwht2lh8egmdrap02qlxz3x32z3zkndgvuql6gynlq7mlv5geelcz83lzvjer59cpc3zmpu0q29f7x4',
					totalLovelace.toString()
				)
			;
			const unsignedTx = await tx.build();
			const signedTx = await wallet.signTx(unsignedTx);
			const txHash = await wallet.submitTx(signedTx);
			setShowComplete(true);
		}
	}

	return (
		<div className="container">
			<Head>
			<title>MCA Cardano Donations</title>
			<link rel="shortcut icon" href="/static/favicon.ico" />
			<link
				href="https://meshjs.dev/css/template.css"
				rel="stylesheet"
				key="mesh-demo"
			/>
			</Head>

			<main className="main">
			<h1 className="title">
				Musawenkosi Christian Academy
			</h1>

			{(!connected && !showComplete) && (
				<>
				<h2 className="thin">Connect your Cardano wallet to make a donation.</h2>
				<p>A Cardano wallet extension and Chrome-based browser is required.</p>
				</>
			)}

			{(connected && !showComplete) && (
				<>
				<h2 className="thin">Make a donation to our school.</h2>
				</>
			)}

			{showComplete && (
				<>
				<h2 className="thin">Thank you for your donation.</h2>
				</>
			)}

			{!showComplete && (
				<div className="demo">
					<CardanoWallet />
				</div>
			)}
			

			{(connected && !showComplete) && (
				<>
				<form onSubmit={handleSubmit}>
					<label>
						Please enter the amount you would like to donate.
						<p><input className="amount" type="number" placeholder="ADA" value={amount} onChange={handleAmountChange} /></p>
						
					</label>
					<button type="submit">Donate</button>
				</form>
				</>
			)}
			</main>
		</div>
	);
};

export default Donate;