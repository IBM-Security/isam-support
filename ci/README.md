Various RAPI for working with a CI tenant

To setup:

```
mkdir git
cd git
git clone https://github.com/IBM-Security/isam-support
Initialized empty Git repository in /home/juser/git/isam-support/.git/
remote: Enumerating objects: 64, done.
remote: Counting objects: 100% (64/64), done.
remote: Compressing objects: 100% (52/52), done.
remote: Total 545 (delta 17), reused 0 (delta 0), pack-reused 481
Receiving objects: 100% (545/545), 1.18 MiB | 1.78 MiB/s, done.
Resolving deltas: 100% (186/186), done.

cd isam-support/ci
chmod -R +x .
cd bin
./create-symlinks.sh
export PATH=”`pwd`:$PATH"
```

Use:

* Generate a token.  Use ci/bin/get-token.sh to get an access token

      get-token.sh tenant client_id client_secret
      {"access_token":"abcdefg","...."}

* Setting tenant and access_token environent variables makes this very easy.
  * export tenant=tenant.ice.ibmcloud.com
  * export access_token=abcdefg
