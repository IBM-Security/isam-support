#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
USER=$3
PASSWORD=$4

rm -f cookie.jar

./pkmslogin.sh "$HOST" "$USER" "$PASSWORD" > /dev/null 2>&1

curl -v -s -k --cookie cookie.jar --cookie-jar cookie.jar -H 'Accept: */*'		\
		"https://$HOST/mga/sps/oauth/oauth20/authorize?response_type=token&client_id=$CLIENT_ID&scope=pictures" 2>&1 | grep location

exit $?

