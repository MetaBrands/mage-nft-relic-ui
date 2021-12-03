/* eslint-disable */
import React, { useState, useEffect } from "react";
// Toastify
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
toast.configure();

// Dotenv
require('dotenv').config()

import { injected } from './connectors/connectors'
import { useWeb3React } from "@web3-react/core";
import {ethers} from 'ethers'

// ABI
import MageCreator from './utils/MageCreator.json'
import MetaBrands from './utils/MetaBrands.json'
import NFT from './utils/NFT.json'

export default function App() {

	
const { active, account, library, connector, chainId, activate, deactivate } = useWeb3React();
	
useEffect(() => {
	if(active){
		verifyNetwork()
	}
}, [chainId, account, active])

// Craft buttons
const [craftMasterButton, setCraftMasterButton]= useState(true)
const [craftOracleButton, setCraftOracleButton]= useState(true)
const [craftArchmageButton, setCraftArchmageButton]= useState(true)

// Craft buttons inner text
const [craftMasterButtonInnerText, setCraftMasterButtonInnerText]= useState(true)
const [craftOracleButtonInnerText, setCraftOracleButtonInnerText]= useState(true)
const [craftArchmageButtonInnerText, setCraftArchmageButtonInnerText]= useState(true)

// Craft Buttons Opacity
const [craftMasterHover, setCraftMasterHover]= useState(false)
const [craftOracleHover, setCraftOracleHover] = useState(false)
const [craftArchmageHover, setCraftArchmageHover] = useState(false)

// Upgrade buttons
const [upgradeFromMasterToOracle, setUpgradeFromMasterToOracle]= useState(false)
const [upgradeFromMasterToArchmage, setUpgradeFromMasterToArchmage]= useState(false)
const [upgradeFromOracleToArchmage, setUpgradeFromOracleToArchmage]= useState(false)

// Upgrade buttons hover
const [upgradeFromMasterToOracleHover, setUpgradeFromMasterToOracleHover]= useState(false)
const [upgradeFromMasterToArchmageHover, setUpgradeFromMasterToArchmageHover]= useState(false)
const [upgradeFromOracleToArchmageHover, setUpgradeFromOracleToArchmageHover]= useState(false)

// Upgrade buttons inner text
const [upgradeMasterToOracleButtonInnerText, setUpgradeMasterToOracleButtonInnerText]= useState(true)
const [upgradeMasterToArchmageButtonInnerText, setUpgradeMasterToArchmageButtonInnerText]= useState(true)
const [upgradeOracleToArchmageButtonInnerText, setUpgradeOracleToArchmageButtonInnerText]= useState(true)

// Token Values ERC20
const [tokenERC20, setTokenERC20] = useState('')
const [MageBalanceERC20, setMageBalanceERC20] = useState('')

// NFT Values ERC721
const [masterNFT, setMasterNFT] = useState('')
const [oracleNFT, setOracleNFT] = useState('')
const [archmageNFT, setArchmageNFT] = useState('')


// *************************** ALERT FUNCTIONS ********************************
const notifySuccess = (mesage) => toast.success(mesage, {position: toast.POSITION.TOP_CENTER});
const notifyError = (mesage) => toast.error(mesage, {position: toast.POSITION.TOP_CENTER});
const notifyInfo = (mesage) => toast.info(mesage, 
	{position: toast.POSITION.TOP_CENTER, 
	autoClose: false,
	closeOnClick: true,	
});



// *************************** VERIFY FUNCTIONS ********************************

function verifyNetwork(){
	if(chainId === 4){
			verifyERC20()
	}else{
			notifyError('Wrong network, please try to change to Rinkeby network')
			resetGeneral()
		if(active){
			deactivate()
		}
	}
}

async function verifyERC20(){
	// Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const contract = new ethers.Contract(process.env.REACT_APP_MAGE_ADDR, MetaBrands, provider)
	let res = await contract.balanceOf(account)
	let MageBalance = ethers.utils.formatEther(res)	
	setTokenERC20(MageBalance)
	setMageBalanceERC20(new Intl.NumberFormat().format(MageBalance))
	
	// Master
	if(MageBalance >= 10_000){
		setCraftMasterButton(false)
		setCraftMasterHover(true)
	}else{
		setCraftMasterButton(true)
		setCraftMasterHover(false)
	}
	// Oracle
	if(MageBalance >= 25_000){
		setCraftOracleButton(false)
		setCraftOracleHover(true)
	}else{
		setCraftOracleButton(true)
		setCraftOracleHover(false)
	}
	// Archmage
	if(MageBalance >= 50_000){
		setCraftArchmageButton(false)
		setCraftArchmageHover(true)
	}else{
		setCraftArchmageButton(true)
		setCraftArchmageHover(false)
	}

	verifyERC721()
}

async function verifyERC721(){

		// Instantiating a new contract
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		await window.ethereum.request({ method: 'eth_requestAccounts' })
		const signerx = provider.getSigner(0)
	
		// ERC721-MASTER
		const contracterc721Master = new ethers.Contract(process.env.REACT_APP_MASTER_ADDR, NFT, signerx)
		let res721Master = await contracterc721Master.balanceOf(account)
		let convertedValue721Master = ethers.utils.formatEther(res721Master)
		// console.table(convertedValue721Master + ' Master')
		let masterNFT = res721Master.toNumber()
		setMasterNFT(res721Master.toNumber())
	
		// // ERC721-ORACLE
		const contracterc721Oracle = new ethers.Contract(process.env.REACT_APP_ORACLE_ADDR, NFT, signerx)
		let res721Oracle = await contracterc721Oracle.balanceOf(account)
		let convertedValue721Oracle = ethers.utils.formatEther(res721Oracle)
		// console.table(convertedValue721Oracle + ' Oracles')
		let oracleNFT = res721Oracle.toNumber()
		setOracleNFT(res721Oracle.toNumber())
	
		// ERC721-ARCHMAGE 
		const contracterc721Archmage = new ethers.Contract(process.env.REACT_APP_ORACLE_ADDR, NFT, signerx)
		let res721Archmage = await contracterc721Archmage.balanceOf(account)
		let convertedValue721Archmage = ethers.utils.formatEther(res721Archmage)
		// console.table(convertedValue721Archmage + ' Archmages')
		let archmageNFT = res721Archmage.toNumber()
		setArchmageNFT(res721Archmage.toNumber())

		// Instantiating a new contract
		const contract = new ethers.Contract(process.env.REACT_APP_MAGE_ADDR, MetaBrands, provider)
		let res = await contract.balanceOf(account)
		let MageBalance = ethers.utils.formatEther(res)
		setTokenERC20(MageBalance)
		setMageBalanceERC20(new Intl.NumberFormat().format(MageBalance))


	
		// NFT

		// Master To Oracle
		if(masterNFT >= 1 && MageBalance >= 15_000){
			setUpgradeFromMasterToOracle(false)
			setUpgradeFromMasterToOracleHover(true)
		}else{
			setUpgradeFromMasterToOracle(true)		
			setUpgradeFromMasterToOracleHover(false)
		}

		// Master To Archmage
		if(masterNFT >= 1 && MageBalance >= 40_000){
			setUpgradeFromMasterToArchmage(false)
			setUpgradeFromMasterToArchmageHover(true)
		}else{
			setUpgradeFromMasterToArchmage(true)
			setUpgradeFromMasterToArchmageHover(false)
		}

		// Oracle To Archmage
		if(oracleNFT >= 1 && MageBalance >= 25_000){
			setUpgradeFromOracleToArchmage(false)
			setUpgradeFromOracleToArchmageHover(true)
		}else{
			setUpgradeFromOracleToArchmage(true)
			setUpgradeFromOracleToArchmageHover(false)
		}

}

// *************************** CRAFT TOKENS ***************************

// Craft Master
async function craftMasterToken(){
	// Instantiating a new contract
	const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const signerx = provider.getSigner(0)

	// Craft Master Tokens
    const contracterc721Master = new ethers.Contract(process.env.REACT_APP_MAGECREATOR_ADDR, MageCreator, signerx)
	try {
		let res = await contracterc721Master.mintNFT("MASTER")
		setCraftMasterButtonInnerText(false)
		
		notifyInfo('Please wait for the transaction to complete....')
		let resWait = await res.wait()
		setCraftMasterButtonInnerText(true)
		toast.dismiss()
		
		if(resWait.status === 1){
			notifySuccess('Your MASTER token was crafted successfully.')
			verifyERC20()
		}else{
			notifyError('Your token was not crafted')
			verifyERC20()
		}
	}catch (e) {
		if(e.code === 4001){
			notifyError('User rejected MASTER TOKEN transaction')
			verifyERC20()
		}
	}

}

// Craft Oracle
async function cratOracleToken(){
	// Instantiating a new contract
	const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const signerx = provider.getSigner(0)

	// Craft Oracle Token
    const contracterc721Oracle = new ethers.Contract(process.env.REACT_APP_MAGECREATOR_ADDR, MageCreator, signerx)
	try{
		let res = await contracterc721Oracle.mintNFT("ORACLE")
		setCraftOracleButtonInnerText(false)
		
		notifyInfo('Please wait for the transaction to complete....')
		let resWait = await res.wait()
		setCraftOracleButtonInnerText(true)
		toast.dismiss()
		
		if(resWait.status === 1){
			notifySuccess('Your ORACLE token was crafted successfully.')
			verifyERC20()
		}else{
			notifyError('Your ORACLE token was not crafted')
			verifyERC20()
		}
	}catch(e){
		if(e.code === 4001){
			notifyError('User rejected ORACLE TOKEN transaction')
			verifyERC20()
		}
	}
}

// Craft Archmage
async function cratArchmageToken(){
	// Instantiating a new contract
	const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const signerx = provider.getSigner(0)

	// Craft Archmage Token
    const contracterc721Archmage = new ethers.Contract(process.env.REACT_APP_MAGECREATOR_ADDR, MageCreator, signerx)
	try{
		let res = await contracterc721Archmage.mintNFT("ARCHMAGE")
		setCraftArchmageButtonInnerText(false)
		
		notifyInfo('Please wait for the transaction to complete....')
		let resWait = await res.wait()
		setCraftArchmageButtonInnerText(true)
		toast.dismiss()
		
		if(resWait.status === 1){
			notifySuccess('Your Archmage token was crafted successfully.')
			verifyERC20()
		}else{
			notifyError('Your Archmage token was not crafted')
			verifyERC20()
		}
	}catch(e){
		if(e.code === 4001){
			notifyError('User rejected ARCHMAGE TOKEN transaction')
			verifyERC20()
		}
	}


}

// *************************** UPGRADE TOKENS ***************************

async function upgradeMasterToOracleToken(){
	// Instantiating a new contract
	const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const signerx = provider.getSigner(0)

	// Upgrade Master to Oracle Token
	if(masterNFT >= 1 && tokenERC20 >= 15_000){
		try{
			const contracterc721Master = new ethers.Contract(process.env.REACT_APP_MAGECREATOR_ADDR, MageCreator, signerx)
			let res = await contracterc721Master.upgradeNFT("MASTER", "ORACLE")
			setUpgradeMasterToOracleButtonInnerText(false)
			
			notifyInfo('Please wait for the transaction to complete....')
			let resWait = await res.wait()
			setUpgradeMasterToOracleButtonInnerText(true)
			toast.dismiss()
			
			if(resWait.status === 1){
				notifySuccess('Your upgrade from MASTER to ORACLE was successfull')
				verifyERC20()
			}else{
				notifyError('Error on upgrade')	
				verifyERC20()
			}

		}catch (e){
			if(e.code === 4001){
			notifyError('User rejected MASTER TO ORACLE UPGRADE transaction')
			verifyERC20()
			}
		}
	}else{
		notifyError('Insufficient tokens')
		verifyERC20()
	}

}

async function upgradeOracleToArchmageToken(){
	// Instantiating a new contract
	const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const signerx = provider.getSigner(0)

	// Upgrade Oracle to Archmage Token
	if(oracleNFT >= 1 && tokenERC20 >= 25_000){
		try {
			const contracterc721Master = new ethers.Contract(process.env.REACT_APP_MAGECREATOR_ADDR, MageCreator, signerx)
			let res = await contracterc721Master.upgradeNFT("ORACLE","ARCHMAGE")
			setUpgradeOracleToArchmageButtonInnerText(false)
			notifyInfo('Please wait for the transaction to complete....')
			
			let resWait = await res.wait()
			setUpgradeOracleToArchmageButtonInnerText(true)
			toast.dismiss()
			
			if(resWait.status === 1){
				notifySuccess('Your upgrade from ORACLE to ARCHMAGE was successfull')
				verifyERC20()
			}else{
				notifyError('Error on upgrade')			
				verifyERC20()
			}			
		}catch(e){
			if(e.code === 4001){
			notifyError('User rejected MASTER TO ARCHMAGE UPGRADE transaction')
			verifyERC20()
			}
		}
	}else{
		notifyError('Insufficient tokens')
		verifyERC20()
	}
}

async function UpgradeMasterToArchmageToken(){
	// Instantiating a new contract
	const provider = new ethers.providers.Web3Provider(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const signerx = provider.getSigner(0)


	if(masterNFT >= 1 && tokenERC20 >= 40_000){
		try{
			const contracterc721Master = new ethers.Contract(process.env.REACT_APP_MAGECREATOR_ADDR, MageCreator, signerx)
			let res = await contracterc721Master.upgradeNFT("MASTER", "ARCHMAGE")
			setUpgradeMasterToArchmageButtonInnerText(false)
			notifyInfo('Please wait for the transaction to complete....')
			
			let resWait = await res.wait()
			setUpgradeMasterToArchmageButtonInnerText(true)
			toast.dismiss()
			
			if(resWait.status === 1){
				notifySuccess('Your upgrade from MASTER to ARCHMAGE was successfull')
				verifyERC20()
			}else{
				notifyError('Error on upgrade')			
				verifyERC20()
			}
		}catch(e){
			if(e.code === 4001){
				notifyError('User rejected ORACLE TO ARCHMAGE UPGRADE transaction')
				verifyERC20()
			}
		}
	}else{
		notifyError('Insufficient tokens')
		verifyERC20()
	}
}

// *************************** RESET FUNCTIONS ***************************

function resetGeneral(){
	// NFT - Current Values
	setMasterNFT('')
	setOracleNFT('')
	setArchmageNFT('')

	// Craft buttons - Able/Disable
	setCraftMasterButton(true)
	setCraftOracleButton(true)
	setCraftArchmageButton(true)
	// Hover - Able/Disable
	setCraftMasterHover(false)
	setCraftOracleHover(false)
	setCraftArchmageHover(false)

	// Upgrade buttons - Able/Disable
	setUpgradeFromMasterToOracle(true)
	setUpgradeFromMasterToArchmage(true)
	setUpgradeFromOracleToArchmage(true)
	// Hover - Able/Disable
	setUpgradeFromMasterToOracleHover(false)
	setUpgradeFromMasterToArchmageHover(false)
	setUpgradeFromOracleToArchmageHover(false)
}

function resetGeneralDeactive(){
	// NFT - Current Values
	setMasterNFT('')
	setOracleNFT('')
	setArchmageNFT('')

	// Craft buttons - Able/Disable
	setCraftMasterButton(true)
	setCraftOracleButton(true)
	setCraftArchmageButton(true)
	// Hover - Able/Disable
	setCraftMasterHover(false)
	setCraftOracleHover(false)
	setCraftArchmageHover(false)

	// Upgrade buttons - Able/Disable
	setUpgradeFromMasterToOracle(true)
	setUpgradeFromMasterToArchmage(true)
	setUpgradeFromOracleToArchmage(true)
	// Hover - Able/Disable
	setUpgradeFromMasterToOracleHover(false)
	setUpgradeFromMasterToArchmageHover(false)
	setUpgradeFromOracleToArchmageHover(false)

	// Deactivate current wallet
	deactivate()
}

  return (
	<div className="App">
		<main className="meta-body">
			<header className="meta-header">
				<div className="meta-logo logo-block">
					<img src="./assets/images/Meta_logo.png" className="logo"/>
				</div>
				<div className="d-flex justify-content-between align-items-center fox-wallet cursorpointer stone-craftown" onClick={() => { active ? resetGeneralDeactive() : activate(injected) }}>
					{active ? 
					<div id="LoadingPage" className="meta-foxown d-flex justify-content-center align-items-center">
						{active ? `MAGE: ${MageBalanceERC20}`: false}
					</div>
					:
					false
					}
					<div className="meta-fox d-flex justify-content-center align-items-center">
						<img src="./assets/images/Meta_fox.png"/>
					</div>
					<div className="font-white wallet-address">
						{active ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
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
						
						<p className="text-white">{masterNFT ? Number(masterNFT) : 0}</p> 
						<img src="./assets/images/stone_1.png" className="stone-1" />	
							<button className={`stone-craft ${craftMasterHover ? false : 'disabled'}`} disabled={craftMasterButton} onClick={craftMasterToken}>
								{craftMasterButtonInnerText ? 'CRAFT' : 'CRAFTING...'}
							</button>
							<p className="text-white mt-2">	{active && tokenERC20 < 10_000? 'Insufficient tokens ' : false}</p>

							<div className="d-flex justify-content-center mt-4 mage-block">
								<p className="m-text">M</p>
								<p className="mage-text Rajdhani-Medium">10,000 MAGE</p>
							</div>
							<button className={`stone-craft ${upgradeFromMasterToOracleHover ? false : 'disabled'}`} disabled={upgradeFromMasterToOracle} onClick={upgradeMasterToOracleToken}>
								{upgradeMasterToOracleButtonInnerText ? 'UPGRADE TO ORACLE' : 'UPGRADING...'}
							</button>
							{/* <p className="text-white mt-2">{active && tokenERC20 > 15_000 && masterNFT < 1 ? 'Insufficient tokens' : false}</p> */}
							<p className="text-white mt-2">{upgradeFromMasterToOracle == true && active ? 'Insufficient Tokens':false }</p>
							

							<div className="d-flex justify-content-center mt-4 mage-block">
								<p className="m-text">M</p>
								<p className="mage-text Rajdhani-Medium">15,000 MAGE</p>
							</div>
							<button className={`stone-craft ${upgradeFromMasterToArchmageHover ? false : 'disabled'}`} disabled={upgradeFromMasterToArchmage} onClick={UpgradeMasterToArchmageToken}>
								{upgradeMasterToArchmageButtonInnerText ? 'UPGRADE TO ARCHMAGE' : 'UPGRADING...'}
							</button>
							{/* {active && tokenERC20 < 40_000 && masterNFT < 1 ? <p className="text-white mt-2">Insufficient tokens</p>  : false} */}
							<p className="text-white mt-2">{upgradeFromMasterToArchmage == true && active ? 'Insufficient Tokens' : false}</p>

							<div className="d-flex justify-content-center mt-4 mage-block">
								<p className="m-text">M</p>
								<p className="mage-text Rajdhani-Medium">40,000 MAGE</p>
							</div>
					</div>
				</div>
				<div className="col-md-3 d-flex justify-content-center">
					<div className="stone t-2">
						<h4 className="font-white" style={{ marginTop: "10%" }}>ORACLE</h4> {/* ************************************************************** */}
						<p className="text-white"> {oracleNFT ? Number(oracleNFT) : 0}</p>
						<img src="./assets/images/stone_2.png" className="stone-2"/>
						<div className="d-flex justify-content-around craft-group flexown">
							<button className={`stone-craft ${craftOracleHover ? false : 'disabled'}`} disabled={craftOracleButton} onClick={cratOracleToken}>
								{craftOracleButtonInnerText ? 'CRAFT' : 'CRAFTING...'}
							</button>
							{active && tokenERC20 < 25_000 ? <p className="text-white mt-2">Insufficient tokens</p> : false }
							<div className="d-flex justify-content-center mt-4 mage-block">
								<p className="m-text">M</p>
								<p className="mage-text Rajdhani-Medium">25,000 MAGE</p>
							</div>
							<button className={`stone-craft ${upgradeFromOracleToArchmageHover ? false : 'disabled'}`} disabled={upgradeFromOracleToArchmage} onClick={upgradeOracleToArchmageToken}>
								{upgradeOracleToArchmageButtonInnerText ? 'UPGRADE TO ARCHMAGE' : 'UPGRADING...'}
							</button>

							<p className="text-white mt-2">	{upgradeFromOracleToArchmage == true && active ? 'Insufficient tokens' : false}</p> 

							
							<div className="d-flex justify-content-center mt-4 mage-block">
								<p className="m-text">M</p>
								<p className="mage-text Rajdhani-Medium">25,000 MAGE</p>
							</div>
						</div>
						
					</div>
				</div>
				<div className="col-md-3 d-flex justify-content-center">
					<div className="stone t-2">
						<h4 className="font-white" style={{ marginTop: "10%" }}>ARCHMAGE</h4>
						<p className="text-white">{archmageNFT ? Number(archmageNFT) : 0}</p>
						<img src="./assets/images/stone_3.png" className="stone-3" />
						<div className="d-flex justify-content-around craft-group">
							<button className={`stone-craft ${craftArchmageHover ? false : 'disabled'}`} disabled={craftArchmageButton} onClick={cratArchmageToken}>
								{craftArchmageButtonInnerText ? 'CRAFT' : 'CRAFTING...'}
							</button>							
						</div>
						<p className="text-white mt-2">{active && tokenERC20 < 50_000  ? 'Insufficient Tokens' : false}</p>			

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