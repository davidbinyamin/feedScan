const config = require("config");
const redis = require('redis');
const cron = require('node-cron');

const redisClient = redis.createClient({
    host: config.get("redis.host"),
    port: config.get("redis.port")
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

let prevStatusError = false;

async function statusCheck() {
    const currentTS = Date.now();
    const lastFeed = await redisClient.get("lastFeed");
    const minutesDifference = (currentTS - lastFeed) / 1000 / 60;
    if (minutesDifference > 1) {
        if (!prevStatusError) {
            console.warn("WARNING - New feed was not delivered for more then 1 minute");
            prevStatusError = true;
        }
    } else {
        if (prevStatusError) {
            console.log("Back to normal");
            prevStatusError = false;
        }
    }
}

async function feedHealthCheck() {
    await redisClient.connect();
    cron.schedule('* * * * *', statusCheck);
}

feedHealthCheck();
