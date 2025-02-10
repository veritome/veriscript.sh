## This shell script installs the latest version of nvm, using git,
## to the $TOOLS_DIR/.nvm directory, and adds the necessary lines to
## the .bashrc file to source the nvm.sh script and set the default
## node version to the latest LTS version.

# Check if nvm is already installed
if command -v nvm >/dev/null 2>&1; then
    echo "nvm is already installed."
    exit 0
fi

# Install nvm
echo "Installing nvm to $TOOLS_DIR ..."

TOOLS_DIR=$HOME/Tools
if [ ! -d $TOOLS_DIR ]; then
    mkdir $TOOLS_DIR
fi

NVM_DIR=$TOOLS_DIR/.nvm
git clone https://github.com/nvm-sh/nvm.git $NVM_DIR

cd $NVM_DIR
git checkout $(git describe --abbrev=0 --tags)

# Function to check if a line exists in .bashrc
line_exists() {
    grep -Fxq "$1" "$HOME/.bashrc"
}

# Add nvm to .bashrc only if not already present
NVM_CONFIG=(
    "## NVM"
    "## https://github.com/nvm-sh/nvm?tab=readme-ov-file#git-install"
    "export NVM_DIR=\"$HOME/.nvm\""
    "[ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\"  # This loads nvm"
    "[ -s \"$NVM_DIR/bash_completion\" ] && \. \"$NVM_DIR/bash_completion\"  # This loads nvm bash_completion"
)

for line in "${NVM_CONFIG[@]}"; do
    if ! line_exists "$line"; then
        echo "$line" >> "$HOME/.bashrc"
    fi
done

printf "=======================================\n\n"
echo "nvm has been installed. Please restart your terminal and install node using nvm."
printf "\nRun \`nvm install node && nvm use node\` to install the latest version of node.\n"