require("@nomiclabs/hardhat-waffle");
// require('@openzeppelin/hardhat-upgrades');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  // settings: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 1
  //   }
  // },
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      // chainId: 4
      // chainId: 1337
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + INFURA,
      accounts: [ETH_ACCOUNT]
    }
  }
};

const INFURA = '';
const ETH_ACCOUNT = '';

