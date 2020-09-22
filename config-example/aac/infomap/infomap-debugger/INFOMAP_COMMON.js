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

function dumpContextArray(contextArray, scope, attrs_type) {
    var attr_name = "";
    var attr_value = "";
    var tag = "";

    trace("INFOMAPDEBUGGER:    Length = ", contextArray.length);

    if (contextArray != null) {
        for (var i = 0; i < contextArray.length; i++) {
            attr_name = contextArray[i];
            attr_value = context.get(scope, attrs_type, attr_name);
            tag = attr_name + " = " + attr_value
            trace("INFOMAPDEBUGGER:    ", tag);

        }
    }
}
