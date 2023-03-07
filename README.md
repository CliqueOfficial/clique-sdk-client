# clique-sdk-client

## Setup
1. Request your apiKey, apiSecret from Clique and put them in .env file
2. Apply for your GitHub personal access token here https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
3. Put your wallet address as env var WALLET_ADDRESS in .env
4. Run the following commands to run two example flows.
```sh
cp ./.npmrc.example ./.npmrc
# Replace ${{github.authToken}} with your GitHub personal access token.
yarn install

ts-node ./src/twitter_login_flow.ts
ts-node ./src/entry_flow.ts
```

wallet flow demo: 
1. npm run dev or yarn dev
2. view: http://localhost:5173/

steam flow demo: 
1. npm run dev or yarn dev
2. view: http://localhost:5173/steam
