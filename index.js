#!/usr/bin/env node
console.log('Token Launchpad Project Initialized')

// Simple server to verify setup
import { createServer } from 'http'

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Token Launchpad Service Running')
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
