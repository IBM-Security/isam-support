#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
rule=$4
payload=$5

${CURL} -u "$username:$password" -H "Accept: application/json" -H "Content-Type: applicaton/json" -X PUT "https://${appliance_hostname}/wga/http_transformation_rules/${rule}?validate=" --data-ascii @${payload}

exit $?
