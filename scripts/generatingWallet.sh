#!/bin/bash

# Define the array with 3 elements
myArray=("$@")

# Check if exactly 3 arguments are provided
if [ "${#myArray[@]}" -ne 3 ]; then
    echo "Error: You must provide exactly 3 arguments."
    exit 1
fi

# Use command substitution to capture the output of expect
capturedOutput=$(expect <<EOF
spawn namadaw gen --alias "${myArray[0]}"
expect "Password:"
send "${myArray[1]}\r"
expect "Retype password:"
send "${myArray[2]}\r"
expect eof
EOF
)

# Now, you can do something with the capturedOutput
echo "$capturedOutput"

# Note: This will echo the output to the terminal, which you might not want for sensitive information.
# Instead, consider processing the output as needed by your security requirements.
