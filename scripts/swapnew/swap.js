const { getWallet } = require("./wallet.js");
const { getClient } = require("./client.js");
const { swapTokens } = require("./transactions.js");

async function swap(
  poolId,
  tokenInDenom,
  tokenInAmount,
  tokenOutDenom,
  mnemonic
) {
  const rpcEndpoint = "https://osmosis-testnet-rpc.polkachu.com";
  const tokenOutMinAmount = "1";

  try {
    const wallet = await getWallet(mnemonic);
    const client = await getClient(rpcEndpoint, wallet);
    const [firstAccount] = await wallet.getAccounts();
    const senderAddress = firstAccount.address;

    console.log(
      `Swapping ${tokenInAmount} of ${tokenInDenom} for ${tokenOutDenom}...`
    );
    const swapResponse = await swapTokens(
      client,
      senderAddress,
      poolId,
      tokenInDenom,
      tokenInAmount,
      tokenOutDenom,
      tokenOutMinAmount
    );

    if (swapResponse && swapResponse.transactionHash) {
      console.log(generateMintscanLink(swapResponse));
      return generateMintscanLink(swapResponse);
    } else {
      throw new Error("Insufficient balance. Failed to execute swap");
    }
  } catch (error) {
    console.error(`Error during swap operation: ${error.message}`);
    throw error; // Re-throw to handle it in the ipcMain process
  }
}

function generateMintscanLink(swapResponse) {
  const baseMintscanUrl = "https://www.mintscan.io/osmosis-testnet/tx/";
  return `${baseMintscanUrl}${swapResponse.transactionHash}?height=${swapResponse.height}`;
}

module.exports = { swap, generateMintscanLink };
