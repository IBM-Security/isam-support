#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
etype=$3

${CURL} -H "Authorization: Bearer ${access_token}" -H "Content-Type: applications/json" -H "Accept: application/json"           \
        -X GET "https://${tenant}/v1.0/events?event_type=\"${etype}\"&range_type=time&size=5000"

exit $?
