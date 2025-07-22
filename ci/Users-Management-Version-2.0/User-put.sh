#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
id=$3
payload=$4

${CURL} -H "Authorization: Bearer ${access_token}" -H "Content-Type: application/scim+json" -X PUT "https://${tenant}/v2.0/Users/${id}" --data-ascii @${payload}

exit $?
