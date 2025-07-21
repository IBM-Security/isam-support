#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2

${CURL} -H "Authorization: Bearer ${access_token}" -H "Content-Type: applications/json" -H "Accept: application/json"           \
        -X GET "https://${tenant}/v1.0/events?all_events=yes&range_type=time&from=1677699432000&to=1679945894&size=5000"

exit $?
