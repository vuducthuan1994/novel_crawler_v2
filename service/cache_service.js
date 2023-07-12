require('dotenv').config();

const redis = require('redis');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || `MCFcFYdek5DEyPd2yZk5CECytkLAz`;
const REDIS_HOST = process.env.REDIS_HOST || '10.116.0.10';

const clientRedis = redis.createClient({
    url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:6379`
});

clientRedis.on('connect', function () {
    console.log('Connected to Redis');
});

clientRedis.on('error', function (err) {
    // console.log('Redis connect get error !', err);
});
const DB_NUMBER = process.env.DB_NUMBER || 2;

const connectRedis = async function () {
    try {
        await clientRedis.connect();
    } catch (error) {

    }
}

class CacheService {
    constructor() {
        connectRedis();
    }
    set(key, value, cacheTime = process.env.CACHE_TIME) {
        const optionsCache = { EX: (cacheTime || 300), NX: true }
        clientRedis.set(`${DB_NUMBER}-${key}`, JSON.stringify(value), optionsCache);
    }
    get(key) {
        return new Promise(async function (reslove, reject) {
            try {
                const result = await clientRedis.get(`${DB_NUMBER}-${key}`);
                if (result) {
                    reslove(JSON.parse(result));
                } else {
                    reslove(null)
                }
            } catch (err) {
                util.sendTele(`REDIS GET ERROR - ${JSON.stringify(err)} - ${process.env.DOMAIN}`);
                reslove(null)
            }
        })
    }
    delete(key) {
        clientRedis.del(`${DB_NUMBER}-${key}`);
    }
}
module.exports = CacheService