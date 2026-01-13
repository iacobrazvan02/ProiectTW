# GreenShelf — Frigider Comunitar

Aplicație web pentru gestionarea alimentelor disponibile în comunitate: administrare produse, oferte gratuite, revendicări (claim), partajare în grupuri și alerte pentru expirare.

## Cuprins

- Prerechizite
- Structura proiectului
- Instalare
- Configurare
- Rulare aplicație
- Tehnologii folosite
- Scripturi disponibile
- API principale
- Licență

## 🔧 Prerechizite

Înainte de a începe, asigură-te că ai instalate:

- Node.js (v16+ recomandat) — https://nodejs.org/
- npm (vine cu Node.js)
- MySQL (sau poți folosi SQLite dacă adaptezi conexiunea) — https://www.mysql.com/

## 📁 Structura proiectului

```
proiect/
├── backend/                # Express + Sequelize backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── db/
│   └── server.js
├── frontend/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── README.md
```

## 📥 Instalare

1. Clonează repository-ul

```bash
git clone <repository-url>
cd proiect
```

2. Instalează dependențele backend

```bash
cd backend
npm install
```

3. Instalează dependențele frontend

```bash
cd ../frontend
npm install
```

## ⚙️ Configurare

Backend — variabile de mediu

Creează un fișier `.env` în directorul `backend/` cu variabilele necesare (exemplu):

```
DB_DIALECT=mysql
DB_HOST=localhost
DB_DATABASE=greenshelf_db
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
PORT=5001
JWT_SECRET=schimba_ta_cheie_jwt
```

Database

- Creează baza de date în MySQL:

```sql
CREATE DATABASE greenshelf_db;
```

- Schema tabelelor este în `backend/db/init.sql` și se poate aplica manual sau lăsa Sequelize să sincronizeze la pornire (verifică `server.js`).

## 🚀 Rulare aplicație

Opțiune recomandată pentru dezvoltare: deschide două terminale.

Terminal 1 — backend:

```bash
cd backend
node server.js
```

Serverul backend pornește implicit pe `http://localhost:5001` (verifică `PORT` în `.env`).

Terminal 2 — frontend:

```bash
cd frontend
npm start
```

Aplicația React pornește pe `http://localhost:3000`.

### Opțiune producție

Build frontend:

```bash
cd frontend
npm run build
```

Rulează backend în modul producție:

```bash
cd backend
npm start
```

Poți servi folderul `frontend/build` cu orice server static sau configura backend-ul să îl servească.

## 🛠️ Tech Stack

Frontend

- React
- (Opțional) Context API / Hooks pentru autentificare

Backend

- Node.js + Express
- Sequelize (ORM)
- JWT pentru autentificare
- bcryptjs pentru hashing parole

Database

- MySQL (sau SQLite pentru dezvoltare rapidă)

## 📝 Scripturi disponibile

Backend

- `node server.js` — pornește serverul backend
- `npm start` — dacă este configurat, pornește serverul backend (alias)

Frontend (`frontend/package.json`)

- `npm start` — pornește dev server React
- `npm run build` — build pentru producție
- `npm test` — rulează teste

## 🔗 API Endpoints (sumar)

Backend rulează pe portul definit în `.env` (ex: `5001`).

- `GET /alimente` — obține toate produsele
- `POST /adauga` — adaugă produs nou
- `PUT /ofera/:id` — marchează/ demarchează produsul ca ofertă (opțional trimite `descriere` și `pret_per_kg`)
- `POST /claim/:id` — revendică produsul
- `POST /undo-claim/:id` — anulează ultimul claim
- `GET /alerts?zile=7` — produse care expiră în următoarele N zile
- `DELETE /alimente/:id` — șterge produs

(adaptează ruta API în `frontend/src/services/api.js` dacă folosești alt port)

## Sugestii / Notițe importante

- Dacă vrei ca un produs retras din ofertă să nu mai afișeze detalii (preț/descriere), backend-ul folosește `PUT /ofera/:id` și curăță `descriere` și `pret_per_kg` la retragere.
- Secțiunea „Alerte” returnează produse cu `data_expirare` în intervalul cerut și cantitate validă.

## 📝 License

Proiectul este licențiat sub ISC.

---

Dacă vrei, pot personaliza titlul proiectului, adăuga instrucțiuni de deploy Docker sau un pas pentru migrații MySQL. Spune-mi ce preferi.