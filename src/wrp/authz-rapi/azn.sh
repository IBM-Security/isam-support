#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

HOST=$1
USERNAME=$2
PASSWORD=$3
PAYLOAD=$4

${CURL} -s -k --user ${USERNAME}:${PASSWORD} -H "Content-Type: application/json" -X POST https://$HOST/aznapi --data-ascii @$PAYLOAD

exit $?
