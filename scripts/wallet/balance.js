// ES Module syntax; ensure your environment supports this
const { osmosis } = require("osmojs");

// Define your RPC endpoint; replace 'YOUR_RPC_ENDPOINT' with your actual endpoint URL
const RPC_ENDPOINT = "https://rpc.testnet.osmosis.zone";

// Wrap the logic in an async function to use await
async function fetchBalance(address) {
  try {
    const { createRPCQueryClient } = osmosis.ClientFactory;
    const client = await createRPCQueryClient({ rpcEndpoint: RPC_ENDPOINT });

    // Query the balance
    const balance = await client.cosmos.bank.v1beta1.allBalances({
      address: address,
    });

    // Assuming you want to log the balance, adjust as necessary for your needs
    console.log(balance);
    return balance; // Return balance for further processing
  } catch (error) {
    // Handle errors gracefully
    console.error("Failed to fetch balance:", error);
    return null; // Indicate failure
  }
}

module.exports = fetchBalance;
