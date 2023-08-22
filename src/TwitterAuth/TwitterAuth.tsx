import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { client, ENV } from "../config";
import { getParamsFromUrl } from "../utils";

const redirect_uri = "http://localhost:5173/twitter";
const TWITTER_CLIENT_ID = "twitter_client_id";


// you should return your own twitter app client_id
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
    const { url } = await client.twitterSibyl.getOAuth2Link({
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

      const { access_token, refresh_token, expires_in } = await client.twitterSibyl.getOAuth2Token({
        code: params.code,
        client_id: client_id,
        redirect_uri,
      });

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
      const user = await client.twitterSibyl.getUserByToken(twitterToken.access_token);
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

      const { access_token, refresh_token, expires_in } = await client.twitterSibyl.getOAuth2TokenByRefresh({
        client_id: client_id,
        refresh_token: twitterToken.refresh_token,
      });

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
        Twitter Auth Test by Sibyl
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
              Get Twitter User Info by Sibyl Encrypt Twitter AccessToken
            </Button>
          </div>
        </>
      )}

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 500 }}>
        <div style={{opacity: 0.5}}>Encrypted Twitter AccessToken: </div>
        {twitterToken.access_token && JSON.stringify({ twitterToken })}
      </h2>

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 500 }}>
        <div style={{opacity: 0.5}}>TwitterUser Info: </div>
        {twitterUser && JSON.stringify({ twitterUser })}
      </h2>
    </div>
  );
};

export default TwitterAuth;
