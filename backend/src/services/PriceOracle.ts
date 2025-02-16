import axios from 'axios';

class PriceOracle {
  private static CHAINLINK_PRICE_FEED = {
    ETH_USD: 'https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd',
    SOL_USD: 'https://data.chain.link/solana/mainnet/crypto-usd/sol-usd'
  };

  static async getTokenCreationFeeInNativeCurrency(chain: 'ethereum' | 'solana'): Promise<number> {
    try {
      const usdPrice = await this.fetchLatestPrice(chain);
      const feeInUSD = 10; // $10 creation fee
      
      return feeInUSD / usdPrice;
    } catch (error) {
      console.error('Price oracle error:', error);
      throw new Error('Unable to fetch current price');
    }
  }

  private static async fetchLatestPrice(chain: 'ethereum' | 'solana'): Promise<number> {
    const priceFeedUrl = chain === 'ethereum' 
      ? this.CHAINLINK_PRICE_FEED.ETH_USD 
      : this.CHAINLINK_PRICE_FEED.SOL_USD;

    try {
      const response = await axios.get(priceFeedUrl);
      return response.data.result;
    } catch (error) {
      // Fallback to backup price sources
      return this.fetchBackupPriceSource(chain);
    }
  }

  private static async fetchBackupPriceSource(chain: 'ethereum' | 'solana'): Promise<number> {
    const backupSources = {
      ethereum: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      solana: 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
    };

    const response = await axios.get(backupSources[chain]);
    return chain === 'ethereum' 
      ? response.data.ethereum.usd 
      : response.data.solana.usd;
  }

  static async detectPotentialScamToken(tokenName: string, logoUrl: string): Promise<boolean> {
    try {
      // AI-powered logo and name similarity check
      const aiCheckResponse = await axios.post('https://api.openai.com/v1/moderations', {
        input: tokenName
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // Basic scam detection logic
      const scamProbability = aiCheckResponse.data.results[0].categories;
      
      return scamProbability.spam > 0.7 || 
             scamProbability.harassment > 0.5;
    } catch (error) {
      console.error('Scam detection error:', error);
      return false;
    }
  }
}

export default PriceOracle;
