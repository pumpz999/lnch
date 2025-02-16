import type { AppProps } from 'next/app'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import '../styles/globals.css'

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider)
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
