#!/bin/sh
# UTILITY-create-multiple-entries.sh
# input a file containing comma separated values and output a single JSON with format : 
#{"entries"[["entry","value"]]}
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
			for value in $(cat ${path}/${file} | sed 's/,/\n/g' )
			do
				values='["'${entry}'","'${value}'"],'$values
				echo $values
			done
		fi
		read -p "Enter input 'entry' file name (leave blank to complete) : "  file
	done
fi

payload=${payload}${values%?}']}'

echo "${payload}"
