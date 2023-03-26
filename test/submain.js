/// <reference types=".." />

window.onload = function () {
	document.body.onmousemove = SCMultiWindow.event.move;
	document.body.onmouseup = SCMultiWindow.event.up;
	document.onmousedown = SCMultiWindow.event.down;
	SCMultiWindow.initialize(); // 初始化
	SCMultiWindow.initDialog({ // 可以根据用户要求配置窗口数量大小
		uri: "sub_1.hta",
		config: {
			dialogWidth: "200px",
			dialogHeight: "100px",
			dialogTop: SCMultiWindow.XYpos.y + SCMultiWindow.XYsiz.y + "px"
		}
	}, {
		uri: "sub_1.hta",
		config: {
			dialogWidth: "200px",
			dialogHeight: "100px",
			dialogLeft: SCMultiWindow.XYpos.x + SCMultiWindow.XYsiz.x + "px"
		}
	});
};