#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json" -X GET "https://${tenant}/v2.0/factors?search=subType%20contains%20%22userPresence%22" 

exit $?
