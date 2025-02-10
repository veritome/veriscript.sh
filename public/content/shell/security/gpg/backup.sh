#!/bin/bash

# Script: backup_gpg_key.sh
# Description: This script allows the user to backup a selected GPG key (private and public)
#              by first listing available keys, then prompting for a backup destination folder.

# List GPG secret keys
echo "Listing available GPG keys:"
key_count=0
declare -A key_map
declare -A user_info_map

while IFS=: read -r type rest; do
    if [[ $type == "sec" ]]; then
        current_key=$(echo "$rest" | cut -d: -f4)
        key_count=$((key_count+1))
        key_map[$key_count]=$current_key
    elif [[ $type == "uid" && -n $current_key ]]; then
        # Extract name and email from the uid line
        user_info=$(echo "$rest" | cut -d: -f9)
        user_info_map[$current_key]=$user_info
        echo "$key_count) ${user_info_map[$current_key]} ($current_key)"
    fi
done < <(gpg --list-secret-keys --with-colons)

# Validate that keys exist
if [ "$key_count" -eq 0 ]; then
    echo "No GPG keys found. Please generate or import keys first."
    exit 1
fi

# Ask the user to select a key by number
read -p "Please select the number of the key you want to back up: " selection

# Validate input selection
if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "$key_count" ]; then
    echo "Invalid selection. Please run the script again."
    exit 1
fi

# Get the selected key ID
selected_key="${key_map[$selection]}"
selected_user="${user_info_map[$selected_key]}"

echo "You selected: $selected_user ($selected_key)"

# Prompt for backup destination folder
read -p "Enter the full path to the folder where you want to back up the key: " backup_folder

# Validate the folder path
if [ ! -d "$backup_folder" ]; then
    echo "Error: The specified folder does not exist."
    exit 1
fi

# Backup private key
echo "Backing up private key..."
gpg --export-secret-keys --armor --output "$backup_folder/${selected_key}_private_key.asc" "$selected_key"
if [ $? -eq 0 ]; then
    echo "Private key backed up successfully to $backup_folder/${selected_key}_private_key.asc"
else
    echo "Error: Failed to back up private key."
    exit 1
fi

# Backup public key
echo "Backing up public key..."
gpg --export --armor --output "$backup_folder/${selected_key}_public_key.asc" "$selected_key"
if [ $? -eq 0 ]; then
    echo "Public key backed up successfully to $backup_folder/${selected_key}_public_key.asc"
else
    echo "Error: Failed to back up public key."
    exit 1
fi

# Function to check for existing revocation certificate
check_revocation_cert() {
    local key_id=$1
    if gpg --list-packets ~/.gnupg/openpgp-revocs.d/${key_id}.rev >/dev/null 2>&1; then
        return 0  # Certificate exists
    else
        return 1  # Certificate does not exist
    fi
}

# Handle revocation certificate
if check_revocation_cert "$selected_key"; then
    echo "Found existing revocation certificate. Backing it up..."
    cp ~/.gnupg/openpgp-revocs.d/${selected_key}.rev "$backup_folder/${selected_key}_revocation_cert.asc"
    if [ $? -eq 0 ]; then
        echo "Existing revocation certificate backed up to $backup_folder/${selected_key}_revocation_cert.asc"
    else
        echo "Error: Failed to copy existing revocation certificate."
        exit 1
    fi
else
    read -p "No existing revocation certificate found. Would you like to generate and back up one? (y/n): " revocation_choice
    if [ "$revocation_choice" == "y" ]; then
        echo "Generating revocation certificate..."
        gpg --output "$backup_folder/${selected_key}_revocation_cert.asc" --gen-revoke "$selected_key"
        if [ $? -eq 0 ]; then
            echo "Revocation certificate generated and backed up successfully to $backup_folder/${selected_key}_revocation_cert.asc"
        else
            echo "Error: Failed to generate revocation certificate."
            exit 1
        fi
    fi
fi

echo "Backup process complete."
