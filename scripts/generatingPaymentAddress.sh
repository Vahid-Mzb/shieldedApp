#!/bin/bash

# Define the array with 3 elements
myArray=("$@")

# Check if exactly 3 arguments are provided
if [ "${#myArray[@]}" -ne 2 ]; then
    echo "Error: You must provide exactly 2 arguments."
    exit 1
fi

# Use command substitution to capture the output of expect
capturedOutput=$(namadaw gen-payment-addr --key "${myArray[0]}" --alias "${myArray[1]}")


# Now, you can do something with the capturedOutput
echo "$capturedOutput"

# Note: This will echo the output to the terminal, which you might not want for sensitive information.
# Instead, consider processing the output as needed by your security requirements.
