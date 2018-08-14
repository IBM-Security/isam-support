#!/bin/bash
# Author: Nick Lloyd
# Email:  nlloyd@us.ibm.com
#
# Requires enabling the Embedded SNMP Agent at https://appliance_hostname/snmp
# See doc at https://www.ibm.com/support/knowledgecenter/SSPREK_9.0.5/com.ibm.isam.doc/admin/task/tsk_configuring_snmp.html
#
# History:
#
# 2018-08-14:		Intitial version.
#
# Pulls info from HOST-RESOURCES-MIB:
#
# HOST-RESOURCES-MIB::hrSWRunID
# HOST-RESOURCES-MIB::hrSWRunIndex
# HOST-RESOURCES-MIB::hrSWRunName
# HOST-RESOURCES-MIB::hrSWRunParameters
# HOST-RESOURCES-MIB::hrSWRunPath
# HOST-RESOURCES-MIB::hrSWRunPerfCPU
# HOST-RESOURCES-MIB::hrSWRunPerfMem
# HOST-RESOURCES-MIB::hrSWRunStatus
# HOST-RESOURCES-MIB::hrSWRunType
#
[ "$DEBUG" ] && set -x


MIB_OUTPUT=/tmp/mib-2.$$
PROCESS_ID=/tmp/process-id.$$
PS_OUTPUT=/tmp/ps.$$

numlines=25
refresh_rate=10

cleanUp()
{
	rm -f $PROCESS_ID
	rm -f $MIB_OUTPUT
	rm -f $PS_OUTPUT
	
	exit 0
}

Usage()
{
    echo ""
    echo "Usage: $0 -h appliance_hostname [ -l numlines ] [ -r refresh_rate ]"
    echo ""
    echo "where:"
    echo "  -h:             Appliance hostname."
    echo "  -l:             Number of lines to dispay.  The default is 25."
    echo "  -r:             The refresh rate.  The default is 10 seconds."

    exit 1
}

while getopts h:l:r: name
do
	case $name in
		h) appliance_hostname="$OPTARG"
		   HOST="$OPTARG"
		   ;;

		l) numlines="$OPTARG"
		   ;;

		r) refresh_rate="$OPTARG"
		   ;;

		*) Usage
		   ;;
	esac
done

trap cleanUp INT

[ "$HOST" ] || Usage

while :
do
	rm -f $MIB_OUTPUT
	for object in hrSWRunPerfTable hrSWRunTable
	do
		snmpwalk -v 2c -c public $HOST HOST-RESOURCES-MIB::$object >> $MIB_OUTPUT
	done 

	grep HOST-RESOURCES-MIB::hrSWRunIndex $MIB_OUTPUT | awk '{ print $ 4}' > $PROCESS_ID

	tput clear
	UPTIME=`snmpwalk -m ALL -v 2c -c public $HOST HOST-RESOURCES-MIB::hrSystemUptime | awk -F\) '{ print $2 }' | sed -e 's/ //'`
	printf "Hostname      = %s\n" "$HOST"
	printf "System Uptime = %s\n" "$UPTIME"
	printf "%-25.20s%-20.15s%-20.15s%-20.180s\n" " CPU (Centi-seconds)" "MEM (KBytes)" " Program" " Arguments"
	for id in `cat $PROCESS_ID`
	do
		NAME=`grep "HOST-RESOURCES-MIB::hrSWRunName.$id " $MIB_OUTPUT | awk -F\: '{ print $4 }'`
		RUNPATH=`grep "HOST-RESOURCES-MIB::hrSWRunPath.$id " $MIB_OUTPUT | awk -F\G: '{ print $2 }'`
		PARAMETERS=`grep "HOST-RESOURCES-MIB::hrSWRunParameters.$id " $MIB_OUTPUT | awk -FG: '{ print $2 }'`
		CPU=`grep "HOST-RESOURCES-MIB::hrSWRunPerfCPU.$id " $MIB_OUTPUT | awk -F\: '{ print $4 }'`
		MEM=`grep "HOST-RESOURCES-MIB::hrSWRunPerfMem.$id " $MIB_OUTPUT | awk -F\: '{ print $4 }' | awk '{ print $1 }'`

		echo "$PARAMETERS" | grep "\-Xms" > /dev/null 2>&1
		if [ $? == 0 ]
		then
			RUNPATH=" AAC: $RUNPATH"
		fi

		FOO=`echo "$RUNPATH $PARAMETERS" | sed -e 's/"//g'`
		printf "%-25.20s%-20.15s%-20.15s%-20.180s\n" "$CPU" "$MEM" "$NAME" "$FOO" >> $PS_OUTPUT
	done
	sort -rn $PS_OUTPUT | head --lines=$numlines
	rm -f $PS_OUTPUT
	sleep $refresh_rate
done

exit 0
