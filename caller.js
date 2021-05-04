const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_FROM_PHONE;
const toPhone = process.env.TWILIO_TO_PHONE;
const client = require('twilio')(accountSid, authToken);

// url: 'http://demo.twilio.com/docs/voice.xml',
// twiml: '<Response><Say>Vaccine slot is available. Go to cowin.gov.in to book your slot.</Say></Response>'

exports.sendCall = function (textContent, callback) {
    textContent = '<Response><Say>'+textContent+'</Say></Response>'
    console.log("Calling with textContent", textContent)
    client.calls
      .create({
            twiml: textContent,
            to: toPhone,
            from: fromPhone,
       })
      .then(call => {
          console.log(call.sid)
          callback(null, call)
      });
};





