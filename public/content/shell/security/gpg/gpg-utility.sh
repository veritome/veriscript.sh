#!/bin/bash

# Script: gpg-utility.sh
# Description: An educational utility for managing GPG keys
#              This script helps users generate and backup GPG keys
#              while explaining the process and concepts.
#
# Usage:
#   ./gpg-utility.sh

# Check if GPG is installed
if ! command -v gpg &> /dev/null; then
    echo "Error: GPG (GNU Privacy Guard) is not installed."
    echo "GPG is a free implementation of the OpenPGP standard that allows you"
    echo "to encrypt and sign your data and communications."
    echo "Please install it using your package manager and try again."
    echo "For example: sudo apt install gnupg (Debian/Ubuntu)"
    echo "             sudo dnf install gnupg (Fedora)"
    echo "             brew install gnupg (macOS with Homebrew)"
    exit 1
fi

# Function to display educational information about GPG
display_gpg_info() {
    echo "======================= ABOUT GPG ======================="
    echo "GPG (GNU Privacy Guard) is a cryptographic software that"
    echo "implements the OpenPGP standard. It allows you to:"
    echo ""
    echo "1. Encrypt data so only intended recipients can read it"
    echo "2. Digitally sign data to verify its authenticity"
    echo "3. Manage a web of trust through key signing"
    echo ""
    echo "GPG uses a pair of keys:"
    echo "- Public key: Share this with others so they can encrypt"
    echo "  messages for you or verify your signatures."
    echo "- Private key: Keep this secret! It's used to decrypt"
    echo "  messages sent to you and to sign your communications."
    echo ""
    echo "A revocation certificate allows you to invalidate your key"
    echo "if it's ever compromised or lost."
    echo "========================================================="
    echo ""
}

# Function to generate a new GPG key
generate_gpg_key() {
    echo "================ GENERATING A NEW GPG KEY ================"
    echo "We'll now create a new GPG key pair for you."
    echo ""
    echo "This process will:"
    echo "1. Create a public key that others can use to encrypt messages to you"
    echo "2. Create a private key that you'll use to decrypt those messages"
    echo "3. Associate your identity (name and email) with these keys"
    echo ""
    
    # Get user information
    read -p "Full Name (e.g., John Doe): " name
    read -p "Email Address (e.g., john.doe@example.com): " email
    
    echo ""
    echo "Key expiration: It's recommended to set an expiration date for security reasons."
    echo "If your key is ever compromised and you've lost the ability to revoke it,"
    echo "an expiration date ensures it won't be valid forever."
    read -p "Key expiration (e.g., 1y for 1 year, 2y for 2 years, 0 for no expiration): " expiration

    # Validate user inputs
    if [ -z "$name" ] || [ -z "$email" ]; then
        echo "Error: Both Full Name and Email Address are required!"
        return 1
    fi

    echo ""
    echo "Generating a 2048-bit RSA key pair for $name <$email> with expiration of $expiration..."
    echo "This is a standard key size that balances security and compatibility."
    echo ""
    
    # Generate the GPG key
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
        echo ""
        echo "Success! Your GPG key has been generated."
        echo ""
        echo "Your new key is now stored in your GPG keyring (~/.gnupg directory)."
        echo "You can view your keys anytime with: gpg --list-keys"
        echo ""
        echo "Next steps you might want to consider:"
        echo "1. Backup your keys (use the backup option in this utility)"
        echo "2. Create a revocation certificate (also part of the backup process)"
        echo "3. Share your public key with others (gpg --export --armor your@email.com)"
    else
        echo "Error: There was an issue generating your GPG key."
        return 1
    fi
    
    echo "========================================================="
}

# Function to backup GPG keys
backup_gpg_keys() {
    echo "================ BACKING UP GPG KEYS ================"
    echo "Backing up your GPG keys is crucial for several reasons:"
    echo "1. If you lose access to your computer, you can restore your keys"
    echo "2. Without your private key, you cannot decrypt messages sent to you"
    echo "3. If you lose your key without having a revocation certificate,"
    echo "   others might continue encrypting messages you can't decrypt"
    echo ""
    
    # List GPG secret keys
    echo "Listing your available GPG keys:"
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
        return 1
    fi

    # Ask the user to select a key by number
    read -p "Please select the number of the key you want to back up: " selection

    # Validate input selection
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "$key_count" ]; then
        echo "Invalid selection. Please try again."
        return 1
    fi

    # Get the selected key ID
    selected_key="${key_map[$selection]}"
    selected_user="${user_info_map[$selected_key]}"

    echo "You selected: $selected_user ($selected_key)"
    echo ""
    
    # Prompt for backup destination folder
    echo "The backup will create encrypted ASCII-armored files that can be safely stored."
    read -p "Enter the full path to the folder where you want to back up the key: " backup_folder

    # Validate the folder path
    if [ ! -d "$backup_folder" ]; then
        echo "Error: The specified folder does not exist."
        return 1
    fi

    # Backup private key
    echo ""
    echo "Backing up private key..."
    echo "The private key is the most critical component to protect."
    echo "It allows decryption of messages sent to you and signing of your communications."
    gpg --export-secret-keys --armor --output "$backup_folder/${selected_key}_private_key.asc" "$selected_key"
    if [ $? -eq 0 ]; then
        echo "Private key backed up successfully to $backup_folder/${selected_key}_private_key.asc"
    else
        echo "Error: Failed to back up private key."
        return 1
    fi

    # Backup public key
    echo ""
    echo "Backing up public key..."
    echo "Your public key can be freely shared with others who want to send you"
    echo "encrypted messages or verify your signatures."
    gpg --export --armor --output "$backup_folder/${selected_key}_public_key.asc" "$selected_key"
    if [ $? -eq 0 ]; then
        echo "Public key backed up successfully to $backup_folder/${selected_key}_public_key.asc"
    else
        echo "Error: Failed to back up public key."
        return 1
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
    echo ""
    echo "Checking for revocation certificate..."
    echo "A revocation certificate is used to invalidate your key if it's ever"
    echo "compromised or if you lose access to your private key."
    
    if check_revocation_cert "$selected_key"; then
        echo "Found existing revocation certificate. Backing it up..."
        cp ~/.gnupg/openpgp-revocs.d/${selected_key}.rev "$backup_folder/${selected_key}_revocation_cert.asc"
        if [ $? -eq 0 ]; then
            echo "Existing revocation certificate backed up to $backup_folder/${selected_key}_revocation_cert.asc"
        else
            echo "Error: Failed to copy existing revocation certificate."
            return 1
        fi
    else
        echo "No existing revocation certificate found."
        echo "A revocation certificate is crucial if your key is ever compromised."
        read -p "Would you like to generate and back up one? (y/n): " revocation_choice
        if [ "$revocation_choice" == "y" ]; then
            echo "Generating revocation certificate..."
            echo "This will create a file that can be used to tell others that your key"
            echo "should no longer be trusted. Store this in a secure, separate location."
            gpg --output "$backup_folder/${selected_key}_revocation_cert.asc" --gen-revoke "$selected_key"
            if [ $? -eq 0 ]; then
                echo "Revocation certificate generated and backed up successfully to $backup_folder/${selected_key}_revocation_cert.asc"
            else
                echo "Error: Failed to generate revocation certificate."
                return 1
            fi
        fi
    fi

    echo ""
    echo "Backup process complete."
    echo ""
    echo "IMPORTANT SECURITY ADVICE:"
    echo "1. Store these backup files in a secure location, preferably offline"
    echo "2. Consider using multiple backup locations for redundancy"
    echo "3. The private key should be protected with strong access controls"
    echo "4. Store the revocation certificate separately from your private key"
    echo "========================================================="
}

# Main menu function
main_menu() {
    clear
    echo "========================================================"
    echo "                GPG KEY MANAGEMENT UTILITY              "
    echo "========================================================"
    echo "This utility will help you manage your GPG keys while"
    echo "explaining the concepts and processes involved."
    echo ""
    
    display_gpg_info
    
    echo "Please select an option:"
    echo "1) Generate a new GPG key pair"
    echo "2) Backup existing GPG keys"
    echo "3) Exit"
    echo ""
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            clear
            generate_gpg_key
            ;;
        2)
            clear
            backup_gpg_keys
            ;;
        3)
            echo "Exiting. Thank you for using the GPG Key Management Utility!"
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to return to the main menu..."
    main_menu
}

# Start the program
main_menu 