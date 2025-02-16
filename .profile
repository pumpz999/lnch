# Set up basic environment
export PATH=$HOME/.npm-global/bin:$PATH
export NODE_PATH=$HOME/.npm-global/lib/node_modules

# Alias for convenience
alias ls='ls --color=auto'
alias grep='grep --color=auto'

# Prevent npm permission issues
export npm_config_unsafe_perm=true

# Simple prompt
PS1='$ '

# Ensure Node.js and npm are in path
export PATH="/usr/local/bin:$PATH"
