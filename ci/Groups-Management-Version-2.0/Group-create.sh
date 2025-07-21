#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
id=$3

sed -e "s/XXXXX/${id}/" create-group.json > payload.json

${CURL} -H "Authorization: Bearer ${access_token}" -H "Content-Type: application/scim+json" -X POST "https://${tenant}/v2.0/Groups" --data-ascii @payload.json

exit $?
