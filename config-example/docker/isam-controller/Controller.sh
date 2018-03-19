#!/bin/sh
#
# This is sample script which create a ISAM ENV complete for
# Adding OTP to an junctioned application.
#
# This creates the following:
#
# OPENLDAP CONTAINER
# POSTGRES CONTAINER
# ISAM CONFIG CONTAINER
# ISAM AAC CONTAINER
# ISAM DSC CONTAINER
# ISAM RP CONTAINER
#
# Unsupported and unmaintained.   Use at your own risk.
# Comments welcome.
#
# nlloyd@us.ibm.com
#
#	1.0		Initial Release 03/19/2018.
#
[ "$DEBUG" ]  && set -x

Usage()
{
	echo ""
	echo "Usage: $0 -d <domain> [-h] [-p <password>] -o <operation>"
	echo ""
	echo "where:"
	echo "	-h:			This help message."
	echo "	-d:			Domain name for environment.  For example, level2.org.  This is required for all operations."
	echo "				At this time should only use domain of two level, i.e. a.b."
	echo "	-p:			Password for environment.  OpenLDAP requires a number so make sure to use one."
	echo "	-l:			Port for LMI,RP:80,RP:443,LDAP:389.  For example, 29443,8082,4432,3892"
	echo "				Use these ports for accessing the LMI, Reverse Proxy http/https, and non-SSL LDAP."
	echo "	-o:			Operation.  One of [up, down, start, stop, list, status, reload, inspect]"
	echo "				up:         docker-compose up		Create the containers, network, attach to volumes."
	echo "				down:       docker-compose down         Tear it all down, like it never existed."
	echo "				start:      docker-compose start      	Starts all containers."
	echo "				stop:       docker-compose stop       	Stops all containers."
	echo "				list:       docker container list       List of the containers and settings (image, ports, health)."
	echo "				status:     docker container status     Detailed status of CPU, MEM, IO, etc."
	echo "				inspect:    docker container inspect    Detailed info about all container"
	echo "				reload:     Restart rp and runtime      This stop and starts the rp and runtime container to pick up a publish."

    exit 1
}

StartENV()
{
	[ "$DEBUG" ]  && set -x

	[ "$PASSWORD" ]		|| PASSWORD=stub
	[ "$LDAP_PORT" ]	|| LDAP_PORT=stub
	[ "$LMI_PORT" ]		|| LMI_PORT=stub
	[ "$HTTPS_PORT" ]	|| HTTPS_PORT=stub
	[ "$HTTP_PORT" ]	|| HTTP_PORT=stub
	export PASSWORD LDAP_PORT LMI_PORT HTTPS_PORT HTTP_PORT

	docker-compose --file docker-files/${DOMAIN_NAME}/docker-compose-isam-openldap-$DOMAIN_NAME.yml start

	while :
	do
		./Controller.sh -d $DOMAIN_NAME -o list | grep "$DOMAIN_NAME" | grep starting > /dev/null 2>&1
		if [ $? = 1 ]
			then
				break
			fi
		echo -n "."
		sleep 1
	done

	echo ""
	echo "All up."
}

StopENV()
{
	[ "$DEBUG" ]  && set -x

	[ "$PASSWORD" ]		|| PASSWORD=stub
	[ "$LDAP_PORT" ]	|| LDAP_PORT=stub
	[ "$LMI_PORT" ]		|| LMI_PORT=stub
	[ "$HTTPS_PORT" ]	|| HTTPS_PORT=stub
	[ "$HTTP_PORT" ]	|| HTTP_PORT=stub
	export PASSWORD LDAP_PORT LMI_PORT HTTPS_PORT HTTP_PORT

 	docker-compose --file docker-files/${DOMAIN_NAME}/docker-compose-isam-openldap-$DOMAIN_NAME.yml stop
}

ListContainers()
{
	[ "$DEBUG" ]  && set -x

	for container in openldap postgres isamconfig isamdsc isamruntime isamreverseproxy
	do
		docker container ls | grep -i $DOMAIN_NAME-$container
	done

}

Status()
{
	[ "$DEBUG" ]  && set -x

	docker container stats $DOMAIN_NAME-openldap --no-stream | head -1

	for container in openldap postgres isamconfig isamdsc isamruntime isamreverseproxy
	do
		docker container stats $DOMAIN_NAME-$container --no-stream | tail -1
	done
}

Reload()
{
	[ "$DEBUG" ]  && set -x

	for container in isamruntime isamreverseproxy
	do
		docker container restart $DOMAIN_NAME-$container
	done
}

Inspect()
{
	[ "$DEBUG" ]  && set -x

	for container in openldap postgres isamconfig isamdsc isamruntime isamreverseproxy
	do
		docker container inspect $DOMAIN_NAME-$container
	done
}

UpENV()
{
	[ "$DEBUG" ]  && set -x

	if [ "$PASSWORD" = "" ]
	then
		echo "The -p option is required for up"
		Usage
	fi

	echo "Creating new environment for:"
	echo "Domain			$DOMAIN_NAME"
	echo "Suffix:			dc=$DC1,dc=$DC2"
	echo ""

	mkdir -p ./docker-files/$DOMAIN_NAME

	sed -e "s/%SERVICE%/${DOMAIN_NAME}/g" ./docker-files/docker-compose-isam-openldap.yml > ./docker-files/$DOMAIN_NAME/docker-compose-isam-openldap-$DOMAIN_NAME.yml

	echo "Creating volumes:..."
	echo "   OPEN LDAP Volumes..."
	docker volume create ${DOMAIN_NAME}-var-lib-ldap
	docker volume create ${DOMAIN_NAME}-etc-ldap-slapd
	docker volume create ${DOMAIN_NAME}-var-lib-ldap.secAuthority
	docker volume create ${DOMAIN_NAME}-container-service-slapd-assests-certs

	echo "   POSTGRES Volumes..."
	docker volume create ${DOMAIN_NAME}-var-lib-postgres-cert
	docker volume create ${DOMAIN_NAME}-var-lib-postgresql-data

	echo "   ISAM Volumes..."
	docker volume create ${DOMAIN_NAME}-var-shared
	docker volume create ${DOMAIN_NAME}-var-application.logs

	docker-compose --file docker-files/${DOMAIN_NAME}/docker-compose-isam-openldap-$DOMAIN_NAME.yml up -d
}

DownENV()
{
	[ "$DEBUG" ]  && set -x

	PASSWORD="stub"
	LMI_PORT="stub"
	HTTPS_PORT="stub"
	HTTP_PORT="stub"
	LDAP_PORT="stub"
	export PASSWORD LMI_PORT HTTP_PORT HTTPS_PORT LDAP_PORT

	docker-compose --file ./docker-files/$DOMAIN_NAME/docker-compose-isam-openldap-$DOMAIN_NAME.yml down

	if [ $? = 0 ]
	then
		rm -rf ./docker-files/$DOMAIN_NAME
		rm -rf ./isam-files/$DOMAIN_NAME
	fi

	echo ""
	echo "Deleting volumes:..."
	echo "   ISAM Volumes..."
	docker volume rm ${DOMAIN_NAME}-var-shared
	docker volume rm ${DOMAIN_NAME}-var-application.logs

	echo "   POSTGRES Volumes..."
	docker volume rm ${DOMAIN_NAME}-var-lib-postgres-cert
	docker volume rm ${DOMAIN_NAME}-var-lib-postgresql-data

	echo "   OPEN LDAP Volumes..."
	docker volume rm ${DOMAIN_NAME}-var-lib-ldap
	docker volume rm ${DOMAIN_NAME}-etc-ldap-slapd
	docker volume rm ${DOMAIN_NAME}-var-lib-ldap.secAuthority
	docker volume rm ${DOMAIN_NAME}-container-service-slapd-assests-certs
}

ISAMConfig()
{
	[ "$DEBUG" ]  && set -x

	echo ""
	echo "Configuring ISAM Appliance"
	echo "   Waiting for containers to fully start."

	mkdir -p ./isam-files/$DOMAIN_NAME

	for file in ./isam-files/*.json
	do
		target=`basename $file`
		sed -e "s/%SERVICE%/${DOMAIN_NAME}/g" $file | sed -e "s/%PASSWORD%/${PASSWORD}/g" | sed -e "s/%DC1%/${DC1}/g" | sed -e "s/%DC2%/${DC2}/g" > ./isam-files/$DOMAIN_NAME/$target
	done

	for file in ./isam-files/*.ldif
	do
		target=`basename $file`
		sed -e "s/%DC1%/${DC1}/g" $file | sed -e "s/%DC2%/${DC2}/g" > ./isam-files/$DOMAIN_NAME/$target
	done

	while :
	do
		./Controller.sh -d $DOMAIN_NAME -o list | grep isamconfig | grep starting > /dev/null 2>&1
		if [ $? = 1 ]
			then
				break
			fi
		echo -n "."
		sleep 1
	done

	echo ""
	echo "Let's go!!!!"
	echo ""
	./SystemBuild.sh
}


while getopts hd:o:p:l: name
do
    case $name in
        h)	Usage
			;;

		o)	operation=$OPTARG
			;;

		d)	DOMAIN_NAME="$OPTARG"
			DC1=`echo "$DOMAIN_NAME" | awk -F\. '{ print $1 }'`
			DC2=`echo "$DOMAIN_NAME" | awk -F\. '{ print $2 }'`
			ORG_NAME="$DOMAIN_NAME Organization"
			CONTAINER_DOMAIN_NAME=${DC1}${DC2}
			export DOMAIN_NAME DC1 DC2 ORG_NAME CONTAINER_DOMAIN_NAME
			;;

		p)	PASSWORD="$OPTARG"
			export PASSWORD
			;;

		l)	PORTS="$OPTARG"
			LMI_PORT=`echo $PORTS   | awk -F \, '{ print $1 }'`
			HTTP_PORT=`echo $PORTS  | awk -F \, '{ print $2 }'`
			HTTPS_PORT=`echo $PORTS | awk -F \, '{ print $3 }'`
			LDAP_PORT=`echo $PORTS | awk -F \, '{ print $4 }'`
			export LMI_PORT HTTP_PORT HTTPS_PORT LDAP_PORT
			;;

        *) Usage
           ;;
    esac
done


if [ "$DOMAIN_NAME" = "" ]
then
	Usage
fi

case $operation in
	start)		StartENV
				;;

	stop)		StopENV
				;;

	status)		Status
				;;

	list)		ListContainers
				;;

	up)			UpENV
				if [ $? != 0 ]
				then
					echo "Environment failed to build."
					exit 1
				fi

				ISAMConfig
				if [ $? != 0 ]
				then
					echo "Environment failed to build."
					exit 1
				fi

				echo ""
				echo "The domain is ready.  Follow the manual steps in the PDF and you are good to go."
				;;

	down)		DownENV
				;;

	reload)		Reload
				;;

	inspect)	Inspect
				;;

	*)			Usage
				;;
esac

exit 0

