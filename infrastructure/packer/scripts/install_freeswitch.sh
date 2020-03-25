#!/bin/bash
VERSION=v1.10.1
GRPC_VERSION=v1.24.2

echo "freeswitch version to install is ${VERSION}"

git config --global pull.rebase true
cd /usr/local/src
git clone https://github.com/davehorton/freeswitch.git -b ${VERSION}
git clone https://github.com/warmcat/libwebsockets.git -b v3.2.0
git clone https://github.com/davehorton/drachtio-freeswitch-modules.git -b master
git clone https://github.com/dpirch/libfvad.git
sudo cp -r /usr/local/src/drachtio-freeswitch-modules/modules/mod_audio_fork /usr/local/src/freeswitch/src/mod/applications/mod_audio_fork
 
sudo sed -i -r -e 's/(.*AM_CFLAGS\))/\1 -g -O0/g' /usr/local/src/freeswitch/src/mod/applications/mod_audio_fork/Makefile.am
sudo sed -i -r -e 's/(.*-std=c++11)/\1 -g -O0/g' /usr/local/src/freeswitch/src/mod/applications/mod_audio_fork/Makefile.am

# build libwebsockets
cd /usr/local/src/libwebsockets
sudo mkdir -p build && cd build && sudo cmake .. -DCMAKE_BUILD_TYPE=RelWithDebInfo && sudo make && sudo make install

# build libfvad
cd /usr/local/src/libfvad
sudo autoreconf -i && sudo ./configure && sudo make && sudo make install

# patch freeswitch
# basic patches
echo "patching freeswitch for lws and mod_audio_fork"
cd /usr/local/src/freeswitch
sudo cp /tmp/configure.ac.patch .
sudo cp /tmp/Makefile.am.patch .
sudo cp /tmp/modules.conf.in.patch  ./build
sudo cp /tmp/modules.conf.vanilla.xml ./conf/vanilla/autoload_configs/modules.conf.xml
sudo cp /tmp/mod_opusfile.c.patch ./src/mod/formats/mod_opusfile
sudo patch < configure.ac.patch 
sudo patch < Makefile.am.patch
cd build && sudo patch < modules.conf.in.patch
cd /usr/local/src/freeswitch/src/mod/formats/mod_opusfile && sudo patch < mod_opusfile.c.patch
cd /usr/local/src/freeswitch

# build freeswitch  
echo "building freeswitch"
cd /usr/local/src/freeswitch
sudo ./bootstrap.sh -j
sudo ./configure --with-grpc=yes
sudo make
sudo make install
sudo make cd-sounds-install cd-moh-install
sudo cp /tmp/acl.conf.xml /usr/local/freeswitch/conf/autoload_configs
sudo cp /tmp/event_socket.conf.xml /usr/local/freeswitch/conf/autoload_configs
sudo cp /tmp/switch.conf.xml /usr/local/freeswitch/conf/autoload_configs
sudo rm -Rf /usr/local/freeswitch/conf/dialplan/*
sudo rm -Rf /usr/local/freeswitch/conf/sip_profiles/*
sudo cp /tmp/mrf_dialplan.xml /usr/local/freeswitch/conf/dialplan
sudo cp /tmp/mrf_sip_profile.xml /usr/local/freeswitch/conf/sip_profiles
sudo cp /usr/local/src/freeswitch/conf/vanilla/autoload_configs/modules.conf.xml /usr/local/freeswitch/conf/autoload_configs
sudo cp /tmp/conference.conf.xml /usr/local/freeswitch/conf/autoload_configs
sudo cp /tmp/freeswitch.service /etc/systemd/system
sudo chown root:root -R /usr/local/freeswitch
sudo chmod 644 /etc/systemd/system/freeswitch.service
sudo sed -i -e 's/global_codec_prefs=OPUS,G722,PCMU,PCMA,H264,VP8/global_codec_prefs=PCMU,PCMA,OPUS,G722/g' /usr/local/freeswitch/conf/vars.xml
sudo sed -i -e 's/outbound_codec_prefs=OPUS,G722,PCMU,PCMA,H264,VP8/outbound_codec_prefs=PCMU,PCMA,OPUS,G722/g' /usr/local/freeswitch/conf/vars.xml
sudo sed -i -e 's/cmd="stun-set" data="external_rtp_ip=stun\:stun.freeswitch.org"/cmd="exec-set" data="external_rtp_ip=curl -s http:\/\/169.254.169.254\/latest\/meta-data\/public-ipv4"/g' /usr/local/freeswitch/conf/vars.xml
sudo sed -i -e 's/cmd="stun-set" data="external_sip_ip=stun\:stun.freeswitch.org"/cmd="exec-set" data="external_sip_ip=curl -s http:\/\/169.254.169.254\/latest\/meta-data\/public-ipv4"/g' /usr/local/freeswitch/conf/vars.xml
sudo systemctl enable freeswitch
sudo cp /tmp/freeswitch_log_rotation /etc/cron.daily/freeswitch_log_rotation
sudo chown root:root /etc/cron.daily/freeswitch_log_rotation
sudo chmod a+x /etc/cron.daily/freeswitch_log_rotation





