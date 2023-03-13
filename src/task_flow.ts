import dotenv from "dotenv";
import readline from "readline";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";

dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);

(async () => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const client = new CliqueClient({
    env: Environment.Test,
    apiKey,
    apiSecret,
  });

  function questionAsync(msg): Promise<string>{
    return new Promise((resolve, reject) => {
      rl.question(msg, (answer) => {
        resolve(answer);
      })
    });
  }

  const twitterAccessToken
    = await questionAsync('Please copy & paste your Twitter access token here(if your campaign need): ');
  const discordAccessToken
    = await questionAsync('Please copy & paste your Discord access token here(if your campaign need): ');

  const data = await client.campaign.getTaskResult({
    twitterAccessToken,
    discordAccessToken,
  });
  console.log(data);

  process.exit(0);

})();
