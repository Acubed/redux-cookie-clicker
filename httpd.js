
var express = require('express');
var path = require('path');
var nunjucks = require('nunjucks');
var React = require('react');
var renderToString = require('react-dom/server').renderToString;
var Redux = require('redux');

var CC = require('./static/app.js');


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


function renderCookieClickerMain(state) {
	var props = {
		state: state,
		onLoadGame: function(){ },
		onSaveGame: function(){ },
		onBigCookieClick: function(){ },
		onUpgradePurchase: function(e){ },
		onPurchase: function(e){ },
	};
	var html = renderToString(React.createElement(CC.CookieClickerMain, props));
	return html;
}

var games = {
	'': CC.initialState(),
	'cheat': CC.initialState().set('cookies', 1e10).set('cookiesEarned', 1e10).set('debugMultiplier', 100),
};

app.get('/:game?', function(req, res) {
	var state = games[req.params.game] || CC.initialState();
	//state = state.set('cookies', 1e30);
	res.setHeader('Content-Type', 'application/xhtml+xml');
	res.render('static/render.html', {
		name: state.get('name', 'Anonymous Coward'),
		body: renderCookieClickerMain(state),
		statejson: CC.serializeState(state),
	});
});

app.put('/:game', function(req, res) {
	res.statusCode = 500;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Not implemented yet, sorry');
});

app.listen(port, function() {
    console.log('Serving running on port ' + port);
});

