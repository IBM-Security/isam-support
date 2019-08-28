#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -H "Content-Type: application/json"      \
                    -X GET https://${appliance_hostname}/setup_complete

exit $?
