#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
CODE=$4

curl -s -k -H 'Content-Type: application/x-www-form-urlencoded'	\
	-H 'Accept: text/html'	\
	-d "grant_type=authorization_code&code=$CODE&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&redirect_uri=&response_type=code"	\
	https://$HOST/mga/sps/oauth/oauth20/token

exit $?

