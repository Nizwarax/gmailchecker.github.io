# Blue Gmail Checker

Selamat datang di repositori Blue Gmail Checker yang telah diperbarui. Repositori ini berisi kode frontend (HTML/JS) tanpa iklan (ads) dan dilengkapi dengan solusi untuk masalah "Error occurred. Process stopped" (CORS error) yang terjadi saat Anda memindahkan situs ke domain baru (`nizwarax.github.io`).

## Solusi Error "Process stopped." (Masalah CORS)

Error yang Anda alami terjadi karena server backend asli (`https://gmail-verify.0b3n954kt1.workers.dev`) menolak permintaan dari domain selain `gmailchecker.github.io`. Karena Anda memindahkan web ini ke `nizwarax.github.io`, browser memblokir permintaan tersebut demi keamanan (CORS Policy).

Untuk memperbaiki ini, saya telah menyediakan **dua pilihan backend baru**. Anda dapat memilih salah satu di bawah ini:

---

### Opsi 1: Menggunakan Cloudflare Worker Proxy (Sangat Disarankan & Gratis)
Opsi ini paling mudah dan paling cepat karena Anda hanya perlu membuat "jembatan" (proxy) antara website Anda dan server aslinya.

**Langkah-langkah:**
1. Buat akun gratis di [Cloudflare Workers](https://workers.cloudflare.com/).
2. Buat "Worker" baru.
3. Buka file `proxy-worker.js` di repositori ini, lalu **salin (copy) seluruh isinya**.
4. Tempel (paste) kode tersebut ke editor Cloudflare Worker Anda, lalu klik **Save and Deploy**.
5. Salin URL Worker yang baru saja Anda buat (contoh: `https://proxy-saya.username.workers.dev`).
6. Buka file `index.html` di repositori ini. Cari baris yang berisi `const SERVER_URL="https://gmail-verify.0b3n954kt1.workers.dev"`.
7. **Ubah** URL tersebut menjadi URL Worker baru Anda.
   *(Contoh: `const SERVER_URL="https://proxy-saya.username.workers.dev"`)*
8. Simpan file `index.html` dan deploy/push ke GitHub Pages Anda. Website siap digunakan!

---

### Opsi 2: Menggunakan Node.js Server Sendiri (Tingkat Lanjut)
Opsi ini disediakan jika Anda ingin memiliki server pengecekan email sendiri dari nol tanpa bergantung pada server asli sama sekali.

**Langkah-langkah:**
1. Siapkan server VPS atau layanan hosting yang mendukung Node.js (seperti Heroku, Render, atau Railway).
2. Salin file `nodejs-backend.js` ke server Anda.
3. Buka terminal di server dan jalankan perintah:
   ```bash
   npm init -y
   npm install express cors body-parser dns net
   ```
4. Jalankan server dengan perintah:
   ```bash
   node nodejs-backend.js
   ```
5. Server akan berjalan. Pastikan URL server Anda dapat diakses publik (contoh: `https://api-saya.com`).
6. Buka file `index.html` di repositori ini dan ubah `SERVER_URL` menjadi URL server Node.js Anda:
   *(Contoh: `const SERVER_URL="https://api-saya.com"`)*
7. Simpan file `index.html` dan deploy ke GitHub Pages Anda.

*Catatan untuk Opsi 2: Server Node.js ini berisi logika pengecekan SMTP dasar. Pengecekan massal yang sebenarnya mungkin memerlukan proxy residential untuk menghindari pemblokiran IP dari Google.*
