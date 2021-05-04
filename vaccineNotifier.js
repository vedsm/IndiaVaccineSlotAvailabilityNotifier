require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
const caller = require('./caller');


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
    let today = moment();
    PINCODES.forEach(pincode => {
        getSlotsForDateAndPIN(today.format('DD-MM-YYYY'), pincode);
    })
}

function getSlotsForDateAndPIN(date, pincode) {
    //OG url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode + '&date=' + date,
    //NEW GET https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=401501&date=04-05-2021

    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=' + pincode + '&date=' + date,
        // headers: {
        //     'accept': 'application/json',
        //     'Accept-Language': 'hi_IN'
        // }
    };

    axios(config)
        .then(function (slots) {
            let centers = slots.data.centers
            // console.log("centers->", centers)
            let sessions = []
            centers.forEach(function(center){
                // console.log("center->", center)
                sessions = sessions.concat(center.sessions)
            });
            // console.log("sessions->", sessions)
            // let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
            momenttime = moment()
            console.log({now: momenttime.format("YYYY-MM-DD hh:mm:ss "),date, pincode, centers: centers.length, sessions: sessions.length, validSlots: validSlots.length})
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
        else{
            console.log("email trigger success", result);
        }
    })

    caller.sendCall("Vaccine slot is available. Go to cowin.gov.in to book your slot.", (err, result) => {
        if(err) {
            console.error("error in sending call trigger", err);
        }
        else{
            console.log("call trigger success", result);
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
