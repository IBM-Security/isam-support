#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
USERNAME=$4
PASSWORD=$5

curl -s -k --cookie cookie.jar --cookie-jar cookie.jar -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Accept: text/html'  \
    -d "grant_type=password&username=$USERNAME&password=$PASSWORD&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"    \
    https://$HOST/mga/sps/oauth/oauth20/token

exit $?
