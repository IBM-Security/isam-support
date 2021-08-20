#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
JWT=$4

${CURL} -H "Authorization: Bearer $JWT" -X GET https://$HOST/mga/sps/oauth/oauth20/userinfo

exit $?
