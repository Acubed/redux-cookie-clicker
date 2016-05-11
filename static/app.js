
var buildingTypes = [
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


function arccReducer(state, action) {
	if (typeof state != 'object') {
		throw new Error('Missing application state');
	}
	switch (action.type) {
		case 'bigCookieClick':
			return state.set('cookies', state.get('cookies')+1);
		case 'buildingPurchase':
			if(state.get('cookies')<1) throw new Error('Insufficent funds!');
			return state.set('cookies', state.get('cookies')+1);
			return state;
		default:
			return state;
	}
}



function CookieClickerMain(props) {
	return React.createElement("div", {}, [
		React.createElement(HelloMessage, props.state),
		React.createElement('h1', {}, 'Big Cookie'),
		React.createElement('div', {}, props.state.get('cookies') + ' Cookies'),
		React.createElement(BigCookieButton, props),
		React.createElement('h1', {}, 'Bakery'),
		React.createElement('h1', {}, 'Store'),
		React.createElement('ul', {}, buildingTypes.map(function(v){
			return React.createElement('li', {}, React.createElement(StorePurchaseButton, {label:v.label, price:v.baseCost, inventory:0}));
		})),
		React.createElement('h1', {}, 'Options'),
		React.createElement('h1', {}, 'Stats'),
		React.createElement('pre', {}, JSON.stringify(props.state,null,'\t')),
		React.createElement('h1', {}, 'Info'),
		React.createElement('p', {}, 'See the README'),
    ]);
}

function StorePurchaseButton(props) {
	return React.createElement("button", {type:'button'}, props.label+': '+props.price+' ('+props.inventory+')');
}

function HelloMessage(props) {
	return React.createElement("div", null, ""+props.bakeryName+"'s Bakery");
}

function BigCookieButton(props) {
	return React.createElement("div", null, [
       React.createElement('button', {type:'button', onClick:props.onBigCookieClick}, "Cookie")
   ]);
}

function onLoad(){
	var initialState = {
		arccStateVersion: 1,
		startDate: new Date().getTime(),
		playMode: 'full',
		bakeryName: 'Snazzy Kitten',
		cookies: 0,
		handmadeCookies: 0,
	};
	var store = Redux.createStore(arccReducer, new Immutable.Map(initialState));
	store.subscribe(render);
	render();
	function render(){
		var props = {
			state: store.getState(),
			onBigCookieClick: function(){ store.dispatch({type:'bigCookieClick'}); },
		};
		ReactDOM.render(React.createElement(CookieClickerMain, props), document.getElementById('main'));
	}
}

document.addEventListener("DOMContentLoaded", onLoad);
