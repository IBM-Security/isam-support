import com.tivoli.pd.rgy.ldap.LdapRgyRegistryFactory;
import com.tivoli.pd.rgy.RgyAttributes;
import com.tivoli.pd.rgy.RgyException;
import com.tivoli.pd.rgy.RgyGroup;
import com.tivoli.pd.rgy.RgyIterator;
import com.tivoli.pd.rgy.RgyRegistry;
import com.tivoli.pd.rgy.RgyUser;
import com.tivoli.pd.rgy.exception.*;

public class rgyDirect_createUser {
        public static void main(String[] args) {
                String                                                  filePath = null;
                String                                                  filePathURL = null;
                String                                                  userName = null;
                String                                                  domain = null;
                String                                                  userId = null;
                String                                                  userNativeId = null;
                String                                                  userPwd = null;
		boolean							bypassPasswordPolicy = false;
                java.net.URL                                            url = null;
                RgyUser                                                 regUser = null;
                RgyRegistry                                             registry = null;

                System.out.println("");

                filePath = args[0];
                filePathURL = "file:" + filePath;
                System.out.println("   Properties file = " + filePathURL);

                try {
                        url = new java.net.URL(filePathURL);
                }
                catch (Exception e) {
                            System.out.println("   Could not create URL.");
                            System.out.println(e.getMessage());
                                System.exit(1);
                }

		domain       = args[1];
		userId       = args[2];
		userNativeId = args[3];
                userPwd      = args[4];

                System.out.println("Creating an instance of RgyRegistry for LDAP");
                try {
                        registry = LdapRgyRegistryFactory.getRgyRegistryInstance(url, null);
                }
                catch (RgyException re) {
                        re.printStackTrace();
                        System.out.println("FAILED: Unable to obtain instance of LdapRegistry");
                        System.exit(1);
                }

		try {
                	System.out.println("Creating an new user");
			RgyAttributes rgyAttrs = registry.newRgyAttributes();
			rgyAttrs.addAttribute("cn", userId);
			rgyAttrs.addAttribute("sn", userId);
			rgyAttrs.addAttribute("secAcctValid", "TRUE");
			registry.createUser(domain, userId, userNativeId, userPwd.toCharArray(), bypassPasswordPolicy, rgyAttrs, null);
		}
                catch (RgyException re) {
                        re.printStackTrace();
                        System.out.println("FAILED: Unable to create new user");
                        registry.close();
                        System.exit(1);
                }

                registry.close();
                System.exit(0);
        }
}
