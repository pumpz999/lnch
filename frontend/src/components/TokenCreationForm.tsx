import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useWallet } from '@solana/wallet-adapter-react';

interface TokenDetails {
  name: string;
  symbol: string;
  totalSupply: number;
  logoFile: File | null;
}

const TokenCreationForm: React.FC = () => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>({
    name: '',
    symbol: '',
    totalSupply: 0,
    logoFile: null
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ethereumContext = useWeb3React();
  const solanaWallet = useWallet();

  const validateTokenDetails = (): boolean => {
    const errors: string[] = [];

    // Name validation
    if (tokenDetails.name.length < 3 || tokenDetails.name.length > 30) {
      errors.push('Token name must be between 3-30 characters');
    }

    // Symbol validation
    if (!/^[A-Z]{3,5}$/.test(tokenDetails.symbol)) {
      errors.push('Symbol must be 3-5 uppercase letters');
    }

    // Supply validation
    if (tokenDetails.totalSupply <= 0 || tokenDetails.totalSupply > 1_000_000_000) {
      errors.push('Total supply must be between 1 and 1 billion');
    }

    // Logo validation
    if (!tokenDetails.logoFile) {
      errors.push('Logo is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateTokenDetails()) {
      setIsLoading(false);
      return;
    }

    try {
      // Detect active blockchain
      const activeChain = ethereumContext.active ? 'ethereum' : 
                          solanaWallet.connected ? 'solana' : null;

      if (!activeChain) {
        throw new Error('Please connect a wallet');
      }

      // Upload logo to IPFS (using NFT.storage)
      const logoUrl = await uploadLogoToIPFS(tokenDetails.logoFile!);

      // Prepare token creation payload
      const tokenPayload = {
        ...tokenDetails,
        logoUrl,
        chain: activeChain
      };

      // Call backend to create token
      const response = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': activeChain === 'ethereum' 
            ? ethereumContext.account! 
            : solanaWallet.publicKey!.toBase58()
        },
        body: JSON.stringify(tokenPayload)
      });

      if (!response.ok) {
        throw new Error('Token creation failed');
      }

      // Success handling
      alert('Token created successfully!');
    } catch (error) {
      console.error('Token creation error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {validationErrors.length > 0 && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700">Token Name</label>
        <input
          type="text"
          value={tokenDetails.name}
          onChange={(e) => setTokenDetails({...tokenDetails, name: e.target.value})}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter token name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Token Symbol</label>
        <input
          type="text"
          value={tokenDetails.symbol}
          onChange={(e) => setTokenDetails({...tokenDetails, symbol: e.target.value.toUpperCase()})}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter token symbol (e.g., BOLT)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Total Supply</label>
        <input
          type="number"
          value={tokenDetails.totalSupply}
          onChange={(e) => setTokenDetails({...tokenDetails, totalSupply: Number(e.target.value)})}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter total token supply"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Token Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTokenDetails({
            ...tokenDetails, 
            logoFile: e.target.files ? e.target.files[0] : null
          })}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {isLoading ? 'Creating Token...' : 'Create Token'}
      </button>
    </form>
  );
};

// Utility function for IPFS upload
async function uploadLogoToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.nft.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NFT_STORAGE_KEY}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Logo upload failed');
  }

  const result = await response.json();
  return `https://ipfs.io/ipfs/${result.value.cid}`;
}

export default TokenCreationForm;
