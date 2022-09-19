Run using:

```
./create-isva-kvm.sh ISVA1040 /var/lib/libvirt/images/isva_10.0.4.0_20220607-2337.iso /var/lib/libvirt/images/ISVA1040.qcow2
```

Can take a few minutes to create it.  Might need to manually start.

Manual Commands:

```
virsh destroy ISVA1040   ## The destroy command only stops the VM.
virsh start ISVA1040
virsh undefine ISVA1040  ## This deletes the VM.
```

How do I know which internal IP is being used?

```
virsh domiflist ISVA1040
 Interface   Type     Source   Model    MAC
-----------------------------------------------------------
 tap0        bridge   virbr0   virtio   52:54:00:6c:6a:05

 arp -e | grep 52:54:00:6c:6a:05
192.168.122.200          ether   52:54:00:6c:6a:05   C                     virbr0
192.168.122.201          ether   52:54:00:6c:6a:05   C                     virbr0
```

Initial KVM will have IP randomly assigned.  Log into LMI and change to static.
