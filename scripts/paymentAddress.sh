#!/bin/bash

# Run the 'namadaw list' command and capture the output
output=$(namadaw list)

# Use awk to start printing from "Known transparent addresses:" to the end of the output
echo "$output" | awk '/Known payment addresses:/,0'
