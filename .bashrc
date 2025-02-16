# Source .profile if it exists
if [ -f ~/.profile ]; then
  source ~/.profile
fi

# Enable bash-specific features
if [ -n "$BASH_VERSION" ]; then
  # Command completion
  if [ -f /etc/bash_completion ]; then
    source /etc/bash_completion
  fi
fi

# Turbo and NPM configurations
alias turbo='npx turbo'
