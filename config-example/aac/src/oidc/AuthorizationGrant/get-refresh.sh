#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
REFRESH_TOKEN=$4

curl -s -k -H 'Content-Type: application/x-www-form-urlencoded'         \
                -d "grant_type=refresh_token&refresh_token=$REFRESH_TOKEN&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"    \
                https://$HOST/mga/sps/oauth/oauth20/token

exit $?
