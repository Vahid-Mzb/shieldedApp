#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 6 ]; then
    echo "Usage: $0 recipientAddress amount senderAddress namadaChannel osmosisChannel password"
    exit 1
fi

recipientAddress="$1"
amount="$2"
senderAddress="$3"
namadaChannel="$4"
osmosisChannel="$5"
password="$6"

# Step 1: Delete the ibc directory if it exists, then recreate it
rm -rf ibc
mkdir -p ibc

# Step 2: Run the first command with updated token identifier and node URL
namadac ibc-gen-shielded --target "$recipientAddress" --token transfer/channel-4280/uusdc --amount "$amount" --output-folder-path ./ibc --channel-id "$namadaChannel" --node https://rpc-namada.kintsugi-nodes.com --chain-id shielded-expedition.88f17d1d14 --port-id transfer

# Assuming there is now only one file in the './ibc' directory, we find it
generatedFile=$(find ibc -type f | head -n 1)

if [ ! -s "$generatedFile" ]; then
    echo "Error: The output file is empty or was not created."
    exit 1
fi

# Step 3: Extract the memo from the generated file
memo=$(<"$generatedFile")

# Step 4: Handle the password prompt for the last command using expect
capturedOutput=$(expect <<EOF
# Run the second command with the extracted memo
spawn osmosisd tx ibc-transfer transfer "$osmosisChannel" "$recipientAddress" "${amount}transfer/channel-4280/uusdc" --from "$senderAddress" --yes --fees 3000uosmo --node https://rpc.testnet.osmosis.zone:443 --chain-id osmo-test-5 --memo "$memo"
# Look for the password prompt
expect "Enter keyring passphrase:"
# Provide the password
send "$password\r"
# Wait for the command to complete
expect eof
EOF
)

# Echo the captured output or process it as needed
echo "$capturedOutput"

# Be cautious with sensitive information, especially when echoing the output that may contain it.
