#!/bin/bash

# Define the array with 6 elements: sender address, amount, type of token, name of channel, receiver address, password
myArray=("$@")

# Check if exactly 6 arguments are provided
if [ "${#myArray[@]}" -ne 6 ]; then
    echo "Error: You must provide exactly 6 arguments."
    echo "Usage: $0 sender_address amount token_type channel_name receiver_address password"
    exit 1
fi

# Use command substitution to capture the output of expect
capturedOutput=$(expect <<EOF
# Set timeout to 30 seconds
set timeout 30

# Run the namadac ibc-transfer command with the provided arguments from the array
spawn namadac ibc-transfer --source "${myArray[0]}" --amount "${myArray[1]}" --token "${myArray[2]}" --channel-id "${myArray[3]}" --receiver "${myArray[4]}" --node https://rpc-namada.kintsugi-nodes.com/
# Handle the password prompt
expect "Enter your decryption password:"
send "${myArray[5]}\r"
# Wait for the command to complete
expect eof
EOF
)

# Output captured from the command execution
echo "$capturedOutput"

# Be cautious with sensitive information, especially when echoing the output that may contain it.
