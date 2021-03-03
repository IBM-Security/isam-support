#! /usr/bin/perl

#	export FILE=; PERL_SCRIPT=~/bin/perl/network_status/network_status_snmp_ephemeral.pl; time perl $PERL_SCRIPT $FILE > ${FILE}.ephemeral

use strict;
use warnings;

{
 LINE:
	while (my $line = <>)
	{
		if ($line =~ m@^\s*tcpConnState\s+tcpConnLocalAddress\s+tcpConnLocalPort\s+tcpConnRemAddress\s+tcpConnRemPort\s*$@o)
		{
			chomp($line);
			print "$line ephemeral\n";
			my $ephemeral = 0;
			my %ephemeral = ();
			my %server = ();
			my @line = ();
			while (my $tcpConnTable = <>)
			{
				chomp($tcpConnTable);
				if ($tcpConnTable =~ m@^\s*([^ ]+)\s+([^ ]+)\s+(\d+)\s+[^ ]+\s+\d+\s*$@o)
				{
					my $tcpConnState = $1;
					my $tcplocal = $2;
					my $tcplocal_port = $3;
					push(@line, $tcpConnTable);
					if ($tcpConnState eq "listen")
					{
						$server{$tcplocal}{$tcplocal_port}++;
					}
				}
				elsif ($tcpConnTable =~ m@^\s*$@o)
				{
					my @client = ();
					my @server = ();
					foreach my $server (sort keys(%server))
					{
						push(@client, $server);
						my $server_ports = "$server\\s+(?:" . join('|', sort keys(%{$server{$server}})) . ")";
						push(@server, "$server_ports");
					}
					my $client = join("|", @client);
					my $client_regexp = qr/\s+(?:${client})\s+\d+$/;
					my $server = join("|", @server);
					my $server_regexp = qr/\s+(?:${server})\s+[^ ]+\s+\d+\s*$/;

					#	Completed reading snmp dataaa
					foreach my $line (@line)
					{
						if ($line =~ m@$server_regexp@o)
						{
							print "$line\n";
						}
						else
						{
							if ($line =~ m@^\s*[^ ]+\s+([^ ]+)\s+\d+\s+[^ ]+\s+\d+\s*$@o)
							{
								my $tcplocal = $1;
								$ephemeral{$tcplocal}++;

								print "$line ephemeral\n";
								$ephemeral++;
							}
						}
					}	#	foreach my $line (@line)
				}	#	elsif ($tcpConnTable =~ m@^\s*$@o)
				else
				{
					foreach my $tcplocal ( sort keys(%ephemeral) )
					{
						print "Total ephemeral ports for $tcplocal\t::\t$ephemeral{$tcplocal}\n";
					}
					print "\n$tcpConnTable\n\n";

					next LINE;
				}
			}	#	while (my $tcpConnTable = <>)
		}	#	($line =~ m@^\s*tcpConnState\s+tcpConnLocalAddress\s+tcpConnLocalPort\s+tcpConnRemAddress\s+tcpConnRemPort\s*$@o)
		else
		{
			print $line;
		}	#	($line !~ m@^\s*tcpConnState\s+tcpConnLocalAddress\s+tcpConnLocalPort\s+tcpConnRemAddress\s+tcpConnRemPort\s*$@o)
	}	#	while (my $line = <>)
}
