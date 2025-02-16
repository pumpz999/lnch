#!/usr/bin/env node
import { createServer } from 'http'

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Backend Service')
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
