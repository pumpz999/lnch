#!/usr/bin/env node
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

class SecretManager {
  static generateSecureSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex')
  }

  static createSecureEnvFile() {
    const secrets = {
      // OpenAI API Configuration
      OPENAI_API_KEY: this.generateSecureSecret(16),
      
      // Database Credentials
      DATABASE_USERNAME: `launchpad_user_${this.generateSecureSecret(8)}`,
      DATABASE_PASSWORD: this.generateSecureSecret(24),
      
      // Blockchain RPC Endpoints
      ETHEREUM_RPC_URL: `https://mainnet.infura.io/v3/${this.generateSecureSecret(16)}`,
      SOLANA_RPC_URL: `https://api.mainnet-beta.solana.com/${this.generateSecureSecret(12)}`,
      
      // External API Keys
      GOOGLE_VISION_API_KEY: this.generateSecureSecret(20),
      MICROSOFT_CONTENT_MOD_KEY: this.generateSecureSecret(20),
      GOOGLE_PERSPECTIVE_API_KEY: this.generateSecureSecret(20),
      
      // Fraud Detection Configurations
      FRAUD_SCORE_THRESHOLD: '0.5',
      SPAM_DETECTION_THRESHOLD: '0.3'
    }

    // Generate .env file
    const envContent = Object.entries(secrets)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    const envPath = path.resolve(process.cwd(), '.env')
    fs.writeFileSync(envPath, envContent)

    console.log('Secure .env file generated successfully')
    return secrets
  }

  static setupPostgresDatabase(secrets) {
    return `
# PostgreSQL Database Setup Script
CREATE USER ${secrets.DATABASE_USERNAME} WITH PASSWORD '${secrets.DATABASE_PASSWORD}';
CREATE DATABASE token_launchpad;
GRANT ALL PRIVILEGES ON DATABASE token_launchpad TO ${secrets.DATABASE_USERNAME};
`
  }
}

// Execute secret generation
const generatedSecrets = SecretManager.createSecureEnvFile()
const postgresSetupScript = SecretManager.setupPostgresDatabase(generatedSecrets)

// Write PostgreSQL setup script
fs.writeFileSync(path.resolve(process.cwd(), 'database-setup.sql'), postgresSetupScript)

console.log('Secrets and database configuration generated successfully')
