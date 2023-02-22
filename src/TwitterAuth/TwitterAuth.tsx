import React, {useEffect, useState} from "react";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
import {Button, message} from "antd";


// @ts-ignore
const ENV = import.meta.env;
console.log(ENV)
const apiKey = String(ENV.VITE_API_KEY);
const apiSecret = String(ENV.VITE_API_SECRET);

const client = new CliqueClient({
  env: Environment.Test,
  apiKey,
  apiSecret,
});


async function getClientId(){
  let client_id = window.localStorage.getItem('twitter_client_id');
  if(!client_id) {
    const data = await client.twitter.getClientId();
    client_id = data.client_id;
    window.localStorage.setItem('twitter_client_id', client_id);
  }
  return client_id;
}

function getParamsFromUrl(url): Record<string, any>{
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

const redirect_uri = 'http://localhost:5173/twitter';

const TwitterAuth = () => {
  const [loading, setLoading] = useState(false);
  const [canGetToken, setCanGetToken] = useState(false);
  const [twitterToken, setTwitterToken] = useState({
    access_token: null, refresh_token: null,
  });
  const [twitterUser, setTwitterUser] = useState(null);

  async function jumpToAuth(){
    setLoading(true);
    const client_id = await getClientId();


    const { url } = await client.twitter.getOAuth2Link({
      client_id: client_id,
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
      const client_id = await getClientId();
      const { access_token, refresh_token } = await client.twitter.getOAuth2Token({
        client_id: client_id,
        code: params.code,
      });
      setTwitterToken({ access_token, refresh_token });
      return;
    }catch (err){
      message.error(err.toString())
    }finally {
      setLoading(false);
    }
    setCanGetToken(false);
  }

  async function getTwitterUserInfoByToken(){
    setLoading(true);
    try {
      const user = await client.twitter.getUserByToken(twitterToken.access_token);
      setTwitterUser(user);
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
        Twitter Auth Test
      </div>



      {
        !canGetToken && (
          <Button type="primary"
                  loading={loading}
                  size={`large`}
                  onClick={jumpToAuth}>
            Request Twitter Auth
          </Button>
        )
      }

      {
        twitterToken.access_token && (
          <div>
            <Button type="primary"
                    disabled={!canGetToken}
                    loading={loading}
                    size={`large`}
                    onClick={getTwitterUserInfoByToken}>
              Get Twitter User Info
            </Button>
          </div>
        )
      }


      <h2 className="colorWhite marginTop20 textWarp" style={{maxWidth: 500}}>
        {JSON.stringify({twitterToken})}
      </h2>

      <h2 className="colorWhite marginTop20 textWarp" style={{maxWidth: 500}}>
        {JSON.stringify({twitterUser})}
      </h2>
    </div>
  )
};

export default TwitterAuth;
