/* eslint-disable */
import React, { useState, useEffect } from "react";
// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

// Dotenv
require("dotenv").config();

// Chain ID
import { InjectedConnector } from "@web3-react/injected-connector";
const injected = new InjectedConnector({
  supportedChainIds: [Number(process.env.REACT_APP_CHAINID)],
});

import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
import { ethers } from "ethers";

// ABI
import MageCreator from "./utils/MageCreator.json";
import MetaBrands from "./utils/MetaBrands.json";
import NFT from "./utils/NFT.json";

export default function App() {
  const {
    active,
    account,
    chainId,
    error,
    activate,
    deactivate,
  } = useWeb3React();

  // *************************** USE EFFECTS ***************************

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        setTimeout(
          () => activate(injected, undefined, true).catch(() => {}),
          1
        );
      }
    });
  }, [activate]);

  useEffect(() => {
    if (active) {
      verifyNetwork();
    }
    if (error) {
      let err = getErrorMessage(error);
      notifyError(err);
      resetGeneralDeactive();
    }
  }, [chainId, account, active, error]);

  // *************************** USE STATES ***************************

  // Craft buttons
  const [craftMasterButton, setCraftMasterButton] = useState(true);
  const [craftOracleButton, setCraftOracleButton] = useState(true);
  const [craftArchmageButton, setCraftArchmageButton] = useState(true);

  // Craft buttons inner text
  const [craftMasterButtonInnerText, setCraftMasterButtonInnerText] =
    useState(true);
  const [craftOracleButtonInnerText, setCraftOracleButtonInnerText] =
    useState(true);
  const [craftArchmageButtonInnerText, setCraftArchmageButtonInnerText] =
    useState(true);

  // Craft Buttons Opacity
  const [craftMasterHover, setCraftMasterHover] = useState(false);
  const [craftOracleHover, setCraftOracleHover] = useState(false);
  const [craftArchmageHover, setCraftArchmageHover] = useState(false);

  // Upgrade buttons
  const [upgradeFromMasterToOracle, setUpgradeFromMasterToOracle] =
    useState(false);
  const [upgradeFromMasterToArchmage, setUpgradeFromMasterToArchmage] =
    useState(false);
  const [upgradeFromOracleToArchmage, setUpgradeFromOracleToArchmage] =
    useState(false);

  // Upgrade buttons hover
  const [upgradeFromMasterToOracleHover, setUpgradeFromMasterToOracleHover] =
    useState(false);
  const [
    upgradeFromMasterToArchmageHover,
    setUpgradeFromMasterToArchmageHover,
  ] = useState(false);
  const [
    upgradeFromOracleToArchmageHover,
    setUpgradeFromOracleToArchmageHover,
  ] = useState(false);

  // Upgrade buttons inner text
  const [
    upgradeMasterToOracleButtonInnerText,
    setUpgradeMasterToOracleButtonInnerText,
  ] = useState(true);
  const [
    upgradeMasterToArchmageButtonInnerText,
    setUpgradeMasterToArchmageButtonInnerText,
  ] = useState(true);
  const [
    upgradeOracleToArchmageButtonInnerText,
    setUpgradeOracleToArchmageButtonInnerText,
  ] = useState(true);

  // Token Values ERC20
  const [tokenERC20, setTokenERC20] = useState("");
  const [MageBalanceERC20, setMageBalanceERC20] = useState("");

  // NFT Values ERC721
  const [masterNFT, setMasterNFT] = useState("");
  const [oracleNFT, setOracleNFT] = useState("");
  const [archmageNFT, setArchmageNFT] = useState("");

  // Add Token Buttons
  const [addTokenButton, setAddTokenButton] = useState(false);

  // Upgrade Collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  // *************************** ALERT FUNCTIONS ********************************
  const notifySuccess = (mesage) =>
    toast.success(mesage, {
      position: toast.POSITION.TOP_CENTER,
      className: "noti-success",
      bodyClassName: "text-center text-white",
	  icon: () => <img src="./assets/images/icon_check.svg" width={'24px'}/>
    });

  const notifyError = (mesage) =>
    toast.error(mesage, {
      position: toast.POSITION.TOP_CENTER,
      className: "noti-error",
      bodyClassName: "text-center text-white",
	  icon: () => <img src="./assets/images/icon_warning.svg" width={'24px'}/>
    });

  const notifyTransactionInfo = (mesage, clickfunction) =>
    toast.info(mesage, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
      closeOnClick: false,
      onClick: clickfunction,
      className: "noti-info",
      bodyClassName: "text-center text-white",
	  icon: () => <img src="./assets/images/icon_magnifying_glass.svg" width={'24px'}/>
    });

  const notifyInfo = (mesage) =>
    toast.warn(mesage, {
      position: toast.POSITION.TOP_CENTER,
      className: "noti-warn",
	  bodyClassName: "text-center text-white",
	  icon: () => <img src="./assets/images/icon_magnifying_glass.svg" width={'24px'}/>
    });

  // ******************************** ADD TOKEN FUNCTION ************************************

  async function AddTokenToWallet() {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: process.env.REACT_APP_MAGE_ADDR, // The address that the token is at.
            symbol: process.env.REACT_APP_TOKEN_SYMBOL, // A ticker symbol or shorthand, up to 5 chars.
            decimals: Number(process.env.REACT_APP_TOKEN_DECIMALS), // The number of decimals in the token
            image: process.env.REACT_APP_TOKEN_IMAGE, // A string url of the token logo
          },
        },
      });
      if (wasAdded) {
        notifySuccess("Token will be added to your wallet...");
      } else {
        console.log("Canceled by user");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // *************************** CHANGE NETWORK FUNCTION *************************************

  async function connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${Number(process.env.REACT_APP_CHAINID).toString(16)}`,
          },
        ],
      });
      activate(injected);
    }
  }

  // *************************** VERIFY FUNCTIONS ********************************

  function verifyNetwork() {
    if (!error) {
      verifyERC20();
      setAddTokenButton(true);
    } else {
      resetGeneral();
      if (active) {
        deactivate();
      }
    }
  }

  function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
      return "Install Metamask";
    } else if (error instanceof UnsupportedChainIdError) {
      return "Switch to right network";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return "Authorize this website to access your Ethereum account.";
    } else {
      console.error(error);
      return "An unknown error occurred. Check the console for more details.";
    }
  }

  async function verifyERC20() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const contract = new ethers.Contract(
      process.env.REACT_APP_MAGE_ADDR,
      MetaBrands,
      provider
    );
    let res = await contract.balanceOf(account);
    let MageBalance = ethers.utils.formatEther(res);
    setTokenERC20(MageBalance);
    setMageBalanceERC20(new Intl.NumberFormat().format(MageBalance));

    // Master
    if (MageBalance >= 10_000) {
      setCraftMasterButton(false);
      setCraftMasterHover(true);
    } else {
      setCraftMasterButton(true);
      setCraftMasterHover(false);
    }
    // Oracle
    if (MageBalance >= 25_000) {
      setCraftOracleButton(false);
      setCraftOracleHover(true);
    } else {
      setCraftOracleButton(true);
      setCraftOracleHover(false);
    }
    // Archmage
    if (MageBalance >= 50_000) {
      setCraftArchmageButton(false);
      setCraftArchmageHover(true);
    } else {
      setCraftArchmageButton(true);
      setCraftArchmageHover(false);
    }

    verifyERC721();
  }

  async function verifyERC721() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    // ERC721-MASTER
    const contracterc721Master = new ethers.Contract(
      process.env.REACT_APP_MASTER_ADDR,
      NFT,
      signerx
    );
    let res721Master = await contracterc721Master.balanceOf(account);
    let masterNFT = res721Master.toNumber();
    setMasterNFT(res721Master.toNumber());

    // // ERC721-ORACLE
    const contracterc721Oracle = new ethers.Contract(
      process.env.REACT_APP_ORACLE_ADDR,
      NFT,
      signerx
    );
    let res721Oracle = await contracterc721Oracle.balanceOf(account);
    let oracleNFT = res721Oracle.toNumber();
    setOracleNFT(res721Oracle.toNumber());

    // ERC721-ARCHMAGE
    const contracterc721Archmage = new ethers.Contract(
      process.env.REACT_APP_ARCHMAGE_ADDR,
      NFT,
      signerx
    );
    let res721Archmage = await contracterc721Archmage.balanceOf(account);
    setArchmageNFT(res721Archmage.toNumber());

    // Instantiating a new contract
    const contract = new ethers.Contract(
      process.env.REACT_APP_MAGE_ADDR,
      MetaBrands,
      provider
    );
    let res = await contract.balanceOf(account);
    let MageBalance = ethers.utils.formatEther(res);
    setTokenERC20(MageBalance);
    setMageBalanceERC20(new Intl.NumberFormat().format(MageBalance));

    // NFT

    // Master To Oracle
    if (masterNFT >= 1 && MageBalance >= 15_000) {
      setUpgradeFromMasterToOracle(false);
      setUpgradeFromMasterToOracleHover(true);
    } else {
      setUpgradeFromMasterToOracle(true);
      setUpgradeFromMasterToOracleHover(false);
    }

    // Master To Archmage
    if (masterNFT >= 1 && MageBalance >= 40_000) {
      setUpgradeFromMasterToArchmage(false);
      setUpgradeFromMasterToArchmageHover(true);
    } else {
      setUpgradeFromMasterToArchmage(true);
      setUpgradeFromMasterToArchmageHover(false);
    }

    // Oracle To Archmage
    if (oracleNFT >= 1 && MageBalance >= 25_000) {
      setUpgradeFromOracleToArchmage(false);
      setUpgradeFromOracleToArchmageHover(true);
    } else {
      setUpgradeFromOracleToArchmage(true);
      setUpgradeFromOracleToArchmageHover(false);
    }
  }

  // *************************** CRAFT TOKENS ***************************

  // Craft Master
  async function craftMasterToken() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    // Craft Master Tokens
    const contracterc721Master = new ethers.Contract(
      process.env.REACT_APP_MAGECREATOR_ADDR,
      MageCreator,
      signerx
    );

    if (tokenERC20 >= 10_000) {
      try {
        let res = await contracterc721Master.mintNFT("MASTER");
        setCraftMasterButtonInnerText(false);

        const transactionLink = `${process.env.REACT_APP_EXPLORER}/${res.hash}`;
        function redirectToTransaction() {
          window.open(transactionLink, "_blank");
        }

        notifyTransactionInfo(
          `Crafting Relic... Please standby... Click here to see the transaction details`,
          redirectToTransaction
        );
        let resWait = await res.wait();
        setCraftMasterButtonInnerText(true);
        toast.dismiss();

        if (resWait.status === 1) {
          notifySuccess(
            "Congratulations! You've successfully crafted a MASTER Relic NFT"
          );
          verifyERC20();
        } else {
          notifyError("Your MASTER Relic NFT was not crafted");
          verifyERC20();
        }
      } catch (e) {
        if (e.code === 4001) {
          notifyError("Rejected MASTER Relic NFT Crafting");
          verifyERC20();
        }
      }
    } else {
      notifyError("Insufficient MAGE Tokens");
    }
  }

  // Craft Oracle
  async function cratOracleToken() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    // Craft Oracle Token
    const contracterc721Oracle = new ethers.Contract(
      process.env.REACT_APP_MAGECREATOR_ADDR,
      MageCreator,
      signerx
    );

    if (tokenERC20 >= 25_000) {
      try {
        let res = await contracterc721Oracle.mintNFT("ORACLE");
        setCraftOracleButtonInnerText(false);

        const transactionLink = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        function redirectToTransaction() {
          window.open(transactionLink, "_blank");
        }

        notifyTransactionInfo(
          "Crafting Relic... Please standby. Click here to see the transaction details",
          redirectToTransaction
        );
        let resWait = await res.wait();
        setCraftOracleButtonInnerText(true);
        toast.dismiss();

        if (resWait.status === 1) {
          notifySuccess(
            "Congratulations! You've successfully crafted an ORACLE Relic NFT"
          );
          verifyERC20();
        } else {
          notifyError("Your ORACLE Relic NFT was not crafted");
          verifyERC20();
        }
      } catch (e) {
        if (e.code === 4001) {
          notifyError("Rejected ORACLE Relic NFT Crafting");
          verifyERC20();
        }
      }
    } else {
      notifyError("Insufficient MAGE Tokens");
    }
  }

  // Craft Archmage
  async function cratArchmageToken() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    // Craft Archmage Token
    const contracterc721Archmage = new ethers.Contract(
      process.env.REACT_APP_MAGECREATOR_ADDR,
      MageCreator,
      signerx
    );

    if (tokenERC20 >= 50_000) {
      try {
        let res = await contracterc721Archmage.mintNFT("ARCHMAGE");
        setCraftArchmageButtonInnerText(false);

        const transactionLink = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        function redirectToTransaction() {
          window.open(transactionLink, "_blank");
        }

        notifyTransactionInfo(
          "Crafting Relic... Please standby. Click here to see the transaction details",
          redirectToTransaction
        );
        let resWait = await res.wait();
        setCraftArchmageButtonInnerText(true);
        toast.dismiss();

        if (resWait.status === 1) {
          notifySuccess(
            "Congratulations! You've successfully crafted an ARCHMAGE Relic NFT"
          );
          verifyERC20();
        } else {
          notifyError("Your ARCHMAGE Relic NFT was not crafted");
          verifyERC20();
        }
      } catch (e) {
        if (e.code === 4001) {
          notifyError("Rejected ARCHMAGE Relic NFT Crafting");
          verifyERC20();
        }
      }
    } else {
      notifyError("Insufficient MAGE Tokens");
    }
  }

  // *************************** UPGRADE TOKENS ***************************

  async function upgradeMasterToOracleToken() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    // Upgrade Master to Oracle Token
    if (masterNFT >= 1 && tokenERC20 >= 15_000) {
      try {
        const contracterc721Master = new ethers.Contract(
          process.env.REACT_APP_MAGECREATOR_ADDR,
          MageCreator,
          signerx
        );
        let res = await contracterc721Master.upgradeNFT("MASTER", "ORACLE");
        setUpgradeMasterToOracleButtonInnerText(false);

        const transactionLink = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        function redirectToTransaction() {
          window.open(transactionLink, "_blank");
        }

        notifyTransactionInfo(
          "Upgrading Relic... Please standby. Click here to see the transaction details",
          redirectToTransaction
        );
        let resWait = await res.wait();
        setUpgradeMasterToOracleButtonInnerText(true);
        toast.dismiss();

        if (resWait.status === 1) {
          notifySuccess(
            "Congratulations! Your upgrade from MASTER to ORACLE was successful"
          );
          verifyERC20();
        } else {
          notifyError("Error on upgrade");
          verifyERC20();
        }
      } catch (e) {
        if (e.code === 4001) {
          notifyError("Rejected MASTER to ORACLE Upgrade");
          verifyERC20();
        }
      }
    } else {
      if (masterNFT < 1) notifyError("No MASTER Relic");
      if (tokenERC20 < 15_000) notifyError("Insufficient MAGE Tokens");

      verifyERC20();
    }
  }

  async function upgradeOracleToArchmageToken() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    // Upgrade Oracle to Archmage Token
    if (oracleNFT >= 1 && tokenERC20 >= 25_000) {
      try {
        const contracterc721Master = new ethers.Contract(
          process.env.REACT_APP_MAGECREATOR_ADDR,
          MageCreator,
          signerx
        );
        let res = await contracterc721Master.upgradeNFT("ORACLE", "ARCHMAGE");
        setUpgradeOracleToArchmageButtonInnerText(false);

        const transactionLink = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        function redirectToTransaction() {
          window.open(transactionLink, "_blank");
        }

        notifyTransactionInfo(
          "Upgrading Relic... Please standby. Click here to see the transaction details",
          redirectToTransaction
        );

        let resWait = await res.wait();
        setUpgradeOracleToArchmageButtonInnerText(true);
        toast.dismiss();

        if (resWait.status === 1) {
          notifySuccess(
            "Congratulations! Your upgrade from ORACLE to ARCHMAGE was successful"
          );
          verifyERC20();
        } else {
          notifyError("Error on upgrade");
          verifyERC20();
        }
      } catch (e) {
        if (e.code === 4001) {
          notifyError("Rejected ORACLE to ARCHMAGE Upgrade");
          verifyERC20();
        }
      }
    } else {
      if (oracleNFT < 1) notifyError("No ORACLE Relic");
      if (tokenERC20 < 25_000) notifyError("Insufficient MAGE Tokens");

      verifyERC20();
    }
  }

  async function UpgradeMasterToArchmageToken() {
    // Instantiating a new contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signerx = provider.getSigner(0);

    if (masterNFT >= 1 && tokenERC20 >= 40_000) {
      try {
        const contracterc721Master = new ethers.Contract(
          process.env.REACT_APP_MAGECREATOR_ADDR,
          MageCreator,
          signerx
        );
        let res = await contracterc721Master.upgradeNFT("MASTER", "ARCHMAGE");
        setUpgradeMasterToArchmageButtonInnerText(false);

        const transactionLink = `https://rinkeby.etherscan.io/tx/${res.hash}`;
        function redirectToTransaction() {
          window.open(transactionLink, "_blank");
        }

        notifyTransactionInfo(
          "Upgrading Relic... Please standby. Click here to see the transaction details",
          redirectToTransaction
        );

        let resWait = await res.wait();
        setUpgradeMasterToArchmageButtonInnerText(true);
        toast.dismiss();

        if (resWait.status === 1) {
          notifySuccess(
            "Congratulations! Your upgrade from MASTER to ARCHMAGE was successful"
          );
          verifyERC20();
        } else {
          notifyError("Error on upgrade");
          verifyERC20();
        }
      } catch (e) {
        if (e.code === 4001) {
          notifyError("Rejected MASTER to ARCHMAGE Upgrade");
          verifyERC20();
        }
      }
    } else {
      if (masterNFT < 1) notifyError("No MASTER Relic");
      if (tokenERC20 < 40_000) notifyError("Insufficient MAGE Tokens");

      verifyERC20();
    }
  }

  // *************************** RESET FUNCTIONS ***************************

  function resetGeneral() {
    // NFT - Current Values
    setMasterNFT("");
    setOracleNFT("");
    setArchmageNFT("");

    // Craft buttons - Able/Disable
    setCraftMasterButton(true);
    setCraftOracleButton(true);
    setCraftArchmageButton(true);
    // Hover - Able/Disable
    setCraftMasterHover(false);
    setCraftOracleHover(false);
    setCraftArchmageHover(false);

    // Upgrade buttons - Able/Disable
    setUpgradeFromMasterToOracle(true);
    setUpgradeFromMasterToArchmage(true);
    setUpgradeFromOracleToArchmage(true);
    // Hover - Able/Disable
    setUpgradeFromMasterToOracleHover(false);
    setUpgradeFromMasterToArchmageHover(false);
    setUpgradeFromOracleToArchmageHover(false);
  }

  function resetGeneralDeactive() {
    // NFT - Current Values
    setMasterNFT("");
    setOracleNFT("");
    setArchmageNFT("");

    // Craft buttons - Able/Disable
    setCraftMasterButton(true);
    setCraftOracleButton(true);
    setCraftArchmageButton(true);
    // Hover - Able/Disable
    setCraftMasterHover(false);
    setCraftOracleHover(false);
    setCraftArchmageHover(false);

    // Upgrade buttons - Able/Disable
    setUpgradeFromMasterToOracle(true);
    setUpgradeFromMasterToArchmage(true);
    setUpgradeFromOracleToArchmage(true);
    // Hover - Able/Disable
    setUpgradeFromMasterToOracleHover(false);
    setUpgradeFromMasterToArchmageHover(false);
    setUpgradeFromOracleToArchmageHover(false);

    // Add token button
    setAddTokenButton(false);

    // Deactivate current wallet
    deactivate();
  }

  function getFlooredFixed(v, d) {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  }

  return (
	<div className="App">
		<main className="meta-body">
			<header className="meta-header">
				<div className="meta-logo logo-block">
					<a href='https://metabrands.io/'>
						<img src="./assets/images/metabrands_logo_light.svg" className="logo"/>
					</a>
				</div>

				<div>
					<div className="d-flex justify-content-between align-items-center fox-wallet cursorpointer stone-craftown" onClick={() => {active ? resetGeneralDeactive() : connectWallet()}}>
						<div className="meta-fox d-flex justify-content-center align-items-center">
							<img src="./assets/images/meta_fox.svg" className="meta-fox-icon"/>
						</div>
						<div className="Rajdhani-SemiBold text-white wallet-address">
							{ error ? getErrorMessage(error) : active ? `${account.substring(0, 6)}...${account.substring(account.length - 6)}` : 'Connect Wallet'}
						</div>
					</div>
					<div className="text-right mt-2">
					{ addTokenButton ?
						<div className="cursorpointer" onClick={() => AddTokenToWallet()}>
							<div className="d-inline-block">
								<img width="30px" src="./assets/images/mage.png" />
							</div>
							<div className="d-inline-block text-white wallet-address px-0">
								{getFlooredFixed(tokenERC20, 0)}
							</div>
						</div>
					: false }
					</div>
				</div>
			</header>
			<section className="text-sention">
				<div className="main-title">
					<h1 className="text-white relic-text Rajdhani-Bold">MAGE RELIC NFTS</h1>
				</div>
				<p className="text-block Rajdhani-SemiBold">SACRIFICE MAGE TOKENS TO CLAIM YOUR MULTI-PASS TO THE METAVERSE...</p>
			</section>
			<section className="art-section row m-0">
				<div className="col-lg-3 d-flex justify-content-center">
					<div className="stone">
						<h4 className="text-white Rajdhani-Bold" style={{ marginTop: "10%" }}>MASTER</h4>

						<p><span className={`${masterNFT ? 'text-green' : 'text-white no-relic'}`}>{masterNFT ? Number(masterNFT) : 0}</span></p>
						<img src="./assets/images/stone_1.png" className="stone-1" />
						<div className="d-flex justify-content-center mt-4 mage-block">
							<img src="./assets/images/mage.png" className="mage-icon" />
							<p className="mage-text Rajdhani-Medium">10,000 MAGE</p>
						</div>
						<button className={`Rajdhani-SemiBold stone-craft ${craftMasterHover ? false : 'disabled'}`} onClick={craftMasterToken}>
							{craftMasterButtonInnerText ? 'CRAFT' : 'CRAFTING...'}
						</button>

            { !isCollapsed ?
              <div className="justify-content-center text-white" style={{marginBottom: "10%"}}>
                <div className="Rajdhani-Medium pb-1">UPGRADE</div>
                <img src="./assets/images/icon_upgrade_plus.svg" className="upgrade-icon" onClick={() => setIsCollapsed(!isCollapsed)} />
              </div>
            : false }

            <div className={`collapse-content-${isCollapsed ? 'expanded' : 'hidden'}`} aria-expanded={isCollapsed}>
              <div className="d-flex justify-content-center mt-3 mage-block">
                <img src="./assets/images/mage.png" className="mage-icon" />
                <p className="mage-text Rajdhani-Medium">15,000 MAGE</p>
              </div>
              <button className={`Rajdhani-SemiBold stone-craft btn-upgrade ${upgradeFromMasterToOracleHover ? false : 'disabled'}`} onClick={upgradeMasterToOracleToken}>
                {upgradeMasterToOracleButtonInnerText ? 'UPGRADE TO ORACLE' : 'UPGRADING...'}
              </button>

              <div className="d-flex justify-content-center mt-3 mage-block">
                <img src="./assets/images/mage.png" className="mage-icon" />
                <p className="mage-text Rajdhani-Medium">40,000 MAGE</p>
              </div>
              <button className={`Rajdhani-SemiBold stone-craft btn-upgrade ${upgradeFromMasterToArchmageHover ? false : 'disabled'}`} onClick={UpgradeMasterToArchmageToken}>
                {upgradeMasterToArchmageButtonInnerText ? 'UPGRADE TO ARCHMAGE' : 'UPGRADING...'}
              </button>
            </div>
					</div>
				</div>
				<div className="col-lg-3 d-flex justify-content-center">
					<div className="stone t-2">
						<h4 className="text-white" style={{ marginTop: "10%" }}>ORACLE</h4>
						<p><span className={`${oracleNFT ? 'text-green' : 'text-white no-relic'}`}>{oracleNFT ? Number(oracleNFT) : 0}</span></p>
						<img src="./assets/images/stone_2.png" className="stone-2"/>
						<div className="d-flex justify-content-around craft-group flexown">


						<div className="d-flex justify-content-center mt-4 mage-block">
								<img src="./assets/images/mage.png" className="mage-icon" />
								<p className="mage-text Rajdhani-Medium">25,000 MAGE</p>
							</div>
							<button className={`Rajdhani-SemiBold stone-craft ${craftOracleHover ? false : 'disabled'}`} onClick={cratOracleToken}>
								{craftOracleButtonInnerText ? 'CRAFT' : 'CRAFTING...'}
							</button>

              { !isCollapsed ?
              <div className="justify-content-center text-white" style={{marginBottom: "10%"}}>
                <div className="Rajdhani-Medium pb-1">UPGRADE</div>
                <img src="./assets/images/icon_upgrade_plus.svg" className="upgrade-icon" onClick={() => setIsCollapsed(!isCollapsed)} />
              </div>
              : false }

              <div className={`collapse-content-${isCollapsed ? 'expanded' : 'hidden'}`} aria-expanded={isCollapsed}>
                <div className="d-flex justify-content-center mt-3 mage-block">
                  <img src="./assets/images/mage.png" className="mage-icon" />
                  <p className="mage-text Rajdhani-Medium">25,000 MAGE</p>
                </div>
                <button className={`Rajdhani-SemiBold stone-craft btn-upgrade ${upgradeFromOracleToArchmageHover ? false : 'disabled'}`} onClick={upgradeOracleToArchmageToken}>
                  {upgradeOracleToArchmageButtonInnerText ? 'UPGRADE TO ARCHMAGE' : 'UPGRADING...'}
                </button>
              </div>
						</div>

					</div>
				</div>
				<div className="col-lg-3 d-flex justify-content-center">
					<div className="stone t-2">
						<h4 className="text-white" style={{ marginTop: "10%" }}>ARCHMAGE</h4>
						<p><span className={`${archmageNFT ? 'text-green' : 'text-white no-relic'}`}>{archmageNFT ? Number(archmageNFT) : 0}</span> </p>
						<img src="./assets/images/stone_3.png" className="stone-3" />
						<div className="d-flex justify-content-center mt-4 mage-block">
							<img src="./assets/images/mage.png" className="mage-icon" />
							<p className="mage-text Rajdhani-Medium">50,000 MAGE</p>
						</div>
						<div className="d-flex justify-content-around craft-group">
							<button className={`Rajdhani-SemiBold stone-craft ${craftArchmageHover ? false : 'disabled'}`} onClick={cratArchmageToken}>
								{craftArchmageButtonInnerText ? 'CRAFT' : 'CRAFTING...'}
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className="learn-more-section text-center">
				<p className="paper-text Rajdhani-Medium">LEARN MORE ABOUT MAGE RELIC NFTS</p>
				<img src="./assets/images/mb_scroll.png" className="mb-scroll" />
				<a href='https://whitepaper.metabrands.io/' target='_BLANK'><button className="paper-btn">WHITE PAPER</button></a>
			</section>
			<footer className="foot-text Rajdhani-Medium">
				<p>
					Disclaimer: BY USING THIS SITE AND INTERACTING WITH THE METABRANDS PLATFORM OR ECOSYSTEM, YOU UNDERSTAND AND ARE INHERENTLY ASSUMING THE RISKS INVOLVED SUCH AS TECHNICAL ISSUES THAT COULD NOT FUNCTION AS NORMALLY EXPECTED OR A COMPLETE LOSS OF VALUE FROM THE TIME OF CRAFTING/MINTING YOUR RELIC BY SACRIFICING MAGE TOKENS, AND YOU ARE AGREEING THAT THE TOKENS/NFTS PRESENT FUNCTIONALITY MIGHT BE ALL THEY ARE EVER CAPABLE OF DOING. IF YOU PURCHASE ANY OF THE TOKENS/NFTS, YOU AGREE THAT YOU ARE IN GOOD FINANCIAL STANDING AND YOU WILL NOT ASSERT ANY CLAIM, ACTION, JUDGEMENT OR REMEDY AGAINST METABRANDS OR ITS SPONSORS IF THE TOKEN/NFTS LOSE VALUE, THE METABRANDS PLATFORM OR NETWORK CEASES TO FUNCTION, OR IF THE PLATFORM DOES NOT ULTIMATELY MEET EXPECTATIONS.
				</p>
			</footer>
		</main>
	</div>
  );
}
