#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
client_id=$2
client_secret=$3

${CURL} -k -s -H "Accept: application/json"                                                                             \
            --data-ascii "grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}&scope=openid"     \
            https://${tenant}/v1.0/endpoint/default/token

exit $?
