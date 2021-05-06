require('dotenv').config()
const caller = require('./caller');
const moment = require('moment');
const axios = require('axios');

const AGE = process.env.AGE


async function main(){
    try {
        testFindByPinMethod()
        testCalendarByPinMethod()

        // testParsingOfCalendarByPinMethod()
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function
testCalendarByPinMethod(){
    console.log("Sending testCalendarByPinMethod")

    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=401501&date=06-05-2021',
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        }
    };

    axios(config)
        .then(function (slots) {
            console.log("Success api of testCalendarByPinMethod")
            console.log("testCalendarByPinMethod slots.data->", slots.data)
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
            console.log({validSlots: validSlots.length})
        })
        .catch(function (error) {
            console.log("error in api testCalendarByPinMethod");
            // console.log(error);
        });
}

async function
testFindByPinMethod(){
    //The OG!!!
    console.log("Sending testFindByPinMethod")

    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=401501&date=06-05-2021',
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        }
    };

    axios(config)
        .then(function (slots) {
            console.log("Success api of testFindByPinMethod the OG", slots.data)
            let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
            console.log({validSlots: validSlots.length})
        })
        .catch(function (error) {
            console.log("error in api testFindByPinMethod the OG", error);
            // console.log(error);
        });
}

async function
testParsingOfCalendarByPinMethod(){
    let slots = {
        "data": {
            "centers": [
                {
                    "center_id": 51615,
                    "name": "TAPS Hospital",
                    "address": "Boisar",
                    "state_name": "Maharashtra",
                    "district_name": "Palghar",
                    "block_name": "Palghar",
                    "pincode": 401501,
                    "lat": 19,
                    "long": 72,
                    "from": "09:00:00",
                    "to": "18:00:00",
                    "fee_type": "Free",
                    "sessions": [
                        {
                            "session_id": "30ff3760-436b-469e-a7b0-bc00e5677177",
                            "date": "05-05-2021",
                            "available_capacity": 0,
                            "min_age_limit": 45,
                            "vaccine": "COVAXIN",
                            "slots": [
                                "09:00AM-11:00AM",
                                "11:00AM-01:00PM",
                                "01:00PM-03:00PM",
                                "03:00PM-06:00PM"
                            ]
                        },
                        {
                            "session_id": "0d056282-077d-47b8-9073-31c7be410299",
                            "date": "06-05-2021",
                            "available_capacity": 0,
                            "min_age_limit": 45,
                            "vaccine": "COVAXIN",
                            "slots": [
                                "09:00AM-11:00AM",
                                "11:00AM-01:00PM",
                                "01:00PM-03:00PM",
                                "03:00PM-06:00PM"
                            ]
                        }
                    ]
                }
            ]
        }
    }

    let centers = slots.data.centers
    console.log("centers->", centers)

    let sessions = []
    centers.forEach(function(center){
        console.log("center->", center)
        sessions = sessions.concat(center.sessions)
    });
    console.log("sessions->", sessions)

    let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
    console.log({validSlots: validSlots.length})


}

main()
    .then(() => {console.log('Testing Vaccine slot availability checker started.');});
