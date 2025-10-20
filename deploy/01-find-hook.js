const { ethers, network } = require("hardhat");

module.exports = async function ({ getNamedAccounts }) {
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const owner = deployer;
  const poolManager = await ethers.getContract("PoolManager");
  const hookFactory = await ethers.getContract("UniswapHooksFactory");

  // Set this to the byte your hook requires.
  // In your previous script you used 0xff (all callbacks). Adjust if your hook uses fewer.
  const requiredFirstByte = "ff";    // e.g. "ff", "3c", "00", etc.
  const limit = 5000;                // search budget; ~256 tries expected for 1 byte

  let foundSalt = null;
  let preAddr = null;

  for (let i = 0; i < limit; i++) {
    const salt = ethers.zeroPadValue(ethers.toBeHex(i), 32);

    const addr = (await hookFactory.getPrecomputedHookAddress(
      owner,
      poolManager.target,
      salt
    )).toLowerCase();

    if (addr.slice(2, 4) === requiredFirstByte) {
      // extra safety: make sure nothing is already deployed there
      const code = await ethers.provider.getCode(addr);
      if (code === "0x") {
        foundSalt = salt;
        preAddr = addr;
        break;
      }
    }
  }

  if (!foundSalt) {
    throw new Error(
      `Could not find a salt that yields first byte 0x${requiredFirstByte} within ${limit} attempts`
    );
  }

  console.log("Precomputed hook address:", preAddr);
  const tx = await hookFactory.deploy(poolManager.target, foundSalt);
  await tx.wait();
  console.log("Hooks deployed at:", preAddr);
  console.log("Chain", chainId);
};
module.exports.tags = ["all", "local"];
