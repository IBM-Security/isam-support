#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
payload="$3"

${CURL} -H "Authorization: Bearer ${access_token}" -H "Content-Type: application/scim+json" -H "Accept: application/scim+json" -X POST "https://${tenant}/v2.0/Users" --data-ascii @${payload}

exit $?
