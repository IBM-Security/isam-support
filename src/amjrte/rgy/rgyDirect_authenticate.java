import com.tivoli.pd.rgy.RgyAttributes;
import com.tivoli.pd.rgy.RgyException;
import com.tivoli.pd.rgy.RgyIterator;
import com.tivoli.pd.rgy.RgyRegistry;
import com.tivoli.pd.rgy.RgyUser;
import com.tivoli.pd.rgy.exception.*;
import com.tivoli.pd.rgy.ldap.LdapRgyRegistryFactory;
import com.tivoli.pd.rgy.*;
import com.tivoli.pd.rgy.ldap.*;

public class rgyDirect_authenticate {
        public static void main(String[] args) {
                String                                                  filePath = null;
                String                                                  filePathURL = null;
                String                                                  userPwd = null;
                String                                                  userName = null;
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

                userName = args[1];
                userPwd  = args[2];

                System.out.println("Creating an instance of RgyRegistry for LDAP");
                try {
                        registry = LdapRgyRegistryFactory.getRgyRegistryInstance(url, null);
                }
                catch (RgyException re) {
                        re.printStackTrace();
                        System.out.println("FAILED: Unable to obtain instance of LdapRegistry");
                        System.exit(1);
                }

                System.out.println("Creating an instance of RgyUser");
                System.out.println("   USERNAME: " + userName);
                try {
                        regUser = registry.getUser("Default", userName);
                        regUser.authenticate(userPwd.toCharArray());
                        System.out.println("   Successfully Authenticated");
                }
                catch (RgyException re) {
                        re.printStackTrace();
                        System.out.println("FAILED: Unable to create RgyUser");
                        registry.close();
                        System.exit(1);
                }

                registry.close();
                System.exit(0);
        }
}
