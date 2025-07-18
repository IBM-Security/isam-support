#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
id="$3"

${CURL} 		\
		-H "Accept: application/json" -H "Content-Type: application-json"	\
		-X POST "https://${tenant}/v2.0/factors/fido2/relyingparties/${id}/assertion/options"		\
		--data-ascii @payload.json
exit $?
