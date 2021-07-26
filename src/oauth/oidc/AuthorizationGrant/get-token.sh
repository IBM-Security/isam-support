#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
CODE=$4
REDIR_URI=$5

${CURL} -s -k -H 'Content-Type: application/x-www-form-urlencoded'	\
	-H 'Accept: text/html'	\
	-d "grant_type=authorization_code&code=$CODE&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&response_type=code&redirect_uri=$REDIR_URI"	\
	https://$HOST/mga/sps/oauth/oauth20/token

exit $?
