#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

${CURL} -u "$username:$password" -H "Accept: application/json" -H "Content-Type: application/json"       \
                    -X PUT https://${appliance_hostname}/setup_service_agreements/accepted --data-ascii '{"accepted": true}'

exit $?
