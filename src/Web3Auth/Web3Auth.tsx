import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
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

// const baseAPIUrl = `http://localhost:3006`;
const baseAPIUrl = `https://b3-api.sit.clique-test.tech`;
// const baseAPIUrl = `https://secret-ai-api.sit.clique-test.tech`;

const RequestSign = (props) => {
  const [loading, setLoading] = useState(false);
  const [web3Token, setWeb3Token] = useState(null);

  async function requestSignMessage() {
    setLoading(true);

    const jwtToken = window.localStorage.getItem('jwtToken');

    try {
      // 1. request sign message
      // const { message } = await client.web3.getSignMessage(props.address);
      const res = await axios({
          method: 'get',
          url: `${baseAPIUrl}/wallet/message?address=${props.address}`,
          headers: {
              'clq-jwt': jwtToken,
          }
      });
      const message = res.data.message;
      // 2. use wallet sign the message to get signature
      const signature = await signMessage(message);
      console.log(signature);

      const redLogin = await axios({
        method: 'post',
        url: `${baseAPIUrl}/wallet/login`,
        data: {
            address: props.address,
            signature: signature,
            chainId: 1,
        },
          headers: {
              'clq-jwt': jwtToken,
          }
      });

      setWeb3Token(redLogin.data.jwtToken);

      window.localStorage.setItem('jwtToken', redLogin.data.jwtToken);

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
