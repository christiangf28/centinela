import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function readApiKey() {
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8')
    const match = envFile.match(/ANTHROPIC_API_KEY=(.+)/)
    return match ? match[1].trim() : ''
  } catch { return '' }
}

const ANTHROPIC_API_KEY = readApiKey()

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'claude-middleware',
      configureServer(server) {
        server.middlewares.use('/api/claude', async (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
          const chunks = []
          req.on('data', chunk => chunks.push(chunk))
          req.on('end', async () => {
            const body = Buffer.concat(chunks).toString('utf-8')
            try {
              const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'x-api-key': ANTHROPIC_API_KEY,
                  'anthropic-version': '2023-06-01',
                  'content-type': 'application/json'
                },
                body: body
              })
              const data = await response.json()
              console.log('[claude]', response.status, JSON.stringify(data).slice(0, 300))
              res.statusCode = response.status
              res.setHeader('content-type', 'application/json')
              res.end(JSON.stringify(data))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        })
      }
    }
  ]
})
