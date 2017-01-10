#!/usr/bin/env bash

#== Import script args ==

github_token=$(echo "$1")

#== Bash helpers ==

function info {
  echo " "
  echo "--> $1"
  echo " "
}

#== Provision script ==

info "Provision-script user: `whoami`"

info "Configure composer"
composer config --global github-oauth.github.com ${github_token}
echo "Done!"

info "Install project dependencies"
cd /app
composer --prefer-dist install
npm install --no-bin-links
echo "Done!"

#info "Init project"
#./init --env=Development --overwrite=y
#echo "Done!"

info "Apply migrations"
php ./yii migrate <<< "yes"
echo "Done!"

info "Grunt Build"
grunt build-dev