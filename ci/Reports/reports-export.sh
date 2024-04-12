#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
name=$3
payload=$4

${CURL} -H "Authorization: Bearer ${access_token}" -H 'Content-Type: application/json' -H 'Accept: text/csv'  -X POST "https://${tenant}/v1.0/reports/export/${name}" --data-ascii @${payload}

exit $?
