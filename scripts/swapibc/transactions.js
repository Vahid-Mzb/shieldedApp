const { osmosis, ibc } = require("osmojs");
const { coins } = require("@cosmjs/amino");
const Long = require("long");

const { transfer } = ibc.applications.transfer.v1.MessageComposer.withTypeUrl;

async function swapTokens(
  client,
  senderAddress,
  poolId,
  tokenInDenom,
  tokenInAmount,
  tokenOutDenom,
  tokenOutMinAmount
) {
  const msg =
    osmosis.gamm.v1beta1.MessageComposer.withTypeUrl.swapExactAmountIn({
      sender: senderAddress,
      routes: [
        {
          poolId: poolId,
          tokenOutDenom: tokenOutDenom,
        },
      ],
      tokenIn: {
        denom: tokenInDenom,
        amount: tokenInAmount,
      },
      tokenOutMinAmount: tokenOutMinAmount,
    });

  const fee = {
    amount: coins(50000, "uosmo"),
    gas: "200000",
  };

  const response = await exponentialBackoffRetry(async () => {
    return client.signAndBroadcast(
      senderAddress,
      [msg],
      fee,
      "Swap tokens using Osmosis"
    );
  });

  if (response.code !== undefined && response.code !== 0) {
    console.error("Swap transaction failed:", response);
  } else {
    console.log("Swap transaction success:", response);
  }

  return response;
}

async function ibcTransfer(
  client,
  senderAddress,
  recipientAddress,
  amount,
  denom,
  sourceChannel
) {
  const tenMinutes = 10 * 60 * 1_000_000_000;
  const currentTimestampInNanoseconds = Date.now() * 1_000_000;
  const timeoutTimestamp = Long.fromNumber(
    currentTimestampInNanoseconds + tenMinutes
  );

  const msg = transfer({
    sender: senderAddress,
    receiver: recipientAddress,
    token: { denom, amount },
    sourcePort: "transfer",
    sourceChannel: sourceChannel,
    timeoutTimestamp: timeoutTimestamp,
  });

  const fee = {
    amount: coins(5000, "uosmo"),
    gas: "200000",
  };

  const response = await exponentialBackoffRetry(async () => {
    return client.signAndBroadcast(senderAddress, [msg], fee, "IBC transfer");
  });

  if (response.code !== undefined && response.code !== 0) {
    console.error("IBC Transfer failed:", response);
  } else {
    console.log("IBC Transfer success:", response);
  }

  return response;
}

async function exponentialBackoffRetry(operation, maxAttempts = 5) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      if (error.message.includes("429")) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Request rate-limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retry attempts reached.");
}

module.exports = { swapTokens, ibcTransfer };

