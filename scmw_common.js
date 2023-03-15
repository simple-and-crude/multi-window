(function (/**|简·陋| 多窗体控制器对象 */Scmw) {
	{ // 初始化环境
		/**是否使用数字传递位置。如果您的屏幕分辨率大于四位数，请改为false */
		var GET_POSDATA_BY_NUMBER = true;
		/**
		 * 分窗配置类
		 * @param {object} obj 分窗的配置
		 * @param {string} obj.dialogHeight 分窗高度
		 * @param {string} obj.dialogWidth 分窗宽度
		 * @param {string|"auto"} obj.dialogLeft 和屏幕左边的距离
		 * @param {string|"auto"} obj.dialogTop 和屏幕上边的距离
		 * @param {0|1|"yes"|"no"} obj.unadorned 是否没有边框
		 * @param {0|1|"yes"|"no"} obj.center 是否居中
		 * @param {0|1|"yes"|"no"} obj.help 是否显示帮助按钮
		 * @param {0|1|"yes"|"no"} obj.resizeable 是否可被改变大小
		 * @param {0|1|"yes"|"no"} obj.status 是否显示状态栏
		 * @param {0|1|"yes"|"no"|"on"|"off"} obj.scroll 是否显示滚动条
		 * @param {0|1|"yes"|"no"|"on"|"off"} obj.dialogHide 打印或者打印预览时是否隐藏
		 * @param {"raised"|"sunken"} obj.edge 边框样式
		 */
		function DialogConfig(obj) {
			if (!obj) return;
			for (var i in obj) this[i] = obj[i];
			if (!obj.dialogLeft && this.dialogLeft == "auto") this.dialogLeft = XYpos.x + "px";
			if (!obj.dialogTop && this.dialogTop == "auto") this.dialogTop = XYpos.y + "px";
		}

		/**分窗配置类原型 */
		DialogConfig.prototype = {
			/**分窗高度 */
			dialogHeight: "300px",
			/**分窗宽度 */
			dialogWidth: "300px",
			/**和屏幕左边的距离
			 * @type {string|"auto"} */
			dialogLeft: "auto",
			/**和屏幕上边的距离
			 * @type {string|"auto"} */
			dialogTop: "auto",
			/**是否没有边框
			 * @type {0|1|"yes"|"no"} */
			unadorned: "yes",
			/**是否居中
			 * @type {0|1|"yes"|"no"} */
			center: "no",
			/**是否显示帮助按钮
			 * @type {0|1|"yes"|"no"} */
			help: "no",
			/**是否可被改变大小
			 * @type {0|1|"yes"|"no"} */
			resizeable: "no",
			/**是否显示状态栏
			 * @type {0|1|"yes"|"no"} */
			status: "no",
			/**是否显示滚动条
			 * @type {0|1|"yes"|"no"|"on"|"off"} */
			scroll: "no",
			/**打印或者打印预览时是否隐藏
			 * @type {0|1|"yes"|"no"|"on"|"off"} */
			dialogHide: "no",
			/**边框样式
			 * @type {"raised"|"sunken"} */
			edge: "raised",
			/**返回配置字符串
			 * @returns {string} 字符串 */
			getFeat: function () {
				var i, feat = "", attr = { getFeat: true };
				for (i in DialogConfig.prototype) feat += attr[i] ? "" : (attr[i] = true, i + ":" + this[i] + ";");
				for (i in this) feat += attr[i] ? "" : i + ":" + this[i] + ";";
				return feat;
			}
		};

		/**
		 * 分窗元素类
		 * @param {object} obj 分窗的各属性
		 * @param {number} obj.id 分窗id
		 * @param {string} obj.name 分窗名称
		 * @param {string} obj.uri 分窗地址
		 * @param {object} obj.config 分窗配置
		 * @param {string} obj.config.dialogHeight 分窗高度
		 * @param {string} obj.config.dialogWidth 分窗宽度
		 * @param {string|"auto"} obj.config.dialogLeft 和屏幕左边的距离
		 * @param {string|"auto"} obj.config.dialogTop 和屏幕上边的距离
		 * @param {0|1|"yes"|"no"} obj.config.unadorned 是否没有边框
		 * @param {0|1|"yes"|"no"} obj.config.center 是否居中
		 * @param {0|1|"yes"|"no"} obj.config.help 是否显示帮助按钮
		 * @param {0|1|"yes"|"no"} obj.config.resizeable 是否可被改变大小
		 * @param {0|1|"yes"|"no"} obj.config.status 是否显示状态栏
		 * @param {0|1|"yes"|"no"|"on"|"off"} obj.config.scroll 是否显示滚动条
		 * @param {0|1|"yes"|"no"|"on"|"off"} obj.config.dialogHide 打印或者打印预览时是否隐藏
		 * @param {"raised"|"sunken"} obj.config.edge 边框样式
		 */
		function SCMW_DialogElement(obj) {
			this.config = new DialogConfig(obj.config);
			this.id = typeof obj.id == "undefined" ? PARENT_GLOBAL.windowList.length : obj.id;
			PARENT_GLOBAL.windowList.push(null);
			if (obj.uri) this.uri = obj.uri;
			PARENT_GLOBAL.windowList[this.id] = this.window = WIN.showModelessDialog(this.uri, [this.id, PARENT_GLOBAL, WIN, this.name], this.config.getFeat());
		}

		/**分窗元素类原型 */
		SCMW_DialogElement.prototype = {
			/**分窗id */
			id: -1,
			/**分窗名称 */
			name: "subWindow",
			/**分窗地址
			 * @type {URIString} */
			uri: "http://www.baidu.com/",
			/**分窗window对象
			 * @type {window} */
			window: { closed: true },
			/**分窗配置 */
			config: new DialogConfig()
		};

		window.SCMW_DialogElement = SCMW_DialogElement;

		/**
		 * XY值对类
		 * @param {number} x X的值
		 * @param {number} y Y的值
		 */
		function XYPair(x, y) {
			this.x = x;
			this.y = y;
		}

		/**XY值对类原型 */
		XYPair.prototype = {
			/**X值 */
			x: NaN,
			/**Y值 */
			y: NaN,
			/**方便地输出当前的值
			 * @returns {string} 当前值的字符串 */
			log: function () {
				return this.x + "," + this.y;
			}
		};

		/**本地全局变量 */
		var GLOBAL = {
			/**屏幕信息 */
			Screen: {
				/**信息版本 */
				changed: 0,
				/**屏幕大小 */
				XYsiz: new XYPair(),
				/**任务栏信息 */
				taskbar: {
					/**任务栏方向（横或纵） */
					rule: new XYPair(),
					/**任务栏位置值 */
					value: 0
				}
			},
			/**磁力吸附范围 */
			magRange: 10,
			/**各分窗尺寸 */
			windowSiz: [window.dialogArguments ? new XYPair(
				dialogArguments[1].windowSiz[0].x,
				dialogArguments[1].windowSiz[0].y
			) : new XYPair()],
			/**新建分窗尺寸XY值对
			 * @param {number} id 新建的id */
			newSiz: function (id) {
				GLOBAL.windowSiz[id] = new XYPair();
			},
			/**各分窗位置 */
			windowPos: [new XYPair()],
			/**分窗位置版本
			 * @type {number[]} */
			windowChanged: [],
			/**分窗位置是否已被更新 */
			alreadyChanged: [false],
			/**各分窗window对象
			 * @type {window[]} */
			windowList: [],
			/**各分窗名称 */
			windowName: ["mainWindow"]
		};

		var /**窗口id */
			WINDOW_ID = -1,
			/**窗口名称 */
			WINDOW_NAME = "subWindow",
			/**祖先窗口的全局变量 */
			PARENT_GLOBAL = GLOBAL,
			/**父窗口 */
			PARENT_WINDOW = window,
			/**祖先窗口 */
			ANCESTOR_WINDOW = window,
			/**当前窗口window对象 */
			WIN = window,
			/**是否开启磁力 */
			magnetic = true;

		if (window.dialogArguments) {
			WINDOW_ID = dialogArguments[0];
			PARENT_GLOBAL = dialogArguments[1];
			PARENT_WINDOW = dialogArguments[2];
			WINDOW_NAME = dialogArguments[3];
			ANCESTOR_WINDOW = PARENT_GLOBAL.windowList[0];
		} else {
			WINDOW_ID = 0;
			WINDOW_NAME = "mainWindow";
			ANCESTOR_WINDOW = PARENT_WINDOW = window;
			PARENT_GLOBAL = GLOBAL;
			GLOBAL.windowList[0] = window;
		}
		Scmw.GLOBAL = GLOBAL;
		Scmw.PARENT_GLOBAL = PARENT_GLOBAL;
		Scmw.PARENT_WINDOW = PARENT_WINDOW;
		Scmw.ANCESTOR_WINDOW = ANCESTOR_WINDOW;
		PARENT_GLOBAL.windowPos[WINDOW_ID] = new XYPair();
		PARENT_GLOBAL.windowSiz[WINDOW_ID] = new XYPair();

		/**当前窗口id */
		var ID = WINDOW_ID;
	} { // 用户配置性函数
		/**
		 * 初始化分窗
		 * @param {...DialogElement} dialogs 分窗的属性
		 */
		function initDialog() {
			for (var i = 0; i < arguments.length; i++) new SCMW_DialogElement(arguments[i]);
		}

		/**检测加载计时器 */
		var loadTimer = null;

		/**全部加载完成 */
		function allLoad() {
			for (var i = 1; i < GLOBAL.windowList.length; i++) if (!GLOBAL.windowList[i].closed) GLOBAL.windowList[i].SCMultiWindow.copyGlobal();
			event.allLoad();
		}

		/**加载完向主窗口报告 */
		function upLoaded() {}
		upLoaded = ID ? ANCESTOR_WINDOW.SCMultiWindow.upLoaded : function () {
			clearTimeout(loadTimer);
			loadTimer = setTimeout(allLoad, 200);
		};

		/**初始化 */
		function initialize() {
			getSiz(), getPos(), upLoaded();
/* debug */	htano.innerText = WINDOW_ID;
/* debug */	htaname.innerText = WINDOW_NAME;
		}

		/**重新获取屏幕各项参数 */
		function regetScreen() {
			var scr = PARENT_GLOBAL.Screen, x = screen.availWidth, y = screen.availHeight, b = getBorder(new XYPair());
			PARENT_GLOBAL.Screen.changed++, scr.XYsiz.x = screen.width, scr.XYsiz.y = screen.height;
			scr.taskbar.value = (scr.taskbar.rule.x = !(scr.taskbar.rule.y = x == scr.XYsiz.x)) ? b.x != 0 ? b.x : x : b.y != 0 ? b.y : y;
		}
		if (!ID) regetScreen();

		/**
		 * 获取或重设磁力范围
		 * @param {number} n 新的磁力范围(px)，为空则不操作
		 * @returns {number} 当前的磁力范围(px)
		 */
		function magneticRange(n) {
			return typeof n == "undefined" ? GLOBAL.magRange : PARENT_GLOBAL.magRange = n;
		}

		/**
		 * 获取或重设磁力开启状态
		 * @param {boolean} n 是否开启磁力。为空则不操作
		 * @returns {boolean} 当前磁力是否开启
		 */
		function magneticStatus(n) {
			if (typeof n == "undefined") return magnetic;
			if (n) updateToAll();
			else for (var i = 0; i < GLOBAL.windowList.length; i++) GLOBAL.windowList[i].SCMultiWindow.GLOBAL.alreadyChanged[ID] = false;
			return magnetic = n;
		}

		/**
		 * 获取窗口id
		 * @returns {number} 窗口的id
		 */
		function windowID() {
			return WINDOW_ID;
		}

		/**
		 * 获取或重设窗口名称
		 * @param {string} n 新名称，为空则不操作
		 * @returns {string} 当前的名称
		 */
		function windowName(n) {
			if (typeof n == "undefined") return WINDOW_NAME;
			for (var i = 0; i < GLOBAL.windowList.length; i++) if (!GLOBAL.windowList[i].closed) GLOBAL.windowList[i].SCMultiWindow.GLOBAL.windowName[ID] = n;
			return WINDOW_NAME = n;
		}

		/**需要跟随当前窗口的分窗列表 */
		var dragList = {};

		/**简单分窗对象 */
		var subWin = {
			name: "",
			id: -1
		};

		// /**
		//  * 添加需要跟随当前窗口的分窗
		//  * @param {...subWin} subWindows 要添加的分窗的数组，忽略为空的参数
		//  * @example
		//  * //添加所有分窗
		//  * addDragging({});
		//  *
		//  * //添加id为1的分窗，若没有则添加失败
		//  * addDragging({id: 1});
		//  *
		//  * //添加名称为IloveU的分窗，若没有则添加失败
		//  * addDragging({name: "IloveU"});
		//  *
		//  * //添加id为1且名称为IloveU的分窗，若没有则添加失败
		//  * addDragging({name: "IloveU", id: 1});
		//  */
		// function addDragging() {
		// 	for (var param = arguments, i = 0; i < param.length; i++) {
		// 		if (typeof param[i].id == "undefined") {
		// 			if (!param[i].name) for (var j = 0; j < GLOBAL.windowList.length; j++) dragList[j] = true;
		// 			else for (var j = 0; j < GLOBAL.windowList.length; j++) if (GLOBAL.windowName[j] == param[i].name) dragList[j] = true;
		// 		} else if (!param[i].name) dragList[param[i].id] = true;
		// 		else if (GLOBAL.windowName[param[i].id] == param[i].name) dragList[param[i].id] = true;
		// 	}
		// }

		// /**
		//  * 获取需要跟随当前窗口的分窗的数组
		//  * @returns {subWin[]} 分窗的数组
		//  */
		// function getDragging() {
		// 	var list = [];
		// 	for (var i in dragList) {
		// 		list.push({
		// 			name: GLOBAL.windowName[i],
		// 			id: Number(i)
		// 		});
		// 	}
		// 	return list;
		// }

		// /**
		//  * 抛弃需要跟随当前窗口的分窗
		//  * @param {...subWin} subWindows 要抛弃的分窗的数组，忽略为空的参数
		//  */
		// function delDragging() {
		// 	for (var param = arguments, i = 0; i < param.length; i++) {
		// 		if (typeof param[i].id == "undefined") {
		// 			if (!param[i].name) {
		// 				dragList = {};
		// 				return;
		// 			}
		// 			else for (var j = 0; j < GLOBAL.windowList.length; j++) if (GLOBAL.windowName[j] == param[i].name) dragList[j] = true;
		// 		} else if (!param[i].name) dragList[param[i].id] = true;
		// 		else if (GLOBAL.windowName[param[i].id] == param[i].name) dragList[param[i].id] = true;
		// 	}
		// }

		Scmw.initDialog = initDialog;
		Scmw.upLoaded = upLoaded;
		Scmw.initialize = initialize;
		Scmw.regetScreen = regetScreen;
		Scmw.magneticRange = magneticRange;
		Scmw.magneticStatus = magneticStatus;
		Scmw.windowID = windowID
		Scmw.windowName = windowName;
		// Scmw.addDragging = addDragging;
		// Scmw.getDragging = getDragging;
		// Scmw.delDragging = delDragging;
	} { // 数据拷贝及上传函数
		/**
		 * 复制窗体位置信息
		 * @param {number} id 窗体id
		 * @param {string|false} data 窗体位置信息
		 */
		function copyPos(id, data) {
			var i;
			if (data) delete closedList[id], i = data.indexOf(','), GLOBAL.windowPos[id].x = Number(data.substring(0, i++)), GLOBAL.windowPos[id].y = Number(data.substring(i, data.length));
			else closedList[id] = true;
		}
		// copyPos = ID ? function (id, changed) {
		// 	if (changed != -1) delete closedList[id], changed != GLOBAL.windowChanged[id] ? (GLOBAL.windowPos[id].x = PARENT_GLOBAL.windowPos[id].x, GLOBAL.windowPos[id].y = PARENT_GLOBAL.windowPos[id].y, GLOBAL.windowChanged[id] = changed) : void (0);
		// 	else closedList[id] = true;
		// } : function (id, changed) {
		// 	if (changed != -1) delete closedList[id], changed != GLOBAL.windowChanged[id] ? GLOBAL.windowChanged[id] = changed : void (0);
		// 	else closedList[id] = true;
		// };

		/**
		 * 刷新本地全局变量
		 * @param {number} len 窗体数
		 */
		function reloadGlobal(len) {
			for (i = 0; i < len; i++) if (i != ID) GLOBAL.alreadyChanged[i] ? GLOBAL.alreadyChanged[i] = false : GLOBAL.windowList[i].closed ? closedList[i] = true : copyPos(i, GLOBAL.windowList[i].SCMultiWindow.update());
		}

		/**拷贝祖先全局变量到本地 */
		function copyGlobal() {
			var i, real = PARENT_GLOBAL, sham = GLOBAL, reallen = real.windowList.length, shamlen = sham.windowList.length;
			sham.magRange = real.magRange;
			if (sham.Screen.changed != real.Screen.changed) sham.Screen.taskbar.value = real.Screen.taskbar.value, sham.Screen.taskbar.rule.x = real.Screen.taskbar.rule.x, sham.Screen.taskbar.rule.y = real.Screen.taskbar.rule.y, sham.Screen.XYsiz.x = real.Screen.XYsiz.x, sham.Screen.XYsiz.y = real.Screen.XYsiz.y, sham.Screen.changed = real.Screen.changed;
			for (i = shamlen; i < reallen; i++) {
				if (!sham.windowSiz[i]) sham.windowSiz[i] = new XYPair(real.windowSiz[i].x, real.windowSiz[i].y);
				sham.windowPos[i] = new XYPair(), sham.windowList[i] = real.windowList[i], sham.windowName[i] = real.windowName[i];
			}
			reloadGlobal(reallen);
		}

		var /**已关闭的分窗列表 */
			closedList = {},
			/**上一次上传的数据记录 */
			updateMem = [NaN, NaN, NaN, NaN],
			// /**当前位置信息版本 */
			// updateNo,
			/**定时上传计时器对象 */
			updateTimer = null;

		/**
		 * 传递窗口位置信息
		 * @returns {string|false} 信息
		 */
		function update() {
			// return magnetic ? updateMem[0] == XYpos.x ? updateMem[1] == XYpos.y ? updateNo : (updateMem[1] = XYpos.y, PARENT_GLOBAL.windowPos[ID].y = XYpos.y, updateNo += 1) : (updateMem[1] == XYpos.y ? (updateMem[0] = XYpos.x, PARENT_GLOBAL.windowPos[ID].x = XYpos.x) : (updateMem[0] = XYpos.x, PARENT_GLOBAL.windowPos[ID].x = XYpos.x, updateMem[1] = XYpos.y, PARENT_GLOBAL.windowPos[ID].y = XYpos.y), updateNo += 1) : -1;
			return magnetic ? XYpos.log() : false;
		}

		function updateToAll() {
			for (var i = 0, data = update(); i < GLOBAL.windowList.length; i++) if (i != ID && !closedList[i]) GLOBAL.windowList[i].SCMultiWindow.copyPos(ID, data), GLOBAL.windowList[i].SCMultiWindow.GLOBAL.alreadyChanged[ID] = true;
		}

		/**
		 * 开启自动检测上传
		 * @param {number} n 两次上传间隔时间(ms)
		 */
		function updateStart(n) {
			update(), updateTimer = setInterval(function () {
				if (!Scmw.bolMove) update();
			}, n);
		}

		/**上传窗口尺寸 */
		function updateSiz() {
			for (var i = 0; i < PARENT_GLOBAL.windowList.length; i++) {
				if ((updateMem[3] == XYsiz.x && updateMem[4] == XYsiz.y) || PARENT_GLOBAL.windowList[i].closed) continue;
				var shamGlobal = PARENT_GLOBAL.windowList[i].SCMultiWindow.GLOBAL;
				if (!shamGlobal.windowSiz[ID]) shamGlobal.newSiz(ID);
				if (updateMem[3] != XYsiz.x) shamGlobal.windowSiz[ID].x = XYsiz.x, updateMem[3] = XYsiz.x;
				if (updateMem[4] != XYsiz.y) shamGlobal.windowSiz[ID].y = XYsiz.y, updateMem[4] = XYsiz.y;
			}
		}

		Scmw.copyPos = copyPos;
		Scmw.copyGlobal = copyGlobal;
		Scmw.updateTimer = updateTimer;
		Scmw.update = update;
		Scmw.updateStart = updateStart;
		Scmw.updateSiz = updateSiz;
	} { // 窗口尺寸及位置相关
		/**窗口尺寸 */
		var XYsiz = new XYPair();
		/**窗口位置 */
		var XYpos = new XYPair();

		/**
		 * 获取窗口尺寸
		 * @returns {XYPair} 窗口尺寸
		 */
		function getSiz() {
			return XYsiz.x = WIN.document.body.offsetWidth, XYsiz.y = WIN.document.body.offsetHeight, updateSiz(), XYsiz;
		}

		/**
		 * 获取窗口位置
		 * @returns {XYPair} 窗口位置
		 */
		function getPos() {
			return XYpos.x = WIN.screenLeft, XYpos.y = WIN.screenTop, XYpos;
		}

		/**
		 * 设置窗口尺寸
		 * @param {number} x 窗口宽度
		 * @param {number} y 窗口高度
		 */
		function setSiz(x, y) { x, y; }
		setSiz = ID ? function (x, y) {
			WIN.dialogWidth = (XYpos.x = x) + "px", WIN.dialogHeight = (XYpos.y = y) + "px", updateSiz();
		} : function (x, y) {
			vbs_resizeto(XYsiz.x = x, XYsiz.y = y), updateSiz();
		};

		/**
		 * 设置窗口位置
		 * @param {number} x 和屏幕左边的距离
		 * @param {number} y 和屏幕上边的距离
		 */
		function setPos(x, y) { x, y; }
		setPos = ID ? function (x, y) {
			WIN.dialogLeft = (XYpos.x = x) + "px", WIN.dialogTop = (XYpos.y = y) + "px";
		} : function (x, y) {
			vbs_moveto(XYpos.x = x, XYpos.y = y);
		};

		Scmw.XYpos = XYpos;
		Scmw.XYsiz = XYsiz;
		Scmw.setSiz = setSiz;
		Scmw.setPos = setPos;
		Scmw.getSiz = getSiz;
		Scmw.getPos = getPos;
	} { // 窗口吸附相关
		var /**吸附的范围 */
			calcValue = 0,
			/**窗口需要移动的距离
			 * @type {number[]} */
			distList = [],
			/**每段距离对应的分窗id
			 * @type {(number|"screen"|"taskbar")[]} */
			nameList = [],
			/**用来计算的位置 */
			XYcalc = new XYPair(),
			/**当前正在计算的方向
			 * @type {("x"|"y")} */
			magSign,
			/**当前不在计算的方向
			 * @type {("x"|"y")} */
			magCosign,
			/**当前正在计算的分窗id
			 * @type {(number|"screen"|"taskbar")} */
			calcName = 0,
			/**已经吸附上的分窗列表 */
			engaList = {};

		/**
		 * 判断一个边是否在吸附范围以内
		 * @param {number} dist 要判断的距离
		 */
		function magJudge(dist) {
			if (Math.abs(dist) <= calcValue) nameList.push(calcName), distList.push(dist);
		}

		/**
		 * 判断一个窗口是否在吸附范围以内
		 * @param {number} pos 要判断的窗口的位置
		 * @param {number} siz 要判断的窗口的尺寸
		 */
		function magJudges(pos, siz) {
			magJudge(XYcalc[magSign] - pos);
			magJudge(XYcalc[magSign] + XYsiz[magSign] - pos);
			magJudge(XYcalc[magSign] - pos - siz);
			magJudge(XYcalc[magSign] + XYsiz[magSign] - pos - siz);
		}

		/**列出能够吸附上的边和对应的分窗名称 */
		function magEnga() {
			calcName = "screen", magJudges(0, GLOBAL.Screen.XYsiz[magSign]);
			if (GLOBAL.Screen.taskbar.rule[magSign]) {
				calcName = "taskbar";
				magJudge(XYcalc[magSign] - GLOBAL.Screen.taskbar.value);
				magJudge(XYcalc[magSign] + XYsiz[magSign] - GLOBAL.Screen.taskbar.value);
			}
			for (calcName = 0; calcName < GLOBAL.windowList.length; calcName++)
				if (calcName != ID && !closedList[calcName]) {
					var dmin = GLOBAL.windowPos[calcName][magCosign], dsiz = GLOBAL.windowSiz[calcName][magCosign], dmax = dmin + dsiz, now = XYpos[magCosign];
					if ((now == dmin) || (now < dmin && dmin <= now + XYsiz[magCosign]) || (now > dmin && now <= dmax)) magJudges(GLOBAL.windowPos[calcName][magSign], GLOBAL.windowSiz[calcName][magSign]);
				}
		}

		/**移动窗口的一个方向 */
		function magtion() {
			for (var i = (magEnga(), 0), min = Math.abs(distList[0]), mini = 0, t; i < distList.length; t = Math.abs(distList[++i])) if (t < min) min = t, mini = i;
			for (i = 0; i < distList.length; i++) if (distList[i] == distList[mini]) engaList[nameList[i]] = true;
			XYcalc[magSign] -= typeof distList[0] == "undefined" ? 0 : distList[mini], distList = [], nameList = [];
		}

		/**
		 * 移动窗口
		 * @param {number} x 要移动到的横坐标
		 * @param {number} y 要移动到的纵坐标
		 */
		function moveWindow(x, y) {
			if (magnetic) {
				engaList = {}, calcValue = GLOBAL.magRange, XYcalc.x = x, XYcalc.y = y;
				magSign = 'x', magCosign = 'y', magtion();
				magSign = 'y', magCosign = 'x', magtion();
				x = XYcalc.x, y = XYcalc.y;
			}
			// if (!WINDOW_ID) {
			// 	GLOBAL.windowList[2].SCMultiWindow.moveWindow(x + XYsiz.x, y);
			// }
			setPos(x, y);
/* debug */	con.innerText = "";
/* debug */	for (var i in engaList) con.innerText += i + " ";
		}

		/**列出窗口当前正在吸附的分窗 */
		function engaCalc() {
			copyGlobal(), engaList = {}, XYcalc.x = XYpos.x, XYcalc.y = XYpos.y, calcValue = 0
			magSign = 'x', magCosign = 'y', magEnga();
			for (var i = 0; i < nameList.length; i++) engaList[nameList[i]] = true;
			distList = [], nameList = [];
			magSign = 'y', magCosign = 'x', magEnga();
			for (var i = 0; i < nameList.length; i++) engaList[nameList[i]] = true;
			distList = [], nameList = [];
/* debug */	con.innerText = "";
/* debug */	for (var i in engaList) con.innerText += i + " ";
		}

		Scmw.moveWindow = moveWindow;
		Scmw.engaCalc = engaCalc;
		Scmw.engaList = engaList;
		Scmw.dragList = dragList;
	} { // 事件相关
		var /**当前的鼠标位置 */
			mouseNow = new XYPair(),
			/**点击时鼠标与窗口左上方的距离 */
			mouseOffset = new XYPair(),
			/**事件函数对象 */
			event = {
				/**鼠标点下 */
				down: function (event) {
					if (Scmw.bolMove) return;
					event = event || window.event;
					Scmw.bolMove = true, mouseOffset.x = event.clientX, mouseOffset.y = event.clientY;
					if (magnetic) ID ? copyGlobal() : reloadGlobal(GLOBAL.windowList.length);
					// need 让相邻窗口 copyGlobal
				},
				/**鼠标移动 */
				move: function (event) {
					event = event || window.event;
					getMouse(mouseNow, event.clientX, event.clientY);
					if (Scmw.bolMove) moveWindow(mouseNow.x - mouseOffset.x, mouseNow.y - mouseOffset.y);
				},
				/**鼠标抬起 */
				up: function () {
					if (!Scmw.bolMove) return;
					Scmw.bolMove = false;
					if (magnetic) updateToAll();
				},
				/**全部加载完成 */
				allLoad: function () { }
			};

		Scmw.bolMove = false;
		Scmw.mouseClicked = mouseOffset;
		Scmw.event = event;
	}
}(SCMultiWindow = {
	/**鼠标是否按下 */
	bolMove: false
}));