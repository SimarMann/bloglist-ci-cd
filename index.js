require('dotenv').config()
require('module-alias/register')
const chokidar = require('chokidar')
const express = require('express')
const path = require('path')
require('express-async-errors')

const { PORT, inProduction } = require('@util/common')

const app = express()

// Require is here so we can delete it from cache when files change (*)
app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

/**
 *  Use "hot loading" in backend
 */
const watcher = chokidar.watch('server') // Watch server folder
watcher.on('ready', () => {
  watcher.on('all', () => {
    Object.keys(require.cache).forEach((id) => {
      if (id.includes('server')) delete require.cache[id] // Delete all require caches that point to server folder (*)
    })
  })
})

// Comment out frontend related code
/*
if (!inProduction) {
  // eslint-disable-next-line
  const webpack = require('webpack');
  const middleware = require('webpack-dev-middleware');
  const hotMiddleWare = require('webpack-hot-middleware');
  const webpackConf = require('@root/webpack.config');

  const compiler = webpack(webpackConf('development', { mode: 'development' }));

  const devMiddleware = middleware(compiler);
  app.use(devMiddleware);
  app.use(hotMiddleWare(compiler));
  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    devMiddleware.waitUntilValid(() => {
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) return next(err);
        res.set('content-type', 'text/html');
        res.send(result);
        return res.end();
      });
    });
  });
} else {
  const DIST_PATH = path.resolve(__dirname, './dist');
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html');

  app.use(express.static(DIST_PATH));
  app.get('*', (req, res) => res.sendFile(INDEX_PATH));
}
*/

// Serve a simple message indicating backend is running
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`)
})