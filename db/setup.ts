const sqlite3Db = require('sqlite3').verbose();
const db = new sqlite3Db.Database('fin.db');

db.serialize(() => {
  // company.dbf (firma procedure)
  db.run(`CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    co_line1 TEXT, co_line2 TEXT, co_line3 TEXT, co_line4 TEXT, 
    co_line5 TEXT, co_line6 TEXT, co_line7 TEXT, co_line8 TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO company (id, co_line1, co_line2) VALUES (1, 'Test Firma d.o.o.', 'Kragujevac')`);

  // kon_plan.dbf (e_plan)
  db.run(`CREATE TABLE IF NOT EXISTS kon_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kp_konto TEXT, kp_analit TEXT, kp_naziv TEXT, kp_nkonto TEXT, kp_nanalit TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO kon_plan VALUES (NULL, '100', '', 'KASA', '', '')`);
  db.run(`INSERT OR IGNORE INTO kon_plan VALUES (NULL, '200', '', 'BANKA', '', '')`);
  db.run(`INSERT OR IGNORE INTO kon_plan VALUES (NULL, '300', '', 'DOBAVNICI', '', '')`);

  // dnevni_nalozi.dbf (eprom, d_nal)
  db.run(`CREATE TABLE IF NOT EXISTS dnevni_nalozi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datum DATE, nalog TEXT, konto TEXT, analit TEXT, vrprom TEXT, 
    iznos DECIMAL(12,2), opis TEXT
  )`);
  db.run(`INSERT OR IGNORE INTO dnevni_nalozi VALUES (1, '2026-01-16', '000001', '100', '', 'DU', 5000.00, 'Test faktura')`);

  // aop1.dbf (bilans uspeha/stanja)
  db.run(`CREATE TABLE IF NOT EXISTS aop1 (
    id INTEGER PRIMARY KEY,
    aop001 DECIMAL DEFAULT 0, aop002 DECIMAL DEFAULT 0 /* 150+ AOP polja iz finx.prg */
  )`);

  console.log('SVE fin.prg tabele kreirane + test podaci!');
});

db.close();
