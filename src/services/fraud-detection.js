import axios from 'axios'
import config from '../config/env.js'

class FraudDetectionService {
  // AI-powered logo similarity check
  static async checkLogoSimilarity(logoUrl) {
    try {
      const response = await axios.post('https://api.openai.com/v1/embeddings', {
        input: logoUrl,
        model: "text-embedding-ada-002"
      }, {
        headers: {
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      // Compare embedding with known fraudulent logos
      const similarity = this.calculateSimilarity(response.data.data[0].embedding)
      
      return {
        isSuspicious: similarity > config.SIMILARITY_THRESHOLD,
        similarityScore: similarity
      }
    } catch (error) {
      console.error('Logo similarity check failed:', error)
      return { 
        isSuspicious: false, 
        error: 'Fraud detection service unavailable' 
      }
    }
  }

  // Token name spam detection
  static async detectSpam(tokenName) {
    try {
      const response = await axios.post('https://api.openai.com/v1/moderations', {
        input: tokenName
      }, {
        headers: {
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      const spamProbability = response.data.results[0].categories.spam
      
      return {
        isSpam: spamProbability > config.SPAM_DETECTION_SCORE,
        spamScore: spamProbability
      }
    } catch (error) {
      console.error('Spam detection failed:', error)
      return { 
        isSpam: false, 
        error: 'Spam detection service unavailable' 
      }
    }
  }

  // Placeholder for similarity calculation
  static calculateSimilarity(embedding) {
    // TODO: Implement actual similarity calculation
    return 0.5
  }
}

export default FraudDetectionService
