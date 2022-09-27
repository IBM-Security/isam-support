#!/bin/sh -x
NAME=$1
BOOTSTRAP_ISO=$2
QEMU_PATH=$3

virt-install  \
    --name ${NAME} \
    --ram 8192  \
    --vcpus 4  \
    --virt-type kvm \
    --disk path=${BOOTSTRAP_ISO},device=cdrom,boot_order=2 \
    --os-type generic  \
    --os-variant generic  \
    --cpu qemu64,disable=svm \
    --network bridge=virbr0,model=virtio \
    --disk path=${QEMU_PATH},device=disk,bus=virtio,format=qcow2,boot_order=1,size=30 \
    --import    \
    --console pty,target_type=serial
