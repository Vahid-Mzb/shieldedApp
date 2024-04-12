#!/bin/bash

# Define the array with 4 elements: [argument, password, retype password, mnemonic code]
myArray=("$@")

# Check if exactly 4 arguments are provided
if [ "${#myArray[@]}" -ne 4 ]; then
    echo "Error: You must provide exactly 4 arguments."
    exit 1
fi

# Use command substitution to capture the output of expect
capturedOutput=$(expect <<EOF
# Run the command with the alias argument
spawn namadaw derive --alias "${myArray[0]}"
# Automate the password input
expect "Password:"
send "${myArray[1]}\r"
expect "Retype password:"
send "${myArray[2]}\r"
# Automate input of the mnemonic code
expect "Input mnemonic code:"
send "${myArray[3]}\r"
# Wait for the command to complete
expect eof
EOF
)

# Now, you can do something with the capturedOutput
# Be cautious with sensitive information
echo "$capturedOutput"

# Note: Directly echoing the output might reveal sensitive information.
# Consider processing the output according to your security requirements.