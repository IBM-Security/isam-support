# Written by Daniel Comeau
# Usage: awk -f disk_usage.awk ls.txt|sort -rn
# Ver: 1.2

BEGIN {
	directory = "^/.*:"
	file = "^-........."
}
{
if ($1 ~ directory) {
	#remove trailing : from directory names
	sub(/\:$/,"");
	dirname = $1;
}

if ($1 ~ file) {
	if ($9 != "kcore") {
		# Handle fixpack output which specifies sizes with K, M, and G by converting to bytes
		if ($5 ~ /K$/) {
			$5 = sprintf("%d",substr($5, 1, length($5)-1)*1024);
			}
		else if ($5 ~ /M$/) {
			$5 = sprintf("%d",substr($5, 1, length($5)-1)*1024*1024);
			}
		else if ($5 ~ /G$/) {
			$5 = sprintf("%d",substr($5, 1, length($5)-1)*1024*1024*1024);
                        }
	
		dir[dirname]+=$5;   		# store directory names
		filename = dirname"/"$9	 	# build the filename with the directory name prefixed
		filelist[filename]=$5		# build the list of files	
		filecount[dirname]+=1		# count the number of files in the directory
	}
	
}
}

END {
if (mode == "dir" ) {
	for (var in dir){
		printf ("%-15d%-15d%s\n", dir[var], filecount[var], var); 
	}
	exit
}

if (mode == "dirfiles" ) {
        for (var in dir){
                printf ("%-15d%-15d%s\n", dir[var], filecount[var], var);
        }
	exit
}


if (mode == "files" ) {
	for (var2 in filelist){
		printf ("%-15d%s\n", filelist[var2], var2); 
		}
	exit
	}

exit
}
