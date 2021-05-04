require('dotenv').config()
const caller = require('./caller');
/**
Step 1) Enable application access on your twilio account with steps given here: https://www.twilio.com/docs/voice/quickstart/node#make-an-outgoing-phone-call-with-nodejs

Step 2) Enter the details in the file .env, present in the same folder

Step 3) On your terminal run: npm i && pm2 start testCaller.js

To close the app, run: pm2 stop testCaller.js && pm2 delete testCaller.js
 */


async function main(){
    try {
        console.log("Sending test call")
        caller.sendCall("Dummy Call Content", (err, result) => {
            if(err) {
                console.error("error in sendign call trigger", err);
            }
            else{
                console.error("call trigger success", result);
            }
        })
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}



main()
    .then(() => {console.log('Testing Vaccine slot availability checker started.');});
