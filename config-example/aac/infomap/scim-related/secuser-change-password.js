//
// Update ISAM secUser object.
//
// Use the following when ISAM Integration has been enabled for SCIM
// so that the secPwdLastChanged attribute on the secUser object is updated.
//
var patchJson = {
  "schemas":[
     "urn:ietf:params:scim:schemas:extension:isam:1.0:PatchOp"
  ],
  "Operations":[
    {
      "op":    "replace",
      "path":"urn:ietf:params:scim:schemas:extension:isam:1.0:user:password",
      "value": ''+password
    }
  ]
};
var resp = ScimClient.httpPatch(scimConfig, "/Users/"+ id, patchJson);
