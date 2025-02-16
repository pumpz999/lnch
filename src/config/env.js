import dotenv from 'dotenv'
import { z } from 'zod'

// Load environment variables
dotenv.config()

// Robust environment variable validation
const EnvSchema = z.object({
  // API Keys
  OPENAI_API_KEY: z.string().min(10, "Invalid OpenAI API Key"),
  NFT_STORAGE_API_KEY: z.string().min(10, "Invalid NFT Storage API Key"),
  
  // Blockchain Configuration
  ETHEREUM_NETWORK: z.enum(['mainnet', 'sepolia', 'goerli']),
  SOLANA_NETWORK: z.enum(['mainnet', 'devnet', 'testnet']),
  
  // Wallet Verification
  MAX_TOKENS_PER_WALLET: z.coerce.number().min(1).max(10),
  TOKEN_CREATION_COOLDOWN_HOURS: z.coerce.number().min(1).max(168),
  
  // Security Thresholds
  SIMILARITY_THRESHOLD: z.coerce.number().min(0).max(1),
  SPAM_DETECTION_SCORE: z.coerce.number().min(0).max(1)
})

// Validate and export configuration
let validatedConfig;
try {
  validatedConfig = EnvSchema.parse(process.env)
} catch (error) {
  console.error('Invalid environment configuration:', error.errors)
  process.exit(1)
}

export default validatedConfig
