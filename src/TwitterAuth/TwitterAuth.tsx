import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { client, ENV } from "../config";
import { getParamsFromUrl } from "../utils";
import axios from "axios";
import { rsaEncrypt } from "../encryptTool";

const redirect_uri = "http://localhost:5173/twitter";
const TWITTER_CLIENT_ID = "twitter_client_id";
const api_base_url = "http://localhost:3000";

async function getRsaPublicKey() {
  const { data: { result } } = await axios.get(`${api_base_url}/twitter_rsa_public_key`);
  return result  
}

async function getClientId() {
  let client_id = Cookies.get(TWITTER_CLIENT_ID);
  if (!client_id) {
    const data = await client.twitter.getClientId();
    client_id = data.client_id;
    Cookies.set(TWITTER_CLIENT_ID, client_id);
  }
  return client_id;
}

const TwitterAuth = () => {
  const [loading, setLoading] = useState(false);
  const [canGetToken, setCanGetToken] = useState(false);
  const [twitterToken, setTwitterToken] = useState({
    access_token: null,
    refresh_token: null,
    expires_in: null,
  });
  const [twitterUser, setTwitterUser] = useState(null);

  async function jumpToAuth() {
    setLoading(true);
    const client_id = await getClientId();
    const { url } = await client.twitter.getOAuth2Link({
      client_id: client_id,
      redirect_uri: redirect_uri,
    });
    setLoading(false);
    // jump to the url
    window.location.href = url;
  }

  async function checkUrlAndGetToken() {
    const params = getParamsFromUrl(window.location.href);
    if (!params.code) {
      return;
    }
    setCanGetToken(true);
    setLoading(true);
    try {
      const client_id = await getClientId();
      const publicRsaKey = await getRsaPublicKey();
      const { data: { result } } = await axios.get(
        `${api_base_url}/twitter_auth_tokens`, 
        { 
          params: {
            code: await rsaEncrypt(params.code, publicRsaKey),
            client_id: await rsaEncrypt(client_id, publicRsaKey),
            redirect_uri: await rsaEncrypt("https://provenance.clique-test.social/social_login", publicRsaKey),
          }
        }
      );
      const { access_token, refresh_token, expires_in } = JSON.parse(result);
      setTwitterToken({ access_token, refresh_token, expires_in });
      return;
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
    setCanGetToken(false);
  }

  async function getTwitterUserInfoByToken() {
    setLoading(true);
    try {
      const { data: { result } } = await axios.get(
        `${api_base_url}/twitter_user`, 
        { 
          params: { 
            token: twitterToken.access_token 
          } 
        }
      );
      const user = JSON.parse(result).data;
      setTwitterUser(user);
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
  }

  async function refreshAuthToken() {
    setLoading(true);
    try {
      const client_id = await getClientId();
      const publicRsaKey = await getRsaPublicKey();
      const { data: { result } } = await axios.get(
        `${api_base_url}/twitter_auth_tokens_by_refresh_token`,
        { 
          params: {
            refresh_token: twitterToken.refresh_token,
            client_id: await rsaEncrypt(client_id, publicRsaKey),
         } 
        }
      );
      const { access_token, refresh_token, expires_in } = JSON.parse(result);
      setTwitterToken({ access_token, refresh_token, expires_in });
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUrlAndGetToken();
  }, []);

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
        Twitter Auth Test
      </div>

      {!canGetToken && (
        <Button
          type="primary"
          loading={loading}
          size={`large`}
          onClick={jumpToAuth}
        >
          Request Twitter Auth
        </Button>
      )}

      {twitterToken.access_token && (
        <>
          <div>
            <Button
              type="primary"
              disabled={!canGetToken}
              loading={loading}
              size={`large`}
              onClick={refreshAuthToken}
            >
              Refresh Twitter Auth
            </Button>
          </div>
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              disabled={!canGetToken}
              loading={loading}
              size={`large`}
              onClick={getTwitterUserInfoByToken}
            >
              Get Twitter User Info
            </Button>
          </div>
        </>
        

      )}

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 500 }}>
        {JSON.stringify({ twitterToken })}
      </h2>

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 500 }}>
        {JSON.stringify({ twitterUser })}
      </h2>
    </div>
  );
};

export default TwitterAuth;
