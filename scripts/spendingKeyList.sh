#!/bin/bash

# Run the 'namadaw list' command and capture the output
output=$(namadaw list)

# Use awk to extract the desired section and stop before "Known payment addresses:"
echo "$output" | awk '/Known shielded keys:/,/Known payment addresses:/{if (!/Known payment addresses:/) print}'
