const textflow = require("textflow.js");
textflow.useKey("HJXHnojSCZ0iSDHxfQOFiajQnfuNNDibCTONoz4FebtrhQxKPwogOaZYwl13xdZ2");

// Sending an SMS in one line
textflow.sendSMS("+998883563777", "Dummy message text...");

// OTP Verification
// User has sent his phone number for verification
textflow.sendVerificationSMS("+998883563777", verificationOptions);

// Show him the code submission form
// We will handle the verification code ourselves

// The user has submitted the code
let result = await textflow.verifyCode("+11234567890", "USER_ENTERED_CODE"); 