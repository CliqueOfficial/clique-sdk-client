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
            env: Environment.Test,
            apiKey,
            apiSecret,
      });

      const { url } = await client.steam.getOpenIDAuthLink({
            callback_url: redirect_uri,
      });
      console.log(url);
      open(url);

      rl.question(
            "Please copy & paste the browser url after you login steam: ",
            async (rUrl) => {
                  const { steamToken } = await client.steam.getSteamToken({
                        authVerifyUrl: rUrl,
                  });
                  console.log({ steamToken });

                  const { steamId } = await client.steam.getSteamIdByToken(
                        steamToken
                  );
                  console.log({ steamId });

                  process.exit(0);
            }
      );
})();
