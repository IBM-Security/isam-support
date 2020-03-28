# Cloud Identity Reports

## Setup instructions

* Create an API client at https://tenant/ui/admin/configuration?tab=api-access&subTab=api-clients with the following access:
   * Manage reports
   * Read reports
   * Read application configuration
* Generate a token.  Use ../ci/bin/get-token.sh to get an access token

      get-token.sh tenant client_id client_secret
      {"access_token":"abcdefg","...."}

* Setting tenant and access_token environent variables makes this very easy.
  * export tenant=tenant.ice.ibmcloud.com
  * export access_token=abcdefg

## Explanation of Reports
* auth_audit_trail: Authentication failures and success.
* app_audit_trail: Application usage.
* admin_activity: Tenant Admin activity.
* user_activity: Activity for a specific user.
* auth_event_details: Details of a specific event.

## Sample commands

**Finding login failures and getting the details.**

* reports.sh ${tenant} ${access_token} auth_audit_trail auth_audit_trail_failure.json

```
                  {
                    "_id": "a3d0c396-0206-420f-b1a1-d4b65e30c955",
                    "_index": "event-authentication-2020.3-000001",
                    "_source": {
                        "data": {
                            "origin": "70.114.164.111",
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
                    }
```                 
                    
* Take the event ID (_id) of a3d0c396-0206-420f-b1a1-d4b65e30c955, update auth_event_details.json, and run the report:

reports.sh ${tenant} ${access_token} auth_event_details auth_event_details.json

The output has complete details of the failure.

Use failure-events-details.sh to process an entire failure log.
* reports.sh ${tenant} ${access_token} auth_audit_trail auth_audit_trail_failure.json | python -mjson.tool > failure.log
* failure-events-details.sh ${tenant} ${access_token} failure.log

**Application Audit**

* Use ../Application-Access/applications.sh to get an application's id.
* Update app_audit_trail.json
* reports.sh ${tenant} ${access_token} app_audit_trail app_audit_trail.json

**User Activity**

* reports.sh ${tenant} ${access_token} user_activity user_activity.json
* reports-export.sh ${tenant} ${access_token} user_activity_csv user_activity_export.json  > user_activity.csv

**Admin Activity**

reports.sh ${tenant} ${access_token} admin_activity admin_activity.json
