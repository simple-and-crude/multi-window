/// <reference types=".." />

document.onmousemove = SCMultiWindow.event.move;
document.onmouseup = SCMultiWindow.event.up;
document.onmousedown = SCMultiWindow.event.down;
window.onload = function () {
	SCMultiWindow.initialize(); // 初始化
	SCMultiWindow.setSiz(
		200, // 窗口宽度
		80 // 窗口高度
	);
	SCMultiWindow.initDialog({ // 可以根据用户要求配置窗口数量大小
		uri: "sub_1.hta",
		config: {
			dialogWidth: "200px",
			dialogHeight: "200px",
			dialogTop: SCMultiWindow.XYpos.y + 80 + "px"
		}
	}, {
		uri: "submain.hta",
		config: {
			dialogWidth: "280px",
			dialogHeight: "120px",
			dialogLeft: SCMultiWindow.XYpos.x + 200 + "px"
		}
	}, {
		uri: "submain.hta",
		config: {
			dialogHeight: "200px",
			dialogWidth: "300px",
			dialogTop: SCMultiWindow.XYpos.y + 220 + "px",
			dialogLeft: SCMultiWindow.XYpos.x + SCMultiWindow.XYsiz.x + "px"
		}
	}/*, {
		name: "sub_1",
		config: {
			dialogHeight: "200px",
			dialogWidth: "300px",
			dialogLeft: "200px",
			dialogLeft: SCMultiWindow.XYpos.x + 200 + "px",
			dialogTop: SCMultiWindow.XYpos.y + 200 + "px"
		}
	}*/);
};
function check() {
	alert(typeof DialogConfig);
}