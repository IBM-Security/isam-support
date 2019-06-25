#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
USER=$2
PASS=$3

curl -v -s -k --cookie-jar cookie.jar --cookie cookie.jar -H 'Content-Type: application/x-www-form-urlencoded' \
        -X POST https://$HOST/pkmslogin.form?token=Unknown --data-ascii "username=$USER&password=$PASS&login-form-type=pwd"

exit 0
