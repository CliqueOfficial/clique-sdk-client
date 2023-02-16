import React, {useEffect, useState} from "react";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
import {Button, message} from "antd";


// @ts-ignore
const ENV = import.meta.env;
console.log(ENV)
const apiKey = String(ENV.VITE_API_KEY);
const apiSecret = String(ENV.VITE_API_SECRET);

const client = new CliqueClient({
  env: Environment.Production,
  apiKey,
  apiSecret,
});




const SteamAuth = () => {
  const [loading, setLoading] = useState(false);
  const [canGetToken, setCanGetToken] = useState(false);
  const [steamToken, setSteamToken] = useState(null);
  const [steamId, setSteamId] = useState(null);

  async function jumpToSteamAuth(){
    setLoading(true);
    const { url } = await client.steam.getOpenIDAuthLink({
      host_url: 'http://localhost:5173/steam',
      callback_url: 'http://localhost:5173/steam',
    });
    setLoading(false);
    // jump to the url
    window.location.href = url;
  }

  async function checkUrlAndGetSteamToken(){
    const nowUrl = window.location.href;
    if(nowUrl.indexOf('?openid.ns') !== -1){
      setCanGetToken(true);
      setLoading(true);
      try {
        const { steamToken } = await client.steam.getSteamToken({
          authVerifyUrl: nowUrl
        });
        setSteamToken(steamToken)
      }catch (err){
        message.error(err.toString())
      }finally {
        setLoading(false);
      }

      return;
    }
    setCanGetToken(false);
  }

  async function getSteamIdBySteamToken(){
    setLoading(true);
    try {
      const { steamId } = await client.steam.getSteamIdByToken(steamToken);
      setSteamId(steamId);
    }catch (err){
      message.error(err.toString())
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUrlAndGetSteamToken();
  }, [])

  return (
    <div className="flexCenterClu">

      <div className="colorWhite textWarp" style={{width: 1000}}> {JSON.stringify(ENV)}</div>

      <div className="marginTop30 gradient-text bold marginBottom30"
           style={{fontSize: 50}}>
        Steam Auth Test
      </div>



      {
        !canGetToken && (
          <Button type="primary"
                  loading={loading}
                  size={`large`}
                  onClick={jumpToSteamAuth}>
            Request Steam Auth
          </Button>
        )
      }

      {
        steamToken && (
          <div>
            <Button type="primary"
                    disabled={!canGetToken}
                    loading={loading}
                    size={`large`}
                    onClick={getSteamIdBySteamToken}>
              Get Steam Id
            </Button>
          </div>
        )
      }


      <h2 className="colorWhite marginTop20 textWarp" style={{maxWidth: 500}}>
        {JSON.stringify({steamToken})}
      </h2>

      <h2 className="colorWhite marginTop20 textWarp" style={{maxWidth: 500}}>
        {JSON.stringify({steamId})}
      </h2>
    </div>
  )
};

export default SteamAuth;
