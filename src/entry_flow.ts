import dotenv from "dotenv";
import readline from "readline";
import { CliqueClient } from "@cliqueofficial/clique-sdk";

dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
const walletAddress = String(process.env.WALLET_ADDRESS);

(async () => {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const client = new CliqueClient({
    apiKey,
    apiSecret,
  });

  rl.question(
    "Please copy & paste your Twitter access token here: ",
    async (twitterAccessToken) => {
      const data = await client.campaign.getStatistics({
        walletAddress,
        twitterAccessToken,
      });
      console.log(data);

      const submitEntryResult = await client.campaign.submitEntry({
        walletAddress,
        twitterAccessToken,
      });
      console.log(submitEntryResult);

      const updateEntryResult = await client.campaign.submitEntry({
        walletAddress,
        twitterAccessToken,
      });
      console.log(updateEntryResult);

      process.exit(0);
    }
  );
})();
