Set colItems = GetObject("winmgmts:\\.\root\cimv2").ExecQuery("Select * from Win32_DesktopMonitor",,48)
For Each objItem in colItems
	if (vartype(objItem.ScreenHeight) = 3) then msgbox "hh"
	if (vartype(objItem.ScreenWidth) = 3) then msgbox "hh"
Next