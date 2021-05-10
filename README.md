# India Vaccine Slot Availability Notifier For India
Vaccine Slot Availability Notifier.
Now no need to check cowin portal to see available slots for covid19 vaccine. Instead get a call and email when a slot opens up!

This code sends a call and a email every 30 seconds when slot opens up till they are available; for a given age and in specified pincodes.


<font size="6"> Steps to run the script: </font> 

1. Download this code. Can be done by opening this [page](https://github.com/vedsm/IndiaVaccineSlotAvailabilityNotifier) -> clicking on the green "Code" button -> "Download zip" OR by opening your terminal(or command prompt on windows) and entering `git clone https://github.com/vedsm/IndiaVaccineSlotAvailabilityNotifier.git`
2. Make sure you have Nodejs installed. Can be checked by ruinning `node --version` in terminal(or command prompt on windows). If not, please install it. On Windows download binary and install from the [site](https://nodejs.org/en/download/) or follow the instructions from this [site](https://www.guru99.com/download-install-node-js.html). On Mac run `brew install node` in your terminal.
3. Set the `PINCODES` you want to track(comma seperated), your `AGE` and the `VACCINE` (Can choose from either `ALL`, `COVAXIN` or `COVISHIELD`) in .env file.
4. If you want to track the pin codes every 30 seconds(in addition to every 1 minute), the set `EVERY_30_MIN=TRUE`. Note that [Official CoWIN API Doc](https://apisetu.gov.in/public/marketplace/api/cowin/cowin-public-v2) says "APIs are subject to a rate limit of 100 API calls per 5 minutes per IP" . Hence if you set this TRUE, you can track only 10 pin codes. Else, you can track 20 pin codes.
5. If you want only the latest data and are ready to risk your calls to CoWIN getting blocked, then set `FETCH_ONLY_VERY_LATEST_SLOTS=TRUE` .  If you set this `FALSE`, you would be using "Public API"(These show data on the cowin homepage without phone no+OTP log-in. These might show data which is upto 30 min old). Else, you shall be using "Protected API"(These show data after phone no+OTP These always show latest data. Fun fact- These apis from code sometimes work even without log-in, or just after you log-in from your browser where you are running the code and hence can be exploited). Sourced from [Official CoWIN API Doc](https://apisetu.gov.in/public/marketplace/api/cowin/cowin-public-v2) which says "[On the public API of CoWIN]The appointment availability data is cached and may be upto 30 minutes old".
6. If you want notification on email, set `EMAIL_NOTIFICATION=TRUE` in your .env file. Then enable application access on your gmail with steps given here: [Google Site to get a password for email through application](https://support.google.com/accounts/answer/185833?hl=en) . In youe .env file : Add the email id in your `SENDER_EMAIL` ; set the password you got in `APPLICATION_PASSWORD` ; Write the list of email IDs(comma seperated) which you want to send a mail to in `RECEIVER_EMAILS`
7. (Optional) To check if emails settings are working, send a sending dummy notification by: On your terminal(or command prompt on windows) run `node start testNotifier.js` .(PS: If email is not being shown in your primary inbox or no notification: Go to Promotions inbox and move email it to primary inbox)
8. If you want notification on email, set `PHONE_CALL_NOTIFICATION=TRUE` in your .env file. Create a twilio account: [Getting started using Twilio Voice Calls](https://www.twilio.com/console/voice/build/getting-started) . Note that you don't need to add credit card details. A trail account also works within demo limits. Just use the twilio demo provided "from" call number and your whitelisted "to" phone number ( [How to whitelist your phone call to receive calls in twilio demo account](https://www.twilio.com/console/phone-numbers/verified) ). In youe .env file : Add the `TWILIO_ACCOUNT_SID` ; `TWILIO_AUTH_TOKEN` ; `TWILIO_FROM_PHONE` (the phone number whic h twilio provides from where you get the phone call) ; `TWILIO_TO_PHONE` (the phone number where you want to receive the call).
9. (Optional) To check if phone notification settings are working, send a sending dummy phone call by: On your terminal(or command prompt on windows) run `node start testCaller.js`
10. On your terminal(or command prompt on windows) run: `npm i && pm2 start vaccineNotifier.js` (if you are getting failed to install pm2, run `npm i -g pm2` first. If ots still failing, simply run `node vaccineNotifier.js` )
11. On your terminal(or command prompt on windows) run: `pm2 logs vaccineNotifier` to check if your script is running properly. (if you ran by `node vaccineNotifier.js`, the logs will get printed on your terminal)


Final Step- To close the app run: `pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js` (if you ran by `node vaccineNotifier.js` just hit hit control+C)


Here's a sample of the resultant emails:
![image info](./exampleEmail.png)
