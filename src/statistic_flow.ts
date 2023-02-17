import dotenv from "dotenv";
import open from "open";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
const walletAddress = "";
const twitterAccessToken = undefined;
const discordAccessToken = undefined;
const selectPipelines = undefined;
const steamToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdGVhbUlkIjoiNzY1NjExOTgxMjM0NzA3NDEiLCJleHAiOjE2NzY2MTgyMDMwMjh9.lIt1-0xJkMOpL_A-hfR7zBjEXLcTcQc-0p3DGsUY8pI";

(async () => {
      const client = new CliqueClient({
            env: Environment.Test,
            apiKey,
            apiSecret,
      });

      const data = await client.campaign.getStatistics({
            walletAddress: walletAddress,
            twitterAccessToken: twitterAccessToken,
            discordAccessToken: discordAccessToken,
            selectPipelines: selectPipelines,
            steamToken: steamToken,
      });
      console.log(`statistic data ${JSON.stringify(data)}`);
})();
