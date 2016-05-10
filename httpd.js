/* eslint-disable */
var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');


// Settings
var port = 8080;
var publicPath = path.resolve(__dirname, './static');


// Init Express
var app = express();

// Nunjucks is used for helping pre-render the DOM maybe in the future
var env = nunjucks.configure({
    express: app,
    noCache: true,
});



// Now set up the express publich path
app.use(express.static(publicPath));


function renderRoute(res, template, options) {
    res.render(template, {
        name: 'Royal Machine',
    });
}

app.get('/', function(req, res) {
    //res.sendFile(path.resolve(__dirname, 'index.html'));
    return renderRoute(res, 'static/base.html', {});
});

app.listen(port, function() {
    console.log('Serving running on port ' + port);
});

