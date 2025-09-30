const digitalData = require('./digital-data')

/**
 *
 * @param {typeof Config} config
 */
module.exports =
  (config) =>
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  (req, res, next) => {
    res.locals.BASE_URL = config.baseURL
    res.locals.ENVIRONMENT = config.env

    // Adobe Analytics
    res.locals.adobeTrackingUrl = config.adobeTrackingUrl

    // Datalayer info
    res.locals.digitalData = digitalData(req)

    next()
  }

/**
 * @import { Request, Response, NextFunction } from 'express'
 * @import { default as Config } from './config.js'
 */
