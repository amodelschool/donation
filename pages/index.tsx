import Head from "next/head";
import { useState } from "react";
import type { NextPage } from "next";
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';
import { receivingAddresses } from "../src/offchain/receivingAddresses";

const Index: NextPage = () => {
	return (
		<div className="container">
			<Head>
			<title>Cardano - A Model School</title>
			<link rel="shortcut icon" href="/static/favicon.ico" />
			<link
				href="https://meshjs.dev/css/template.css"
				rel="stylesheet"
				key="mesh-demo"
			/>
			</Head>

			<main className="main">
				<h1 className="title">
					Cardano - A Model School
				</h1>
			</main>
		</div>
	);
};

export default Index;