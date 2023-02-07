import React, {useState} from "react";
import {checkWalletIsConnected, getEtherObject} from "./utils";

const ConnectWalletButton = (props) => {
    const [currentAccount, setCurrentAccount] = useState("");

    const connectWallet = async () => {
        try {
            if (!checkWalletIsConnected()) {
                return;
            }
            const ethereum = getEtherObject();
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
            if (props["onConnect"]) {
                props["onConnect"](accounts[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            {
                !currentAccount && (
                    <div className="flexCenterClu">
                        <div className="bio">
                            Connect your Ethereum wallet and continue!
                        </div>
                        <button className="waveButton" onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    </div>
                )
            }
        </div>
    )
};

export default ConnectWalletButton;
