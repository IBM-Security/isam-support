Scripts that process network traffic captured by the Solaris snoop command

Connection reuse
check_connection_reuse.sh will use tshark to read a snoop of SSL traffic and report any connections that have more than one request packet.  This lets us verify connection pooling is working.

Usage: check_connection_reuse.sh file.snoop

SSL session reuse
sessionids.sh and sessionid.awk can be run on a Solaris system, using snoop to read a snoop of SSL traffic and report how many SSL sessions were reused and how many the client asked for and the server didn't have them in its cache.  This lets us see if the SSL session cache may need increasing.  sessionids.sh needs to be updated to point to where sessionid.awk lives

Usage: sessionids.sh file.snoop
