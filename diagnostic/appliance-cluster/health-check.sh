#!/bin/sh
# This is an unsupported and unmaintained tool.
# Use at your own risk.
# Comments more than welcome.
# nlloyd@us.ibm.com
#
# 1.0			Intial Version.
#

[ "$DEBUG" ] && set -x

SUPPORT_FILE_TOP_DIR=$1

Usage()
{
    echo ""
    echo "Usage: $0 <directory of unzipped support file>"
    echo ""
    echo "where:"
	echo "	-h:				This help message."

    exit 1
}

if [ "$1" == "" ]
then
   Usage
fi

Info()
{
	echo "================================================================================"
	echo "SYSTEM INFO"
	echo "================================================================================"
	grep HostName "$SUPPORT_FILE_TOP_DIR/etc/policies/cml/mesa/gw_net/gw_net1_1_0.xml" | awk '{ print $2 }'
	grep sys.product.version "$SUPPORT_FILE_TOP_DIR/etc/settings.sys" | awk '{ print $3 }'
	grep sys.build.label "$SUPPORT_FILE_TOP_DIR/etc/settings.sys" | awk '{ print $3 }'
}

SSH_TUNNELS()
{
	echo "================================================================================"
	echo "ALL SSH TUNNELS"
	echo "================================================================================"
	grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }'
}

DSC_TUNNELS()
{
	echo "================================================================================"
	echo "DSC TUNNELS"
	echo "================================================================================"
	grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }' | grep -f cache-ports.lst -i
}

LDAP_TUNNELS()
{
	echo "================================================================================"
	echo "LDAP TUNNELS"
	echo "================================================================================"
	grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }' | grep -f v3-ports.lst -i
}

POSTGRES_TUNNELS()
{
	echo "================================================================================"
	echo "POSTGRES TUNNELS"
	echo "================================================================================"
	grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }' | grep -f pg-ports.lst -i
}

PDMGRD_PROCS()
{
	echo "================================================================================"
	echo "ISAM RUNTIME PROCS AND FILES"
	echo "================================================================================"
	grep -f ivmgrd.lst -i "$SUPPORT_FILE_TOP_DIR/support.txt" | grep -f ivmgrd-v.lst -v
	echo ""
    if [ -d "$SUPPORT_FILE_TOP_DIR/var/PolicyDirector/etc" ]
	then
		ls -l "$SUPPORT_FILE_TOP_DIR/var/PolicyDirector/etc"
	fi
}

LDAP_PROCS()
{
	echo "================================================================================"
	echo "LDAP RUNTIME PROCS"
	echo "================================================================================"
	grep -f v3.lst -i "$SUPPORT_FILE_TOP_DIR/support.txt" | grep -v wga_watchdogd | grep ep_pol | sort | uniq
}

POSTGRES_PROCS()
{
	echo "================================================================================"
	echo "POSTGRES PROCS"
	echo "================================================================================"
}

REAL_PORTS()
{
	echo "================================================================================"
	echo "ACTIVE PORTS IN LISTEN (I.E. NOT AN SSH TUNNEL)"
	echo "================================================================================"
	grep LISTEN "$SUPPORT_FILE_TOP_DIR/iswga/sockets.txt" | grep tcp | grep -f real-ports.lst
}

SSL_KEYSTORES()
{
	echo "================================================================================"
	echo "SSL KEYSTORES"
	echo "================================================================================"
	ls -lR "$SUPPORT_FILE_TOP_DIR/var/pdweb/shared/keytab"
}

while getopts h name
do
	case $name in
		h) Usage
		   ;;

        *) Usage
		   ;;
    esac
done

Info
echo ""
SSH_TUNNELS
echo ""
DSC_TUNNELS
echo ""
LDAP_TUNNELS
echo ""
POSTGRES_TUNNELS
echo ""
PDMGRD_PROCS
echo ""
LDAP_PROCS
echo ""
REAL_PORTS
echo ""
SSL_KEYSTORES

exit 0
