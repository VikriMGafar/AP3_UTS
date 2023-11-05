const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Di sini Anda dapat menambahkan logika autentikasi, seperti memeriksa username dan password di database.

  // Contoh autentikasi sederhana
  if (username === 'user' && password === 'password') {
    res.send('Login berhasil!');
  } else {
    res.send('Login gagal. Silakan coba lagi.');
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
