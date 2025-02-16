import winston from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'

class LoggingService {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'token-launchpad' },
      transports: this.configureTransports()
    })
  }

  configureTransports() {
    const transports = [
      // Console transport
      new winston.transports.Console({
        format: winston.format.simple()
      }),

      // File transport for error logs
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
      }),

      // File transport for combined logs
      new winston.transports.File({ 
        filename: 'logs/combined.log' 
      })
    ]

    // Conditional Elasticsearch transport
    if (process.env.ELASTICSEARCH_URL) {
      transports.push(
        new ElasticsearchTransport({
          level: 'info',
          clientOpts: { 
            node: process.env.ELASTICSEARCH_URL 
          },
          indexPrefix: 'token-launchpad-logs',
          transformer: (logData) => {
            const transformed = {
              '@timestamp': logData.timestamp,
              message: logData.message,
              level: logData.level,
              service: logData.meta.service
            }
            return transformed
          }
        })
      )
    }

    return transports
  }

  // Centralized logging methods
  info(message, meta) {
    this.logger.info(message, meta)
  }

  error(message, meta) {
    this.logger.error(message, meta)
  }

  warn(message, meta) {
    this.logger.warn(message, meta)
  }

  // Performance and security tracking
  trackPerformance(operation, startTime) {
    const duration = Date.now() - startTime
    this.info(`Performance: ${operation}`, { duration })
  }

  // Security event logging
  logSecurityEvent(eventType, details) {
    this.logger.warn(`Security Event: ${eventType}`, {
      type: eventType,
      ...details
    })
  }
}

export default new LoggingService()
