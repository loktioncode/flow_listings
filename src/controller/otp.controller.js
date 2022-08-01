const otpSchema = require("../models/Otp");
var otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

// Function to Compares dates (expiration time and current time in our case)
var dates = {
  convert: function (d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    let email_subject, email_message;
    if (!email) {
      const response = { Status: "Failure", Details: "Email not provided" };
      return res.status(400).send(response);
    }
    if (!type) {
      const response = { Status: "Failure", Details: "Type not provided" };
      return res.status(400).send(response);
    }
    //Generate OTP
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);

    //Create OTP instance in DB
    const otp_instance = new otpSchema({
      email: email,
      otp: otp,
      expiration_time: expiration_time,
      verified: false,
    });

    otpSchema.find({ email: email }, (error, data) => {
      if (!data) {
        otp_instance.save().then(() => console.log("otp added to db"));
      } else {
        let obj = {
          email: email,
          otp: otp,
          expiration_time: expiration_time,
          verified: false,
        };
        otpSchema.findOneAndUpdate({ email: email }, obj, null, function () {
          console.log("otp updated");
        });
      }
    });

    //Choose message template according type requestedconst encoded= await encode(JSON.stringify(details))
    if (type) {
      if (type == "VERIFICATION") {
        const {
          message,
          subject_mail,
        } = require("../templates/email_verification");
        email_message = message(otp);
        email_subject = subject_mail;
      } else if (type == "FORGET") {
        const { message, subject_mail } = require("../templates/email_forget");
        email_message = message(otp);
        email_subject = subject_mail;
      } else {
        const response = {
          Status: "Failure",
          Details: "Incorrect Type Provided",
        };
        return res.status(400).send(response);
      }
    }

    // Create nodemailer transporter
    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    const mailOptions = {
      from: `"P2P DEFI"<${process.env.EMAIL_ADDRESS}>`,
      to: `${email}`,
      subject: email_subject,
      text: email_message,
    };

    await transporter.verify();

    //Send Email
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(400).send({ Status: "Failure", Details: err });
      } else {
        return res.status(201).json({
          message: "OTP sent successfully!",
        });
      }
    });
  } catch (err) {
    const response = { Status: "Failure", Details: err.message };
    return res.status(400).send(response);
  }
};

const verifyOtp = async (req, res) => {
  try {
    var currentdate = new Date();
    const { otp, email } = req.body;

    if (!otp) {
      const response = { Status: "Failure", Details: "OTP not Provided" };
      return res.status(400).send(response);
    }
    if (!email) {
      const response = { Status: "Failure", Details: "Email not Provided" };
      return res.status(400).send(response);
    }

    let filter = {
      email: email,
    };

    const otp_instance = await otpSchema.findOne(filter);

    console.log(filter, otp_instance);

    //Check if OTP is available in the DB
    if (otp_instance != null) {
      //Check if OTP is already used or not
      if (otp_instance.verified != true) {
        //Check if OTP is expired or not
        if (dates.compare(otp_instance.expiration_time, currentdate) == 1) {
          //Check if OTP is equal to the OTP in the DB
          if (otp === otp_instance.otp) {
            // Mark OTP as verified or used
            const update = { verified: true };
            let doc = await otpSchema.findOneAndUpdate(filter, update, {
              returnOriginal: false,
            });

            console.log(">updated OTP>", doc);

            const response = {
              Status: "Success",
              Details: "OTP Matched",
              email: email,
            };
            return res.status(200).send(response);
          } else {
            const response = { Status: "Failure", Details: "OTP NOT Matched" };
            return res.status(400).send(response);
          }
        } else {
          const response = { Status: "Failure", Details: "OTP Expired" };
          return res.status(400).send(response);
        }
      } else {
        const response = { Status: "Failure", Details: "OTP Already Used" };
        return res.status(400).send(response);
      }
    } else {
      const response = { Status: "Failure", Details: "Bad Request" };
      return res.status(400).send(response);
    }
  } catch (err) {
    const response = { Status: "Failure", Details: err.message };
    return res.status(400).send(response);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
