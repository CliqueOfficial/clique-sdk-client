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



})();
