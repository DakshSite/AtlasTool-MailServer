import { Resend } from 'resend';
import { configDotenv } from 'dotenv';
configDotenv();

import http from "http";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMailToResend = async function (firstName, lastName, email, message) {
  const { data, error } = await resend.emails.send({
    from: `${email} <onboarding@resend.dev>`,
    to: ['delivered@resend.dev'],
    subject: `${firstName} ${lastName}`,
    html: `
    <div>
      <p><strong>Full Name : </strong>${firstName} ${lastName}</p>
      <p><strong>Email : </strong>${email}</p>
      <p><strong>Message : </strong>${message}</p>
    </div>`,
  });

  if (error) {
    return console.error({ error });
  }
};







const appName = "https://dakshdev.vercel.app/" // convert it later by the name of atlas-tools
// create Server
const ContactServer = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method === "OPTIONS"){
    res.writeHead(200)
    return res.end()
  }

  if(req.method === "GET" && req.url == "/"){
      res.setHeader("Content-Type", "text/plain")
      res.end(appName)
  }

  if(req.method === "POST" && req.url == "/"){
      let data = "";
      req.on("data", chunk => {
        data += chunk;
      })
      req.on("end", () => {
        const {firstName, lastName, email, message} = JSON.parse(data);
        sendMailToResend(firstName, lastName, email, message)
        res.end()
      })

  }
});

let PORT = 8080; 
ContactServer.listen(PORT, () => console.log("Server is Runing on Port", PORT))