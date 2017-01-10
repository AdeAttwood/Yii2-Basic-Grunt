#!/usr/bin/env bash

#== Import script args ==

timezone=$(echo "$1")

#== Bash helpers ==

function info {
  echo " "
  echo "--> $1"
  echo " "
}

#== Provision script ==

info "Provision-script user: `whoami`"

info "Allocate swap for MySQL 5.6"
fallocate -l 2048M /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap defaults 0 0' >> /etc/fstab
echo "Done!"

info "Configure locales"
update-locale LC_ALL="C"
dpkg-reconfigure locales
echo "Done!"

info "Configure timezone"
echo ${timezone} | tee /etc/timezone
dpkg-reconfigure --frontend noninteractive tzdata
echo "Done!"

info "Update OS software"
apt-get update
echo "Done!"

info "link app to server root"
rm -rf /var/www/app
ln -s /app /var/www/app
chown -R www-data:www-data /var/www/
info "Done"

info "Initailize databases for MySQL"
mysql -uroot -proot <<< "CREATE DATABASE yii2_basic"
mysql -uroot -proot <<< "CREATE DATABASE yii2_basic_test"
echo "Done!"

