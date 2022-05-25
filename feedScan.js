const config = require("config");
const chokidar = require('chokidar');
const redis = require('redis');

const clients = ["1424", "4323", "1194"];
const feedPath = config.get("feedPath");
const redisClient = redis.createClient({
    host: config.get("redis.host"),
    port: config.get("redis.port")
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

function extractCustomerIdFromFeedBatch(pathToBatch) {
    const batchRegex = /(\d+.batch)$/;
    const match = pathToBatch.match(batchRegex);
    const batchName = match ? match[0] : "";
    if (batchName === "") {
        return "";
    }

    return batchName.split(".")[0];
}

async function onCustomerFeed(path) {
    const customerID = extractCustomerIdFromFeedBatch(path);
    if (customerID !== "" && clients.includes(customerID)) {
        console.log("found new feed for customer " + customerID)
        await redisClient.set('lastFeed', Date.now());
    }
}

const feedScan = async () => {
    await redisClient.connect();
    const watcher = chokidar.watch(feedPath, {persistent: true});
    watcher.on('add', onCustomerFeed);
}

feedScan();
