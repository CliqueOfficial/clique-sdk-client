import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { client, ENV } from "../config";
import { getParamsFromUrl } from "../utils";

const redirect_uri = "http://localhost:5173/discord";
const DISCORD_ACCESS_TOKEN = "discord_access_token";
const DISCORD_REFRESH_TOKEN = "discord_refresh_token";

const discordAuth = () => {
  const [loading, setLoading] = useState(false);
  const [canGetToken, setCanGetToken] = useState(false);
  const [discordToken, setDiscordToken] = useState({
    access_token: null,
    refresh_token: null,
  });
  const [discordUser, setDiscordUser] = useState(null);

  async function jumpToAuth() {
    setLoading(true);

    const { url } = await client.discord.getOAuth2Link({
      redirect_uri,
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
      const { access_token, expires_in, refresh_token } =
        await client.discord.getOAuth2Token({
          redirect_uri,
          code: params.code,
        });
      setDiscordToken({ access_token, refresh_token });
      Cookies.set(DISCORD_ACCESS_TOKEN, access_token, {
        expires: new Date(new Date().getTime() + expires_in * 1000),
      });
      Cookies.set(DISCORD_REFRESH_TOKEN, refresh_token);
      return;
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
    setCanGetToken(false);
  }

  async function getDiscordUserInfoByToken() {
    setLoading(true);
    try {
      const user = await client.discord.getUserByToken(
        discordToken.access_token
      );
      setDiscordUser(user);
    } catch (err) {
      message.error(err.toString());
    } finally {
      setLoading(false);
    }
  }

  async function refreshDiscordToken() {
    setCanGetToken(true);
    setLoading(true);
    try {
      const { access_token, expires_in, refresh_token } =
        await client.discord.getOAuth2TokenByRefresh({
          refresh_token: discordToken.refresh_token,
        });
      setDiscordToken({ access_token, refresh_token });
      Cookies.set(DISCORD_ACCESS_TOKEN, access_token, {
        expires: new Date(new Date().getTime() + expires_in * 1000),
      });
      Cookies.set(DISCORD_REFRESH_TOKEN, refresh_token);
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
        Discord Auth Test
      </div>

      {!canGetToken && (
        <Button
          type="primary"
          loading={loading}
          size={`large`}
          onClick={jumpToAuth}
        >
          Request Discord Auth
        </Button>
      )}

      {discordToken.access_token && (
        <div>
          <div>
            <Button
              type="primary"
              disabled={!canGetToken}
              loading={loading}
              size={`large`}
              onClick={getDiscordUserInfoByToken}
            >
              Get Discord User Info
            </Button>
          </div>
          <br />
          <div>
            <Button
              type="primary"
              disabled={!canGetToken}
              loading={loading}
              size={`large`}
              onClick={refreshDiscordToken}
            >
              Refresh Token
            </Button>
          </div>
        </div>
      )}

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 600 }}>
        {JSON.stringify({ discordToken })}
      </h2>

      <h2 className="colorWhite marginTop20 textWarp" style={{ maxWidth: 600 }}>
        {JSON.stringify({ discordUser })}
      </h2>
    </div>
  );
};

export default discordAuth;
