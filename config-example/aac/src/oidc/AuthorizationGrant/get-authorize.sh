#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -v -s -k"

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3

${CURL} --cookie cookie.jar -X GET		\
				"https://$HOST/mga/sps/oauth/oauth20/authorize?scope=openid&state=something&response_type=code&redirect_uri=https://$HOST/dashboard&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"

exit $?
