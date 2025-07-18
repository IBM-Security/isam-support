#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X GET "https://${appliance_hostname}/isam/application_logs/access_control/runtime?recursive=yes&flat_details=yes" | jq  -r '.contents[].name'

exit $?
