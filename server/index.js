const express = require('express')
const { createPageRender } = require('vite-plugin-ssr')
const https = require('@small-tech/https')
const hostname = require('@small-tech/cross-platform-hostname')

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = express()

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`, { index: false }))
  } else {
    const vite = require('vite')
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true }
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRender({ viteDevServer, isProduction, root })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContext = {
      url
    }
    const result = await renderPage(pageContext)
    if (result.nothingRendered) return next()
    res.status(result.statusCode).send(result.renderResult)
  })

  const server = isProduction ? https.createServer({ domains: [hostname] }, app) : https.createServer(app)
  server.listen(443, () => {
    console.log(`Server running at https://${isProduction ? hostname : 'localhost'}`)
  })
}