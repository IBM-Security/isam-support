#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
instance_id=$4

echo "Retrieving all files for intance $instance_id..."
./Retrieving_the_names_of_all_instance-specific_log_files_and_file_sizes.sh "$appliance_hostname" "$username" "$password" "$instance_id" | python -mjson.tool | grep id | awk '{ print $2 }' | sed -e 's/[,"]//g' > list.log

echo ""
echo "Exporting files..."
for file in `cat list.log`
do
    echo "  $file"
    ./Exporting_an_instance-specific_log_file.sh "$appliance_hostname" "$username" "$password" "$instance_id" "$file"
done

echo ""
echo "Clearing files..."
for file in `cat list.log`
do
    echo "  $file"
    ./Clearing_an_instance-specific_log_file.sh "$appliance_hostname" "$username" "$password" "$instance_id" "$file"
done

rm -f list.log

exit $?
