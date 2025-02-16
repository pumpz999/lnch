import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

class DatabaseService {
  constructor() {
    this.prisma = new PrismaClient()
  }

  // Secure wallet registration with verification scoring
  async registerOrUpdateWallet(walletAddress, verificationData) {
    try {
      // Calculate verification score
      const verificationScore = this.calculateVerificationScore(verificationData)

      return this.prisma.user.upsert({
        where: { walletAddress },
        update: {
          verificationData,
          verificationScore,
          lastVerifiedAt: new Date()
        },
        create: {
          walletAddress,
          verificationData,
          verificationScore
        }
      })
    } catch (error) {
      console.error('Wallet registration failed:', error)
      throw new Error('Wallet registration failed')
    }
  }

  // Advanced fraud detection and token creation tracking
  async recordTokenCreation(tokenData, fraudDetectionResult) {
    try {
      // Begin transaction to ensure data consistency
      return this.prisma.$transaction(async (tx) => {
        // Check wallet's token creation history
        const userTokenCount = await tx.token.count({
          where: { creatorId: tokenData.creatorId }
        })

        // Prevent excessive token creation
        if (userTokenCount >= 5) {
          throw new Error('Maximum token creation limit reached')
        }

        // Create token with fraud scoring
        const token = await tx.token.create({
          data: {
            ...tokenData,
            fraudScore: fraudDetectionResult.overallScore,
            isVerified: fraudDetectionResult.overallScore < 0.3
          }
        })

        // Log fraud detection details
        await tx.fraudDetectionLog.create({
          data: {
            walletAddress: tokenData.creator.walletAddress,
            tokenName: tokenData.name,
            similarityScore: fraudDetectionResult.logoSimilarity,
            spamScore: fraudDetectionResult.nameSpamScore,
            isSuspicious: fraudDetectionResult.overallScore >= 0.3
          }
        })

        return token
      })
    } catch (error) {
      console.error('Token creation failed:', error)
      throw new Error('Token creation process failed')
    }
  }

  // Advanced verification score calculation
  calculateVerificationScore(verificationData) {
    let score = 0

    // Worldcoin verification
    if (verificationData.worldcoin?.verified) {
      score += 0.4
    }

    // Civic verification
    if (verificationData.civic?.verified) {
      score += 0.3
    }

    // Transaction history
    if (verificationData.transactionHistory?.transactionCount > 10) {
      score += 0.2
    }

    // Age of wallet
    const walletAge = (new Date() - new Date(verificationData.createdAt)) / (1000 * 60 * 60 * 24)
    if (walletAge > 180) {
      score += 0.1
    }

    return Math.min(score, 1)
  }

  // Comprehensive fraud detection aggregation
  async aggregateFraudDetection(walletAddress) {
    const fraudLogs = await this.prisma.fraudDetectionLog.findMany({
      where: { walletAddress },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const suspiciousCount = fraudLogs.filter(log => log.isSuspicious).length
    const averageSimilarityScore = fraudLogs.reduce((sum, log) => sum + log.similarityScore, 0) / fraudLogs.length

    return {
      suspiciousTokens: suspiciousCount,
      averageSimilarityScore,
      riskLevel: suspiciousCount > 3 ? 'HIGH' : suspiciousCount > 1 ? 'MEDIUM' : 'LOW'
    }
  }
}

export default new DatabaseService()
