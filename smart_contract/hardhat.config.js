// https://eth-goerli.g.alchemy.com/v2/iF3TWvfH8AqMeh1O90LB2xM9K78CjkEQ

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-goerli.g.alchemy.com/v2/iF3TWvfH8AqMeh1O90LB2xM9K78CjkEQ',
      accounts: ['be32642e9b8f87e9d167e6c5fa6fac1c37c365dfe0e36d36fe256d05bb55491d'],
    },
  },
};