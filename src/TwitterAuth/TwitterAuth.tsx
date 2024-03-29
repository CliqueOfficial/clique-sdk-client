import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { client, ENV } from "../config";
import { getParamsFromUrl } from "../utils";
import ReactJson from "react-json-view";
import {
  Navigate,
  redirect,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const redirect_uri = "http://localhost:5173/twitter";
const client_id = "eEpMNU9DSDl6dTNCQi1zcDNTMGc6MTpjaQ";

const TwitterAuth = () => {
  const [loading, setLoading] = useState(false);
  const [canGetToken, setCanGetToken] = useState(false);
  const [twitterToken, setTwitterToken] = useState({
    access_token: null,
    refresh_token: null,
    expires_in: null,
  });
  const [twitterUser, setTwitterUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  async function jumpToAuth() {
    setLoading(true);
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
      const { access_token, refresh_token, expires_in } =
        await client.twitterSibyl.getOAuth2Token({
          code: params.code,
          client_id: client_id,
          redirect_uri,
        });

      setTwitterToken({ access_token, refresh_token, expires_in });
      searchParams.delete("code");
      searchParams.delete("state");
      setSearchParams(searchParams);
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
      const user = await client.twitterSibyl.getUserByToken(
        twitterToken.access_token
      );
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
      const { access_token, refresh_token, expires_in } =
        await client.twitterSibyl.getOAuth2TokenByRefresh({
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
              Refresh Twitter AccessToken
            </Button>
          </div>
          <h2
            className="colorWhite marginTop20 textWarp"
            style={{ maxWidth: 1000 }}
          >
            <div style={{ opacity: 0.5 }}>Encrypted Twitter AccessToken: </div>
            <ReactJson src={twitterToken} theme="monokai" />
          </h2>
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
      {twitterUser && (
        <>
          <h2
            className="colorWhite marginTop20 textWarp"
            style={{ maxWidth: 1000 }}
          >
            <div style={{ opacity: 0.5 }}>TwitterUser Info: </div>
            <ReactJson src={twitterUser} theme="monokai" />
          </h2>
        </>
      )}
    </div>
  );
};

export default TwitterAuth;
