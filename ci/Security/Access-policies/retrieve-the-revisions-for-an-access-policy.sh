#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
policyId=$3

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json" -X GET "https://${tenant}/v5.0/policyvault/accesspolicy/${policyId}/revision"

exit $?
