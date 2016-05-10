function HelloMessage(props) {
	return React.createElement("div", null, ""+props.name+"'s Bakery");
}

function onLoad(){
	ReactDOM.render(React.createElement(HelloMessage, { name: "Royal Machine" }), document.getElementById('main'));
}

document.addEventListener("DOMContentLoaded", onLoad);
