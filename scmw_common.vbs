Sub vbs_moveto(x, y)
	me.moveTo x, y
End Sub
Sub vbs_resizeto(x, y)
	me.resizeTo x, y
End Sub
Function getBorder(n)
	With CreateObject("internetexplorer.application")
		.Navigate "about:blank"
		.document.parentWindow.window.moveTo 0, 0
		n.x = .Left
		n.y = .Top
		.Quit
	End with
	Set getBorder = n
End Function
' 获取鼠标位置
Sub getMouse(mouseNow, x, y)
	mouseNow.x = top.screenLeft + x
	mouseNow.y = top.screenTop + y
End Sub
