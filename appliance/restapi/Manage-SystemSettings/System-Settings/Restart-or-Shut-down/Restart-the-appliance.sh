#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3

[ "$CURL" ] || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X POST "https://${appliance_hostname}/diagnostics/restart_shutdown/reboot"

exit $?
