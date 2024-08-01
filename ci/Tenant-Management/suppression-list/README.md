The Suppression Lists RAPI are:

Check for a specific email address:\
GET https://${tenant}/v1.0/notification/suppression/email/${email}\
Response:\
404: Email is not on the list\
200: Email is on the list

Remove a specific email address:\
DELETE https://${tenant}/v1.0/notification/suppression/email/${email}\
Response:\
404: Email is not on the list\
204: Email address succesfully removed
