#!/usr/bin/env node
import * as readline from 'readline'
import * as fs from 'fs'
import * as path from 'path'

class SecretReviewManager {
  static async interactiveSecretReview() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const secrets = this.loadCurrentSecrets()
    const reviewedSecrets = {}

    const sensitiveKeys = [
      'OPENAI_API_KEY',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'ETHEREUM_RPC_URL',
      'SOLANA_RPC_URL',
      'GOOGLE_VISION_API_KEY',
      'MICROSOFT_CONTENT_MOD_KEY',
      'GOOGLE_PERSPECTIVE_API_KEY'
    ]

    for (const key of sensitiveKeys) {
      reviewedSecrets[key] = await this.promptForSecret(rl, key, secrets[key])
    }

    this.saveReviewedSecrets(reviewedSecrets)
    rl.close()
  }

  static loadCurrentSecrets() {
    const envPath = path.resolve(process.cwd(), '.env')
    const envContent = fs.readFileSync(envPath, 'utf-8')
    
    return envContent.split('\n').reduce((acc, line) => {
      const [key, value] = line.split('=')
      acc[key] = value
      return acc
    }, {})
  }

  static promptForSecret(rl, key, currentValue) {
    return new Promise((resolve) => {
      rl.question(`Review ${key} (current: ${this.maskSecret(currentValue)}). 
Enter new value (press enter to keep current): `, (input) => {
        resolve(input.trim() || currentValue)
      })
    })
  }

  static saveReviewedSecrets(secrets) {
    const envContent = Object.entries(secrets)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    const envPath = path.resolve(process.cwd(), '.env')
    fs.writeFileSync(envPath, envContent)
    
    console.log('Secrets updated successfully')
  }

  static maskSecret(secret, visibleChars = 4) {
    if (!secret) return 'N/A'
    return `${secret.slice(0, visibleChars)}${'*'.repeat(secret.length - visibleChars)}`
  }
}

SecretReviewManager.interactiveSecretReview()
