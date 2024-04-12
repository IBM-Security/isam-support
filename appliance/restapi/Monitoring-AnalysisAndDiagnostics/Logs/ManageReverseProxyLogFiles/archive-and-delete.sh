#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
instance_id=$4

echo "Retrieving all files for intance $instance_id..."
./Retrieving-the-names-of-all-instance-specific-log-files-and-file-sizes.sh "$appliance_hostname" "$username" "$password" "$instance_id" | python2 -mjson.tool | grep id | awk '{ print $2 }' | sed -e 's/[,"]//g' > list.log

echo ""
echo "Exporting files..."
for file in `cat list.log`
do
    echo "  $file"
    ./Exporting-an-instance-specific-log-file.sh "$appliance_hostname" "$username" "$password" "$instance_id" "$file"
done

echo ""
echo "Clearing files..."
for file in `cat list.log`
do
    echo "  $file"
    ./Clearing-an-instance-specific-log-file.sh "$appliance_hostname" "$username" "$password" "$instance_id" "$file"
done

rm -f list.log

exit $?
