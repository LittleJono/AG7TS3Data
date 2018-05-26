# AG7TS3Data

This repository contains the code I used to collection data on user activity on a Teamspeak (VOIP) server. 
I collected the list of connected users and their corresponding voice channel every minute using an API I was provided. I stored this data in a redis database and then displayed this data on a simple website. I was able to determine what channels were used most, who the most active users were and how much time every user spent with other users.

I believe I had the data collection script running on a Raspberry Pi and the web server running on a Linux VPS. The Pi would then transfer the data to the VPS every few minutes. I'm not sure why I had the two seperated, if I were to make this again I would have everything run on a VPS.

