#!/bin/ksh
# Any issues please report to Daniel Comeau dcomeau@ca.ibm.com

for jar in $(find / -name \*PD.jar\*);
do
        printf "%s%s%s\n" "$(ls -l $jar)" ": " "$(unzip -p $jar META-INF/MANIFEST.MF 2>/dev/null|grep Implementation-Version|cut -d " " -f 2)";
done;

