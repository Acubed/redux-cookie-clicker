
if(typeof exports=='object'){
	var Immutable = require('immutable');
	var React = require('react');
}else if(typeof document=='object'){
	var exports = {};
	document.addEventListener("DOMContentLoaded", onLoad);
}else{
	//throw new Error('Unknown platform');
}
// Section 1. Static game data
var buildingTypeList = [
	{label:'Cursor', name:'cursor', baseCost:15, baseClicks:0.1},
	{label:'Grandma', name:'grandma', baseCost:100, baseClicks:1},
	{label:'Farm', name:'farm', baseCost:1100, baseClicks:8},
	{label:'Mine', name:'mine', baseCost:12000, baseClicks:47},
	{label:'Factory', name:'factory', baseCost:130000, baseClicks:260},
	{label:'Bank', name:'bank', baseCost:1.4e6, baseClicks:1400},
	{label:'Temple', name:'temple', baseCost:20e6, baseClicks:7800},
	{label:'Wizard Tower', name:'wizardtower', baseCost:330e6, baseClicks:44000},
	{label:'Shipment', name:'shipment', baseCost:5100e6, baseClicks:260000},
	{label:'Alchemy Lab', name:'alchemylab', baseCost:75000e6, baseClicks:1.6e6},
	{label:'Portal', name:'portal', baseCost:1e12, baseClicks:10e6},
	{label:'Time Machine', name:'timemachine', baseCost:14e12, baseClicks:65e6},
	{label:'Antimatter Condenser', name:'antimattercondenser', baseCost:170e12, baseClicks:430e6},
	{label:'Prism', name:'prism', baseCost:2100e12, baseClicks:2900e6},
];
var buildingTypes = {};
buildingTypeList.forEach(function(v){ buildingTypes[v.name] = v; });

function upgraderBuildingMinimum(buildingType, buildingCount){
	return function(state){
		return state.get('buildings').get(buildingType).get('count') >= buildingCount;
	}
}
function upgraderBuildingMinimumGrandma(buildingType, buildingCount){
	return function(state){
		return (state.get('buildings').get(buildingType).get('count') >= 15) && (state.get('buildings').get('grandma').get('count') >= 1);
	}
}
var upgradeList = [
	// Cursor upgrades
	{label:'Reinforced index finger', unlocked:upgraderBuildingMinimum('cursor', 1), cost:100, descriptionHtml:'The mouse and cursors are twice as efficient. "prod prod"'},
	{label:'Carpal tunnel prevention cream', unlocked:upgraderBuildingMinimum('cursor', 1), cost:500, descriptionHtml:'The mouse and cursors are twice as efficient. "it... it hurts to click..."'},
	{label:'Ambidextrous', unlocked:upgraderBuildingMinimum('cursor', 10), cost:10000, descriptionHtml:'The mouse and cursors are twice as efficient. "prod prod"'},
	{label:'Thousand fingers', unlocked:upgraderBuildingMinimum('cursor', 20), cost:100000, descriptionHtml:'The mouse and cursors gain +0.1 cookies for each non-cursor object owned.'},
	{label:'Million fingers', unlocked:upgraderBuildingMinimum('cursor', 40), cost:10e6, descriptionHtml:'The mouse and cursors gain +0.5 cookies for each non-cursor object owned.'},
	{label:'Billion fingers', unlocked:upgraderBuildingMinimum('cursor', 80), cost:100e6, descriptionHtml:'The mouse and cursors gain +5 cookies for each non-cursor object owned.'},
	// Grandma upgrades
	{label:'Forwards from grandma', unlocked:upgraderBuildingMinimum('grandma', 1), cost:1000, descriptionHtml:'Grandmas are twice as efficient.'},
	{label:'Steel-plated rolling pins', unlocked:upgraderBuildingMinimum('grandma', 5), cost:5000, descriptionHtml:'Grandmas are twice as efficient.'},
	{label:'Lubricated dentures', unlocked:upgraderBuildingMinimum('grandma', 25), cost:50000, descriptionHtml:'Grandmas are twice as efficient.'},
	{label:'Prune juice', unlocked:upgraderBuildingMinimum('grandma', 50), cost:5e6, descriptionHtml:'Description'},
	{label:'Double-thick glasses', unlocked:upgraderBuildingMinimum('grandma', 100), cost:500e6, descriptionHtml:'Description'},
	{label:'Aging agents', unlocked:upgraderBuildingMinimum('grandma', 150), cost:50e9, descriptionHtml:'Description'},
	{label:'Xtreme walkers', unlocked:upgraderBuildingMinimum('grandma', 200), cost:50e12, descriptionHtml:'Description'},
	{label:'The Unbridling', unlocked:upgraderBuildingMinimum('grandma', 250), cost:50e15, descriptionHtml:'Description'},
	// The Grandma-x-Grandma upgrades
	{label:'Farmer grandmas', unlocked:upgraderBuildingMinimumGrandma('farm'), cost:55000, descriptionHtml:'Grandmas are twice as efficient. Farms gain +1% CpS per grandma.'},
	{label:'Miner grandmas', unlocked:upgraderBuildingMinimumGrandma('mine'), cost:600000, descriptionHtml:'Grandmas are twice as efficient. Mines gain +1% CpS per 2 grandmas.'},
	{label:'Worker grandmas', unlocked:upgraderBuildingMinimumGrandma('factory'), cost:6.5e6, descriptionHtml:'Grandmas are twice as efficient. Factories gain +1% CpS per 3 grandmas.'},
	{label:'Banker grandmas', unlocked:upgraderBuildingMinimumGrandma('bank'), cost:70e6, descriptionHtml:'Grandmas are twice as efficient. Banks gain +1% CpS per 4 grandmas'},
	{label:'Priestess grandmas', unlocked:upgraderBuildingMinimumGrandma('temple'), cost:1e9, descriptionHtml:'Grandmas are twice as efficient. Temples gain +1% CpS per 5 grandmas.'},
	{label:'Witch grandmas', unlocked:upgraderBuildingMinimumGrandma('wizardtower'), cost:16.5e9, descriptionHtml:'Grandmas are twice as efficient. Wizard towers gain +1% CpS per 6 grandmas.'},
	{label:'Cosmic grandmas', unlocked:upgraderBuildingMinimumGrandma('shipment'), cost:255e9, descriptionHtml:'Grandmas are twice as efficient. Shipments gain +1% CpS per 7 grandmas.'},
	{label:'Transmuted grandmas', unlocked:upgraderBuildingMinimumGrandma('alchemylab'), cost:3.75e12, descriptionHtml:'Grandmas are twice as efficient. Alchemy labs gain +1% CpS per 8 grandmas.'},
	{label:'Altered grandmas', unlocked:upgraderBuildingMinimumGrandma('portal'), cost:50e12, descriptionHtml:'Grandmas are twice as efficient. Portals gain +1% CpS per 9 grandmas.'},
	{label:'Grandmas\' grandmas', unlocked:upgraderBuildingMinimumGrandma('timemachine'), cost:700e12, descriptionHtml:'Grandmas are twice as efficient. Time machines gain +1% CpS per 10 grandmas.'},
	{label:'Antigrandmas grandmas', unlocked:upgraderBuildingMinimumGrandma('antimattercondenser'), cost:8.5e15, descriptionHtml:'Grandmas are twice as efficient. Antimatter condensers gain +1% CpS per 11 grandmas.'},
	{label:'Rainbow grandmas', unlocked:upgraderBuildingMinimumGrandma('prism'), cost:105e15, descriptionHtml:'Grandmas are twice as efficient. Prisms gain +1% CpS per 12 grandmas.'},
	// Farm upgrades
	//{label:'Name', unlocked:upgraderBuildingMinimumGrandma('grandma'), cost:100, descriptionHtml:'Description'},
];
var upgradeTypes = {};
upgradeList.forEach(function(v){ upgradeTypes[v.label] = v; });

var priceIncrease = 1.15;


// Section 2. Utility functions

function ts(){
	return new Date().getTime();
}

function buildingCost(state, name){
	var building = buildingTypes[name];
	var buildingCount = state.get('buildings').get(name).get('count');
	var cost = Math.floor(building.baseCost * Math.pow(priceIncrease, buildingCount));
	return cost;
}

function CpSTotal(state){
	var buildingsTotal = buildingTypeList.reduce(function(sum, v){
			return sum + CpSBuilding(state, v.name);
	}, 0);
	return buildingsTotal * state.get('debugMultiplier', 1);
}

function CpSBuilding(state, name){
	var building = buildingTypes[name];
	var buildingCount = state.get('buildings').get(name).get('count');
	var rate = building.baseClicks * buildingCount;
	switch(name){
		case 'cursor':
			if(state.get('upgradesPurchased').has('Reinforced index finger')) rate *= 2;
			if(state.get('upgradesPurchased').has('Carpal tunnel prevention cream')) rate *= 2;
			if(state.get('upgradesPurchased').has('Ambidextrous')) rate *= 2;
			break;
		case 'grandma':
			if(state.get('upgradesPurchased').has('Forwards from grandma')) rate*=2;
			if(state.get('upgradesPurchased').has('Steel-plated rolling pins')) rate*=2;
			if(state.get('upgradesPurchased').has('Lubricated dentures')) rate*=2;
			if(state.get('upgradesPurchased').has('Prune juice')) rate*=2;
			if(state.get('upgradesPurchased').has('Double-thick glasses')) rate*=2;
			if(state.get('upgradesPurchased').has('Aging agents')) rate*=2;
			if(state.get('upgradesPurchased').has('Xtreme walkers')) rate*=2;
			if(state.get('upgradesPurchased').has('The Unbridling')) rate*=2;
			if(state.get('upgradesPurchased').has('Farmer grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Miner grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Worker grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Banker grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Priestess grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Witch grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Cosmic grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Transmuted grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Altered grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Grandmas\' grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Antigrandmas grandmas')) rate*=2;
			if(state.get('upgradesPurchased').has('Rainbow grandmas')) rate*=2;
			break;
	}
	return rate;
}

function bigCookieClickCookies(state){
	var rate = 1;
	// These upgrades also affect big cookie clicks (it's supposed to be the same thing)
	if(state.get('upgradesPurchased').has('Reinforced index finger')) rate *= 2;
	if(state.get('upgradesPurchased').has('Carpal tunnel prevention cream')) rate *= 2;
	if(state.get('upgradesPurchased').has('Ambidextrous')) rate *= 2;
	return rate;
}

function CookiesNow(state, now){
	if(!now) now = ts();
	return state.get('cookies') + (now-state.get('ts'))/1000*CpSTotal(state);
}

exports.serializeState = serializeState;
function serializeState(state){
	return JSON.stringify(state);
}

exports.restoreState = restoreState;
function restoreState(json){
	var obj = JSON.parse(json);
	return Immutable.fromJS(obj).merge({
		upgradesPurchased: Immutable.Set.of.apply(Immutable.Set, obj.upgradesPurchased),
	});
}


// Section 3. State machine
exports.arccReducer = arccReducer;
function arccReducer(state, action) {
	if (typeof state != 'object') {
		throw new Error('Missing application state');
	}
	//if(typeof action.type != 'string') return state;
	switch (action.type) {
		case '@@redux/INIT':
			return state;
		case 'fixState':
			// Saves the current number of cookies to "cookies" and maybe anything else needed to ensure the state is in a good place for saving
			var cookiesNow = CookiesNow(state, action.ts);
			return state.merge({
				ts: action.ts,
				cookies: cookiesNow,
				cookiesEarned: cookiesNow - state.get('cookies') + state.get('cookiesEarned'),
			});
		case 'setState':
			// Merely load a given state
			// If you want to continue as if cookies were being generated in the background, after being saved, use this
			return action.state;
		case 'resume':
			// Continue as if the save state was saved right just now
			return action.state.set('ts', action.ts);
		case 'bigCookieClick':
			var cookiesNow = CookiesNow(state, action.ts);
			var cookiesEarned = bigCookieClickCookies(state);
			return state.merge({
				ts: action.ts,
				cookies: cookiesNow + cookiesEarned,
				// Count the cookie click and any cookies generated by buildings since the last action towards cookiesEarned
				cookiesEarned: cookiesNow - state.get('cookies') + state.get('cookiesEarned') + cookiesEarned,
			});
		case 'upgradePurchase':
			var cookiesNow = CookiesNow(state, action.ts);
			var hasUpgrade = state.get('upgradesPurchased').has(action.upgradeName);
			var cost = upgradeTypes[action.upgradeName].cost;
			if(cookiesNow<cost) throw new Error('Insufficent funds!');
			return state.merge({
				ts: action.ts,
				cookies: cookiesNow-cost,
				cookiesEarned: cookiesNow - state.get('cookies') + state.get('cookiesEarned'),
				upgradesPurchased: state.get('upgradesPurchased').add(action.upgradeName),
			});
		case 'buildingPurchase':
			var cookiesNow = CookiesNow(state, action.ts);
			var buildingCount = state.get('buildings').get(action.buildingName).get('count');
			var cost = buildingCost(state, action.buildingName);
			if(cookiesNow<cost) throw new Error('Insufficent funds!');
			return state.mergeDeep({
				ts: action.ts,
				cookies: cookiesNow-cost,
				cookiesEarned: cookiesNow - state.get('cookies') + state.get('cookiesEarned'),
				buildings: new Immutable.Map([[action.buildingName, new Immutable.Map({count: buildingCount+1})]]),
			});
		default:
			throw new Error('Unknown action type '+JSON.stringify(action.type));
	}
}

// Section 4. User Interface

exports.CookieClickerMain = CookieClickerMain;
function CookieClickerMain(props) {
	var state = props.state;
	return React.createElement("div", {}, [
		React.createElement(HelloMessage, {name:state.get('bakeryName')}),
		React.createElement('h1', {}, 'Big Cookie'),
		React.createElement('div', {}, Math.floor(CookiesNow(props.state, ts())) + ' Cookies'),
		React.createElement('div', {}, CpSTotal(props.state) + ' Cookies per Second'),
		React.createElement(BigCookieButton, props),
		React.createElement('h1', {}, 'Store'),
		React.createElement('h2', {}, 'Upgrades'),
		React.createElement('ul', {}, upgradeList.map(function(v){
			if(state.get('upgradesPurchased').has(v.label)) return null;
			if(!upgradeTypes[v.label].unlocked(props.state)) return null;
			return React.createElement('li', {}, React.createElement(UpgradePurchaseButton, {
				label: v.label,
				price: v.cost,
				onClick: function(){ props.onUpgradePurchase({name:v.label}); },
			}));
		})),
		React.createElement('h2', {}, 'Buildings'),
		React.createElement('ul', {}, buildingTypeList.map(function(v){
			if(state.get('cookiesEarned')+15<v.baseCost) return null;
			return React.createElement('li', {}, React.createElement(StorePurchaseButton, {
				label: v.label,
				price: buildingCost(props.state, v.name),
				inventory: state.get('buildings').get(v.name).get('count'),
				onClick: function(){ props.onPurchase({name:v.name}); },
			}));
		})),
		React.createElement('h1', {}, 'Options'),
		React.createElement('button', {type:'button', onClick:props.onSaveGame}, "Save Game"),
		React.createElement('button', {type:'button', onClick:props.onLoadGame}, "Load Game"),
		React.createElement('h1', {}, 'Stats'),
		React.createElement('pre', {}, JSON.stringify(props.state,null,'\t')),
		React.createElement('h1', {}, 'Info'),
		React.createElement('p', {}, 'See the README'),
    ]);
}

function UpgradePurchaseButton(props) {
	return React.createElement("button", {type:'button', onClick:props.onClick}, props.label+': '+props.price);
}

function StorePurchaseButton(props) {
	return React.createElement("button", {type:'button', onClick:props.onClick}, props.label+': '+props.price+' ('+props.inventory+')');
}

function HelloMessage(props) {
	return React.createElement("div", null, ""+props.name+"'s Bakery");
}

function BigCookieButton(props) {
	return React.createElement("div", null, [
       React.createElement('button', {type:'button', onClick:props.onBigCookieClick}, "Cookie")
   ]);
}

// Section 5. Document initialization

exports.initialState = initialState;
function initialState(){
	var startDate = ts();
	var initialState = {
		arccStateVersion: 1,
		startDate: startDate,
		ts: startDate,
		playMode: 'full',
		bakeryName: 'Snazzy Kitten',
		cookies: 0,
		cookiesEarned: 0,
		handmadeCookies: 0,
		buildings: new Immutable.Map(buildingTypeList.map(function(v){ return [v.name, new Immutable.Map({count:0})]; })),
		upgradesPurchased: new Immutable.Set,
	};
	return new Immutable.Map(initialState);
}

function onLoad(){
	var e = document.getElementById('state');
	var state = e ? restoreState(e.innerText) : initialState() ;
	var store = Redux.createStore(arccReducer, state);
	window.Game = {store:store};
	store.subscribe(render);
	window.setInterval(render, 100);
	render();
	function render(){
		var props = {
			state: store.getState(),
			onLoadGame: function(){ var state=restoreState(window.localStorage.getItem("saved")); store.dispatch({type:'resume', state:state, ts:ts()}); },
			onSaveGame: function(){ store.dispatch({type:'fixState', ts:ts()}); window.localStorage.setItem("saved", serializeState(store.getState())); },
			onBigCookieClick: function(){ store.dispatch({type:'bigCookieClick', ts:ts()}); },
			onUpgradePurchase: function(e){ store.dispatch({type:'upgradePurchase', ts:ts(), upgradeName:e.name}); },
			onPurchase: function(e){ store.dispatch({type:'buildingPurchase', ts:ts(), buildingName:e.name}); },
		};
		ReactDOM.render(React.createElement(CookieClickerMain, props), document.getElementById('main'));
	}
}
