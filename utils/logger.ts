const {createLogger,transports,format} = require('winston');
require('winston-mongodb')

const logger = createLogger({
    transports: [
        new transports.Console({
            level: "info",
            format: format.combine(format.timestamp(),format.simple())
        }),
        new transports.MongoDB({
            level: 'error',
            db: process.env.MONGODB_URI,
            options: {
                useUnifiedTopology:true,
            },
            collection:'errors'
        })
    ]
})
export {
    logger
}