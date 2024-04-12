const { osmosis } = require("osmojs");

// Use the RPC endpoint from environment variables
const rpcEndpoint = "https://osmosis-testnet-rpc.polkachu.com";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractReceivedAmount(swapResponse, targetDenom) {
  let receivedAmount = null; // Default to null to indicate no amount found

  const targetEvent = swapResponse.events.find(
    event =>
      event.type === "coin_received" &&
      event.attributes.some(
        attr => attr.key === "amount" && attr.value.includes(targetDenom)
      )
  );

  if (targetEvent) {
    const amountAttr = targetEvent.attributes.find(attr =>
      attr.value.includes(targetDenom)
    );
    if (amountAttr) {
      receivedAmount = amountAttr.value.split(targetDenom)[0]; // Extract the amount
    }
  }

  return receivedAmount; // Will return null if no amount was found
}

async function fetchBalance(address) {
  try {
    const { createRPCQueryClient } = osmosis.ClientFactory;
    const client = await createRPCQueryClient({ rpcEndpoint });

    // Query the balance
    const balances = await client.cosmos.bank.v1beta1.allBalances({
      address,
    });

    // Assuming balances are returned as an array of { denom, amount } objects
    // Find the uosmo balance
    const uosmoBalanceObj = balances.balances.find(
      balance => balance.denom === "uosmo"
    );
    return uosmoBalanceObj ? parseInt(uosmoBalanceObj.amount, 10) : 0; // Convert to integer and return
  } catch (error) {
    console.error("Error fetching balance for address:", address, error);
    throw error; // Rethrow error to handle it in the calling code
  }
}

module.exports = { delay, extractReceivedAmount, fetchBalance };

