#!/bin/ksh
# Any issues please report to Daniel Comeau dcomeau@ca.ibm.com
# Version 1.0: Dec 6, 2019
# Version 2.0: Jan 20, 2020 Added collection for java versions found on the system

# Notes: 
# Execute this script to find any PD.jar files, the details of the files, and their versions. 
# At the same time this script will also collect java information from the system.
# Requires read access so it is recommended to run as root to ensure you have permissions to find them all. 
# Relies on the "unzip" command being avialble.

printf "PD.jar information:\n"
for jar in $(find / -name \*PD.jar\*);
do
        printf "%s%s%s\n" "$(ls -l $jar)" ": " "$(unzip -p $jar META-INF/MANIFEST.MF 2>/dev/null|grep Implementation-Version|cut -d " " -f 2)";
done;

printf "\nJava information:\n"

for jar in $(find / -name java -perm -111 -type f);
do
        printf "%s%s%s\n" "$(echo $jar)" " -> " "$($jar -fullversion 2>&1|cut -f 4- -d " ")";
done;

printf "\n\$JAVA_HOME: $JAVA_HOME\n"
printf "\"which java\": %s\n" "$(which java)"
printf "\$PATH: $PATH\n"
