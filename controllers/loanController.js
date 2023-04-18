const User = require("../models/userModel");

// retrive account number

exports.retrieveAccountNumber = async function (req, res, next) {
  try {
    const phoneNumber = req.body.phoneNumber;
    const isPhoneNumberValid = await User.findOne({ phoneNumber: phoneNumber });
    console.log(req.user);
    if (!isPhoneNumberValid) {
      return res
        .status(404)
        .json({ status: "fail", message: "Phone Number is invalid" });
    }
    const accountNumber = isPhoneNumberValid.accountNumber;
    return res.status(200).json({
      status: "success",
      data: accountNumber,
    });
  } catch (err) {
    next(err);
  }
};

exports.loanRequest = async function (req, res, next) {
  try {
    let amount = req.body.amount;
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        status: "failed",
        message: "User is not logged in",
      });
    }

    const verifiedUser = await User.findOne({ _id: userId });
    if (verifiedUser.isBlocked === true) {
      return res.status(200).json({
        status: "success",
        message: "You are blocked",
      });
    }
    if (verifiedUser.balance) {
      return res.status(404).json({
        status: "failed",
        message: "Loan request disapproved. Please pay your current loan",
      });
    }
    const interestRate = 0.1;
    const interest = amount * interestRate;

    verifiedUser.amount = amount;
    verifiedUser.balance = interest + amount;
    verifiedUser.paymentDeadline = new Date(Date.now()); // set for the next 30 days
    await verifiedUser.save();
    // format date
    const formattedDate = verifiedUser.paymentDeadline.toLocaleDateString(
      "en-us",
      {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
    return res.status(200).json({
      status: "success",
      message: "Loan Granted",
      amount: amount,
      balance: verifiedUser.balance,
      paymentDate: formattedDate,
    });
  } catch {}
};

exports.loanPayment = async function (req, res, next) {
  try {
    const amount = req.body.amount;
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        status: "failed",
        message: "User is not logged in",
      });
    }
    const verifiedUser = await User.findOne({ _id: userId });
    if (verifiedUser.balance === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No current debt to pay",
      });
    }
    // if balance have not been paid completely
    if (verifiedUser.balance !== 0) {
      verifiedUser.balance -= amount;
      verifiedUser.amount -= amount;
      // if balance is been paid
      if (verifiedUser.amount <= 0 || verifiedUser.balance <= 0) {
        verifiedUser.amount = 0;
        verifiedUser.balance = 0;

        // remove paymentDeadline field by identifying the document
        await User.updateOne(
          { _id: userId },
          { $unset: { paymentDeadline: "" } }
        );
      }
      verifiedUser.save();
      const remainingBalance = verifiedUser.balance;
      return res.status(200).json({
        status: "success",
        message: "Amount paid successfully",
        remainingBalance: remainingBalance,
      });
    }
  } catch {}
};

exports.checkPaymentDeadline = async function (req, res, next) {
  try {
    // admin id
    const userId = req.user.id;
    // user id
    const debtorId = req.params.id;
    const currentDate = new Date();
    // admin document
    const verifiedUser = await User.findOne({ _id: userId });
    // check if logged in user is ADMIN
    if (verifiedUser.isAdmin === false) {
      return res.status(404).json({
        status: "fail",
        message: "Unauthorized",
      });
    }
    // user document
    const debtor = await User.findOne({ _id: debtorId });
    const deadlineDate = debtor.paymentDeadline;
    // compare current date and deadline date
    if (currentDate > deadlineDate) {
      debtor.isBlocked = true;
      debtor.save();
      return res.status(200).json({
        status: "success",
        message: "User BLocked",
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "User have not defaulted",
      });
    }
  } catch {}
};
