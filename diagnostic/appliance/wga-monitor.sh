#!/bin/bash
# Author: Nick Lloyd
# Email:  nlloyd@us.ibm.com
#
# Requires enabling the Embedded SNMP Agent at https://appliance_hostname/snmp
# See doc at https://www.ibm.com/support/knowledgecenter/en/SSPREK_10.0.0/com.ibm.isva.doc/admin/task/tsk_configuring_snmp.html
#
# History:
#
# 2020-06-19:		Intitial version.
# 2020-07-13:		Added systemStats and memory.
# 2020-07-17:		Mimic options for snmpwalk.
# 2021-02-12:		Added looped for specific MIBs.
# 2021-03-21:		Mimc v3 options for snmpwalk.
#
[ "$DEBUG" ] && set -x

refresh_rate="300"
version="2c"
community="public"

cleanUp()
{
	exit 0
}

Usage()
{
	echo ""
	echo "Usage: $0 -h appliance_hostname [ -r refresh_rate ] [ -v snmp version ] [ -c community ] [ -l security_level ] [ -a protocol ] [-u security name ] [ -A passphrase ] [ -x privacy protcol ] [-X privacy passphrase ]"
	echo ""
	echo "where:"
	echo "  -h:		Appliance hostname."
	echo "  -r:		The refresh rate.  The default is 300 seconds."
	echo "  -v:		SNMP version.  1, 2c, or 3.  The default is 2c."
	echo "  -c:		SNMP Community.  The default is public."
	echo ""
	echo "V3 options when using -v 3."
	echo "  -l:		Security Level.  One of (noAuthNoPriv|authNoPriv|authPriv)"
	echo "  -a:		Authentication Protocol.  One of (MD5|SHA)"
	echo "  -u:		Security name used for authenticated SNMPv3 messages."
	echo "  -A:		Authentication passphrase used for authenticated SNMPv3 messages"
	echo "  -x:		Privacy protocol (DES or AES) used for encrypted SNMPv3 messages"
	echo "  -X:		Privacy passphrase used for encrypted SNMPv3 messages."
	echo ""
	echo "The script runs continously.  Use <Ctrl>C to stop."

    exit 1
}

while getopts h:r:v:c:l:a:u:A:x:X: name
do
	case $name in
		h) appliance_hostname="$OPTARG"
		   HOST="$OPTARG"
		   ;;

		r) refresh_rate="$OPTARG"
		   ;;

		v) version="$OPTARG"
		   ;;

		c) community="$OPTARG"
		   ;;

		l) security_level="$OPTARG"
		   ;;

		a) authentication_protocol="$OPTARG"
		   ;;

		u) security_name="$OPTARG"
		   ;;

		A) authentication_passphrase="$OPTARG"
		   ;;

		x) privacy_protocol="$OPTARG"
		   ;;

		X) privacy_passphrase="$OPTARG"
		   ;;

		*) Usage
		   ;;
	esac
done

trap cleanUp INT

[ "$HOST" ] || Usage

if [ "$version" = "2c" ]
then
	CLI_ARGS="-v $version -c $community $HOST"
else
	CLI_ARGS="-v $version -c $community -l $security_level -a $authentication_protocol -u $security_name -A $authentication_passphrase -x $privacy_protocol -X $privacy_passphrase $HOST"
fi

SNMP_SYSTEM_NAME=`snmpwalk $CLI_ARGS SNMPv2-MIB::sysName.0 | awk '{ print $4 }'`

while :
do
	TIME_STAMP=`date +"%Y-%m-%d-%H-%M-%S"`
	OUTPUT_LOG="$TIME_STAMP-$SNMP_SYSTEM_NAME.log"

	echo "$SNMP_SYSTEM_NAME ($OUTPUT_LOG)"
	echo "$SNMP_SYSTEM_NAME ($TIME_STAMP)" > $OUTPUT_LOG
	
	for table in rStorageTable hrSWRunTable hrSWRunPerfTable tcpConnTable udpTable
	do
		echo "=================================================="
		echo "TABLE = $table"
		echo "=================================================="
		snmptable $CLI_ARGS $table
		echo ""
	done >> $OUTPUT_LOG

	for comp in systemStats memory hrSWRunTable hrSWRunPerfTable
	do
		echo "=================================================="
		echo "COMP = $comp"
		echo "=================================================="
		snmpwalk $CLI_ARGS $comp
		echo ""
	done >> $OUTPUT_LOG

	for mib in TCP-MIB
	do
		echo "=================================================="
		echo "MIB = $mib"
		echo "=================================================="
		snmpwalk -m $mib $CLI_ARGS  | grep $mib
		echo ""
	done >> $OUTPUT_LOG
		
	sleep $refresh_rate
done

exit 0
