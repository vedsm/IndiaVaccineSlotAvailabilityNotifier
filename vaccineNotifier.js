require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
/**
Step 1) Enable application access on your gmail with steps given here:
 https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1

Step 2) Enter the details in the file .env, present in the same folder

Step 3) On your terminal run: npm i && pm2 start vaccineNotifier.js

To close the app, run: pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js
 */

const PINCODES = process.env.PINCODES.split(',')
const SENDER_EMAIL = process.env.SENDER_EMAIL
const RECEIVER_EMAILS = process.env.RECEIVER_EMAILS
const AGE = process.env.AGE

async function main(){
    try {
        cron.schedule('* * * * *', async () => {
             await checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function checkAvailability() {

    let datesArray = await fetchNext10Days();
    datesArray.forEach(date => {
        PINCODES.forEach(pincode => {
            getSlotsForDateAndPIN(date, pincode);
        })
    })
}

function getSlotsForDateAndPIN(date, pincode) {
    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + date,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    };

    axios(config)
        .then(function (slots) {
            let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
            console.log({date, pincode, validSlots: validSlots.length})
            if(validSlots.length > 0) {
                notifyMe(validSlots);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function

notifyMe(validSlots){
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    notifier.sendEmail(SENDER_EMAIL, RECEIVER_EMAILS, 'VACCINE BOOKING AVAILABLE', slotDetails, (err, result) => {
        if(err) {
            console.error({err});
        }
    })
};

async function fetchNext10Days(){
    let dates = [];
    let today = moment();
    for(let i = 0 ; i < 10 ; i ++ ){
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => {console.log('Vaccine slot availability checker started.');});
