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
#
[ "$DEBUG" ] && set -x

refresh_rate=300
version=2c
community=public

cleanUp()
{
	exit 0
}

Usage()
{
    echo ""
    echo "Usage: $0 -h appliance_hostname [ -r refresh_rate ] [ -v snmp version ] [ -c community ]"
    echo ""
    echo "where:"
    echo "  -h:             Appliance hostname."
    echo "  -r:             The refresh rate.  The default is 300 seconds."
    echo "  -v:             SNMP version.  1, 2c, or 3.  The default is 2c."
    echo "  -c:             SNMP Community.  The default is public."
	echo ""
	echo "The script runs continously.  Use <Ctrl>C to stop."

    exit 1
}

while getopts h:r:v:c: name
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

		*) Usage
		   ;;
	esac
done


trap cleanUp INT

[ "$HOST" ] || Usage

SNMP_SYSTEM_NAME=`snmpwalk -v $version -c $community $HOST SNMPv2-MIB::sysName.0 | awk '{ print $4 }'`

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
		snmptable -v $version -c $community $HOST $table
		echo ""
	done >> $OUTPUT_LOG

	for comp in systemStats memory hrSWRunTable hrSWRunPerfTable
	do
		echo "=================================================="
		echo "COMP = $comp"
		echo "=================================================="
		snmpwalk -v $version -c $community $HOST $comp
		echo ""
	done >> $OUTPUT_LOG

	for mib in TCP-MIB
	do
		echo "=================================================="
		echo "mib = $mib"
		echo "=================================================="
		snmpwalk -m $mib -v $version -c $community $HOST | grep $mib
		echo ""
	done >> $OUTPUT_LOG
		
	sleep $refresh_rate
done

exit 0
