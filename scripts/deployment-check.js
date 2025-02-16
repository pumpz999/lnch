#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

class DeploymentValidator {
  static runPreDeploymentChecks() {
    console.log('🚀 Starting Deployment Validation')
    
    this.checkNodeVersion()
    this.checkEnvironmentVariables()
    this.checkSystemRequirements()
    this.checkBuildDependencies()
  }

  static checkNodeVersion() {
    const currentVersion = process.version
    const majorVersion = parseInt(currentVersion.replace('v', '').split('.')[0])

    console.log(`Current Node.js version: ${currentVersion}`)
    
    if (majorVersion < 18) {
      throw new Error(`Node.js version must be >= 18. Current: ${currentVersion}`)
    }
    console.log('✅ Node.js version validated')
  }

  static checkEnvironmentVariables() {
    const requiredVars = [
      'DATABASE_URL',
      'OPENAI_API_KEY'
    ]

    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        console.warn(`⚠️ Missing environment variable: ${varName}`)
      }
    })

    console.log('✅ Environment variables checked')
  }

  static checkSystemRequirements() {
    try {
      // Check available disk space
      const diskSpace = execSync('df -h .').toString()
      console.log('Disk Space:\n', diskSpace)

      // Check system memory
      const memoryInfo = execSync('free -h').toString()
      console.log('Memory Info:\n', memoryInfo)
    } catch (error) {
      console.warn('⚠️ Unable to retrieve system requirements')
    }
  }

  static checkBuildDependencies() {
    const requiredDependencies = [
      'prisma',
      'typescript',
      'express'
    ]

    requiredDependencies.forEach(dep => {
      try {
        require.resolve(dep)
        console.log(`✅ ${dep} is installed`)
      } catch (error) {
        console.warn(`⚠️ ${dep} is not installed`)
      }
    })
  }
}

// Ensure the script can be run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    DeploymentValidator.runPreDeploymentChecks()
    console.log('🎉 Deployment Validation Complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Deployment Validation Failed:', error.message)
    process.exit(1)
  }
}
