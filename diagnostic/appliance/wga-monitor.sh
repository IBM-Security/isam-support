#!/bin/bash
# Author: Nick Lloyd
# Email:  nlloyd@us.ibm.com
#
# Requires enabling the Embedded SNMP Agent at https://appliance_hostname/snmp
# See doc at https://www.ibm.com/support/knowledgecenter/en/SSPREK_10.0.0/com.ibm.isva.doc/admin/task/tsk_configuring_snmp.html
#
# History:
#
# 2020-06-19:       Intitial version.
#
[ "$DEBUG" ] && set -x

refresh_rate=300

cleanUp()
{
    exit 0
}

Usage()
{
    echo ""
    echo "Usage: $0 -h appliance_hostname [ -r refresh_rate ]"
    echo ""
    echo "where:"
    echo "  -h:             Appliance hostname."
    echo "  -r:             The refresh rate.  The default is 300 seconds."

    exit 1
}

while getopts h:r: name
do
    case $name in
        h) appliance_hostname="$OPTARG"
           HOST="$OPTARG"
           ;;

        r) refresh_rate="$OPTARG"
           ;;

        *) Usage
           ;;
    esac
done

trap cleanUp INT

[ "$HOST" ] || Usage

SNMP_SYSTEM_NAME=`snmpwalk  -v 2c -c public $HOST SNMPv2-MIB::sysName.0 | awk '{ print $4 }'`

while :
do
    TIME_STAMP=`date +"%Y-%m-%d-%H-%M-%S"`
    OUTPUT_LOG="$TIME_STAMP-$SNMP_SYSTEM_NAME.log"

    echo "$SNMP_SYSTEM_NAME ($TIME_STAMP)"
    echo "$SNMP_SYSTEM_NAME ($TIME_STAMP)" > $OUTPUT_LOG

    for table in rStorageTable hrSWRunTable hrSWRunPerfTable
    do
        echo "=================================================="
        echo "TABLE = $table"
        echo "=================================================="
        snmptable -mALL -v 2c -c public $HOST $table
        echo ""
    done >> $OUTPUT_LOG

    for table in hrSWRunTable hrSWRunPerfTable
    do
        echo "=================================================="
        echo "TABLE = $table"
        echo "=================================================="
        snmpwalk -v 2c -c public $HOST $table
        echo ""
    done >> $OUTPUT_LOG

    sleep $refresh_rate
done

exit 0
