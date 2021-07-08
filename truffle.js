module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777", // match any network id
      from: "0xB2b87F54d65b6fc4687704f771f3A21f4fF2F66F", // account address from which to deploy
      gas: 6721975,
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  }
};
