#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
rp_id=$4
payload=$5

${CURL} -u "$username:$password" -H "Accept: application/json" -X POST "https://${appliance_hostname}/wga/reverseproxy/${rp_id}/junctions" --data-ascii @${payload}

exit $?
