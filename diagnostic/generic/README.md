**Generic Diagnostic Tools that can be used against many components**

*These are available as-is and are not maintained*

====================================================================
cipherTester.sh - a Bash script that loops through openssl ciphers to confirm which the target server is using

*Usage* : cipherTester.sh --host `<hostname|ip>` --port `<port>` [-tls1 -tls1_1 -tls1_2 -tls1_3 -debug]

-- Note --
Requires 'bash' and 'openssl' to run as intended

====================================================================
pdjar.sh - Execute this script to find any *PD.jar* files, the details of the files, and their versions.

Requires read access so it is recommended to run as root to ensure you have permissions to find them all.
Relies on the "unzip" command being avialble.

====================================================================


