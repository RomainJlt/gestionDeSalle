const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('database.db');

// Create users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    firstName TEXT,
    lastName TEXT
  )
`);

// Routes
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
          }
          return res.status(500).json({ error: 'Erreur lors de la création du compte.' });
        }
        res.status(201).json({ message: 'Compte créé avec succès.' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
});

app.post('/login', async (req, res) => {
  const { mail, password } = req.body;
  
  if (!mail || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [mail], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({ 
          message: 'Connexion réussie',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        });
      } else {
        res.status(401).json({ error: 'Identifiants incorrects.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  });
});

// API routes
const salleRouter = require('./public/api/salle');
app.use('/api/salles', salleRouter);

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'connect.html'));
});

app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
