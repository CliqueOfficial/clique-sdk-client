import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { client, ENV } from "../config";
import { getParamsFromUrl } from "../utils";

const redirect_uri = "http://localhost:5173/twitter";
const TWITTER_ACCESS_TOKEN = "twitter_access_token";
const TWITTER_REFRESH_TOKEN = "twitter_refresh_token";
const TWITTER_CLIENT_ID = "twitter_client_id";

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
      const { access_token, expires_in, refresh_token } =
        await client.twitter.getOAuth2Token({
          client_id: client_id,
          code: params.code,
        });
      setTwitterToken({ access_token, refresh_token });
      Cookies.set(TWITTER_ACCESS_TOKEN, access_token, {
        expires: new Date(new Date().getTime() + expires_in * 1000),
      });
      Cookies.set(TWITTER_REFRESH_TOKEN, refresh_token);
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
      const user = await client.twitter.getUserByToken(
        twitterToken.access_token
      );
      setTwitterUser(user);
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
  }

  async function refreshTwitterToken() {
    setCanGetToken(true);
    setLoading(true);
    try {
      const { access_token, expires_in, refresh_token } =
        await client.discord.getOAuth2TokenByRefresh({
          refresh_token: twitterToken.refresh_token,
        });
      setTwitterToken({ access_token, refresh_token });
      Cookies.set(TWITTER_ACCESS_TOKEN, access_token, {
        expires: new Date(new Date().getTime() + expires_in * 1000),
      });
      Cookies.set(TWITTER_REFRESH_TOKEN, refresh_token);
      return;
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
    setCanGetToken(false);
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
        <div>
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
