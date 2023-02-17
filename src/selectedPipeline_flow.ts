import dotenv from "dotenv";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);
const walletAddress = "";
const twitterAccessToken = undefined;
const discordAccessToken = undefined;
const selectPipelines = undefined;
const steamToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdGVhbUlkIjoiNzY1NjExOTgxMjM0NzA3NDEiLCJleHAiOjE2NzY2MzA4NDk3MDF9.lmXjBhU0B74v2RVKOP9r9DBF0rpYB39GCNJObbSoLCs";

(async () => {
      const client = new CliqueClient({
            env: Environment.Test,
            apiKey,
            apiSecret,
      });

      const projectCfg = await client.campaign.getConfig();

      // get configured pipelines of this project
      console.log(
            `project entryFieldsConfig list ---> ${JSON.stringify(
                  projectCfg.entryFieldsConfig
            )}`
      );
      /**
       * @notice  SelectPipelines must be a subset of configured pipelines of this project.
       * If Setting SelectPipelines undefine will query all configured pipelines from proejct
       */
      const data = await client.campaign.getStatistics({
            walletAddress: walletAddress,
            twitterAccessToken: twitterAccessToken,
            discordAccessToken: discordAccessToken,
            selectPipelines: ["sumMoneySpentSteam"], //add sumMoneySpentSteam in selectPipelines
            steamToken: steamToken,
      });
      console.log(`statistic data ${JSON.stringify(data)}`);
})();
