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
    "query_type": "twitter_get_rsa_public_key",
  });
  ctx.body = { publicKey: response.result };
});

router.get('/twitter_user', async (ctx) => {
  const { token } = ctx.request.query;
  const response = await request({
    "query_type": "twitter_me",
    "query_param": {
      bearer: token,
    },
  });

  console.log({ response });
  ctx.body = { user: JSON.parse(response.result).data }
});

app
  .use(cors())
  .use(json())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
