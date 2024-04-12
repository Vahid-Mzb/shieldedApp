#!/bin/bash

# Check if a block number argument is provided
if [ -z "$1" ]; then
  echo "Error: Block number argument is required."
  exit 1
fi

# Run the command with the provided block number
namadac shielded-sync --from-height "$1" --node https://rpc-namada.kintsugi-nodes.com/
