#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
USERNAME=$4
PASSWORD=$5

OAUTH_TOKEN=`./get-token.sh "$HOST"  "$CLIENT_ID" "$CLIENT_SECRET" "$USERNAME" "$PASSWORD" | awk -F\: '{ print $2 }' | awk -F\, '{ print $1 }' | sed -e 's/"//g'`
echo $OAUTH_TOKEN

exit $?
