#!/bin/sh
# This is an unsupported and unmaintained tool.
# Use at your own risk.
# ts=4
# Comments more than welcome.
# nlloyd@us.ibm.com
#
# 1.0			2018-01-16: Intial Version.
# 1.1			2018-08-09: 9.0.5.0 added top command output.  If the tunnels are busy 
#							the grep catches, the format is different, and the ouptut
#							is wrong.
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
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "SYSTEM INFO"
	echo "================================================================================"
	grep HostName $SUPPORT_FILE_TOP_DIR/etc/policies/cml/mesa/gw_net/gw*.xml | awk '{ print $2 }'
	FIRMWARE_VERSION=`grep sys.product.version "$SUPPORT_FILE_TOP_DIR/etc/settings.sys" | awk '{ print $3 }'`
	echo $FIRMWARE_VERSION
	grep sys.build.label "$SUPPORT_FILE_TOP_DIR/etc/settings.sys" | awk '{ print $3 }'
}

CLUSTER_INFO()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "CLUSTER INFO"
	echo "================================================================================"
	grep isam_cluster.masters.primary "$SUPPORT_FILE_TOP_DIR//etc/settings.txt"
	grep isam_cluster.masters.secondary "$SUPPORT_FILE_TOP_DIR//etc/settings.txt"
	grep isam_cluster.masters.tertiary "$SUPPORT_FILE_TOP_DIR//etc/settings.txt"
	grep isam_cluster.masters.quatenary "$SUPPORT_FILE_TOP_DIR//etc/settings.txt"
	grep isam_cluster.masters.master_ere "$SUPPORT_FILE_TOP_DIR//etc/settings.txt"
}


SSH_TUNNELS()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "ALL SSH TUNNELS"
	echo "================================================================================"
	if [ "$FIRMWARE_VERSION" == "9.0.5.0" ]
	then
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ if (NF == 30) print $14 " " $15 " " $16 " " $28 }'
	elif [ "$FIRMWARE_VERSION" == "9.0.3.0" ]
	then
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ if (NF == 32) print $14 " " $15 " " $16 " " $30 }'
	else
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }'
	fi
}

DSC_TUNNELS()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "DSC TUNNELS"
	echo "================================================================================"
	if [ "$FIRMWARE_VERSION" == "9.0.3.0" ]
	then
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $30 }' | grep -f cache-ports.lst -i
	else
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }' | grep -f cache-ports.lst -i
	fi
}

LDAP_TUNNELS()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "LDAP TUNNELS"
	echo "================================================================================"
	grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }' | grep -f v3-ports.lst -i
}

POSTGRES_TUNNELS()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "POSTGRES TUNNELS"
	echo "================================================================================"
	if [ "$FIRMWARE_VERSION" == "9.0.3.0" ]
	then
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $30 }' | grep -f pg-ports.lst -i
	else
		grep -f ssh-tunnel.lst "$SUPPORT_FILE_TOP_DIR/support.txt" | grep "cluster@" | awk '{ print $14 " " $15 " " $16 " " $28 }' | grep -f pg-ports.lst -i
	fi
}

PDMGRD_PROCS()
{
	[ "$DEBUG" ] && set -x
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
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "LDAP RUNTIME PROCS"
	echo "================================================================================"
	grep -f v3.lst -i "$SUPPORT_FILE_TOP_DIR/support.txt" | grep -v wga_watchdogd | grep ep_pol | sort | uniq
}

POSTGRES_PROCS()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "POSTGRES PROCS"
	echo "================================================================================"
}

REAL_PORTS()
{
	[ "$DEBUG" ] && set -x
	echo "================================================================================"
	echo "ALL PORTS IN LISTEN"
	echo "================================================================================"
	grep LISTEN "$SUPPORT_FILE_TOP_DIR/iswga/sockets.txt" | grep tcp | grep -v ":::"
}

SSL_KEYSTORES()
{
	[ "$DEBUG" ] && set -x
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
CLUSTER_INFO
echo ""
SSH_TUNNELS
echo ""
DSC_TUNNELS
echo ""
LDAP_TUNNELS
echo ""
POSTGRES_TUNNELS
echo ""
REAL_PORTS
echo ""
PDMGRD_PROCS
echo ""
LDAP_PROCS
echo ""
SSL_KEYSTORES

exit 0
