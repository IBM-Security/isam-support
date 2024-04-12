#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
name=$3
payload=$4

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json, text/plain" -H "Content-Type: application/json" -X POST "https://${tenant}/v1.0/reports/${name}" --data-ascii @${payload}

exit $?
