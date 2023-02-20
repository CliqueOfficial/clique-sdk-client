import dotenv from "dotenv";
import open from "open";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
const walletAddress = "";
const twitterAccessToken = 'dEJxNEFSejZ3UVpsU2pQWlpONG9uZ2hzY0hVdV9CSnJNWC12N2dPV3ZmYUZPOjE2NzY5MzI5NTYxMjA6MTowOmF0OjE';
const discordAccessToken = 'QjsXtyDuZub4K4ns3sAOmfMj9aCZgW';
const selectPipelines = undefined;
const steamToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdGVhbUlkIjoiNzY1NjExOTgwNDU3NzM4ODQiLCJleHAiOjE2NzY5NDA0MjY0Njh9.xABc70G3PBTt6Y9hfZjLLphy50-jlAAeurkNALl0-R8";

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
      console.log(`statistic data`, data);
})();
