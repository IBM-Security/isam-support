#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE=-v

tenant=$1
access_token=$2
trxnId=$3
otp=$4

curl $VERBOSE -s -k -H "Authorization: Bearer ${access_token}" -H "Content-type: application/json" -H "Accept: application/json"        \
                -X POST "https://${tenant}/v2.0/factors/voiceotp/transient/verifications/${trxnId}"              \
                --data-ascii "{\"otp\":\"$otp\"}"

exit $?
