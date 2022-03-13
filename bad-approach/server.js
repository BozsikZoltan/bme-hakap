const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Storage
 * */
const inArray = [];

/**
 * Add method
 * */
app.post('/put', function (req, res) {
    inArray.push(req.body.random_text);
    return res.redirect('/');
});

/**
 * Clear method
 * */
app.post('/clear', (req, res) => {
    while (inArray.length) {
        inArray.pop();
    }
    return res.redirect('/');
});

/**
 * Get method
 * */
app.get('/', (req, res) => {
    res.body = {items: inArray};
    res.render('index', {items: inArray});
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});