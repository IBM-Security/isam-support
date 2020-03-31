#!/bin/sh
# UTILITY-create-multi-entry-json.sh
# input multiple json files and output a single JSON with format : 
#{"entries"[[]]}
[ "$DEBUG" ] && set -x

payload='{"entries":['
printf "Starting Payload : %s\n" $payload

entry=$1
filelist=$2
file=

if [ -z ${entry} ]
then
	printf "No entry supplied\n"
	exit $?
fi

if [ -z ${filelist} ]
then
	read -p "Set payload file path : " path
	echo "These files should be a single line that is the value of the entry specified"
	
	 read -p "Enter input 'entry' file name : "  file
	while [ ! -z ${file} ]
	do
		if [ ! -z ${file} ]
		then
			values='["'${entry}'","'$(cat ${path}/${file})'"],'$values
			echo $values
		fi
		read -p "Enter input 'entry' file name (leave blank to complete) : "  file
	done
fi

payload=${payload}${values%?}']}'

echo "${payload}"