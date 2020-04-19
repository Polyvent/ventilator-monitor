![](https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/001/036/850/datas/gallery.jpg)

## Inspiration

We started working on a vaccine but quickly hit a wall (cannot program vaccines). After scrapping that idea, we registered at _hackaTUM_.

[Jokes aside]
Our main inspiration is (of course) the ever-present _Covid-19_ pandemic. We did not want to sit at home and waste our time doing nothing. 

_hackaTUM_ gives us a great opportunity to join other inspired students and try to make our contribution to solve this unprecedented crisis. Also, the hackathon gives us the chance to gain knowledge and experience in organizing projects.

## What it does

We developed a monitoring platform for ventilators (lung monitoring). A physician can use the platform on a tablet to observe the status of multiple patients at once. Additionally, the physician is alarmed when there are anomalies in the data (e.g. patients vital signs are critical). Without the need to check on the ventilators constantly, the physician can be occupied with other important tasks.

The observed data includes measurements from the ventilator itself (flow rate, pressure, volume,...) and also vital data (blood pressure, heart rate, oxygen saturation).

## How we built it

The data we use is from _Infineon Technologies'_ API. Additionally we have added simulated vital signs for analysis/monitoring. This part is handled by our _node.js_ data simulator. Each instance of that simulator represents one ventilator.

The data is then transferred to our main _node.js_ server using _socket.io_. That server processes the packages (SQLite DB) and displays the data in graphs (_chart.js_) on a web interface (_next.js_). The web interface is optimized for tablets for maximum utility.

## What we learned

We have had multiple learning experiences over the course of the project.

At first, coming up with the structure of the project, especially in such a limited time, was very challenging. Communication is key, especially in that phase of the project.

When we actually started to develop code, we needed to learn about different new packages and systems. Thankfully the environments we worked in (e.g. _node.js_) are relatively forgiving. :)

Also, we learned that health data can be very tricky to handle privacy-wise. You do not want any third parties to have access to people's vital data. While we discussed that aspect, one weekend was obviously not enough to build a system that protects the data of patients sufficiently.

## What's next for Polyvent

- Integration of _electron_ to get a better user experience
- Reunification of the _Polyvent_ software with an actual _TheOpenVent_ ventilator
- Save the world from Corona
