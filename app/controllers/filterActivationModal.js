var args = arguments[0] || {};

console.log( JSON.stringify(Alloy.Collections.filter) );

function closeWindow(e) {
	$.getView().close();
}
