const { getWallet, readAndDecryptMnemonic } = require("./wallet.js");
const { getClient } = require("./client.js");
const { swapTokens, sendTokenAll } = require("./transactions.js");
const { extractReceivedAmount } = require("./utils.js");

async function main(
  password,
  poolId,
  tokenInDenom,
  tokenInAmount,
  tokenOutDenom,
  sourceChannel,
  recipientAddress,
  memo
) {
  const mnemonic = readAndDecryptMnemonic(password);
  const rpcEndpoint = "https://osmosis-testnet-rpc.polkachu.com";

  const tokenOutMinAmount = "1";

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

  const targetDenom =
    "ibc/DE6792CF9E521F6AD6E9A4BDF6225C9571A3B74ACC0A529F92BC5122A39D2E58";
  const receivedAmount = extractReceivedAmount(swapResponse, targetDenom);

  if (receivedAmount) {
    console.log(
      `Amount of token received for ${targetDenom}: ${receivedAmount}`
    );
  } else {
    console.log(
      `No 'coin_received' event found for denomination ${targetDenom}.`
    );
  }
  const denom = tokenOutDenom; // The denomination of the swapped token to send
  if (receivedAmount) {
    console.log(
      `Transferring ${receivedAmount} of ${denom} to ${recipientAddress} via IBC on channel ${sourceChannel}...`
    );
    const transferResponse = await sendTokenAll(
      client,
      senderAddress,
      recipientAddress,
      receivedAmount,
      tokenOutDenom,
      sourceChannel,
      memo
    );
    console.log("IBC Transfer response:", transferResponse);
  }
}

module.exports = main;

