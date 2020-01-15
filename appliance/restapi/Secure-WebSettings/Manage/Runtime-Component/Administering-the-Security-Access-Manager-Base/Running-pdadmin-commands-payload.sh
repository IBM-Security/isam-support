#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
payload=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -H 'Content-Type: application/json' -X POST https://${appliance_hostname}/isam/pdadmin --data-ascii @${payload}

exit $?
