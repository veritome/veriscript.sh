#!/bin/bash

# Script: generate_ssh_key.sh
# Description: Generates SSH key pair with modern security standards

# Check if ssh-keygen is available
if ! command -v ssh-keygen &> /dev/null; then
    echo "Error: ssh-keygen is not installed. Please install openssh-client."
    exit 1
fi

# Ask for user details
read -p "Enter your email address: " email
read -p "Enter key name (default: id_ed25519): " key_name
key_name=${key_name:-id_ed25519}

# Set the key path
key_path="$HOME/.ssh/$key_name"

# Check if key already exists
if [ -f "$key_path" ]; then
    read -p "Key already exists. Overwrite? (y/N): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Aborting key generation."
        exit 1
    fi
fi

# Create .ssh directory if it doesn't exist
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

# Generate Ed25519 key (modern, secure standard)
echo "Generating Ed25519 SSH key..."
ssh-keygen -t ed25519 -C "$email" -f "$key_path"

# Set appropriate permissions
chmod 600 "$key_path"
chmod 644 "$key_path.pub"

echo "SSH key pair generated successfully!"
echo "Private key: $key_path"
echo "Public key: $key_path.pub"