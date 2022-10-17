const redis = require('redis');
const session = require('express-session');
const connectRedis = require('connect-redis');
const { promisify } = require("util");
require('dotenv').config();

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    legacyMode: true
});

redisClient.on('connect', () => {
    console.log('connected to redis successfully!');
})

redisClient.on('error', (error) => {
    console.log('Redis connection error :', error);
})

redisClient.connect();

redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
redisClient.hgetAsync = promisify(redisClient.hget).bind(redisClient);
redisClient.hsetAsync = promisify(redisClient.hset).bind(redisClient);
redisClient.existsAsync = promisify(redisClient.exists).bind(redisClient);
redisClient.deleteAsync = promisify(redisClient.del).bind(redisClient)

module.exports = {
    redisClient,
    session: session({
        store: new RedisStore({ client: redisClient }),
        secret: 'keyboard cat',
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false, // if true: only transmit cookie over https, in prod, always activate this
            httpOnly: false, // if true: prevents client side JS from reading the cookie
            maxAge: 1000 * 60 * 30, // session max age in milliseconds
            // explicitly set cookie to lax
            // to make sure that all cookies accept it
            // you should never use none anyway
        },
    })
};