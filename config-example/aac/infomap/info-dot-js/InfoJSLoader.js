importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

var movealong = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "movealong");

if (movealong != null) {
    success.setValue(true);
}
