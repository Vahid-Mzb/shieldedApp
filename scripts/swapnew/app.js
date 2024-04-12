const main = require("./main.js");

// Example call to main with all parameters, including the recipient address
const password = "amir1234";
const poolId = "367"; // Swap pool ID
const tokenInDenom = "uosmo"; // Denomination of the input token
const tokenInAmount = "10000"; // Amount of input token in smallest unit
const tokenOutDenom =
  "ibc/DE6792CF9E521F6AD6E9A4BDF6225C9571A3B74ACC0A529F92BC5122A39D2E58"; // Denomination of the output token
const sourceChannel = "channel-6751"; // IBC source channel for the transfer
const recipientAddress = "osmo1e0d8cwsw4gzdg7k55t4zk3x240tlvxaq8sj4ws"; // Recipient address for the IBC transfer
const memo = "test";

main(
  password,
  poolId,
  tokenInDenom,
  tokenInAmount,
  tokenOutDenom,
  sourceChannel,
  recipientAddress,
  memo
).catch(console.error);

