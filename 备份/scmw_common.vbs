function setPos_getX()
	setPos_getX = top.screenleft
end function
function setPos_getY()
	setPos_getY = top.screentop
end function
function vbs_moveto(x, y)
	me.moveto x, y
end function
function vbs_resizeto(x, y)
	me.resizeto x, y
end function
function getScreenSiz(n)
	Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
	Set colItems = objWMIService.ExecQuery("Select * from Win32_DesktopMonitor",,48)
	n.x = createobject("htmlfile").parentWindow.screen.availWidth
	n.y = createobject("htmlfile").parentWindow.screen.availHeight
	set getScreenSiz = n
end function
function getMouse(param)
	param.x = top.screenLeft + param.x
	param.y = top.screenTop + param.y
	set getMouse = param
end function
function calcNowXY(param)
	param.x = param.x - XYclickMouse.x
	param.y = param.y - XYclickMouse.y
	set calcNowXY = param
end function
