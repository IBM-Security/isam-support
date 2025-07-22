#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
USER=$4
PASSWORD=$5

rm -f cookie.jar

./pkmslogin.sh "$HOST" "$USER" "$PASSWORD" > /dev/null 2>&1

AUTHORIZATION_CODE=`./get-authorize.sh "$HOST" "$CLIENT_ID" "$CLIENT_SECRET" | awk -F\= '{ print $2 }'`

./get-token.sh "$HOST" "$CLIENT_ID" "$CLIENT_SECRET" $AUTHORIZATION_CODE

exit $?

