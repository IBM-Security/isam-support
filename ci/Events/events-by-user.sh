#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
etype=$3
filter_key=$4
filter_value=$5

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json"           \
        -X GET "https://${tenant}/v1.0/events?&event_type=\"${etype}\"&filter_key=${filter_key}&filter_value=\"${filter_value}\""

exit $?
