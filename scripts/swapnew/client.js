const { getSigningOsmosisClient } = require("osmojs");

async function getClient(rpcEndpoint, wallet) {
  return await getSigningOsmosisClient({
    rpcEndpoint: rpcEndpoint,
    signer: wallet,
  });
}

module.exports = { getClient };

