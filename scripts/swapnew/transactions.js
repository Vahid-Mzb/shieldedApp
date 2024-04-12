const { osmosis, ibc } = require("osmojs");
const { coins } = require("@cosmjs/amino");
const Long = require("long");

const RPC_ENDPOINT = "https://osmosis-testnet-rpc.polkachu.com";

const { transfer } = ibc.applications.transfer.v1.MessageComposer.withTypeUrl;

async function fetchBalance(address) {
  try {
    const { createRPCQueryClient } = osmosis.ClientFactory;
    const client = await createRPCQueryClient({ rpcEndpoint: RPC_ENDPOINT });
    const balanceResponse = await client.cosmos.bank.v1beta1.allBalances({
      address: address,
    });
    console.log(balanceResponse);
    return balanceResponse.balances;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return null;
  }
}

async function swapTokens(
  client,
  senderAddress,
  poolId,
  tokenInDenom,
  tokenInAmount,
  tokenOutDenom,
  tokenOutMinAmount
) {
  const balances = await fetchBalance(senderAddress);
  const tokenInBalance = balances.find((b) => b.denom === tokenInDenom);
  if (
    !tokenInBalance ||
    parseInt(tokenInBalance.amount) < parseInt(tokenInAmount)
  ) {
    console.error("Insufficient tokenIn balance to complete the swap.");
    return;
  }

  const feeDenom = "uosmo";
  const requiredFeeAmount = 50000;
  const feeBalance = balances.find((b) => b.denom === feeDenom);
  if (!feeBalance || parseInt(feeBalance.amount) < requiredFeeAmount) {
    console.error("Insufficient fee balance to complete the swap.");
    return;
  }

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
    amount: coins(50000, feeDenom),
    gas: "200000",
  };

  const response = await exponentialBackoffRetry(async () => {
    return client.signAndBroadcast(senderAddress, [msg], fee, "");
  });

  if (response.code !== undefined && response.code !== 0) {
    console.error("Swap transaction failed:", response);
  } else {
    console.log("Swap transaction success:", response);
  }

  return response;
}

async function sendToken(
  client,
  senderAddress,
  recipientAddress,
  amountToSend
) {
  const balances = await fetchBalance(senderAddress);
  const osmoBalance = balances.find((b) => b.denom === "uosmo");
  if (!osmoBalance || parseInt(osmoBalance.amount) < parseInt(amountToSend)) {
    console.error("Insufficient balance to complete the transaction.");
    return;
  }

  const msg = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: senderAddress,
      toAddress: recipientAddress,
      amount: [{ denom: "uosmo", amount: amountToSend.toString() }],
    },
  };

  const fee = {
    amount: [{ denom: "uosmo", amount: "5000" }],
    gas: "200000",
  };

  const response = await exponentialBackoffRetry(async () => {
    return client.signAndBroadcast(
      senderAddress,
      [msg],
      fee,
      "Sending uosmo tokens"
    );
  });

  console.log("Transaction response:", response);
}

async function ibcTransfer(
  client,
  senderAddress,
  recipientAddress,
  amount,
  denom,
  sourceChannel,
  memo
) {
  const balances = await fetchBalance(senderAddress);
  const tokenBalance = balances.find((b) => b.denom === denom);
  const requiredAmount = parseInt(amount) + 5000;

  if (!tokenBalance || parseInt(tokenBalance.amount) < requiredAmount) {
    console.error("Insufficient balance to complete the IBC transfer.");
    return;
  }

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
    amount: coins(5000, denom),
    gas: "200000",
  };

  const response = await exponentialBackoffRetry(async () => {
    return client.signAndBroadcast(senderAddress, [msg], fee, memo);
  });

  if (response.code !== undefined && response.code !== 0) {
    console.error("IBC Transfer failed:", response);
  } else {
    console.log("IBC Transfer success:", response);
  }

  return response;
}

async function sendTokenAll(
  client,
  senderAddress,
  recipientAddress,
  amountToSend,
  denom,
  sourceChannel,
  memo
) {
  // This function body remains the same as described in your previous instructions.
  if (recipientAddress.startsWith("osmo")) {
    // Pass 'memo' to the modified sendToken function
    return await sendToken(
      client,
      senderAddress,
      recipientAddress,
      amountToSend
    );
  } else if (recipientAddress.startsWith("tnam")) {
    // For "tnam", memo is set to an empty string

    // Establish a client connection
    // const client = await SigningStargateClient.connectWithSigner(
    //   RPC_ENDPOINT,
    //   wallet
    // );

    // Execute IBC transfer with an empty memo
    return await ibcTransfer(
      client,
      senderAddress,
      recipientAddress,
      amountToSend, // 'amountToSend' is treated as a string
      denom, // Pass the 'denom' parameter
      sourceChannel,
      "" // Set memo to an empty string
    );
  } else if (recipientAddress.startsWith("znam")) {
    // For "znam", pass the memo as provided

    // Establish a client connection
    // const client = await SigningStargateClient.connectWithSigner(
    //   RPC_ENDPOINT,
    //   wallet
    // );

    // Execute IBC transfer, including the provided 'memo'
    return await ibcTransfer(
      client,
      senderAddress,
      recipientAddress,
      amountToSend, // 'amountToSend' is treated as a string
      denom, // Pass the 'denom' parameter
      sourceChannel,
      memo // Include the provided 'memo'
    );
  } else {
    console.error("Unsupported recipient address prefix.");
  }
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
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retry attempts reached.");
}

module.exports = { swapTokens, sendTokenAll };
