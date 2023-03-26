
	set sock=CreateObject("MSWinsock.Winsock")
	sock.Protocol = "1"
	sock.RemoteHost = "127.0.0.1"
	sock.RemotePort = "8083"
	sock.sendData "test"