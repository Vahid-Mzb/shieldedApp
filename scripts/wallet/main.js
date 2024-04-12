const fs = require("fs");
const crypto = require("crypto");
const { Bip39, Random } = require("@cosmjs/crypto");
const { Secp256k1HdWallet, makeCosmoshubPath } = require("@cosmjs/amino");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient } = require("@cosmjs/stargate");
const osmojs = require("osmojs");
const osmosis = osmojs.osmosis;

const RPC_ENDPOINT = "https://osmosis-testnet-rpc.polkachu.com/";

// Function to encrypt text using a password
function encrypt(text, password) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-ctr",
    crypto.createHash("sha256").update(password).digest(),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Function to decrypt text using a password
function decrypt(text, password) {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    crypto.createHash("sha256").update(password).digest(),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString();
}

// Function to create a wallet, encrypt the mnemonic, and save it to a file
const createAndSaveWallet = async (password) => {
  const mnemonic = Bip39.encode(Random.getBytes(16)).toString();

  // Use the correct prefix for Osmosis
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
    // Providing the correct HD path for Cosmos SDK-based chains and specifying the Osmosis prefix
    hdPaths: [makeCosmoshubPath(0)],
    prefix: "osmo", // This specifies the Osmosis prefix
  });

  const [{ address }] = await wallet.getAccounts();
  const encryptedMnemonic = encrypt(mnemonic, password);

  // Save the encrypted mnemonic to a file
  fs.writeFileSync("wallet.dat", encryptedMnemonic);

  console.log("Osmosis Wallet address:", address);
  console.log("Mnemonic encrypted and saved to wallet.dat.");
  return address;
};

// Function to read and decrypt the mnemonic from the file
const readAndDecryptMnemonic = (password) => {
  const encryptedMnemonic = fs.readFileSync("wallet.dat", { encoding: "utf8" });
  const decryptedMnemonic = decrypt(encryptedMnemonic, password);
  return decryptedMnemonic;
};

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

async function sendToken(password, recipientAddress, amountToSend) {
  const mnemonic = readAndDecryptMnemonic(password);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "osmo",
  });
  const [account] = await wallet.getAccounts();

  const balances = await fetchBalance(account.address);
  const osmoBalance = balances.find((b) => b.denom === "uosmo");
  if (!osmoBalance || parseInt(osmoBalance.amount) < parseInt(amountToSend)) {
    console.error("Insufficient balance to complete the transaction.");
    return;
  }

  const client = await SigningStargateClient.connectWithSigner(
    RPC_ENDPOINT,
    wallet
  );

  const msg = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: account.address,
      toAddress: recipientAddress,
      amount: [{ denom: "uosmo", amount: amountToSend.toString() }],
    },
  };

  const fee = {
    amount: [{ denom: "uosmo", amount: "5000" }],
    gas: "200000",
  };

  // Wrap signAndBroadcast in a retry mechanism
  const response = await exponentialBackoffRetry(async () => {
    return client.signAndBroadcast(
      account.address,
      [msg],
      fee,
      "Sending uosmo tokens"
    );
  });

  console.log("Transaction response:", response);
}

async function exponentialBackoffRetry(operation, maxAttempts = 5) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      if (error.message.includes("429")) {
        // Check if the error is due to rate limiting
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff formula
        console.log(`Request rate-limited. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        throw error; // Rethrow if a different error occurs
      }
    }
  }
  throw new Error("Max retry attempts reached.");
}

// Example usage:
// const password = "amir1234"; // This should be a strong, securely stored password
// createAndSaveWallet(password)
//   .then(() => {
//     const mnemonic = readAndDecryptMnemonic(password);
//     console.log("Decrypted mnemonic:", mnemonic);
//   })
//   .catch(console.error);

//console.log(readAndDecryptMnemonic("amir1234"));

//fetchBalance("osmo1qdyfwx8yrpn5qvt6gayevephl59sa6pa6z2uul");
// sendToken("amir1234", "osmo1e0d8cwsw4gzdg7k55t4zk3x240tlvxaq8sj4ws", "123");

module.exports = createAndSaveWallet;
