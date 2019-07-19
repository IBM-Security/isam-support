#!/bin/sh
# Author: Nick Lloyd
# Email:  nlloyd@us.ibm.com
#
# Requires enabling the Embedded SNMP Agent at https://appliance_hostname/snmp
# See doc at https://www.ibm.com/support/knowledgecenter/SSPREK_9.0.5/com.ibm.isam.doc/admin/task/tsk_configuring_snmp.html
#
# History:
#
# 2018-08-08:           Intitial version.  The formating needs works but it looks good for dscd at the moment.
#
[ "$DEBUG" ] && set -x

HOST=$1
PROCESS_NAME=$2
COMMUNITY_NAME=$3

[ "$COMMUNITY_NAME" ] || COMMUNITY_NAME="public"

PID=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunName | grep "$PROCESS_NAME" | awk -F\. '{ print $2 }' | awk '{ print $1 }'`

RUNNAME=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunName.${PID} | awk -F\" '{ print $2 }'`
RUNPATH=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunPath.${PID} | awk -F\" '{ print $2 }'`
RUNPARAMS=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunParameters.${PID} | awk -F\" '{ print $2 }'`
RUNTYPE=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunType.${PID} | awk '{ print $NF }'`

echo "RUNNAME           RUNPATH                         RUNPARAMS                       RUNTYPE                 RUNSTATUS       RUNPERFCPU(cs)  RUNPERFMEM(Kbytes)"
while :
do
        RUNSTATUS=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunStatus.${PID} | awk '{ print $NF }'`
        RUNPERFCPU=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunPerfCPU.${PID} | awk '{ print $NF }'`
        RUNPERFMEM=`snmpwalk -m ALL -v 2c -c $COMMUNITY_NAME $HOST HOST-RESOURCES-MIB::hrSWRunPerfMem.${PID} | awk '{ print $4 }'`
        echo "$RUNNAME          $RUNPATH                $RUNPARAMS      $RUNTYPE                $RUNSTATUS      $RUNPERFCPU             $RUNPERFMEM"

        sleep 5
done

exit 0
