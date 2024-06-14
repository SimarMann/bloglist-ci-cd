const express = require('express')
const routes = require('@util/routes');
const middleware = require('@middleware/middleware');
const logger = require('@util/logger')
const mongoose = require('mongoose')
const common = require('@util/common')

const app = express()

mongoose.set('strictQuery', false)
logger.info('connecting to', common.MONGODB_URI)
mongoose.connect(common.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(routes)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app