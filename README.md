Alarm Server to MQTT
====================

This repository contains the necessary code you need to host an Alarm server by yourself that works with EZVIZ cameras over the local network. I wrote this because I have a lot of EZVIZ cameras lying around and do not want to send my home video to their cloud.

To use EZVIZ cameras on your local network, you'll lose a lot of features but can still retain the two most important ones: Video feed & motion detection.

Video feed (via rtsp) can be enabled by the EZVIZ Mobile application by going into LAN Devices and enabling it. Motion detection is a bit tricker, you'll have to download the EZVIZ Studio, [enable advanced settings](https://web.archive.org/web/20230610141219/https://m-support.ezviz.com/faq/171) and then set the address of the "Alarm server" where this package is running. If you happen to be using EZVIZ cameras with Apple Homekit, you may also want to change the video quality to h264 while you're in there.

It is highly recommended to configure your network isolation so that the cameras are not accessible by the entire network, but only your video coordination server (where this package would be running) to prevent privacy leaks.

### Usage

Happy to accept any PRs that make it easier to install and deploy this!

For the time being, here's how you can do it:

```
$ git clone https://github.com/steelbrain/alarm-server-mqtt alarm-server
$ cd alarm-server
$ cp config.example.json config.json
$ nano config.json # Add the correct values
$ npm install; npm run prepare # To compile the sources
$ node . # or node lib
```

### License

The contents of this repository are licensed under the terms of the MIT License. See the LICENSE file for more info.
