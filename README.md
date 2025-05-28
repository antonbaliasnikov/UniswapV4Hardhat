### Setup
0) Make sure you have your rpc node available via url specified in hardhat.config.js.
1) Run `npm i --force`
2) Create `.env` file, you can copy `.env.example` with default values.
3) Make sure account specified in the `WALLET_PRIVATE_KEY` env has funds.
4) Set `defaultNetwork` in hardhat config, either `geth` or `boojumos`.
5) Run `npx hardhat deploy --tags local`
6) Run `npx hardhat deploy --tags tokens`
7) Run `npx hardhat test`


* In order to rerun tests just remove deployments (`rm -r ./deployments`) folder and run steps 5-7 again.