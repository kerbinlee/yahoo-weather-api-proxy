// Copyright 2019 Oath Inc. Licensed under the terms of the zLib license see https://opensource.org/licenses/Zlib for terms.

const dotenv = require('dotenv');
dotenv.config();

var OAuth = require('oauth');
var header = {
    "X-Yahoo-App-Id": process.env.APP_ID
};
var request = new OAuth.OAuth(
    null,
    null,
    process.env.CONSUMER_KEY,
    process.env.CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1',
    null,
    header
);
function callYahoo(query, response) {
    request.get(
        'https://weather-ydn-yql.media.yahoo.com/forecastrss?'+query,
        null,
        null,
        function (err, data, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(data)
    	    response.send(data);
            }
        }
    );
}

const express = require('express');
const app = express();

var morgan  = require('morgan');
app.use(morgan('combined'));

function dataCallback(err, tableData) {
    if (err) {
        console.log("error: ",err,"\n");
    } else {
        console.log("got: ",tableData,"\n");
    }
}

app.get('/query', function (request, response) {
    query = request.url.split("?"); // split query string
    // if query exists
    if (query[1]) {
        response.status(200);
        response.type("text/json");
        callYahoo(query[1], response);
    }
});

app.listen(process.env.PORT);
