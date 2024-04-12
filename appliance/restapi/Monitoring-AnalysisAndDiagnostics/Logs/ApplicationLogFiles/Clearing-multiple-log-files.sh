#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
payload=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" --data-ascii @${payload} -X PUT "https://${appliance_hostname}/isam/application_logs?action=delete"

exit $?
