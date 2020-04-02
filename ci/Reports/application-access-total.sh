#!/bin/sh
[ "$DEBUG" ] && set -x
alias jf="python -mjson.tool"

tenant=$1
access_token=$2

alloutput=$$.log
tmpjson=$$.json
tmppattern=$$.pattern


rm -f ${alloutput}
rm -f ${tmpjson}
rm -f ${tmppattern}

echo "total" > ${tmppattern}

applications.sh ${tenant} ${access_token} | jf > ${alloutput}

for app_id in `grep "href" ${alloutput} | grep "/applications/[0-9]*" | awk -F\" '{ print $4 }' | awk -F\/ '{ print $5 }'`
do
    echo "Access total for application ${app_id}"
    echo "{\"APPID\":\"${app_id}\",\"FROM\":\"now-168h\",\"TO\":\"now\",\"SIZE\":\"10000\",\"SORT_BY\":\"time\",\"SORT_ORDER\":\"asc\" }" > ${tmpjson}
    reports.sh ${tenant} ${access_token} app_audit_trail ${tmpjson} | jf | grep -f ${tmppattern}
    echo ""
done

rm -f ${alloutput}
rm -f ${tmpjson}
rm -f ${tmppattern}

exit 0
