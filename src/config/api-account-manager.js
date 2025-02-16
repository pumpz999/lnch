import axios from 'axios'

class APIAccountManager {
  static async configureOpenAIAccount() {
    return {
      steps: [
        {
          name: 'Create OpenAI Account',
          url: 'https://platform.openai.com/signup',
          instructions: [
            'Go to OpenAI website',
            'Create a new account',
            'Generate API key in API Keys section',
            'Set up billing (if required for advanced features)'
          ]
        },
        {
          name: 'API Key Best Practices',
          recommendations: [
            'Use environment variables',
            'Enable IP restrictions',
            'Set up usage limits',
            'Rotate keys periodically'
          ]
        }
      ],
      validationEndpoint: 'https://api.openai.com/v1/engines'
    }
  }

  static async configureGoogleCloudAccount() {
    return {
      steps: [
        {
          name: 'Google Cloud Setup',
          url: 'https://cloud.google.com/resource-manager/docs/creating-managing-projects',
          instructions: [
            'Create a new Google Cloud Project',
            'Enable Vision API',
            'Enable Perspective API',
            'Create service account',
            'Generate API credentials'
          ]
        },
        {
          name: 'API Activation',
          apis: [
            'vision.googleapis.com',
            'commentanalyzer.googleapis.com'
          ]
        }
      ],
      validationEndpoints: {
        vision: 'https://vision.googleapis.com/v1/images:annotate',
        perspective: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze'
      }
    }
  }

  static async validateAPICredentials(apiName, credentials) {
    const validationStrategies = {
      openai: async () => {
        try {
          const response = await axios.get('https://api.openai.com/v1/engines', {
            headers: { 'Authorization': `Bearer ${credentials}` }
          })
          return response.status === 200
        } catch (error) {
          console.error('OpenAI API validation failed:', error)
          return false
        }
      },
      googleVision: async () => {
        try {
          const response = await axios.post('https://vision.googleapis.com/v1/images:annotate', {
            requests: [{
              image: { source: { imageUri: 'https://example.com/sample.jpg' } },
              features: [{ type: 'LABEL_DETECTION' }]
            }],
            key: credentials
          })
          return response.status === 200
        } catch (error) {
          console.error('Google Vision API validation failed:', error)
          return false
        }
      }
    }

    return validationStrategies[apiName] 
      ? await validationStrategies[apiName]()
      : false
  }
}

export default APIAccountManager
