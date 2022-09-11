## Steps for Initial Extension Creation
  * Verify-the-contents-of-a-bundle-file.sh (No point in importing if the bundle was not created correctly)
  * Create-a-bundle.sh (Basically a stub function to create the internal definition)
  * Retrieve-a-list-of-bundles.sh (Get newly created id for the bundle)
  * Import-the-bundle-file-for-a-bundle.sh (Upload the actual .jar)
  * Retrieve-a-specific-bundle.sh (Examine bundle specifics)
  
## Lifetime steps
  * Export-a-specific-bundle.sh (Get the .jar back)
  * Update-a-bundle.sh (Upload a new .jar)
  * Delete-a-bundle.sh (Delete entire bundle from appliance.  This removed .jar and the bundle id)
