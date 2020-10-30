#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="-v -s -k"

##
## Authorization Grant Flow
##

HOST=$1
USER=$2
PASS=$3
CLIENT_ID=$4
CLIENT_SECRET=$5

rm -f cookie.jar token.json

echo "Logging into the OP"
./pkmslogin.sh "$HOST" "$USER" "$PASS" > /dev/null 2>&1

echo ""
echo "Getting Authorization Code.  This is done authenticated as the user, $USER"
AUTHORIZATION_CODE=`./get-authorize.sh $HOST "$CLIENT_ID" "$CLIENT_SECRET" 2>&1 | grep location: | awk -F\= '{ print $2 }'`
echo "$AUTHORIZATION_CODE"

echo ""
echo "Client going back to get tokens (JSON).  This is an unauthenticated request."
./get-token.sh "$HOST" "$CLIENT_ID" "$CLIENT_SECRET" "$AUTHORIZATION_CODE" | python -mjson.tool > token.json


#echo ""
#echo "Pulling access token and id_token from the returned json"
#ACCESS_TOKEN=`grep "access_token" token.json | awk -F\: '{ print $2 }' | sed -e 's/[",]//g'| sed -e 's/ //'`
#ID_TOKEN=`grep "id_token" token.json | awk -F\: '{ print $2 }' | sed -e 's/[",]//g'`

#echo "access_token = $ACCESS_TOKEN"
#echo "id_token     = $ID_TOKEN"

#echo ""
#echo "Decode the token"
#./decode-jwt.sh $ID_TOKEN


#echo ""
#echo "Can use the access token to get user info"
#./get-userinfo.sh $HOST $CLIENT_ID $CLIENT_SECRET $ACCESS_TOKEN | python -mjson.tool

exit 0


