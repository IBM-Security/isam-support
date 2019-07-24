#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

HOST=$1
USER=$2
PASS=$3
COOKIEJAR=$4

rm -f "$COOKIEJAR"

${CURL} -s -k --cookie-jar ${COOKIEJAR}  --cookie ${COOKIEJAR} -H 'Content-Type: application/x-www-form-urlencoded' \
        -X POST https://$HOST/pkmslogin.form?token=Unknown --data-ascii "username=$USER&password=$PASS&login-form-type=pwd"

exit 0
