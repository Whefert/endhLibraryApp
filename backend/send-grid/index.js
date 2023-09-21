const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// TODO: Create verification token route
newUserMessage = (user, host) => {
  return {
    to: user.email,
    from: "enidanddaphnefoundation@gmail.com",
    subject: "EnDH Foundation - Verify Your Email",
    text: `Hello thanks for registering on our site, please copy and paste the address below to verify your
account http://${host}/user/verify/${user.emailToken}`,
    html: `
<h1>Hello ${user.name}</h1>
<p>Thanks for registering on our site.</p>
<p>Please copy and paste the address below to verify your account.
<a href="http://${host}/user/verify/${user.emailToken}">http://${host}/user/verify/${user.emailToken}</a><p>
`,
  };
};

newReservationMessageForAdmin = (user, book, reservation) => {
  return {
    from: "enidanddaphnefoundation@gmail.com", // sender address
    // TODO:Add Yvonne's email address to receiver's list
    to: ["enidanddaphnefoundation@gmail.com", "yvonnestewart541@gmail.com"], // list of receivers
    subject: "Reservation Received", // Subject line
    text: "Hello, a new reservation has been received", // plain text body
    html: `<p><strong>Hi Yvonne</strong></p><p>${
      user.name
    } is requesting the book ${book.name}.</p>
    <p>Book requested: ${book.name} by ${book.author} </p>
    <p>Request date: ${reservation.reserveDate.toDateString()}</p>
    <p>Return date: ${reservation.returnDate.toDateString()}</p>
    - EnDH Library`, // html body
  };
};

newReservationMessageForUser = (user, book, reservation) => {
  return {
    from: "enidanddaphnefoundation@gmail.com", // sender address
    to: `${user.email}`, // list of receivers
    subject: "Reservation Request Received", // Subject line
    text: "Hello, we have received your reservation request. We will get back to you with more details about the request approval", // plain text body
    html: `<p><strong>Hi ${user.name}</strong></p>
    <p> We have received your reservation request for ${
      book.name
    }. We will get back to you with more details about the request approval.</p>
    <p>Book requested: ${book.name} by ${book.author}</p>
    <p>Request date: ${reservation.reserveDate.toDateString()}</p>
    <p>Return date: ${reservation.returnDate.toDateString()}</p>
    - EnDH Library`, // html body
  };
};

sendNewUserMessage = (user, host) => {
  sgMail
    .send(newUserMessage(user, host))
    .then(() => {
      console.log("Verification email sent to new user");
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Unable to send verifaction email. ", error.message);
    });
};

sendReservationMessgeToUser = (user, book, reservation) => {
  sgMail
    .send(newReservationMessageForUser(user, book, reservation))
    .then(() => {
      console.log("Email sent to user");
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Unable to send reservation notification email to user");
    });
};

sendReservationMessgeToAdmin = (user, book, reservation) => {
  sgMail
    .send(newReservationMessageForAdmin(user, book, reservation))
    .then(() => {
      console.log("Email sent to admin");
    })
    .catch((error) => {
      console.error(error);
      throw new Error("Unable to send reservation notification email to user");
    });
};
module.exports = {
  sendReservationMessgeToUser,
  sendReservationMessgeToAdmin,
  sendNewUserMessage,
};
