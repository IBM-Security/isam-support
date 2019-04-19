#!/usr/bin/perl
# Usage:
# Takes master authorization server db, outputs list of permissions associated with each ACL or for specified ACLs to report.txt
#
# Input
# =====================
# 	ACLPermissionsTranslator.pl <master_authz_dump_file> [<ACL_To_Translate_Permissions (or set of ACLs)>] 
# 	Where
#	-A -> output list of all acls with translated permissions 
# 	<ACL_To_Translate_Permissions (or set of ACLs)> -> comma separated list of ACLs to translate.
# =====================
#
# Output  
# =====================
# 	report.txt
# =====================

if ($ARGV[0] eq "") {
	print "No arguments supplied";
	exit(1);
}


$MasterAuthzDumpFile=shift(@ARGV);

$NameOfACL = shift(@ARGV);

$NoArgFlag = "0";

$ACLPrefix = "/auth/extended-acl/";

#Get List of ACL(s)
if (!($NameOfACL =~ /^\S+$/ || $NameOfACL =~ /^\S+,\S+.*$/)) {
   $NoArgFlag = "1";
} else {
    if ($NameOfACL =~ /^\S+,\S+.*$/) {
      @NameOfACLs = split(/,/, $NameOfACL);
	}
	elsif ($NameOfACL =~ /^\S+$/) {
      @NameOfACLs = ($NameOfACL);
	}
}

#Future args go here

foreach (@ARGV) {
  
}


open (FILE, '<', $MasterAuthzDumpFile) or die "Could not open".$MasterAuthzDumpFile;

open(my $fh, '>', 'report.txt');

$flag = 0;

while($line = <FILE>)
{
	if($NoArgFlag eq "1")
	{
		#Object Name
		if ($line =~ /$ACLPrefix(.*)/)
		{
			print $fh "\nACL name: $1\n";
		}
		#ACL Entry
		elsif ($line =~ /ACLEntry:         (.*)/)
		{
			@AclEntry = split(/ /, $1);
			$AclEntry[2] =~ /\[0\](.*)/;
			$result = hexSubtraction($1);
			if($result ne "Invalid Hex Value"){
				$result = reverse($result);
			}
			print $fh "Entry: $AclEntry[0] $result\n";
		}
	}
	else{
		foreach (@NameOfACLs)
		{
			#If any of the list of acls are found
			if ($line =~ /$ACLPrefix(.*)/ && ($1 eq $_))
			{
				print $fh "\nACL name: $1\n";
				$flag = 1;
			}
			elsif ($flag && $line =~ /ACLEntry:         (.*)/)
				{
					@AclEntry = split(/ /, $1);
					$AclEntry[2] =~ /\[0\](.*)/;
					$result = hexSubtraction($1);
					if($result ne "Invalid Hex Value"){
						$result = reverse($result);
					}
					print $fh "Entry: $AclEntry[0] $result\n";
				}
			elsif($line =~ /(END OBJECT)/)
			{
				$flag = 0;
			}
		}
	}
}
	  
sub hexSubtraction{

	%permissions = ("T", "0x01",
	"c", "0x02",
	"g", "0x20",
	"m", "0x40",
	"d", "0x80",
	"b", "0x100",
	"s", "0x200",
	"v", "0x400",
	"a", "0x800",
	"B", "0x1000",
	"t", "0x2000",
	"R", "0x4000",
	"r", "0x10000",
	"x", "0x20000",
	"l", "0x40000",
	"N", "0x200000",
	"W", "0x400000",
	"A", "0x800000");
	
	#Taking in the parameter
	
	$result = (hex($_[0]));
		
	$permissionsList = "";
	
	foreach my $listValue (sort { hex($permissions{$b}) <=> hex($permissions{$a}) } keys %permissions)
	{
		if($result==0)
		{
			last;
		}
		if($result - hex($permissions{$listValue}) < 0)
		{
			next;
		}
		$result = $result - hex($permissions{$listValue});
				
		$permissionsList = $permissionsList . $listValue;
	}
	if($result != 0)
	{
		$permissionsList = "Invalid Hex Value";
	}
	return $permissionsList;
}
	   
close $fh;	   
close (FILE) or die "Could not close file!";
