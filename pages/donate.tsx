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
			// const amountEach = Math.floor(totalLovelace / 5);

			const tx = new Transaction({ initiator: wallet })
				.sendLovelace(
					// Personal Mainnet Test Accout
					// 'addr1qycxglxpgn67hxpjnggwa95gjmujfwpmgqhjspwaggn3jgufw5dq7tns33pyvkedd8nxxy94hr7gjxzvv5zp9l9sxelq8jujnx',
					// Mainnet MCA Treasury Account
					'addr1q8tytnpwzzk4u3q9vg2gwht2lh8egmdrap02qlxz3x32z3zkndgvuql6gynlq7mlv5geelcz83lzvjer59cpc3zmpu0q29f7x4',
					totalLovelace.toString()
				)
				/*.sendLovelace(
					// Distribution 1
					//'addr_test1qrhzmg2xv5xdd8uq460ethr5efpj6x2w4pp98hlz5eu4nefdqtcsz5w7pamjgz0r0fe47du3hgaczkaxrp804yp0vntq2mxcc3',
					// mainnet
					'addr1qxea54qhrj4xynsxgju8wtpzmd96gs7fjdu8p93uet8ck8av7svuh3hapejrm6s65qvmp4x76m3fwt9rj52aws02nqdq7utwjd',
					amountEach.toString()
				)
				.sendLovelace(
					// Distribution 2
					//'addr_test1qryekzvqm0vyprm69py97p9dpggxvescnvcnpkrmhlkfscnk24qa5rcdyhx4m72nkw384wv6pjhcz8wn97n7vvy762qqej62z7',
					// mainnet
					'addr1qxg0f40km5mkkjas6p5hqhe3pjeasuvkqj0ksvh92mu5kk5ks2qxc30j3j77twhd9hhul6475jpfj29qn77zldma6v9q0lgp47',
					amountEach.toString()
				)
				.sendLovelace(
					// Distribution 3
					//'addr_test1qz5fuz6c8n6my0w82z83rwla6c5uftuh7mlf4wn4fpa4zz4m52ymed0k5uyxx7cvp0dv5603szgxu8x6ljdt04h97fvsucvpyu',
					// mainnet
					'addr1q975qhjljlusw9e5g75zq9vn774n0f6z3nrrdnkj8dztky5ks28fcrfyrkumz07atgjzp0vsf07zwj74s0sq38qjkhhqqwuf7s',
					amountEach.toString()
				)
				.sendLovelace(
					// Distribution 4
					//'addr_test1qpha2jks7xk2uy3adf768mwpg4fe86g4gmmkya985mr30hydquq2vretqu77ewrsh0k0zsx3dfntm8pxuktxkdvvcf3sh66zu3',
					// mainnet
					'addr1q8lp6npvm8fhzr468kjxj0vweez45qgs2m0kux2araep9f972pzt7etue6dttlk8j0q5eaewh5msg96jz5dvlfnc0vksx5g4ny',
					amountEach.toString()
				)
				.sendLovelace(
					// Distribution 5
					//'addr_test1qzg622rj95xcjnre6xwl6480rn87mgscs8qqpma83fz4myjxk25j4ax48dnzgcvz5ul26nxu0wd6dh59slp3ywhguq8s9wpant',
					// mainnet
					'addr1qy4t645hff2lvswjdrqydmelczg0d6jy9lw3j2mz8atvdddkq0s7yx75vpgk7vy2l6vvv9qe3ryt2xxcu9dn0jv9ckysvehlhy',
					amountEach.toString()
				)*/
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