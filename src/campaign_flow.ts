import dotenv from "dotenv";
import open from "open";
import readline from "readline";
import util from "util";
import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";
import { yargsOption } from "./yargs";
dotenv.config();

const apiKey = String(process.env.API_KEY);
const apiSecret = String(process.env.API_SECRET);

interface CampaignParams {
      walletAddress?: string;
      twitterAccessToken?: string;
      discordAccessToken?: string;
      steamToken?: string;
      selectPipelines?: Array<string>;
      additionalInformation?: Record<string, string>;
}

let campaignParams: CampaignParams = {
      walletAddress: yargsOption.walletAddress,
      twitterAccessToken: undefined,
      discordAccessToken: undefined,
      steamToken: undefined,
      selectPipelines:
            yargsOption.selectedPipelines.length > 0
                  ? yargsOption.selectedPipelines
                  : undefined,
};

let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);

const client = new CliqueClient({
      env: validateEnvironment(yargsOption.environment),
      apiKey,
      apiSecret,
});

/**
 * @description  steam auth flow to get steam jwt token
 */
async function steamAuthToken() {
      const redirect_uri = "http://localhost:8080/social_login";

      const { url } = await client.steam.getOpenIDAuthLink({
            callback_url: redirect_uri,
      });
      console.log(`steam auth link  ${url}`);
      await open(url);

      const rUrl = await question(
            "Please copy & paste the browser url after you login steam:"
      );
      const { steamToken } = await client.steam.getSteamToken({
            authVerifyUrl: rUrl,
      });
      console.log(`steamToken ${steamToken}`);
      campaignParams.steamToken = steamToken;
}

/**
 * @description twitter auth flow to get twitter token
 */
async function twitterAuthToken() {
      const redirect_uri = "http://localhost:8080/social_login";

      const clientIdResult = await client.twitter.getClientId();
      const client_id = clientIdResult.client_id;
      console.log("Allocated Client ID:", client_id);

      const data = await client.twitter.getOAuth2Link({
            client_id,
            redirect_uri,
      });
      console.log(data);
      await open(data.url);

      // Once you authorize ClientOfficial Twitter Application, grab the code from the URL.

      const code = await question("Please copy & paste your code here:");
      const token = await client.twitter.getOAuth2Token({
            client_id,
            code,
            redirect_uri,
      });

      console.log("Twitter Tokens:", token);
      campaignParams.twitterAccessToken = token.access_token;
}

/**
 * @description discord auth flow to get discord token
 */
async function discordAuthToken() {
      const client_id = process.env.DISCORD_CLIENT_ID;
      const client_secret = process.env.DISCORD_CLIENT_SECRET;
      const redirect_uri = "http://localhost:8080/discord_login";
      const data = await client.discord.getOAuth2Link({
            client_id,
            redirect_uri,
      });
      console.log(data);
      await open(data.url);

      // Once you authorize ClientOfficial Discord Application, grab the code from the URL.
      const code = await question("Please copy & paste your code here:");
      const token = await client.discord.getOAuth2Token({
            code,
            redirect_uri,
            client_id,
            client_secret: client_secret,
      });

      console.log("Discord Tokens:", token);
      campaignParams.discordAccessToken = token.access_token;
}

/**
 * @description task result of campaign
 * @returns boolean
 */
async function checkTask(): Promise<boolean> {
      const data = await client.campaign.getTaskResult({
            walletAddress: campaignParams.walletAddress,
            twitterAccessToken: campaignParams.twitterAccessToken,
            discordAccessToken: campaignParams.discordAccessToken,
      });
      console.log(`task result ${JSON.stringify(data)}`);
      return data.every((element) => element.done === true);
}

async function getStatistics() {
      const data = await client.campaign.getStatistics({
            walletAddress: campaignParams.walletAddress,
            twitterAccessToken: campaignParams.twitterAccessToken,
            discordAccessToken: campaignParams.discordAccessToken,
            selectPipelines: campaignParams.selectPipelines,
            steamToken: campaignParams.steamToken,
      });
      console.log(`statistic data ${JSON.stringify(data)}`);
}

async function submitEntry() {
      const submitEntryResult = await client.campaign.submitEntry({
            walletAddress: campaignParams.walletAddress,
            twitterAccessToken: campaignParams.twitterAccessToken,
            discordAccessToken: campaignParams.discordAccessToken,
            steamToken: campaignParams.steamToken,
      });
      console.log(`submit result ${JSON.stringify(submitEntryResult)}`);
}

async function updateEntry() {
      const submitEntryResult = await client.campaign.updateEntry({
            walletAddress: campaignParams.walletAddress,
            twitterAccessToken: campaignParams.twitterAccessToken,
            discordAccessToken: campaignParams.discordAccessToken,
            steamToken: campaignParams.steamToken,
      });
      console.log(`update result ${JSON.stringify(submitEntryResult)}`);
}

async function main() {
      console.log(yargsOption.hasSteamAuth);
      if (yargsOption.hasSteamAuth) {
            await steamAuthToken();
      }
      if (yargsOption.hasTwitterAuth) {
            await twitterAuthToken();
      }
      if (yargsOption.hasDiscordAuth) {
            await discordAuthToken();
      }
      // show statistics
      await getStatistics();
      const passed = await checkTask();
      if (passed) {
            if (yargsOption.needSubmitEntry) {
                  await submitEntry();
            }
            if (yargsOption.needUpdateEntry) {
                  await updateEntry();
            }
      }
      process.exit(0);
}

function validateEnvironment(e: number): number {
      if (
            e != Environment.Dev &&
            e != Environment.Production &&
            e != Environment.Staging &&
            e != Environment.Test
      ) {
            throw new Error(`invalid environment number ${e}!`);
      }
      return e;
}
main().catch((err) => {
      console.error(err);
      process.exit(1);
});
