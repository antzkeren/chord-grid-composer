# Cara Push ke Bitbucket

## Menggunakan Script (Cara Mudah)

```bash
cd chord-grid-composer
./push.sh "isi pesan commit"
```

Contoh:
```bash
./push.sh "Add new feature"
```

---

## Token Bitbucket (Sudah Tersimpan di push.sh)

```
ATCTT3xFfGN0G-_-yhx9mGlb2zUbM1MCIxuEcHvGDTASt1Hm0Q3kvEibkv27I1AKU_o08rFLPVYU7nJ5klLz0kfKzVeEdpLBPFAmtaZJrvAA_vJRqck5IsWdGxbOpTzuqhciNjEUePKXYA7AeI0PtuX5DmcNQWeytb2Oa_jwLDk1Z3X-q5vI-hI=8961AD34
```

Repo URL: `https://bitbucket.org/andi_personal/chord-grid-composer.git`

---

## Cara Dapat Token Baru (Kalau Expired)

1. Login ke https://bitbucket.org
2. Klik avatar → **Personal settings**
3. Klik **App passwords** (di sidebar)
4. Klik **Create app password**
5. Beri nama, centang `repo` (Pull and push)
6. Copy token yang muncul
7. Update di `push.sh` (bagian setelah `x-token-auth:`)
