#!/bin/sh
[ "$DEBUG" ] && set -x

Usage()
{
    echo ""
    echo "Usage: $0"
    echo ""
    exit 1
}

##
## ALL TRACE SETTINGS
##
ListAllTrace()
{
	curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X GET https://${appliance_hostname}/wga/reverseproxy/${id}/tracing
}

##
## LIST
##
ListDetail()
{
	curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X GET https://${appliance_hostname}/wga/reverseproxy/${id}/tracing/${component_id}/trace_files
}

##
## SET COMP
##
SetComponent()
{
	curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X PUT https://${appliance_hostname}/wga/reverseproxy/${id}/tracing/${component_id}  --data-ascii @trace.json
}

##
## EXPORT
##
ExportLog()
{
	curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X GET https://${appliance_hostname}/wga/reverseproxy/${id}/tracing/${component_id}/trace_files/${trace_file_id}?export
}

##
## DELETE
##
DeleteLog()
{
	curl -s -k -u "$CREDS" -H 'Accept: application/json' -H 'Content-Type: application/json' -X DELETE https://${appliance_hostname}/wga/reverseproxy/${id}/tracing/${component_id}/trace_files/
}

while getopts h:c:i:t:afsed name
do
	case $name in
		h) appliance_hostname="$OPTARG"
		   ;;

        c) CREDS="$OPTARG"
		   ;;

        i) id="$OPTARG"
		   ;;

        t) component_id="$OPTARG"
		   trace_file_id=${component_id}.log
		   ;;

		a) ListAllTrace
		   ;;

		f) ListDetail
		   ;;

		s) SetComponent
		   ;;

		e) ExportLog
		   ;;

		d) DeleteLog
		   ;;

        *) Usage
		   ;;
    esac
done

exit 0

