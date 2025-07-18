The /core/cli RAPI lets LMI users run SSH admin console commands.  Note that this operates via the LMI, not SSH.

Some examples:

./run-cli-command.sh isvaprimarywrp.kvm.org:10000 admin admin "tools database hvdb status -b64json" > hvdb.json
jq '.output' hvdb.json | sed -e 's/"//g' | base64 --decode
