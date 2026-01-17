const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

const db2 = new sqlite3.Database('fin.db');

// Menu iz fin.prg (tačno 30+ opcija)
app.get('/api/menu', (req, res) => {
  res.json({
    'kontni-plan': ['Azuriranje', 'Listanje', 'Stampa'],
    knjizenje: ['Dnevnih naloga', 'Listanje', 'Stampa', 'Dnevnik pre obrade', 'Brisanje naloga'],
    obrada: ['Redovna', 'Bilans uspeha', 'Bilans stanja', 'Pocetno stanje'],
    izvestaji: ['Stanje', 'Zakljucni list', 'Kartica', 'Glavna knjiga', 'Zbirno stanje', 'Stanje analitike', 'Nalozi', 'Dnevnik', 'Indexiranje', 'Firma obrade']
  });
});

// Kon_plan (e_plan, l_plan)
app.get('/api/kon-plan', (req, res) => db.all('SELECT * FROM kon_plan', (err, rows) => res.json(rows || [])));
app.post('/api/kon-plan', (req, res) => {
  const { kp_konto, kp_naziv } = req.body;
  db.run('INSERT INTO kon_plan (kp_konto, kp_naziv) VALUES (?, ?)', [kp_konto, kp_naziv], function(err) {
    res.json({ id: this.lastID });
  });
});

// Dnevni nalozi (eprom, d_nal)
app.get('/api/dnevni-nalozi', (req, res) => db.all('SELECT * FROM dnevni_nalozi ORDER BY nalog', (err, rows) => res.json(rows || [])));
app.post('/api/dnevni-nalozi', (req, res) => {
  const { datum, nalog, konto, vrprom, iznos, opis } = req.body;
  db.run('INSERT INTO dnevni_nalozi (datum, nalog, konto, vrprom, iznos, opis) VALUES (?, ?, ?, ?, ?, ?)', 
    [datum, nalog, konto, vrprom, iznos, opis], function(err) { res.json({ id: this.lastID }); });
});
app.delete('/api/dnevni-nalozi/:id', (req, res) => {
  db.run('DELETE FROM dnevni_nalozi WHERE id = ?', [req.params.id], (err) => res.json({ deleted: true }));
});

// Company/Firma
app.get('/api/company', (req, res) => db.all('SELECT * FROM company', (err, rows) => res.json(rows || [])));
app.post('/api/company', (req, res) => {
  db.run('INSERT OR REPLACE INTO company (co_line1, co_line2) VALUES (?, ?)', 
    [req.body.co_line1 || 'Firma', req.body.co_line2 || 'Adresa'], (err) => res.json({ saved: true }));
});

app.listen(PORT, () => console.log(`Server na http://localhost:${PORT}`));
