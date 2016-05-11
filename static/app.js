
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

var priceIncrease = 1.15;


function arccReducer(state, action) {
	if (typeof state != 'object') {
		throw new Error('Missing application state');
	}
	switch (action.type) {
		case 'bigCookieClick':
			var cookiesNow = CookiesNow(state, action.ts);
			return state.merge({
				ts: action.ts,
				cookies: cookiesNow+1,
			});
		case 'buildingPurchase':
			var cookiesNow = CookiesNow(state, action.ts);
			var buildingCount = state.get('buildings').get(action.buildingName).get('count');
			var cost = buildingCost(state, action.buildingName);
			if(cookiesNow<cost) throw new Error('Insufficent funds!');
			return state.mergeDeep({
				ts: action.ts,
				cookies: cookiesNow-cost,
				buildings: new Immutable.Map([[action.buildingName, new Immutable.Map({count: buildingCount+1})]]),
			});
		default:
			// Error here maybe?
			return state;
	}
}

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
	return buildingsTotal;
}

function CpSBuilding(state, name){
	var building = buildingTypes[name];
	var buildingCount = state.get('buildings').get(name).get('count');
	var rate = building.baseClicks * buildingCount;
	return rate;
}

function CookiesNow(state, now){
	if(!now) now = ts();
	return state.get('cookies') + (now-state.get('ts'))/1000*CpSTotal(state);
}

function CookieClickerMain(props) {
	return React.createElement("div", {}, [
		React.createElement(HelloMessage, {name:props.state.get('bakeryName')}),
		React.createElement('h1', {}, 'Big Cookie'),
		React.createElement('div', {}, Math.floor(CookiesNow(props.state, ts())) + ' Cookies'),
		React.createElement('div', {}, CpSTotal(props.state) + ' Cookies per Second'),
		React.createElement(BigCookieButton, props),
		React.createElement('h1', {}, 'Bakery'),
		React.createElement('h1', {}, 'Store'),
		React.createElement('ul', {}, buildingTypeList.map(function(v){
			return React.createElement('li', {}, React.createElement(StorePurchaseButton, {
				label: v.label,
				price: buildingCost(props.state, v.name),
				inventory: props.state.get('buildings').get(v.name).get('count'),
				onClick: function(){ props.onPurchase({name:v.name}); },
			}));
		})),
		React.createElement('h1', {}, 'Options'),
		React.createElement('h1', {}, 'Stats'),
		React.createElement('pre', {}, JSON.stringify(props.state,null,'\t')),
		React.createElement('h1', {}, 'Info'),
		React.createElement('p', {}, 'See the README'),
    ]);
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

function onLoad(){
	var startDate = ts();
	var initialState = {
		arccStateVersion: 1,
		startDate: startDate,
		ts: startDate,
		playMode: 'full',
		bakeryName: 'Snazzy Kitten',
		cookies: 0,
		handmadeCookies: 0,
		buildings: new Immutable.Map(buildingTypeList.map(function(v){ return [v.name, new Immutable.Map({count:0})]; })),
	};
	var store = Redux.createStore(arccReducer, new Immutable.Map(initialState));
	store.subscribe(render);
	window.setInterval(render, 200);
	render();
	function render(){
		var props = {
			state: store.getState(),
			onBigCookieClick: function(){ store.dispatch({type:'bigCookieClick', ts:ts()}); },
			onPurchase: function(e){ store.dispatch({type:'buildingPurchase', ts:ts(), buildingName:e.name}); },
		};
		ReactDOM.render(React.createElement(CookieClickerMain, props), document.getElementById('main'));
	}
}

document.addEventListener("DOMContentLoaded", onLoad);
