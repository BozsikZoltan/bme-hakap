const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();
const redisPort = 6379
const client = redis.createClient({
    host: process.env.GET_HOSTS_FROM,
    port: redisPort
});

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

client.on("error", (err) => {
    console.log(err);
})

/**
 * Add method
 * */
app.post('/put', function (req, res) {
    client.rpush(['cloud-native:immutability', req.body.random_text], function (err, reply) {
    });
    return res.redirect('/')
});

/**
 * Clear method
 * */
app.post('/clear', (req, res) => {
    client.del('cloud-native:immutability', function (err, reply) {
    });

    return res.redirect('/');
});

/**
 * Get method
 * */
app.get('/', (req, res) => {
    client.lrange('cloud-native:immutability', 0, -1, function (err, reply) {
        res.render('index', {items: reply});
    });
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});