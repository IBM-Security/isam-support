#!/bin/sh
#
#
[ "$DEBUG" ] && set -x

export ORG_CREDS="admin:admin"
export CREDS="admin:$PASSWORD"

##
## Accept agreement
##
HOSTNAME=`hostname`
LMI_HOST="$HOSTNAME:$LMI_PORT"

echo ""
echo "Accepting License Agreement..."
curl -s -k -u $ORG_CREDS -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/setup_service_agreements/accepted --data-ascii @accept_agreement.json
curl -s -k -u $ORG_CREDS -H 'Accept: application/json' -H 'Content-Type: application/json' -X GET https://${LMI_HOST}/setup_service_agreements/accepted
curl -s -k -u $ORG_CREDS -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/setup_complete
echo ""

##
## Update admin systems.
##
echo ""
echo "Updating standard admin settings..."
curl -s -k -u $ORG_CREDS -H 'Accept: application/json' -H 'Content-Type: application/json'	\
		-X PUT https://${LMI_HOST}/admin_cfg													\
		--data-ascii @./isam-files/$DOMAIN_NAME/update-password.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""

##
## Apply Support License
##
echo ""
echo "Applying Support License..."
curl -s -k -u "$CREDS" -H 'Accept: text/html' -F "license=@./support-license.isslicense" -X POST https://${LMI_HOST}/licenses
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""

##
## Configure DB
##
echo ""
echo "Configuring DB..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -X POST https://${LMI_HOST}/isam/cluster/v2 --data-ascii @./isam-files/$DOMAIN_NAME/config-db.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""


##
## Activate Modules
##
echo ""
echo "Activate Modules..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST https://${LMI_HOST}/isam/capabilities/v1 --data-ascii @webseal_code.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST https://${LMI_HOST}/isam/capabilities/v1 --data-ascii @aac_code.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST https://${LMI_HOST}/isam/capabilities/v1 --data-ascii @federation_code.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes

##
## Configure DSC
##
echo ""
echo "Configuring DSC..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -X PUT https://${LMI_HOST}/isam/dsc/config --data-ascii @./isam-files/$DOMAIN_NAME/config-dsc.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""

##
## Policy Server
##
echo ""
echo "Configuring ISAM Runtime (The Policy Server)..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json'	\
		-X POST https://${LMI_HOST}/isam/runtime_components --data-ascii @./isam-files/$DOMAIN_NAME/config-isamruntime.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""

##
## Reverse Proxy
##
echo ""
echo "Configuring ISAM Reverse Proxy..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json'	\
			-X POST https://${LMI_HOST}/wga/reverseproxy/ --data-ascii @./isam-files/$DOMAIN_NAME/config-rp.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""
echo ""
echo "  Creating Junction..."
curl -s -k -u "$CREDS" -H 'Accept: application/json, text/javascript, */*; q=0.01'	\
		-H 'Content-Type: application/json' -X POST https://${LMI_HOST}/wga/reverseproxy/default/junctions --data-ascii @./isam-files/create-junction.json
echo ""

##
## Creating Test User 
##
echo ""
echo "Creating Test User..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST https://${LMI_HOST}/isam/pdadmin --data-ascii @./isam-files/$DOMAIN_NAME/create-user.json
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""

##
## Update User with e-mail.
##
echo ""
echo "Update user with e-mail"
ldapmodify -h `hostname` -p ${LDAP_PORT} -D cn=root,secAuthority=Default -w "$PASSWORD" -f ./isam-files/$DOMAIN_NAME/add-attribute.ldif

##
## Publish Container
##
echo ""
echo "Publish The Container..."
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/docker/publish
echo ""


##
## Load sample AAC OTP Policy
##
echo ""
echo "Restarting the Domain so all containers pickup up all changes that were just made."
./Controller.sh -d $DOMAIN_NAME -o stop
./Controller.sh -d $DOMAIN_NAME -o start
while :
do
	./Controller.sh -d $DOMAIN_NAME -o list | grep starting > /dev/null 2>&1
	if [ $? = 1 ]
		then
			break
		fi
	echo -n "."
	sleep 1
done
echo ""
echo ""
echo "Almost there..."
echo "Loading sample OTP Policy..."
echo "OTP THEN SILENT REGISTER."
curl -s -k -u "$CREDS" -H 'Accept: text/html' -F "file=@./isam-files/opt-then-silent-register-policy.json" -X POST https://${LMI_HOST}/iam/access/v8/policies/import
echo ""
echo "EMAIL OTP."
curl -s -k -u "$CREDS" -H 'Accept: text/html' -F "file=@./isam-files/email-otp-policy.json" -X POST https://${LMI_HOST}/iam/access/v8/policies/import
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/isam/pending_changes
echo ""
curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${LMI_HOST}/docker/publish
echo ""

echo ""
echo "Another publish, but just need to restart runtime and reverseproxy."
./Controller.sh -d $DOMAIN_NAME -o reload

exit 0

