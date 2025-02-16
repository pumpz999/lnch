#!/usr/bin/env node
import { spawn } from 'child_process'

// Minimal dev script to start services
const startFrontend = spawn('node', ['frontend/server.js'], { stdio: 'inherit' })
const startBackend = spawn('node', ['backend/server.js'], { stdio: 'inherit' })

process.on('SIGINT', () => {
  startFrontend.kill()
  startBackend.kill()
})
