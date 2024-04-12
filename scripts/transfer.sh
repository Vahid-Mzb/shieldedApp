#!/bin/bash

# Check if the correct number of arguments is provided
# if [ "$#" -ne 5 ]; then
#     echo "Usage: $0 recipientAddress amount senderAddress namadaChannel osmosisChannel"
#     exit 1
# fi

recipientAddress="$1"
amount="$2"
senderAddress="$3"
namadaChannel="$4"
osmosisChannel="$5"

# Step 1: Delete the ibc directory if it exists, then recreate it
rm -rf ibc
mkdir -p ibc

# Step 2: Run the first command with updated token identifier and node URL
namadac ibc-gen-shielded --target "$recipientAddress" --token transfer/channel-4280/uusdc --amount "$amount" --output-folder-path ./ibc --channel-id "$namadaChannel" --node https://rpc-namada.kintsugi-nodes.com --chain-id shielded-expedition.88f17d1d14 --port-id transfer

# Assuming there is now only one file in the './ibc' directory, we find it
# Note: This assumes the command generates exactly one file in the directory
generatedFile=$(find ibc -type f | head -n 1)

if [ ! -s "$generatedFile" ]; then
    echo "Error: The output file is empty or was not created."
    exit 1
fi

# Step 3: Extract the memo from the generated file
memo=$(<"$generatedFile")

# Step 4: Run the second command with the extracted memo, adjusting the amount format as required
osmosisd tx ibc-transfer transfer transfer "$osmosisChannel" "$recipientAddress" "${amount}transfer/channel-4280/uusdc" --from "$senderAddress" --yes --fees 3000uosmo --keyring-backend test --keyring-dir ./.osmosisd/ --node https://rpc.testnet.osmosis.zone:443 --chain-id osmo-test-5 --memo "$memo"