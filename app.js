const express = require('express');
const req = require('express/lib/request');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// import * as dotenv from 'dotenv';
// import { google } from 'googleapis';
// import { oauth2, oauth2_v2 } from 'googleapis/build/src/apis/oauth2';

// const oauth2Client = (
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   'http://localhost:3000/auth/google/callback'
// );

// const scopes = (
//   'http://www.googleapis.com/auth/userinfo.email',
//   'http://www.googleapis.com/auth/userinfo.profile'
// );

// const authorizationUrl = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: scopes,
//   included_granted_scopes: true
// })

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// app.get('/auth/google',(req, res)=> {
//   res.redirect(authorizationUrl);
// })

// app.get('/auth/google/callback', async (req, res) => {
//   const {code} = req.query;

//   const {tokens} = await oauth2Client.getToken(code);

//   oauth2Client.setCredentials(tokens);

//   const oauth2Client = google.oauth2({
//     auth: oauth2Client,
//     version: 'v2'
//   })

//   const {data} = await oauth2.userinfo.get();

//   if(!data){
//     return res.json({
//       data: data
//     })
//   }

//   let user = await prisma.users.findUnique({
//     where: {
//       email: data.email
//     }
//   })

//   if(!user){
//     user = await prisma.users.create({
//       data:{
//         name : data.name,
//         email : data.email
//       }
//     })
//   }

// })


app.post('/signin', async (req, res) => {
  const username = await req.body.username; // Ambil data dari req.body.username
  const password = await req.body.password; // Ambil data dari req.body.username

  console.log('Username:', username);
  console.log('passwword:', password);

  res.json({ message: 'Data berhasil diterima di server.' });
});


app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public' ,'dashboard.html'));
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
