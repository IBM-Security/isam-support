#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -v -s -k"

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3

${CURL} --cookie cookie.jar -X GET		\
				"https://$HOST/isam/oidc/endpoint/amapp-runtime-LEGACY/authorize?response_type=code&redirect_uri=https://isam9070-web.level2.org/dashboard/&client_id=cid&scope=openid"

exit $?

