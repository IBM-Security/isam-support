BEGIN{
   single_use=0;
   reuse=0;
   cache_miss=0;
   total=0;
}
/HTTPS/{
   packetnum=$1;
   time=$2;
   sender=$3;
   receiver=$5;
   port=substr($8,6);
}
/0: 1603/{
   sslop=substr($4,3,2);
   if (sslop=="01") {
      getline;
      getline;
      sslid=$8 $9;
      getline;
      sslid=sslid $2 $3 $4 $5 $6 $7 $8 $9;
      getline;
      sslid=sslid $2 $3 $4 $5 $6 $7;
      client_id[port]=sslid;
#      print packetnum "	" sender "	" port "	" sslid;
   }
   if (sslop=="02") {
      handshakes++;
      getline;
      getline;
      sslid=$8 $9;
      getline;
      sslid=sslid $2 $3 $4 $5 $6 $7 $8 $9;
      getline;
      sslid=sslid $2 $3 $4 $5 $6 $7;
      if (sslid != client_id[port]) {
#         print "sslid mismatch, client requested " client_id[port] " but server sent " sslid;
          cache_miss++;
      }
#      print packetnum "	" sender "	" port "	" sslid;
      count[sslid]++;
   }
}
END {
   for (sslid in count) {
#      print sslid, count[sslid];
      if (count[sslid]==1) {
         single_use++;
      } else {
         reuse++;
      }
      total++;
   }
   print reuse " SSL IDs reused, " single_use " SSL IDs used once, " cache_miss " apparent cache misses out of " total " total session IDs seen in " handshakes " SSL handshakes";
}
