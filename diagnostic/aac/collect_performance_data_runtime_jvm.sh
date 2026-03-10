# !/bin/bash

lmi_hostname=
lmi_port=
lmi_user=
lmi_password=
collection_interval=

while [ "$1" != "" ]; do
        case $1 in
                -h | --lmi_hostname ) shift
                        lmi_hostname=$1
                        ;;
                -p | --lmi_port ) shift
                        lmi_port=$1
                        ;;
                -u | --lmi_user) shift
		       	lmi_user=$1
                        ;;
                -x | --lmi_password ) shift
			lmi_password=$1
                        ;;
                -i | --interval ) shift
			collection_interval=$1
                        ;;
                -debug ) debug=1
                        ;;
                * ) echo "Invalid option detected";
		       echo -e "-h | --lmi_hostname required\n-p | --lmi_port required\n-u | --lmi_user required\n-x | --lmi_password required\n-i | --interval optional. Default value of 10 seconds\n"
	       	       exit 1
        esac
        shift
done

if [ -z $lmi_hostname ]; then
	echo -e "Missing value for -h | --lmi_hostname flag. This is required\n";
	exit 1
elif [ -z $lmi_port ]; then
	echo -e "Missing value for -p | --lmi_port flag. This is required\n";
	exit 1
elif [ -z $lmi_user ]; then
	echo -e "Missing value for -u | --lmi_user flag. This is required\n";
	exit 1
elif [ -z $lmi_password ]; then
	echo -e "Missing value for -x | --lmi_password flag. This is required\n";
	exit 1
elif [ -z $collection_interval ]; then
	echo -e "Missing value for -i | --interval. This flag is optional and the default will be used (10s).\n";
	collection_interval=10
fi

read -p "***Warning, this script overwrites the existing files when run. Press return to proceed with overwrite.***" proceed
if [ -z proceed ]; then
	exit 1;
else
	echo -e "\n\n"
fi

echo -e "Starting date time\n\n" |tee java_dump_output.log top_output.log top_memory_output.log ps_full_output.log > /dev/null


while(true) do
	# collect java core file for runtime JVM
	#
	date| tee -a java_dump_output.log top_output.log top_memory_output.log ps_full_output.log > /dev/null
	curl -k -u "admin:admin" -H "Accept: application/json" -H "Content-Type: application/json" "https://10.2.1.102/core/cli" -X POST --data-ascii '{"command":"diagnostics java_dump runtime thread"}'| jq -r .output| sed 's/\\n/\n/g' >> java_dump_output.log
	
	curl -k -u "admin:admin" -H "Accept: application/json" -H "Content-Type: application/json" "https://10.2.1.102/core/cli" -X POST --data-ascii '{"command":"diagnostics monitor top"}'| jq -r .output| sed 's/\\n/\n/g' >> top_output.log
	
	curl -k -u "admin:admin" -H "Accept: application/json" -H "Content-Type: application/json" "https://10.2.1.102/core/cli" -X POST --data-ascii '{"command":"diagnostics monitor top_memory"}'| jq -r .output| sed 's/\\n/\n/g' >> top_memory_output.log
	
	curl -k -u "admin:admin" -H "Accept: application/json" -H "Content-Type: application/json" "https://10.2.1.102/core/cli" -X POST --data-ascii '{"command":"diagnostics monitor ps_full"}'| jq -r .output| sed 's/\\n/\n/g' >> ps_full_output.log
	
	read -p "Press enter to stop" -t "$collection_interval" input
	if [ $? -eq 0 ] && [ -z $input]; then
		exit 1
	else
		echo -e "\nMoving to next iteration\n"
	fi
	echo -e "\n====\n" | tee -a java_dump_output.log top_output.log top_memory_output.log ps_full_output.log > /dev/null
done
