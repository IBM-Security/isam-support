The /core/cli RAPI lets LMI users run SSH admin console commands.  Note that this operates via the LMI, not SSH.

Some examples:

./run-cli-command.sh appliance_lmi_hostname admin admin "tools database hvdb status -b64json" > hvdb.json<br>
jq '.output' hvdb.json | sed -e 's/"//g' | base64 --decode<br>
<br>
./run-cli-command.sh appliance_lmi_hostname admin admin "diagnostics pidstat -h  --human -r -s -u -v -w" | jq '.output' | sed -e 's/\\\n/\n/g'<br>


