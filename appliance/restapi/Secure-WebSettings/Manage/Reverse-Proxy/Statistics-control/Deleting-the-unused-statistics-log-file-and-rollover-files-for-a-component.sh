#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
instance_id=$4
component_id=$5

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X DELETE https://${appliance_hostname}/wga/reverseproxy/${instance_id}/statistics/${component_id}/stats_files

exit $?
