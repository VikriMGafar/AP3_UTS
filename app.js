const express = require('express');
const req = require('express/lib/request');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
require('dotenv').config();
// const 
const port = process.env.PORT;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
var cors = require('cors')

app.use(cors())


passport.use(new GoogleStrategy({
  // clientID: '901070851054-flvbsk6h7h788j2lctoao1e04hoj77s6.apps.googleusercontent.com',
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${port}/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(session({ secret: process.env.GOOGLE_CLIENT_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});





app.post('/signin', async (req, res) => {
  const inUsername = await req.body.username; // Ambil data dari req.body.username
  const inPassword = await req.body.password; // Ambil data dari req.body.username

  let authorizedAcc = {
    account: [
      {
        username: 'vikrimg',
        password: 'password'
      },
      {
        username: 'admin',
        passport: 'admin'
      }
    ]
  }

  if (isAuthorized(authorizedAcc, inUsername, inPassword)) {
    console.log('Akun ditemukan. Akses diizinkan.');
    // res.status(200).json({ message: 'Login berhasil' });
    res.redirect(`/secondDashboard?username=${inUsername}`);
    // Lanjutkan dengan tindakan yang diperlukan jika akun ditemukan.
  } else {
    console.log('Akun tidak ditemukan. Akses ditolak.');
    res.status(401).json({ message: 'Login gagal' });
    // Lanjutkan dengan tindakan yang diperlukan jika akun tidak ditemukan.
  }



});

function isAuthorized(database, username, password) {
  for (const acc of database.account) {

    console.log(acc);

    if (acc.username === username && acc.password === password) {
      return true;
    }
  }
  return false;
}


app.get('/secondDashboard', (req, res) => {
  // Mengambil data username dan password dari parameter query string
  const username = req.query.username;

  console.log("berhasil");

  res.send(
    `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="/dashboard.css">

    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            width: 600px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
        }

        .info {
            background-color: aliceblue;
            border-radius: 10px;
            padding: 10px;
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            /* margin-top: 10px;
            margin-bottom: 10px; */
        }


        .profilePic {
            width: 100;
            border-radius: 50%;
        }

        p {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-weight: 400;
        }

        .logoutButton {
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            /* margin-bottom: 20px; */
        }
    </style>
</head>

<body>
    <div class="container">
        <h1 style="margin: 0;">Dashboard</h1>
        <div class="info">
            <p style="margin: 0;">${username}</p>
            <button class="logoutButton" onclick="logout()">Log Out</button>
        </div>
    </div>

</body>
<script>
    function logout() {
        try {
            window.location.href = '/logout';
        } catch (error) {
            console.log(error);
        }
    }
</script>

</html>
    `
  )

});


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});



app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log(user);

    // return res.json(user);


    // res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
        <link rel="stylesheet" href="/dashboard.css">
      
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
      
          .container {
            width: 600px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
          }
      
          .info {
            background-color: aliceblue;
            border-radius: 10px;
            padding: 10px;
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            /* margin-top: 10px;
            margin-bottom: 10px; */
          }
      
      
          .profilePic {
            width: 100;
            border-radius: 50%;
          }
          p{
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-weight: 400;
          }
          .logoutButton {
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            /* margin-bottom: 20px; */
          }
        </style>
      </head>
      
      <body>
        <div class="container">
          <h1 style="margin: 0;">Dashboard</h1>
          <img class="profilePic"
            src="${user.photos[0].value}"
            alt="User Image" width="100">
          <div class="info">
            <p style="margin: 0;">${user.emails[0].value}</p>
            <p style="margin: 0;">${user.displayName}</p>
            <button class="logoutButton" onclick="logout()">Log Out</button>
          </div>
        </div>
      
      </body>
      <script>
        function logout() {
          try {
            window.location.href = '/logout';
          } catch (error) {
            console.log(error);
          }
        }
      </script>
      
      </html>
          `);
  } else {
    res.redirect('/');
  }
});


app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      res.redirect('/'); // Redirect ke halaman utama jika ada kesalahan
    } else {
      res.redirect('/'); // Redirect ke halaman utama setelah berhasil logout
    }
  });
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});


function accountCheck(username, password) {
  const fileName = 'account.txt';
  const dbUsername = '';
  const dbPassword = '';
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }


    // const lines = data.split('\n');
    // const userData = [];

    // lines.forEach(line => {
    //   const parts = line.split(':');
    //   if (parts.length === 2) {
    //     dbUsername = parts[0];
    //     dbPassword = parts[1];
    //   }
    // });

    // const out = {
    //   dbPassword: dbPassword,
    //   dbUsername: dbUsername
    // }
    // if(username != dbUsername)
    // return out;
  })
}