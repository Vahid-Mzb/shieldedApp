#!/bin/bash

# Check if an argument is provided
if [ "$#" -ne 1 ]; then
    echo "Error: You must provide exactly one argument."
    exit 1
fi

# The argument is the key name
keyName="$1"

# Run the osmosisd keys add command and capture its output
output=$(osmosisd keys add "$keyName" --keyring-backend test --keyring-dir ./.osmosisd/ 2>&1)

# Check for success or failure
if [ $? -eq 0 ]; then
    echo "Command succeeded. Output:"
    echo "$output"
else
    echo "Command failed. Output:"
    echo "$output"
fi

