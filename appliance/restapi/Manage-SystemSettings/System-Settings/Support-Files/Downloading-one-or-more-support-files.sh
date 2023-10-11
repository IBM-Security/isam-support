#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
id=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: applicaton/json" -X GET https://${appliance_hostname}/support/download?record_ids=${id}

exit $?
