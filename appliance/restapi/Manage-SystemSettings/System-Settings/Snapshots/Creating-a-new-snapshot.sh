#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
comment=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: applicaton/json" -H "Content-Type: application/json" -X POST https://${appliance_hostname}/snapshots --data-ascii "{\"comment\":\"$4\"}"

exit $?
