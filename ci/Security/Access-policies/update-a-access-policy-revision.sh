#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
policyId=$3
revisionId=$4

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json" -H "Content-Type: application/json"	\
			-X PUT "https://${tenant}/v5.0/policyvault/accesspolicy/${policyId}/revision/${revisionId}" --data-ascii @payload.json

exit $?
