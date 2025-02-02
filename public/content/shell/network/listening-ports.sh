#!/bin/bash

set -euo pipefail

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Function to print usage
print_usage() {
    cat << EOF
Usage: 
  Direct: $(basename "$0") [OPTIONS]
  Piped:  curl ... | bash -s -- [OPTIONS]

Lists all TCP/UDP ports in LISTEN state.

Options:
  -h, --help     Show this help message
  -4             Show only IPv4 ports
  -6             Show only IPv6 ports

Examples:
  Local:  ./listening-ports.sh -4
  Remote: curl --silent https://veriscript.sh/public/content/shell/network/listening-ports.sh | bash -s -- -4
EOF
}

# Ensure script is safe to pipe to bash
if [ -z "${BASH_VERSION:-}" ]; then
    echo "Error: This script requires bash" >&2
    exit 1
fi

# Parse command line arguments
# Arguments will be available via bash -s -- arg1 arg2
IPV=""
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            print_usage
            exit 0
            ;;
        -4)
            IPV="-4"
            ;;
        -6)
            IPV="-6"
            ;;
        *)
            echo "Error: Unknown option $1"
            print_usage
            exit 1
            ;;
    esac
    shift
done

# Main logic
if command_exists ss; then
    echo "Using 'ss' to list all listening ports:"
    ss $IPV -tuln
elif command_exists netstat; then
    echo "Using 'netstat' to list all listening ports:"
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        netstat $IPV -tuln
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        netstat -an | grep LISTEN
    else
        echo "Error: Unsupported operating system" >&2
        exit 1
    fi
elif command_exists lsof; then
    echo "Using 'lsof' to list all listening ports:"
    lsof -nP -iTCP -sTCP:LISTEN
else
    echo "Error: No supported tool (ss, netstat, or lsof) found to list listening ports." >&2
    exit 1
fi