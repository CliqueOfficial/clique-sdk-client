import dotenv from "dotenv";
import open from "open";
import readline from "readline";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";

dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
const redirect_uri = "http://localhost:8080/social_login";

(async () => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const client = new CliqueClient({
    env: Environment.Production,
    apiKey,
    apiSecret,
  });

  const clientIdResult = await client.twitter.getClientId();
  const client_id = clientIdResult.client_id;
  console.log("Allocated Client ID:", client_id);

  const data = await client.twitter.getOAuth2Link({
    client_id,
    redirect_uri,
  });
  console.log(data);
  open(data.url);

  // Once you authorize ClientOfficial Twitter Application, grab the code from the URL.
  rl.question("Please copy & paste your code here: ", async (code) => {
    const token = await client.twitter.getOAuth2Token({
      client_id,
      code,
      redirect_uri,
    });

    console.log("Twitter Tokens:", token);

    const tokenByRefresh = await client.twitter.getOAuth2TokenByRefresh({
      refresh_token: token.refresh_token,
      client_id,
    });

    console.log("Twitter Tokens by Refresh Token:", tokenByRefresh);

    process.exit(0);
  });
})();
