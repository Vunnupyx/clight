#!/bin/bash

# DESCRIPTION: 
# Generates a bootable USB stick image with the selected MDC flex image. 
# The boot image depends an the selected FS Version
# DEPENDENCIES: 
# kpartx

clear
if [ "$(id -u)" -ne 0 ]
  then echo "root privileges required"
  exit 1
fi

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
INSTALLER_IMAGE_BASE=installerBaseImages
MDC_IMAGES_PATH=mdcImages

echo "For which device do you want to build?";
select FS in "FS03" "FS04";
    do
        case $FS in
            FS03 ) break;;
            FS04 ) break;;
            *) echo "Invalid selection. Abort!"; exit 1;;
        esac
    done

INSTALLER_BASE_IMAGE_PATH=$SCRIPTPATH/$INSTALLER_IMAGE_BASE/$FS
MOUNT_POINT=$SCRIPTPATH/tmpMount
OUTPUT=$SCRIPTPATH/output

echo "Please select MDC Flex image:"
select MDC_IMAGE in $SCRIPTPATH/$MDC_IMAGES_PATH/* ; do
    case $d in 
        *) break;;
    esac
done

BASE_IMAGE=$INSTALLER_BASE_IMAGE_PATH/MDC_LITE_INSTALLER-$FS.img
echo "Create loop back device from $BASE_IMAGE"
# create loopback device
kpartx -av $BASE_IMAGE
# create mountpoint
echo "Create mount point $MOUNT_POINT";
mkdir -p $MOUNT_POINT
# create output directory
echo "Generate output directory";
mkdir -p $OUTPUT
# mount
echo "Mount image to $MOUNT_POINT";
mount -o loop /dev/mapper/loop0p1 $MOUNT_POINT
# remove old mdc image
echo "remove old mdc flex image from installer";
rm $MOUNT_POINT/root/*.img.gz
# copy selected mdc image into boot image
echo "copy new mdc flex image to installer";
cp $MDC_IMAGE $MOUNT_POINT/root/
# unmount
echo "unmount installer image"
umount $MOUNT_POINT
# remove loopback
echo "remove loop back device"
kpartx -ds $INSTALLER_BASE_IMAGE_PATH/*.img
# copy result to output
echo "copy generated installer image to output"
cp $INSTALLER_BASE_IMAGE_PATH/*.img $OUTPUT/MDC_FLEX_INSTALLER-$FS-NEW.img
# rm tmpmount
echo "destroy mountpoint"
rm -r $MOUNT_POINT


