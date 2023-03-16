const express = require("express");
const crypto = require("crypto");
require("dotenv").config();
const axios = require("axios");
const app = express();

const PORT = 3000;

const robUrl = "http://44.202.179.158:8080/start";
const myIp = "44.202.210.169:3000";

app.listen(PORT);
app.use(express.json());

axios
  .post(robUrl, {
    banner: "B00925445",
    ip: myIp,
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.status(200).json({ message: "server started successfully" });
});

app.post("/decrypt", (req, res) => {
  //Importing private key from env variables
  const privateKey = process.env.PRIVATE_KEY;
  const string = req.body.message;
  console.log(string);

  //converting base64 String into binary String
  const buf = Buffer.from(string, "base64");
  console.log(buf);

  console.log(privateKey);

  //decrypting binary data using private key
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buf
  );

  //converting decrypted String into hex
  const hexString = Buffer.form(decryptedData, "hex");

  //convert hex into readable form
  const finalStrign = hexString.toString("utf8");
  console.log(finalStrign);

  res.status(200).json({ response: finalStrign });
});

app.post("/encrypt", (req, res) => {
  const encryptString = req.body.message;
  console.log(encryptString);

  // converting string to utf8
  const utf8String = Buffer.from(encryptString, "utf8");
  console.log(utf8String);

  const publicKey = process.env.PUBLIC_KEY;

  // encrypting utf8 string using public key
  const encryptUsingPublicKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    utf8String
  );
  console.log(encryptUsingPublicKey);

  // convert encrypting string to base64
  const base64String = encryptUsingPublicKey.toString("base64");
  console.log(base64String);

  res.status(200).json({ response: base64String });
});
