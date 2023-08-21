const axios = require('axios');
const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const json = require('koa-json');
const app = new Koa();
const router = new Router();

async function request(data) {
  const config = {
    method: 'post',
    url: 'https://sibyl.clique-test.social/query',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(data),
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  };
  const response = await axios.request(config)
  return response.data
}

router.get('/twitter_rsa_public_key', async (ctx) => {
  const response = await request({
    "query_type": "twitter_rsa_public_key",
  });
  ctx.body = response;
});

router.get('/twitter_auth_tokens', async (ctx) => {
  const { code, client_id, redirect_uri } = ctx.request.query;
  const response = await request({
    "query_type": "twitter_auth_tokens",
    "query_param": {
      code,
      client_id,
      redirect_uri,
    },
  });
  ctx.body = response;
});

router.get('/twitter_auth_tokens_by_refresh_token', async (ctx) => {
  const { client_id, refresh_token } = ctx.request.query;
  const response = await request({
    "query_type": "twitter_auth_tokens_by_refresh_token",
    "query_param": {
      client_id,
      refresh_token,
    },
  });
  ctx.body = response;
});

router.get('/twitter_me', async (ctx) => {
  const { token } = ctx.request.query;
  const response = await request({
    "query_type": "twitter_me",
    "query_param": {
      bearer: token,
    },
  });
  ctx.body = response
});

app
  .use(cors())
  .use(json())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
