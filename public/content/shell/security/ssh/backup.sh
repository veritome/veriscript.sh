#!/bin/bash

# Script: backup_ssh_key.sh
# Description: Backs up SSH keys to a specified location

# List SSH keys in ~/.ssh
echo "Available SSH keys:"
key_count=0
declare -A key_map

while IFS= read -r file; do
    if [[ $file =~ ^id_.+$ && ! $file =~ \.pub$ && ! $file =~ \.rev$ ]]; then
        key_count=$((key_count+1))
        key_map[$key_count]=$file
        echo "$key_count) $file"
    fi
done < <(cd ~/.ssh && ls)

# Validate that keys exist
if [ "$key_count" -eq 0 ]; then
    echo "No SSH keys found. Please generate keys first."
    exit 1
fi

# Ask user to select a key
read -p "Please select the number of the key you want to back up: " selection

# Validate input selection
if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "$key_count" ]; then
    echo "Invalid selection. Please run the script again."
    exit 1
fi

# Get the selected key name
selected_key="${key_map[$selection]}"
echo "You selected: $selected_key"

# Prompt for backup destination folder
read -p "Enter the full path to the folder where you want to back up the key: " backup_folder

# Validate the folder path
if [ ! -d "$backup_folder" ]; then
    echo "Error: The specified folder does not exist."
    exit 1
fi

# Create timestamped backup folder
timestamp=$(date +"%Y%m%d_%H%M%S")
backup_dir="${backup_folder}/ssh_backup_${timestamp}"
mkdir -p "$backup_dir"

# Backup private key
echo "Backing up private key..."
cp ~/.ssh/"$selected_key" "$backup_dir/"
chmod 600 "$backup_dir/$selected_key"

# Backup public key if it exists
if [ -f ~/.ssh/"${selected_key}.pub" ]; then
    echo "Backing up public key..."
    cp ~/.ssh/"${selected_key}.pub" "$backup_dir/"
    chmod 644 "$backup_dir/${selected_key}.pub"
fi

# Backup SSH config if it exists
if [ -f ~/.ssh/config ]; then
    echo "Backing up SSH config..."
    cp ~/.ssh/config "$backup_dir/config"
    chmod 600 "$backup_dir/config"
fi

echo "Backup complete at: $backup_dir"