/**
 * |简·陋| 多窗体控制器
 * @version 0.9.0
 * @license GPL-3.0-or-later
 * @see https://github.com/simple-and-crude/multi-window
 */
"use strict";
declare var dialogArguments: [
	id: number,
	PARENT_GLOBAL: typeof SCMultiWindow.GLOBAL,
	WIN: typeof window,
	name: string,
] | undefined;
declare function showModelessDialog(url: string, varArgIn?: any, options?: string): Window;
declare var dialogWidth: string | undefined;
declare var dialogHeight: string | undefined;
declare var dialogLeft: string | undefined;
declare var dialogTop: string | undefined;
interface Window {
	SCMultiWindow: typeof SCMultiWindow;
}
declare function vbs_moveto(x: number, y: number): void;
declare function vbs_resizeto(x: number, y: number): void;
declare function getBorder(n: SCMultiWindow.XYPair): SCMultiWindow.XYPair;
/**获取鼠标位置 */
declare function getMouse(mouseNow: SCMultiWindow.XYPair, x: number, y: number): void;
/*test*/declare var con: HTMLAreaElement;
/*test*/declare var htaname: HTMLBaseElement;
/*test*/declare var htano: HTMLBaseElement;

namespace SCMultiWindow {

	/**************************************************************************\
	|******************************* 初始化环境 *******************************|
	\**************************************************************************/

	/**是否使用数字传递位置。如果您的屏幕分辨率大于四位数，请改为false */
	export let GET_POSDATA_BY_NUMBER = true;

	export interface DialogConfigParam {
		/**分窗高度 */
		dialogHeight?: string;
		/**分窗宽度 */
		dialogWidth?: string;
		/**和屏幕左边的距离 */
		dialogLeft?: string | "auto";
		/**和屏幕上边的距离 */
		dialogTop?: string | "auto";
		/**是否没有边框 */
		unadorned?: 0 | 1 | "yes" | "no";
		/**是否居中 */
		center?: 0 | 1 | "yes" | "no";
		/**是否显示帮助按钮 */
		help?: 0 | 1 | "yes" | "no";
		/**是否可被改变大小 */
		resizeable?: 0 | 1 | "yes" | "no";
		/**是否显示状态栏 */
		status?: 0 | 1 | "yes" | "no";
		/**是否显示滚动条 */
		scroll?: 0 | 1 | "yes" | "no" | "on" | "off";
		/**打印或者打印预览时是否隐藏 */
		dialogHide?: 0 | 1 | "yes" | "no" | "on" | "off";
		/**边框样式  */
		edge?: "raised" | "sunken";
	}
	/**分窗配置类 */
	export interface DialogConfig extends Required<DialogConfigParam> {
		/**返回配置字符串 */
		getFeat(): string;
	}
	export class DialogConfig {
		constructor(
			/**分窗的配置 */
			obj?: DialogConfigParam,
		) {
			if (!obj) return;
			for (const i in obj) (this as any)[i] = (obj as any)[i];
			if (!obj.dialogLeft && this.dialogLeft == "auto") this.dialogLeft = XYpos.x + "px";
			if (!obj.dialogTop && this.dialogTop == "auto") this.dialogTop = XYpos.y + "px";
		}
	}
	/**分窗配置类原型 */
	DialogConfig.prototype = {
		dialogHeight: "300px",
		dialogWidth: "300px",
		dialogLeft: "auto",
		dialogTop: "auto",
		unadorned: "yes",
		center: "no",
		help: "no",
		resizeable: "no",
		status: "no",
		scroll: "no",
		dialogHide: "no",
		edge: "raised",
		getFeat() {
			const attr: { [n: string]: true; } = { getFeat: true };
			const feat: string[] = [];
			for (const i in DialogConfig.prototype) i in attr || (attr[i] = true, feat.push(i + ":" + (this as any)[i] + ";"));
			for (const i in this) i in attr || feat.push(i + ":" + (this as any)[i] + ";");
			return feat.join('');
		},
	};

	export interface SCMW_DialogElementParam {
		/**分窗id */
		id?: number;
		/**分窗地址 */
		uri?: string;
		/**分窗配置 */
		config?: DialogConfigParam;
	}
	/**分窗元素类 */
	export interface SCMW_DialogElement extends Required<SCMW_DialogElementParam> {
		config: DialogConfig;
		/**分窗名称 */
		name: string;
		/**分窗window对象 */
		window: Window | { closed: true; };
	}
	export class SCMW_DialogElement {
		constructor(
			/**分窗的各属性 */
			obj: SCMW_DialogElementParam
		) {
			this.config = new DialogConfig(obj.config);
			this.id = typeof obj.id == "undefined" ? PARENT_GLOBAL.windowList.length : obj.id;
			PARENT_GLOBAL.windowList.push(null as any);
			if (obj.uri) this.uri = obj.uri;
			PARENT_GLOBAL.windowList[this.id] = this.window = WIN.showModelessDialog(this.uri, [this.id, PARENT_GLOBAL, WIN, this.name], this.config.getFeat());
		}
	}
	/**分窗元素类原型 */
	SCMW_DialogElement.prototype = {
		id: -1,
		name: "subWindow",
		uri: "http://www.baidu.com/",
		window: { closed: true },
		config: new DialogConfig(),
	};

	/**XY值对类 */
	export interface XYPair {
		/**X值 */
		x: number;
		/**Y值 */
		y: number;
		/**方便地输出当前的值 */
		log(): string;
	}
	export class XYPair {
		constructor(x?: number, y?: number) {
			typeof x === 'number' && (this.x = x);
			typeof y === 'number' && (this.y = y);
		}
	}
	/**XY值对类原型 */
	XYPair.prototype = {
		x: NaN,
		y: NaN,
		log() {
			return this.x + "," + this.y;
		},
	};

	/**能够安全使用的 {@link dialogArguments} */
	const diaArgs: [any, { windowSiz: XYPair[]; }, any, any] = window.dialogArguments!;
	/**本地全局变量 */
	export const GLOBAL = {
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
				value: 0,
			},
		},
		/**磁力吸附范围 */
		magRange: 10,
		/**各分窗尺寸 */
		windowSiz: ['dialogArguments' in window ? new XYPair(
			diaArgs[1].windowSiz[0].x,
			diaArgs[1].windowSiz[0].y,
		) : new XYPair()],
		/**新建分窗尺寸XY值对 */
		newSiz(
			/**新建的id */
			id: number
		) {
			GLOBAL.windowSiz[id] = new XYPair();
		},
		/**各分窗位置 */
		windowPos: [new XYPair()],
		/**分窗位置版本 */
		windowChanged: [] as number[],
		/**分窗位置是否已被更新 */
		alreadyChanged: [false],
		/**各分窗window对象 */
		windowList: [] as Window[],
		/**各分窗名称 */
		windowName: ["mainWindow"]
	};

	/**窗口id */
	const WINDOW_ID = typeof dialogArguments !== 'undefined' ? dialogArguments[0] : 0;
	/**窗口名称 */
	let WINDOW_NAME = typeof dialogArguments !== 'undefined' ? dialogArguments[3] ?? "subWindow" : "mainWindow";
	/**祖先窗口的全局变量 */
	export const PARENT_GLOBAL = typeof dialogArguments !== 'undefined' ? dialogArguments[1] : GLOBAL;
	/**父窗口 */
	export const PARENT_WINDOW: Window = typeof dialogArguments !== 'undefined' ? dialogArguments[2] : GLOBAL.windowList[0] = window;
	/**祖先窗口 */
	export const ANCESTOR_WINDOW: Window = typeof dialogArguments !== 'undefined' ? PARENT_GLOBAL.windowList[0]! : window;
	/**当前窗口window对象 */
	const WIN = window;
	/**是否开启磁力 */
	let magnetic = true;

	PARENT_GLOBAL.windowPos[WINDOW_ID] = new XYPair();
	PARENT_GLOBAL.windowSiz[WINDOW_ID] = new XYPair();

	/**当前窗口id */
	const ID = WINDOW_ID;

	/**************************************************************************\
	|***************************** 用户配置性函数 *****************************|
	\**************************************************************************/

	/**初始化分窗 */
	export function initDialog(
		/**分窗的属性 */
		...dialogs: SCMW_DialogElementParam[]
	) {
		for (let i = 0; i < dialogs.length; i++) new SCMW_DialogElement(dialogs[i]);
	}
	/**检测加载计时器 */
	let loadTimer: undefined | number = void 0;
	/**全部加载完成 */
	function allLoad() {
		for (let i = 1; i < GLOBAL.windowList.length; i++) if (!GLOBAL.windowList[i].closed) GLOBAL.windowList[i].SCMultiWindow.copyGlobal();
		event.allLoad();
	}
	/**加载完向主窗口报告 */
	export const upLoaded: () => void = ID ? ANCESTOR_WINDOW.SCMultiWindow.upLoaded : () => {
		clearTimeout(loadTimer);
		loadTimer = setTimeout(allLoad, 200);
	};

	/**初始化 */
	export function initialize() {
		getSiz(), getPos(), upLoaded();
/*test*/htano.innerText = '' + WINDOW_ID;
/*test*/htaname.innerText = WINDOW_NAME;
	}

	/**重新获取屏幕各项参数 */
	export function regetScreen() {
		const scr = PARENT_GLOBAL.Screen;
		const x = screen.availWidth;
		const y = screen.availHeight;
		const b = getBorder(new XYPair());
		PARENT_GLOBAL.Screen.changed++, scr.XYsiz.x = screen.width, scr.XYsiz.y = screen.height;
		scr.taskbar.value = (
			scr.taskbar.rule.x = Number(!(
				scr.taskbar.rule.y = Number(x == scr.XYsiz.x)
			))
		)
			? b.x != 0
				? b.x
				: x
			: b.y != 0
				? b.y
				: y;
	}
	if (!ID) regetScreen();

	/**获取或重设磁力范围 */
	export function magneticRange(
		/**新的磁力范围(px)，为空则不操作 */
		n?: number
	) {
		return typeof n == "undefined" ? GLOBAL.magRange : PARENT_GLOBAL.magRange = n;
	}

	/**获取或重设磁力开启状态 */
	export function magneticStatus(
		/**是否开启磁力。为空则不操作 */
		n?: boolean
	) {
		if (typeof n == "undefined") return magnetic;
		if (n) updateToAll();
		else for (let i = 0; i < GLOBAL.windowList.length; i++) GLOBAL.windowList[i].SCMultiWindow.GLOBAL.alreadyChanged[ID] = false;
		return magnetic = n;
	}

	/**获取窗口id */
	export function windowID() {
		return WINDOW_ID;
	}

	/**获取或重设窗口名称 */
	export function windowName(
		/**新名称，为空则不操作 */
		n?: string
	) {
		if (typeof n == "undefined") return WINDOW_NAME;
		for (let i = 0; i < GLOBAL.windowList.length; i++) if (!GLOBAL.windowList[i].closed) GLOBAL.windowList[i].SCMultiWindow.GLOBAL.windowName[ID] = n;
		return WINDOW_NAME = n;
	}

	/**需要跟随当前窗口的分窗列表 */
	export const dragList = {};

	/**简单分窗对象 */
	const subWin = {
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

	/**************************************************************************\
	|*************************** 数据拷贝及上传函数 ***************************|
	\**************************************************************************/

	/**复制窗体位置信息 */
	export function copyPos(
		/**窗体id */
		id: number,
		/**窗体位置信息 */
		data: string | false,
	) {
		let i: number;
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

	/**刷新本地全局变量 */
	function reloadGlobal(
		/**窗体数 */
		len: number
	) {
		for (let i = 0; i < len; i++) if (i != ID) GLOBAL.alreadyChanged[i] ? GLOBAL.alreadyChanged[i] = false : GLOBAL.windowList[i].closed ? closedList[i] = true : copyPos(i, GLOBAL.windowList[i].SCMultiWindow.update());
	}

	/**拷贝祖先全局变量到本地 */
	export function copyGlobal() {
		const real = PARENT_GLOBAL;
		const sham = GLOBAL;
		const reallen = real.windowList.length;
		const shamlen = sham.windowList.length;
		sham.magRange = real.magRange;
		if (sham.Screen.changed != real.Screen.changed) sham.Screen.taskbar.value = real.Screen.taskbar.value, sham.Screen.taskbar.rule.x = real.Screen.taskbar.rule.x, sham.Screen.taskbar.rule.y = real.Screen.taskbar.rule.y, sham.Screen.XYsiz.x = real.Screen.XYsiz.x, sham.Screen.XYsiz.y = real.Screen.XYsiz.y, sham.Screen.changed = real.Screen.changed;
		for (let i = shamlen; i < reallen; i++) {
			if (!sham.windowSiz[i]) sham.windowSiz[i] = new XYPair(real.windowSiz[i].x, real.windowSiz[i].y);
			sham.windowPos[i] = new XYPair(), sham.windowList[i] = real.windowList[i], sham.windowName[i] = real.windowName[i];
		}
		reloadGlobal(reallen);
	}

	/**已关闭的分窗列表 */
	const closedList: { [id: number]: true; } = {};
	/**上一次上传的数据记录 */
	const updateMem = [NaN, NaN, NaN, NaN];
	// /**当前位置信息版本 */
	// const updateNo;
	/**定时上传计时器对象 */
	let updateTimer: undefined | number = void 0;
	/**鼠标是否按下 */
	export let bolMove = false;

	/**传递窗口位置信息 */
	export function update() {
		// return magnetic ? updateMem[0] == XYpos.x ? updateMem[1] == XYpos.y ? updateNo : (updateMem[1] = XYpos.y, PARENT_GLOBAL.windowPos[ID].y = XYpos.y, updateNo += 1) : (updateMem[1] == XYpos.y ? (updateMem[0] = XYpos.x, PARENT_GLOBAL.windowPos[ID].x = XYpos.x) : (updateMem[0] = XYpos.x, PARENT_GLOBAL.windowPos[ID].x = XYpos.x, updateMem[1] = XYpos.y, PARENT_GLOBAL.windowPos[ID].y = XYpos.y), updateNo += 1) : -1;
		return magnetic ? XYpos.log() : false;
	}

	function updateToAll() {
		for (var i = 0, data = update(); i < GLOBAL.windowList.length; i++) if (i != ID && !closedList[i]) GLOBAL.windowList[i].SCMultiWindow.copyPos(ID, data), GLOBAL.windowList[i].SCMultiWindow.GLOBAL.alreadyChanged[ID] = true;
	}

	/**开启自动检测上传 */
	export function updateStart(
		/**两次上传间隔时间(ms) */
		n: number
	) {
		update(), updateTimer = setInterval(function () {
			if (!bolMove) update();
		}, n);
	}

	/**上传窗口尺寸 */
	export function updateSiz() {
		for (var i = 0; i < PARENT_GLOBAL.windowList.length; i++) {
			if ((updateMem[3] == XYsiz.x && updateMem[4] == XYsiz.y) || PARENT_GLOBAL.windowList[i].closed) continue;
			var shamGlobal = PARENT_GLOBAL.windowList[i].SCMultiWindow.GLOBAL;
			if (!shamGlobal.windowSiz[ID]) shamGlobal.newSiz(ID);
			if (updateMem[3] != XYsiz.x) shamGlobal.windowSiz[ID].x = XYsiz.x, updateMem[3] = XYsiz.x;
			if (updateMem[4] != XYsiz.y) shamGlobal.windowSiz[ID].y = XYsiz.y, updateMem[4] = XYsiz.y;
		}
	}

	/**************************************************************************\
	|*************************** 窗口尺寸及位置相关 ***************************|
	\**************************************************************************/

	/**窗口尺寸 */
	export const XYsiz = new XYPair();
	/**窗口位置 */
	export const XYpos = new XYPair();

	/**获取窗口尺寸 */
	export function getSiz() {
		return XYsiz.x = WIN.document.body.offsetWidth, XYsiz.y = WIN.document.body.offsetHeight, updateSiz(), XYsiz;
	}

	/**获取窗口位置 */
	export function getPos() {
		return XYpos.x = WIN.screenLeft, XYpos.y = WIN.screenTop, XYpos;
	}

	/**设置窗口尺寸 */
	export const setSiz: (/**窗口宽度 */x: number,/**窗口高度 */y: number) => void = ID
		? (x, y) => {
			WIN.dialogWidth = (XYpos.x = x) + "px", WIN.dialogHeight = (XYpos.y = y) + "px", updateSiz();
		}
		: (x, y) => {
			vbs_resizeto(XYsiz.x = x, XYsiz.y = y), updateSiz();
		};

	/**设置窗口位置 */
	export const setPos: (/**和屏幕左边的距离 */x: number,/**和屏幕上边的距离 */y: number) => void = ID
		? (x, y) => {
			WIN.dialogLeft = (XYpos.x = x) + "px", WIN.dialogTop = (XYpos.y = y) + "px";
		}
		: (x, y) => {
			vbs_moveto(XYpos.x = x, XYpos.y = y);
		};

	/**************************************************************************\
	|****************************** 窗口吸附相关 ******************************|
	\**************************************************************************/

	/**可被吸附的东西的名字 */
	type magObjName = number | "screen" | "taskbar";
	/**吸附的范围 */
	let calcValue = 0;
	/**窗口需要移动的距离 */
	let distList: number[] = [];
	/**每段距离对应的分窗id */
	let nameList: magObjName[] = [];
	/**用来计算的位置 */
	const XYcalc = new XYPair();
	/**当前正在计算的方向 */
	let magSign: "x" | "y";
	/**当前不在计算的方向 */
	let magCosign: "x" | "y";
	/**当前正在计算的分窗id */
	let calcName: magObjName = 0;
	/**已经吸附上的分窗列表 */
	export let engaList: { [name in magObjName]?: true } = {};

	/**判断一个边是否在吸附范围以内 */
	function magJudge(
		/**要判断的距离 */
		dist: number
	) {
		if (Math.abs(dist) <= calcValue) nameList.push(calcName), distList.push(dist);
	}

	/**判断一个窗口是否在吸附范围以内 */
	function magJudges(
		/**要判断的窗口的位置 */
		pos: number,
		/**要判断的窗口的尺寸 */
		siz: number,
	) {
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
		let min = Math.abs(distList[0]);
		let mini = 0;
		let t = Infinity;
		magEnga();
		for (let i = 0; i < distList.length; t = Math.abs(distList[++i])) if (t < min) min = t, mini = i;
		for (let i = 0; i < distList.length; i++) if (distList[i] == distList[mini]) engaList[nameList[i]] = true;
		XYcalc[magSign] -= typeof distList[0] == "undefined" ? 0 : distList[mini], distList = [], nameList = [];
	}

	/**移动窗口 */
	export function moveWindow(
		/**要移动到的横坐标 */
		x: number,
		/**要移动到的纵坐标 */
		y: number,
	) {
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
/*test*/con.innerText = "";
/*test*/for (var i in engaList) con.innerText += i + " ";
	}

	/**列出窗口当前正在吸附的分窗 */
	export function engaCalc() {
		copyGlobal(), engaList = {}, XYcalc.x = XYpos.x, XYcalc.y = XYpos.y, calcValue = 0;
		magSign = 'x', magCosign = 'y', magEnga();
		for (let i = 0; i < nameList.length; i++) engaList[nameList[i]] = true;
		distList = [], nameList = [];
		magSign = 'y', magCosign = 'x', magEnga();
		for (let i = 0; i < nameList.length; i++) engaList[nameList[i]] = true;
		distList = [], nameList = [];
/*test*/con.innerText = "";
/*test*/for (const i in engaList) con.innerText += i + " ";
	}

	/**************************************************************************\
	|******************************** 事件相关 ********************************|
	\**************************************************************************/

	/**当前的鼠标位置 */
	const mouseNow = new XYPair();
	/**点击时鼠标与窗口左上方的距离 */
	export const mouseOffset = new XYPair();
	/**事件函数对象 */
	export const event = {
		/**鼠标点下 */
		down(event: MouseEvent) {
			if (bolMove) return;
			event = event || window.event;
			bolMove = true, mouseOffset.x = event.clientX, mouseOffset.y = event.clientY;
			if (magnetic) ID ? copyGlobal() : reloadGlobal(GLOBAL.windowList.length);
			// need 让相邻窗口 copyGlobal
		},
		/**鼠标移动 */
		move(event: MouseEvent) {
			event = event || window.event;
			getMouse(mouseNow, event.clientX, event.clientY);
			if (bolMove) moveWindow(mouseNow.x - mouseOffset.x, mouseNow.y - mouseOffset.y);
		},
		/**鼠标抬起 */
		up() {
			if (!bolMove) return;
			bolMove = false;
			if (magnetic) updateToAll();
		},
		/**全部加载完成 */
		allLoad: function () { }
	};
}
var SCMW_DialogElement = SCMultiWindow.SCMW_DialogElement;
