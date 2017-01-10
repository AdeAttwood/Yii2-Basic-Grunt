#!/usr/bin/env bash

#== Bash helpers ==

function info {
  echo " "
  echo "--> $1"
  echo " "
}

#== Provision script ==

info "Provision-script user: `whoami`"

info "Restart web-stack"
service apache2 restart
service mysql restart

info "start selenium server"
export DISPLAY=:10
Xvfb :10 -screen 0 1366x768x24 -ac &
nohup java -jar /usr/local/bin/selenium-server-standalone-2.53.1.jar &
