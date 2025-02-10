#!/bin/bash

# Script: generate_gpg_key.sh
# Description: This script automates the process of generating a GPG key pair
#              for secure communication and file encryption.
#
# Prerequisites:
# - GPG (GNU Privacy Guard) must be installed on the system.
# - User should have an existing GPG keyring or the script will create one.
#
# Usage:
# - Run the script without any arguments to generate a default GPG key pair.
#   The key pair will be saved in the default keyring and can be used for
#   encryption, signing, and verification purposes.
#
# Example:
#   ./generate_gpg_key.sh

# Check if GPG is installed
if ! command -v gpg &> /dev/null
then
    echo "Error: GPG is not installed. Please install it and try again."
    exit 1
fi

# Ask for user details
echo "Let's generate your GPG key!"
echo "You will need to provide some details for the key."

# Get user information
read -p "Full Name (e.g., John Doe): " name
read -p "Email Address (e.g., john.doe@example.com): " email
read -p "Key expiration (e.g., 1y for 1 year, 0 for no expiration): " expiration

# Validate user inputs
if [ -z "$name" ] || [ -z "$email" ]; then
    echo "Error: Both Full Name and Email Address are required!"
    exit 1
fi

# Generate the GPG key
echo "Generating GPG key for $name <$email> with expiration of $expiration..."

gpg --batch --gen-key <<EOF
    Key-Type: 1
    Key-Length: 2048
    Name-Real: $name
    Name-Email: $email
    Expire-Date: $expiration
    %no-protection
    %commit
EOF

# Notify the user
if [ $? -eq 0 ]; then
    echo "GPG key generated successfully!"
    echo "You can now use this key for encryption and signing."
else
    echo "Error: There was an issue generating your GPG key."
    exit 1
fi
