function trace(tag, msg) {
    IDMappingExtUtils.traceString(tag + msg);
}

function dumpMap(scope, namespace, name) {
    var theMap = context.get(scope, namespace, name);

    if (theMap != null) {
	var mapKeySet    = theMap.keySet();
	var numKeys = theMap.size();
	
        trace("INFOMAPDEBUGGER:    Map      = ", theMap);
	trace("INFOMAPDEBUGGER:    Set        = ", mapKeySet);
	trace("INFOMAPDEBUGGER:    Length = ", numKeys);

	var theKeyArray = theMap.keySet().toArray();
	var i;
	for(i=0; i < numKeys; i++) {
	    var aKey = theKeyArray[i]; 
	    var aValue = theMap.get(aKey);
	    trace("INFOMAPDEBUGGER:      ", aKey + "=" + aValue[0]);
	}
    }
}
