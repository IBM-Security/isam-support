#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
filter="$3"

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json" -X GET "https://${tenant}/config/v2.0/factors/fido2/relyingparties"

exit $?
