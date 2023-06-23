#!/usr/bin/perl

use Time::Local;
use POSIX qw(strftime);

print "Thread\tBrowser => PD\tPD => BackEnd\tBackend => PD\tPD => Browser\tPD Delay 1\tBackend Delay\tPD Delay 2\tRequest\n";

my $delay   =   0;
my $segment =  '';    # need to init out of loop so it can be used to process next lines

while (<>) {
    # Remove EOL markers
    chomp;

    # This Regex needs to check for 30 min time zones
    # Matches 'yyyy-mm-dd-hh:mm:ss.sss-oo:00I----- thread(tnum) [source reference] ---------------- component ===> component -----------------'
    # Also matches 'yyyy-mm-dd-hh:mm:ss.1sss-oo:00I----- thread(tnum) [source reference] ---------------- component ===> component -----------------'
    # Also matches 'yyyy-mm-dd-hh:mm:ss.1?sss-oo:30I----- thread(tnum) [source reference] ---------------- component ===> component -----------------'
    
    if ( /^(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2}):(\d{2})\.(1?\d{3})[-+]\d{2}:[03]0I----- thread\((\d+)\) trace.pdweb.debug.* ----------------- (\w+) ([<=]==[=>]) (\w+) -----------------/){
        #   $1      $2      $3      $4      $5      $6       $7                                     $8                                            $9    $10          $11
        # Convert integer millisconds to a decimal for later use
        $frac = substr( $7 / 1000 + 0.0001, 1, 4 );
        $time = timelocal( $6, $5, $4, $3, $2 - 1, $1 - 1900 ) + $frac;
        $thread = $8;
        if ( $10 eq '===>' ) {
            $segment = $9 . '2' . $11;
        }
        else {
            $segment = $11 . '2' . $9;
        }
        $time{$thread}{$segment} = $time;
        $frac{$thread}{$segment} = $frac;
        if ( $segment eq "PD2Browser" ) {
            # Matches on response to browser
            if (    exists $time{$thread}{'Browser2PD'}
                and exists $time{$thread}{'PD2Browser'} ) {
                # Matches when we also have the inital browser request
                if ( $time{$thread}{'PD2Browser'} -
                    $time{$thread}{'Browser2PD'} > $delay ) {
                    # Unimplemented thresholding also prevents redisplay of requests in progress when trace started 
                    print $thread, "\t";
                    if (    exists $time{$thread}{'PD2BackEnd'}
                        and exists $time{$thread}{'BackEnd2PD'} ) {
                        # Full flow
                        print 
                            strftime( "%H:%M:%S", localtime $time{$thread}{'Browser2PD'} ), $frac{$thread}{'Browser2PD'}, "\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'PD2BackEnd'} ), $frac{$thread}{'PD2BackEnd'}, "\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'BackEnd2PD'} ), $frac{$thread}{'BackEnd2PD'}, "\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'PD2Browser'} ), $frac{$thread}{'PD2Browser'}, "\t";
                        $pd1 = $time{$thread}{'PD2BackEnd'} - $time{$thread}{'Browser2PD'};
                        $be  = $time{$thread}{'BackEnd2PD'} - $time{$thread}{'PD2BackEnd'};
                        $pd2 = $time{$thread}{'PD2Browser'} - $time{$thread}{'BackEnd2PD'};
                        printf "%6.3f\t%6.3f\t%6.3f\t", $pd1, $be, $pd2;
                    } else {
                        # Partal flow just WebSEAL and Browser show only PD Delay 1
                        print 
                            strftime( "%H:%M:%S", localtime $time{$thread}{'Browser2PD'} ), $frac{$thread}{'Browser2PD'}, "\t-\t-\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'PD2Browser'} ), $frac{$thread}{'PD2Browser'}, "\t";
                        $pd  = $time{$thread}{'PD2Browser'} - $time{$thread}{'Browser2PD'};
                        printf "%6.3f\t-\t-\t", $pd;
                    }
                    print $time{$thread}{'request'}, "\n";
                }
            }
            undef( $time{$thread} );
            undef( $frac{$thread} );
        } elsif ( $segment eq "BackEnd2PD" ) {
            # Handle formating for junction pings 
            if (  ( not (exists $time{$thread}{'Browser2PD'})) and exists $time{$thread}{'PD2BackEnd'}) {
                # BUG This incorrectly matches on requests in progress when trace started. 
                #    Limitation as no reliable way to distinguish this.  
                #    Trailing PD2Browser segment will be ignored.
                #    This check is needed handle a parsing issue.
                print $thread, "\t";
                #Partial flow junction ping show only Backend Delay
                print
                    "-\t",
                    strftime( "%H:%M:%S", localtime $time{$thread}{'PD2BackEnd'} ), $frac{$thread}{'PD2BackEnd'}, "\t",
                    strftime( "%H:%M:%S", localtime $time{$thread}{'BackEnd2PD'} ), $frac{$thread}{'BackEnd2PD'}, "\t",
                    "-\t";
                $be = $time{$thread}{'BackEnd2PD'} - $time{$thread}{'PD2BackEnd'};
                printf "-\t%6.3f\t-\t",  $be;
                print $time{$thread}{'PDrequest'}, "\n";
                undef( $time{$thread} );
                undef( $frac{$thread} );
            }
        }
    } elsif ( $segment eq "Browser2PD" and /^(GET|HEAD|POST|PUT|DELETE|OPTIONS)\s(\S+)/i ) {
        # Only matches when parsing the browser request lines
        $time{$thread}{'request'} = $1 . ' ' . $2;
    } elsif ( $segment eq "PD2BackEnd" and /^(GET|HEAD|POST|PUT|DELETE|OPTIONS)\s(\S+)/i ) {
        # Only matches when WebSEAL to backend request lines
        $time{$thread}{'PDrequest'} = $1 . ' ' . $2;
    }
}
