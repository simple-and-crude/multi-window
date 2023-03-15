XY_ARRAY = { 'x': true, 'y': true };
YX_ARRAY = { 'y': 'x', 'x': 'y' };
// SCMW_DialogConfig类的原型的公共属性
SCMW_DEF_DIALOG_CONFIG = {
	dialogHeight: "300px",
	dialogWidth: "300px",
	dialogLeft: "30px",
	dialogTop: "30px",
	unadorned: "yes",
	center: "no",
	getFeat: function () {
		var i, n = this, feat = "", attr = {}, addFeat = function (i) { return i == "getFeat" && typeof attr[i] == "undefined" ? "" : i + ":" + n[i] + ";"; };
		for (i in SCMW_DEF_DIALOG_CONFIG) feat += addFeat(i), attr[i] = true;
		for (i in n) feat += addFeat(i);
		return feat;
	}
}
/**
 * 分窗配置类
 * @param {object} obj 分窗的style对象
 */
function SCMW_DialogConfig(obj) {
	if (typeof SCMW_DialogConfig._flag == "undefined") {
		SCMW_DialogConfig._flag = true;
		for (var i in SCMW_DEF_DIALOG_CONFIG) SCMW_DialogConfig.prototype[i] = SCMW_DEF_DIALOG_CONFIG[i];
	}
	for (var i in obj) this[i] = obj[i];
}
// SCMW_DialogElement类的原型的公共属性
SCMW_DEF_DIALOG_ELEMENT = {
	id: -1,
	window: null,
	config: null
}
/**
 * 分窗元素类
 * @param {object} obj 分窗的style和id
 */
function SCMW_DialogElement(obj) {
	if (typeof SCMW_DialogElement._flag == "undefined") {
		SCMW_DialogElement._flag = true;
		for (var i in SCMW_DEF_DIALOG_ELEMENT) SCMW_DialogElement.prototype[i] = SCMW_DEF_DIALOG_ELEMENT[i];
	}
	this.config = new SCMW_DialogConfig(obj.config);
	this.id = typeof obj.id == "undefined" ? SCMultiWindow.Global.windowList.length : obj.id;
	this.name = typeof obj.name == "undefined" ? "window_" + this.id : obj.name;
	this.window = window.showModelessDialog(this.name + ".hta", [this.id, SCMultiWindow.Global], this.config.getFeat());
}
/**
 * XY值对
 * @param {object} n x和y
 */
function SCMW_XYPair(n) {
	if (typeof SCMW_XYPair._flag == "undefined") {
		SCMW_XYPair._flag = true;
		for (var i in XY_ARRAY) SCMW_XYPair.prototype[i] = 0;
		SCMW_XYPair.prototype.log = function() {
			return "(" + this.x + ", " + this.y + ") ";
		}
	}
	if (typeof n != "undefined") for (var i in XY_ARRAY) if (typeof n[i] != "undefined") this[i] = n[i];
}
SCMultiWindow = {
	XYsiz: new SCMW_XYPair(),
	/**
	 * 改变或获取窗口尺寸
	 * @param {SCMW_XYPair} n 目标尺寸
	 * @returns {SCMW_XYPair} 当前尺寸
	 */
	setSiz: function (n) {
		if (typeof n == "undefined") {
			this.XYsiz.x = document.body.offsetWidth;
			this.XYsiz.y = document.body.offsetHeight;
		} else {
			this.XYsiz.x = n.x;
			this.XYsiz.y = n.y;
			if (WINDOW_ID) {
				window.dialogWidth = this.XYsiz.x + "px";
				window.dialogHeight = this.XYsiz.y + "px";
			} else vbs_resizeto(n.x, n.y);
		}
		this.Global.windowSiz[WINDOW_ID].x = this.XYsiz.x;
		this.Global.windowSiz[WINDOW_ID].y = this.XYsiz.y;
		return this.XYsiz;
	},
	XYpos: new SCMW_XYPair(),
	/**
	 * 改变或获取窗口位置
	 * @param {SCMW_XYPair} n 目标位置
	 * @returns {SCMW_XYPair} 当前位置
	 */
	setPos: function (n) {
		if (typeof n == "undefined") {
			this.XYpos.x = setPos_getX();
			this.XYpos.y = setPos_getY();
		} else {
			this.XYpos.x = n.x;
			this.XYpos.y = n.y;
			if (WINDOW_ID) {
				window.dialogLeft = n.x + "px";
				window.dialogTop = n.y + "px";
			} else vbs_moveto(n.x, n.y);
		}
		this.Global.windowPos[WINDOW_ID].x = this.XYpos.x;
		this.Global.windowPos[WINDOW_ID].y = this.XYpos.y;
		return this.XYpos;
	},
	/**
	 * 移动窗口
	 * @param {SCMW_XYPair} param 临时参数，鼠标在页面的位置
	 */
	moveWindow: (function () {
		var ableList = new SCMW_XYPair({ x: [], y: [] });
		var moveList = new SCMW_XYPair({ x: [], y: [] });
		var XYcalc = new SCMW_XYPair();
		var judge = function (w, n) {
			if (Math.abs(n) <= SCMultiWindow.Global.sorption) moveList[w].push(n);
		};
		var judges = function (w, n1, n2) {
			var n = SCMultiWindow;
			judge(w, n.XYposNow[w] - n1);
			judge(w, n.XYposNow[w] + n.XYsiz[w] - n1);
			judge(w, n.XYposNow[w] - n1 - n2);
			judge(w, n.XYposNow[w] + n.XYsiz[w] - n1 - n2);
		};
		var sorption = function (i, u) {
			var j, n = SCMultiWindow;
			for (j = 0; j < n.Global.windowList.length; j++) {
				if (j == WINDOW_ID) continue;
				var dmin = n.Global.windowPos[j][u], dsiz = n.Global.windowSiz[j][u], dmax = dmin + dsiz, now = n.XYpos[u], flag = false;
				if (now == dmin) flag = true;
				else if (now < dmin && dmin <= now + n.XYsiz[u]) flag = true;
				else if (now > dmin && now <= dmax) flag = true;
				if (flag) {
					testList[i].push(dmin, dsiz);
					ableList[i].push(j);
				}
			}
			judges(i, 0, n.XYres[i]);
			for (j = 0; j < ableList[i].length; j++) judges(i, n.Global.windowPos[ableList[i][j]][i], n.Global.windowSiz[ableList[i][j]][i]);
			if (typeof moveList[i][0] != "undefined") {
				var min = Math.abs(moveList[i][0]), mini = 0;
				for (j = 0; j < moveList.length; j++) {
					var t = Math.abs(moveList[j]);
					if (t < min) min = t, mini = j;
				}
				XYcalc[i] -= moveList[i][mini];
			}
			ableList[i] = [], moveList[i] = [];
		};
		/**
		 * @param {SCMW_XYPair} param
		 */
		var moveWindow = function(param) {
			XYcalc = calcNowXY(getMouse(param));
			sorption('x', 'y');
			sorption('y', 'x');
			SCMultiWindow.setPos(XYcalc);
		};
		return moveWindow;
	}()),
	/**
	 * 初始化子窗口
	 * @param {object} arguments 各个窗口的配置
	 */
	initDialog: function () {
		for (var i = 0; i < arguments.length; i++) {
			var newDialog = new SCMW_DialogElement(arguments[i]);
			this.Global.windowList[newDialog.id] = newDialog;
		}
	},
	Global: null,
	ParentGlobal: null,
	/**
	 * 生成Global全局变量的本地拷贝
	 */
	copyGlobal: function() {
		// this.ParentGlobal.change[0].push(WINDOW_ID);
		this.Global = {};
		this.Global.sorption = this.ParentGlobal.sorption;
		this.Global.screenSiz = new SCMW_XYPair(this.ParentGlobal.screenSiz);
		this.Global.windowList = [];
		this.Global.windowPos = [];
		this.Global.windowSiz = [];
		for (var i = 0; i < this.ParentGlobal.windowList.length; i++) {
			this.Global.windowList[i] = this.ParentGlobal.windowList[i];
			this.Global.windowPos[i] = new SCMW_XYPair(this.ParentGlobal.windowPos[i]);
			this.Global.windowSiz[i] = new SCMW_XYPair(this.ParentGlobal.windowSiz[i]);
		}
	},
	/**
	 * 初始化
	 */
	initialize: function () {
		{ // 设置窗口环境
			if (typeof window.dialogArguments == "undefined") {
				WINDOW_ID = 0;
				PARENT_WINDOW = window;
				SCMultiWindow.Global = {
					sorption: 10,
					screenSiz: getScreenSiz(new SCMW_XYPair()),
					windowSiz: [new SCMW_XYPair()],
					windowPos: [new SCMW_XYPair()],
					windowList: [window]
				}
				SCMultiWindow.ParentGlobal = SCMultiWindow.Global
			}
			if (typeof WINDOW_ID == "undefined") {
				WINDOW_ID = window.dialogArguments[0];
				SCMultiWindow.ParentGlobal = window.dialogArguments[1];
				PARENT_WINDOW = window.dialogArguments[1].windowList[0];
				window.dialogArguments[1].windowList[WINDOW_ID] = window;
				window.dialogArguments[1].windowPos[WINDOW_ID] = new SCMW_XYPair();
				window.dialogArguments[1].windowSiz[WINDOW_ID] = new SCMW_XYPair();
			}
			SCMultiWindow.setSiz();
			SCMultiWindow.setPos();
			if (WINDOW_ID) {

				SCMultiWindow.copyGlobal();
				SCMultiWindow.startUpdate();
			}
			SCMultiWindow.XYres = SCMultiWindow.Global.screenSiz;
			SCMultiWindow.XYsiz = SCMultiWindow.Global.windowSiz[WINDOW_ID];
			SCMultiWindow.XYpos = SCMultiWindow.Global.windowPos[WINDOW_ID];
		}
		{ // 拖动操作
			SCMultiWindow.bolMove = false;
			document.body.onmousedown = function () {
				if (WINDOW_ID) SCMultiWindow.copyGlobal();
				var event = event || window.event;
				XYclickMouse = new SCMW_XYPair({"x": event.clientX, "y": event.clientY});
				SCMultiWindow.bolMove = true;
			}
			document.body.onmouseup = function () {
				SCMultiWindow.bolMove = false;
			}
			document.body.onmousemove = function () {
				if (SCMultiWindow.bolMove) {
					var event = event || window.event;
					SCMultiWindow.moveWindow(new SCMW_XYPair({
						x: event.clientX,
						y: event.clientY
					}));
				}
			}
			document.body.onmouseout = function () {
				SCMultiWindow.bolMove = false;
			}
		}
	}
}
function check() {
	var str = "", str1 = "", str2 = "";
	for (var i = 0; i < SCMultiWindow.Global.windowList.length; i++) {
		str1 += SCMultiWindow.Global.windowPos[i].log();
		str2 += SCMultiWindow.Global.windowSiz[i].log();
	}
	look.innerHTML = "<br />" + str1 + "<br />" + str2;
}