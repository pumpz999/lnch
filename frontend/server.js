#!/usr/bin/env node
import { createServer } from 'http'

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Frontend Service')
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`)
})
