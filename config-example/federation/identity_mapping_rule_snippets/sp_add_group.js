importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Group);

// Example: Adding group to ISAM credential.
//
// To add attribute to ISAM credential, add an attribute to "stsuu", as shown
// below. Set the type to "urn:ibm:names:ITFIM:5.1:accessmanager", and the
// attributes to NULL.

stsuu.addGroup(new Group("manager", "urn:ibm:names:ITFIM:5.1:accessmanager", null));
