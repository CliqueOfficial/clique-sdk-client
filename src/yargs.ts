import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

export const yargsOption = yargs(hideBin(process.argv))
      .options({
            hasSteamAuth: {
                  describe: "enable steam auth",
                  type: "boolean",
                  require: false,
                  default: false,
                  alias: "st",
            },
            walletAddress: {
                  describe: "wallet address",
                  type: "string",
                  require: false,
                  default: "",
                  alias: "wa",
            },
            hasTwitterAuth: {
                  describe: "enable twitter auth",
                  type: "boolean",
                  require: false,
                  default: false,
                  alias: "tw",
            },
            hasDiscordAuth: {
                  describe: "enable discord auth",
                  type: "boolean",
                  require: false,
                  default: false,
                  alias: "dc",
            },
            environment: {
                  describe: "project environment. 0 Dev, 1  Test, 2 Staging, 3 Production ",
                  type: "number",
                  default: 1,
                  alias: "en",
            },
            selectedPipelines: {
                  description: "selected pipelines to include",
                  type: "array",
                  required: false,
                  default: [],
                  alias: "sp",
            },
            needSubmitEntry: {
                  describe: "enable submit entry",
                  type: "boolean",
                  require: false,
                  default: false,
                  alias: "submit",
            },
            needUpdateEntry: {
                  describe: "enable update entry",
                  type: "boolean",
                  require: false,
                  default: false,
                  alias: "update",
            },
      })
      .parseSync();
