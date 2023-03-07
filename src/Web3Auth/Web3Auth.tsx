import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, message } from "antd";
import { getEtherObject } from "./utils";

import ConnectWalletButton from "./ConnectWalletButton";
import { client, ENV } from "../config";

async function signMessage(msg: string) {
  const ethereum = getEtherObject();
  if (!ethereum) {
    console.log("Ethereum object doesn't exist!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return await signer.signMessage(msg);
}

const RequestSign = (props) => {
  const [loading, setLoading] = useState(false);
  const [web3Token, setWeb3Token] = useState(null);

  async function requestSignMessage() {
    setLoading(true);
    try {
      // 1. request sign message
      const { message } = await client.web3.getSignMessage(props.address);
      // 2. use wallet sign the message to get signature
      const signature = await signMessage(message);
      console.log(signature);
      // 3. get web3 auth token
      const { web3Token } = await client.web3.getTokenBySign({
        address: props.address,
        signature,
      });
      setWeb3Token(web3Token);
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="primary"
        loading={loading}
        size={`large`}
        onClick={requestSignMessage}
      >
        Sign Clique Msg
      </Button>

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 500 }}>
        {JSON.stringify({ web3Token })}
      </h2>
    </div>
  );
};

const Web3Auth = () => {
  const [address, setAddress] = useState("");

  function onWalletConnect(address) {
    setAddress(address);
  }

  return (
    <div className="flexCenterClu">
      <div className="colorWhite textWarp" style={{ width: 1000 }}>
        {" "}
        {JSON.stringify(ENV)}
      </div>

      <div
        className="marginTop30 gradient-text bold marginBottom30"
        style={{ fontSize: 50 }}
      >
        Sign Message Test
      </div>

      <div className="colorWhite marginBottom20">address: {address}</div>

      {!address && <ConnectWalletButton onConnect={onWalletConnect} />}

      {address && <RequestSign address={address} />}
    </div>
  );
};

export default Web3Auth;
