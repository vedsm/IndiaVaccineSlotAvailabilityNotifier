# India Vaccine Slot Availability Notifier For India
IndiaVaccineSlotAvailabilityNotifier checks the cowin portal periodically to find vaccination slots available in your pin codes and for your age. If found, it will send you emails to all your recipients every minute until the slots are available.


<font size="6"> Steps to run the script: </font> 

Step 1) Enable application access on your gmail with steps given here:
https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1  
\
Step 2) Enter the details in the file .env, present in the same folder
\
\
Step 3) Make sure you have Nodejs installed. Can be checked by ruinning `node --version` in terminal. If not, please install it.
\
\
Check if emails are proper by sending dummy notification) On your terminal run: `node start testNotifier.js`
(PS: If email is not being shown in your primary inbox or no notification: Go to Promotions inbox and move email it to primary inbox)
\
\
Step 4) On your terminal run: `npm i && pm2 start vaccineNotifier.js` (if you are getting failed to install pm2, run `npm i -g pm2` first)
\
\
Step 5) On your terminal run: `pm2 logs vaccineNotifier` to checkif your script is running properly
\
\
Final Step) To close the app run: `pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js`
\
\


Here's a sample of the resultant emails:
![image info](./exampleEmail.png)
