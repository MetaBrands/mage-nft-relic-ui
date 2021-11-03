/* eslint-disable */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'material-react-toastify';

export default function App() {

  return (
	<div className="App">
		<main className="meta-body">
			<header className="meta-header">
				<div className="meta-logo logo-block">
					<img src="./assets/images/Meta_logo.png" className="logo" />
				</div>
				<div className="d-flex justify-content-end align-items-center fox-wallet">
					<div className="meta-fox d-flex justify-content-center align-items-center">
						<img src="./assets/images/Meta_fox.png" />
					</div>
					<div className="font-white wallet-address">
						1234567890
					</div>
				</div>
			</header>
			<section className="text-sention">
				<div className="main-title">
					<h1 className="font-white relic-text Rajdhani-Bold">MAGE RELIC NFTS</h1>
				</div>
				<p className="text-block Rajdhani-SemiBold">SACRIFICE MAGE TOKENS TO CLAIM YOUR RELIC TO THE METAVERSE...</p>
			</section>
			<section className="art-section row m-0">
				<div className="col-md-3 d-flex justify-content-center">
					<div className="stone">
						<h4 className="font-white Rajdhani-Bold" style={{ marginTop: "10%" }}>MASTER</h4>
						<img src="./assets/images/stone_1.png" className="stone-1" />
						<button className="stone-craft">CRAFT</button>
						<div className="d-flex justify-content-center mt-4 mage-block">
							<p className="m-text">M</p>
							<p className="mage-text Rajdhani-Medium">10,000 MAGE</p>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex justify-content-center">
					<div className="stone t-2">
						<h4 className="font-white" style={{ marginTop: "10%" }}>ORACLE</h4>
						<img src="./assets/images/stone_2.png" className="stone-2"/>
						<div className="d-flex justify-content-around craft-group">
							<button className="stone-craft">CRAFT</button>
							<button className="stone-craft">UPGRADE</button>
						</div>
						<div className="d-flex justify-content-center mt-4 mage-block">
							<p className="m-text">M</p>
							<p className="mage-text Rajdhani-Medium">25,000 MAGE</p>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex justify-content-center">
					<div className="stone t-2">
						<h4 className="font-white" style={{ marginTop: "10%" }}>ORACLE</h4>
						<img src="./assets/images/stone_3.png" className="stone-3" />
						<div className="d-flex justify-content-around craft-group">
							<button className="stone-craft">CRAFT</button>
							<button className="stone-craft">UPGRADE</button>
						</div>
						<div className="d-flex justify-content-center mt-4 mage-block">
							<p className="m-text">M</p>
							<p className="mage-text Rajdhani-Medium">50,000 MAGE</p>
						</div>
					</div>
				</div>
			</section>
			<section className="text-center mt-5">
				<p className="paper-text Rajdhani-Medium">LEARN MORE ABOUT MAGE RELIC NFTS</p>
				<a href='https://whitepaper.metabrands.io/' target='_BLANK'><button className="paper-btn">WHITE PAPER</button></a>
			</section>
			<footer className="foot-text Rajdhani-Medium">
				<p>
					Disclaimer: IF YOU PURCHASE THE TOKENS, YOU ARE INHERENTLY ASSUMING THE RISK OF ITS LOSS OF VALUE FROM THE TIE OF THE PURCHASE,
					AND YOU ARE AGREEING THAT THE TOKENS PRESENT FUNCTIONALITY AND IF MIGHT BE ALL THEY ARE EVER CAPABLE  OF GOING. IF YOU PURCHASE ANY OF THE TOKENS,
					YOU AGREE THAT YOU HAVE NO RECOURSE AND YOU WILL NOT ASSERT ANY CLAIM, ACTION, JUDGEMENT OR REMEDY AGAINST METABRANDS OR
					ITS SPONSORS IF THE TOKEN LOESE VALLUE, THE METABRANDS PLATFORM OR NETWORK CEASES TO FUNCTION, OR IF THE PLATFORM DOES NOT ULTIMATELY MEET EXPECTIONS.
				</p>
			</footer>
		</main>
	</div>
  );
}