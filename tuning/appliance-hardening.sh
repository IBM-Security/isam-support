# !/bin/sh

# Initialize variables to hold information
hostname=
username=
password=

# Begin by prompting for some information. This information cannot be empty.
read -p "Please enter your appliance hostname : " hostname
while [ -z "$hostname" ]
do
	read -p "Please enter your appliance hostname : " hostname
done

read -p "Please enter your administrative username : " username
while [ -z "$username" ]
do
	read -p "Please enter your administrative username : " username
done

read -p "Please enter your administrative password : " password
while [ -z "$password" ]
do
	read -p "Please enter your administrative password : " password
done

# Attempt to get the appliance version
result=$(get-appliance-firmware-version.sh $hostname $username $password 2>&1)
if echo $result |grep -i ex
then
	exit
fi

#Get the version from the result output and store it in a variables
majorversion=`echo $result| awk 'BEGIN {FS = "."}; {printf $1}'`
releaseversion=`echo $result| awk 'BEGIN {FS = "."}; {printf $3}'`

if [ $majorversion -gt 7 ]
then
	if [ $releaseversion -gt 3 ]
	then
		printf "\nBeginning Cipher configuration for appliance 9.0.4.0+\n"
		./set-protocols-and-ciphers-9040plus.sh $hostname $username $password
	else
		printf "\nBeginning Cipher configuration for appliance 9.0.3.1-\n"
		set-protocols-and-ciphers-9031minus.sh -h $hostname -u $username -p $password
	fi
else
	echo "You should not be running an ISAM 7.0.0.X appliance"
fi