import { Button, useToast } from "@chakra-ui/react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import Head from "next/head";
import { lockTx } from "../src/offchain/lockTx";
import { unlockTx } from "../src/offchain/unlockTx";

export default function Home()
{
	const { wallet, connected } = useWallet();
	const toast = useToast();

	function onLock()
	{
		lockTx( wallet )
		// lock transaction created successfully
		.then( txHash => toast({
			title: `lock tx submitted: https://preprod.cardanoscan.io/transaction/${txHash}`,
			status: 'success'
		}))
		// lock transaction failed
		.catch( e => {
			toast({
				title: `lock transaction failed`,
				status: 'error'
			});
			console.error( e )
		});
	}

	function onUnlock()
	{
		unlockTx( wallet )
		// unlock transaction created successfully
		.then( txHash => toast({
			title: `unlock tx submitted: https://preprod.cardanoscan.io/transaction/${txHash}`,
			status: "success"
		}))
		// unlock transaction failed
		.catch( e => {
			toast({
				title: `unlock transaction failed`,
				status: "error"
			});
			console.error( e )
		});
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
					Math Improvement Program
				</h1>
				<h2 className="thin">Fund smart contract</h2>

				{/* TODO: embed ZAR (rand) to ADA currency converter */}

				<div className="demo">
					<CardanoWallet />
					<br /><br />
					{
						connected &&
						<>
							<Button onClick={onLock}>Fund</Button>
							<Button onClick={onUnlock} >Unlock</Button>
						</>
					}
				</div>
			</main>
		</div>
	)
}