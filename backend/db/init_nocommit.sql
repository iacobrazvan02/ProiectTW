-- Init DB (no BEGIN/COMMIT) — run statements one by one to see errors
-- Usage: psql -U <user> -d <db> -f init_nocommit.sql

-- Utilizatori
CREATE TABLE IF NOT EXISTS utilizatori (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(150) NOT NULL,
  email VARCHAR(200),
  preferinte TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Categorii
CREATE TABLE IF NOT EXISTS categorii (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(100) UNIQUE NOT NULL
);

-- Grupuri
CREATE TABLE IF NOT EXISTS grupuri (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(150) NOT NULL,
  descriere TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Prieteni
CREATE TABLE IF NOT EXISTS prieteni (
  id SERIAL PRIMARY KEY,
  grup_id INTEGER REFERENCES grupuri(id) ON DELETE CASCADE,
  utilizator_id INTEGER REFERENCES utilizatori(id) ON DELETE CASCADE,
  eticheta VARCHAR(100)
);

-- Alimente
CREATE TABLE IF NOT EXISTS alimente (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(200) NOT NULL,
  descriere TEXT,
  categorie_id INTEGER REFERENCES categorii(id),
  cantitate VARCHAR(50),
  data_expirare TIMESTAMP,
  disponibil BOOLEAN DEFAULT false,
  claimed_by INTEGER REFERENCES utilizatori(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Claims
CREATE TABLE IF NOT EXISTS claims (
  id SERIAL PRIMARY KEY,
  aliment_id INTEGER REFERENCES alimente(id) ON DELETE CASCADE,
  utilizator_id INTEGER REFERENCES utilizatori(id),
  data_claim TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index-uri
CREATE INDEX IF NOT EXISTS idx_alimente_data_expirare ON alimente(data_expirare);
CREATE INDEX IF NOT EXISTS idx_alimente_disponibil ON alimente(disponibil);
CREATE INDEX IF NOT EXISTS idx_alimente_claimed_by ON alimente(claimed_by);

-- Sample seed (optional)
INSERT INTO categorii (nume) VALUES ('Fructe') ON CONFLICT DO NOTHING;
INSERT INTO categorii (nume) VALUES ('Legume') ON CONFLICT DO NOTHING;
INSERT INTO categorii (nume) VALUES ('Conserve') ON CONFLICT DO NOTHING;

INSERT INTO utilizatori (nume, email) VALUES ('Test User','test@example.com') ON CONFLICT DO NOTHING;
