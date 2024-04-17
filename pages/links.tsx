import Head from 'next/head';
import type { NextPage } from 'next';

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
				<h2 className="title">Smart Contract Links</h2>
				<div id="links">
					<p>
						Donor to School (5-month period)
						<br />
						<a
							href="https://cardanoams.com/conditionaldonation"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/conditionaldonation
						</a>
					</p>
					<p>
						Donation Fulfillment
						<br />
						<a
							href="https://cardanoams.com/donationfulfill"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/donationfulfill
						</a>
					</p>
					<p>&nbsp;</p>
					<p>
						Donor to School (6 or 12-month period)
						<br />
						<a
							href="https://cardanoams.com/metereddonation"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/metereddonation
						</a>
					</p>
					<p>
						Donation Fulfillment
						<br />
						<a
							href="https://cardanoams.com/metereddonationfulfill"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/metereddonationfulfill
						</a>
					</p>
					<p>&nbsp;</p>
					<p>
						Pen Pal 1 Fund
						<br />
						<a
							href="https://cardanoams.com/penpal1fund"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/penpal1fund
						</a>
					</p>
					<p>
						Pen Pal 1 Fulfill
						<br />
						<a
							href="https://cardanoams.com/penpal1fulfill"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/penpal1fulfill
						</a>
					</p>
					<p>&nbsp;</p>
					<p>
						Direct Donation to School
						<br />
						<a
							href="https://cardanoams.com/donate"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/donate
						</a>
					</p>
					<p>&nbsp;</p>
					<p>
						MIP: 5th Grade (fund)
						<br />
						<a
							href="https://cardanoams.com/mipfund"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/mipfund
						</a>
					</p>
					<p>
						MIP: 5th Grade (fulfill)
						<br />
						<a
							href="https://cardanoams.com/mipfulfill"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/mipfulfill
						</a>
					</p>
					<p>&nbsp;</p>
					<p>
						MIP: 6th Grade (fund)
						<br />
						<a
							href="https://cardanoams.com/mipfundmath6"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/mipfundmath6
						</a>
					</p>
					<p>
						MIP: 6th Grade (fulfill)
						<br />
						<a
							href="https://cardanoams.com/mipfulfillmath6"
							target="_blank"
							rel="noreferrer"
						>
							https://cardanoams.com/mipfulfillmath6
						</a>
					</p>
				</div>
			</main>
		</div>
	);
};

export default Index;
