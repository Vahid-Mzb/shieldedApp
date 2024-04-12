#!/bin/bash

# Run the 'namadaw list' command and capture the output
output=$(namadaw list)

# Use awk to extract the desired section and stop before "Known shielded keys:"
echo "$output" | awk '/Known transparent addresses:/,/Known shielded keys:/{if (!/Known shielded keys:/) print}'
