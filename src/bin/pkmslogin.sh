#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
USER=$2
PASS=$3

rm -f cookie.jar

curl -s -k --cookie-jar cookie.jar --cookie cookie.jar -H 'true-client-ip: 1.2.3.4' -H 'Content-Type: application/x-www-form-urlencoded' \
		-X POST https://$HOST/pkmslogin.form?token=Unknown --data-ascii "username=$USER&password=$PASS&login-form-type=pwd"

exit 0
