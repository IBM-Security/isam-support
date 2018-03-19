P L E A S E  R E A D  A L L  S E C T I O N S

I) Update the license and activate keys.
You need to update the following files with valid content.
The activation codes are downloaded from Passport Advantage.
Obtain the support license from Flexera.

aac_code.json
webseal_code.json
federation_code.json
support-license.isslicense


II) The following should be customized with valid data.

Edit the file ./isam-files/add-attribute.ldif:

dn: cn=testuser,dc=%DC1%,dc=%DC2%	<==== These are macros which get expanded later so leave alone.
changetype: modify
add: mail
mail: use_your_real_email_addr_here	<==== Use a valid e-mail address here.

Edit the file ./isam-files/create-junction.json:
"server_hostname":"www.ibm.com",	<==== Point to your application.
"server_port":"80",			<==== TCP Junction at this point.


III) Run the command.  Make sure to set execute permission on Controller.sh and SystemBuild.sh

The command is very simple:

Usage: ./Controller.sh -d <domain> [-h] [-p <password>] -o <operation>

where:
  -h:                   This help message.
  -d:                   Domain name for environment.  For example, example.org.  This is required for all operations.
  -p:                   Password for environment.  OpenLDAP requires a number
  -l:                   Port for LMI,RP:80,RP:443,LDAP:389.  For example, 29443,8082,4432,3892
  						These ports are PUBLISHED for external access.
                        Use for accessing the LMI, reverse proxy http/https, and non-SSL LDAP.
  -o:                   Operation.  One of [up, down, start, stop, list, status, reload, inspect]
  			up:			docker-compose up			Create the containers, network, attach to volumes.
			down:		docker-compose down			Tear it all down, like it never existed.
			start:		docker container start		Starts all containers.
			stop:		docker container stop		Stops all containers.
			list:		docker container list		List of the containers and settings (image, ports, health).
			status:		docker container status		Detailed status of CPU, MEM, IO, etc.
			inspect:	docker container inspect	Detailed info about all container
			reload:		Restart rp and runtime		This stop and starts the rp and runtime container to pick up a publish.

./Controller.sh -d example.org -p passw0rd -l 29443,8082,4432,2389 -o up

and in about 5 minutes you will have a fully functional ISAM Environment
to protect an applications with an OTP.

IV) See the PDF for the manul steps.

