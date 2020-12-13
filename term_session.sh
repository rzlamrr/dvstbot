#!/bin/bash
#
# Copyright (C) 2020 KeselekPermen69
# Copyright (C) 2020 rzlamrr
#
# SPDX-License-Identifier: GPL-3.0-or-later
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

export LANG=C.UTF-8

echo -e "\nChecking dependencies...\n"

if command -v node >/dev/null 2>&1 ; then
    echo -e "nodejs found "
    echo -e "version: $(node -v)"
else
    echo -e "node not found"
    arr+=(nodejs )
fi

if command -v wget >/dev/null 2>&1 ; then
    echo -e "\nwget found\n"
else
    echo -e "\nwget not found\n"
    arr+=(wget )
fi

if command -v curl >/dev/null 2&1 ; then
    echo -e "\ncurl found\n"
else
    echo -e "\ncurl not found\n"
    arr+=(curl )
fi

DEPENDENCIES=${arr[@]}
sleep 1

if [ ! -z "$DEPENDENCIES" ]; then
    echo -e "\nInstalling required dependencies\n"
    sleep 1

    if [ "$(command -v pkg)" != "" ]; then # termux
        pkg install "$DEPENDENCIES" -y

    elif [ "$(command -v apt-get)" != "" ]; then # debian
        sudo apt-get install "$DEPENDENCIES" -Y
    elif [ "$(command -v pacman)" != "" ]; then # arch
        sudo pacman -S "$DEPENDENCIES"npm -y

# Free to PR to add others
    else
        echo -e "\nDistro not supported \nInstall this packages yourself: $DEPENDENCIES\n"
    fi

else
    echo -e "\nDependencies have been installed. \n"
    sleep 1
fi

if [ ! -e wabot_sessio.js ]; then
    echo -e "\nDownloading wabot_session.js\n"
    wget https://raw.githubusercontent.com/rzlamrr/dvstbot/main/wabot_session.js
fi
echo -e "\nInstalling package\n"
npm i @open-wa/wa-automate
echo -e "\nRunning script...\n"
sleep 1
if node wabot_session.js; then
    echo -e "Here your session:\n"
    cat *.data.json
    echo
    echo
else
    echo "Could not make session"
fi

echo -e "Do you want to cleanup your file?"
echo -e "[1] cleanup: this delete wabot_session.js and this file"
echo -e "[2] exit"
echo -ne "\nEnter your choice[1-2]: "
read choice
if [ "$choice" = "1" ]; then
    echo -e "Cleanup: removing file"
    rm -f wabot_session.js term_session.sh
elif [ "$choice" = "2" ]; then
    exit
fi
