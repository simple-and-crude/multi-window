/// <reference types=".." />

window.onload = function () {
	document.onmousemove = SCMultiWindow.event.move;
	document.onmouseup = SCMultiWindow.event.up;
	document.onmousedown = SCMultiWindow.event.down;
	SCMultiWindow.initialize();
};
function check() {
	SCMultiWindow.magnetic = !SCMultiWindow.magnetic;
	alert(SCMultiWindow.WINDOW_ID);
}