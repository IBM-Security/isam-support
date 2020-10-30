#!/bin/sh
# Note: Requires ISVA username of CLIENT_ID/CLIENT_SECRET
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
SCOPE=$4

curl -s -k -u "$CLIENT_ID:$CLIENT_SECRET" -H 'Content-Type: application/x-www-form-urlencoded'	\
	-H 'Accept: text/html'	\
	-d "grant_type=client_credentials&client_id=$CLIENT_ID&scope=$SCOPE" "https://$HOST/mga/sps/oauth/oauth20/token"

exit $?
