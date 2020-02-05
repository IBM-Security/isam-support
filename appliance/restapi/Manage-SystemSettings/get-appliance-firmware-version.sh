#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -H 'Content-Type: application/json' https://${appliance_hostname}/core/sys/versions | JSON.sh | egrep '\[\"firmware_version\"\][[:space:]]' |egrep -o '[[:digit:]].[[:digit:]].[[:digit:]].[[:digit:]]'

exit $?
