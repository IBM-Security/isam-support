Finding login failures and getting the details.

1) Create an API client at https://<tenant>/ui/admin/configuration?tab=api-access&subTab=api-clients with the following Manage reports
   and Read reports access.
   
2) Generate a token.  Use the ../ci/bin/get-token.sh to get an access token

   ./get-token.sh <tenant> <client_id> <client_secret>
   {"access_token":"abcdefg","...."}
   
3) Use the token to run the reports:

./reports.sh <tenant> <access_token> auth_audit_trail auth_audit_trail_failure.json | python -mjson.tool
{
    "response": {
        "report": {
            "hits": [
                {
                    "_id": "a3d0c396-0206-420f-b1a1-d4b65e30c955",
                    "_index": "event-authentication-2020.3-000001",
                    "_source": {
                        "data": {
                            "origin": "X.X.X.X",
                            "realm": "cloudIdentityRealm",
                            "result": "failure",
                            "subject": "UNKNOWN",
                            "subtype": "user_password",
                            "username": "dsfadsfads"
                        },
                        "geoip": {
                            "country_iso_code": "US",
                            "country_name": "United States",
                            "region_name": "Texas"
                        },
                        "time": 1585362232823
                    },
                    "_type": "_doc",
                    "sort": [
                        1585362232823,
                        "a3d0c396-0206-420f-b1a1-d4b65e30c955"
                    ]
                }
            ],
            "total": 1
        }
    },
    "success": true
}

4) Take the event ID (_id) of a3d0c396-0206-420f-b1a1-d4b65e30c955, update auth_event_details.json, and run the report:

./reports.sh <tenant> <access_token> auth_event_details auth_event_details.json | python -mjson.tool

The output has complete details of the failure.
