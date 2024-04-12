const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const crypto = require("crypto");
const fs = require("fs");

async function getWallet(mnemonic, prefix = "osmo") {
  return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix });
}

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

const readAndDecryptMnemonic = password => {
  const encryptedMnemonic = fs.readFileSync("wallet.dat", { encoding: "utf8" });
  const decryptedMnemonic = decrypt(encryptedMnemonic, password);
  return decryptedMnemonic;
};

module.exports = { getWallet, readAndDecryptMnemonic };

