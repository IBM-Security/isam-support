#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
payload=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: applicaton/json" -X PUT https://${appliance_hostname}/admin_cfg --data-ascii @${payload}

exit $?
