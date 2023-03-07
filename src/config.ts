import { CliqueClient, Environment } from "@cliqueofficial/clique-sdk";

// @ts-ignore
export const ENV = import.meta.env;
console.log(ENV);
const apiKey = String(ENV.VITE_API_KEY);
const apiSecret = String(ENV.VITE_API_SECRET);

export const client = new CliqueClient({
  env: Environment[String(ENV.ENVIRONMENT)],
  apiKey,
  apiSecret,
});
