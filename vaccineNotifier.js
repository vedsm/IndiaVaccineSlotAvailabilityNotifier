require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
const caller = require('./caller');


const PINCODES = process.env.PINCODES.split(',')
const EMAIL_NOTIFICATION = process.env.EMAIL_NOTIFICATION
const PHONE_CALL_NOTIFICATION = process.env.PHONE_CALL_NOTIFICATION
const SENDER_EMAIL = process.env.SENDER_EMAIL
const RECEIVER_EMAILS = process.env.RECEIVER_EMAILS
const AGE = process.env.AGE
const VACCINE = process.env.VACCINE
const ONLY_SHOW_FREE_VACCINE = process.env.ONLY_SHOW_FREE_VACCINE
const RUN_EVERY_30_SECOND = process.env.RUN_EVERY_30_SECOND
const FETCH_ONLY_VERY_LATEST_SLOTS = process.env.FETCH_ONLY_VERY_LATEST_SLOTS

async function main(){
    try {
        cron.schedule('* * * * *', async () => {
            await checkAvailability();
            if(RUN_EVERY_30_SECOND === "TRUE") setTimeout(checkAvailability, 30000);
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
    //NEW GET https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=401501&date=04-05-2021

    let url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=' + pincode + '&date=' + date
    if(FETCH_ONLY_VERY_LATEST_SLOTS === "TRUE"){
        url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=' + pincode + '&date=' + date
    }
    if (VACCINE !== "ALL"){
        url = url + '&vaccine=' + VACCINE
    }
    //TODO!
    // if (ONLY_SHOW_FREE_VACCINE !== "TRUE"){
    //     url = url + '&vaccine=' + VACCINE
    // }

    let config = {
        method: 'get',
        url: url,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
            'Cache-Control': 'no-cache'
        }
    };

    axios(config)
        .then(function (slots) {
            let centers = slots.data.centers
            // console.log("centers->", centers)
            let sessions = []
            centers.forEach(function(center){
                // console.log("center->", center)
                center_sessions_with_details = []
                if(ONLY_SHOW_FREE_VACCINE === "TRUE" && center.fee_type !== "Free"){
                    console.log("The center is for paid vaccines and you have selected to show only Free vaccines. Hence ignoring it->", center.name)
                }
                else{
                    center.sessions.forEach(function(center_session){
                        center_session.center_name = center.name
                        center_session.center_address = center.address
                        center_session.center_state_name = center.state_name
                        center_session.center_pincode = center.pincode
                        center_sessions_with_details = center_sessions_with_details.concat(center_session)
                    })
                    sessions = sessions.concat(center_sessions_with_details)
                    // sessions = sessions.concat(center.sessions)
                }
            });
            // console.log("sessions->", sessions)
            // let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
            if (VACCINE !== "ALL"){
                validSlots = validSlots.filter(slot => slot.vaccine === VACCINE)
            }
            momenttime = moment()
            console.log({now: momenttime.format("YYYY-MM-DD hh:mm:ss "),date, pincode, centers: centers.length, sessions: sessions.length, validSlots: validSlots.length, url})
            if(validSlots.length > 0) {
                notifyMe(validSlots);
            }
        })
        .catch(function (error) {
            momenttime = moment()
            console.log("error in doing the api call to cowin ", momenttime.format("hh:mm:ss"), pincode, date);
            // console.log("error in doing the api call to cowin", error);
        });
}

async function

notifyMe(validSlots){
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    if(EMAIL_NOTIFICATION === "TRUE"){
        notifier.sendEmail(SENDER_EMAIL, RECEIVER_EMAILS, 'VACCINE BOOKING AVAILABLE', slotDetails, (err, result) => {
            if(err) {
                console.error({err});
            }
            else{
                console.log("email trigger success");
                // console.log("email trigger success result->", result);
            }
        })
    }

    if(PHONE_CALL_NOTIFICATION === "TRUE"){
        caller.sendCall("Vaccine slot is available. Go to cowin.gov.in to book your slot.", (err, result) => {
            if(err) {
                console.error("error in sending call trigger", err);
            }
            else{
                console.log("call trigger success");
                // console.log("call trigger success result->", result);
            }
        })
    }
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
