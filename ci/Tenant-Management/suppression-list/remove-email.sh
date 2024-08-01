#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
email="$3"

RESPONSE=`${CURL} -w "%{http_code}" -H "Authorization: Bearer ${access_token}" -H "Accept: application/json" -X DELETE "https://${tenant}/v1.0/notification/suppression/email/${email}"`

echo "Response: $RESPONSE"

case $RESPONSE in
	404) echo "Email is not in the supression list"
		 ;;
	204) echo "Email removed from the suppression list"
		 ;;
	  *) echo "ERROR: Unknown response code"
esac

exit $?
