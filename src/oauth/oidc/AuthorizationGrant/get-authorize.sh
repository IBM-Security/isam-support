#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -v -s -k"

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3
REDIR_URI=$4

${CURL} --cookie cookie.jar -X GET		\
				"https://$HOST/mga/sps/oauth/oauth20/authorize?scope=openid%20employeeNumber%20departmentNumber%20employeeType&state=something&response_type=code&redirect_uri=$REDIR_URI&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET"

exit $?
