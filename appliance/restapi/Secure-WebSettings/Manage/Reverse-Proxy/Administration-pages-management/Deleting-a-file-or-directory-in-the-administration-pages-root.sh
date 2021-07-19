#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
instance_id=$4
path=$5

${CURL} -u "$username:$password" -H "Accept: application/json" -X DELETE "https://${appliance_hostname}/wga/reverseproxy/${instance_id}/management_root/${path}"

exit $?
