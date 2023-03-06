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

function getParamsFromUrl(url: string): Record<string, any>{
  if(!url) {
    url = window.location.href;
  }
  const prArrSrr = url.split("?")[1];
  if(!prArrSrr) return {};
  const kvStrArr = prArrSrr.split("&");
  const result = {};
  for(const kvStr of kvStrArr){
    const ps = kvStr.split("=");
    result[ps[0]] = ps[1];
  }
  return result;
}

const redirect_uri = 'http://localhost:5173/discord';

const discordAuth = () => {
  const [loading, setLoading] = useState(false);
  const [canGetToken, setCanGetToken] = useState(false);
  const [discordToken, setdiscordToken] = useState({
    access_token: null, refresh_token: null,
  });
  const [discordUser, setdiscordUser] = useState(null);

  async function jumpToAuth(){
    setLoading(true);

    const { url } = await client.discord.getOAuth2Link({
      redirect_uri: redirect_uri
    });
    setLoading(false);
    // jump to the url
    window.location.href = url;
  }

  async function checkUrlAndGetToken(){
    
    const params = getParamsFromUrl(window.location.href);
    if(!params.code){
      return;
    }

    setCanGetToken(true);
    setLoading(true);
    try {
      const { access_token, refresh_token } = await client.discord.getOAuth2Token({
        redirect_uri: window.location.href,
        code: params.code,
      });
      setdiscordToken({ access_token, refresh_token });
      return;
    }catch (err){
      message.error(err.toString())
    }finally {
      setLoading(false);
    }
    setCanGetToken(false);
  }

  async function getdiscordUserInfoByToken(){
    setLoading(true);
    try {
      const user = await client.discord.getUserByToken(discordToken.access_token);
      setdiscordUser(user);
    }catch (err){
      message.error(err.toString())
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUrlAndGetToken();
  }, [])

  return (
    <div className="flexCenterClu">

      <div className="colorWhite textWarp" style={{width: 1000}}> {JSON.stringify(ENV)}</div>

      <div className="marginTop30 gradient-text bold marginBottom30"
           style={{fontSize: 50}}>
        discord Auth Test
      </div>



      {
        !canGetToken && (
          <Button type="primary"
                  loading={loading}
                  size={`large`}
                  onClick={jumpToAuth}>
            Request discord Auth
          </Button>
        )
      }

      {
        discordToken.access_token && (
          <div>
            <Button type="primary"
                    disabled={!canGetToken}
                    loading={loading}
                    size={`large`}
                    onClick={getdiscordUserInfoByToken}>
              Get discord User Info
            </Button>
          </div>
        )
      }


      <h2 className="colorWhite marginTop20 textWarp" style={{maxWidth: 500}}>
        {JSON.stringify({discordToken})}
      </h2>

      <h2 className="colorWhite marginTop20 textWarp" style={{maxWidth: 500}}>
        {JSON.stringify({discordUser})}
      </h2>
    </div>
  )
};

export default discordAuth;
