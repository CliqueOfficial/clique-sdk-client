import dotenv from "dotenv";
import open from "open";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
const walletAddress = "0x3b93478192d3C66Ac1270DB1B8f6F9F29f1c65db";
const twitterAccessToken =
      "ZkVWM1JXcTB1RjZOMkVBZjRPSVpSOWVfcjRxbWY3V0Rvc2FKbjRnUDRWQ2RwOjE2ODI2NzU1NTk0MzM6MTowOmF0OjE";
const discordAccessToken = "QjsXtyDuZub4K4ns3sAOmfMj9aCZgW";
const selectPipelines = undefined;
const steamAccessToken = "";
const spotifyToken = "";

(async () => {
      const client = new CliqueClient({
            env: Environment.Test,
            apiKey,
            apiSecret,
      });

      const data = await client.campaign.getStatistics({
            walletAddress: walletAddress,
            twitterAccessToken: twitterAccessToken,
            selectPipelines: selectPipelines,
            spotifyAccessToken: spotifyToken,
      });
      console.log(`statistic data`, JSON.stringify(data));
})();
