# Portfel — instrukcja wdrożenia krok po kroku

Nie musisz nic programować. To są same kliknięcia. Całość zajmuje ok. 15 minut i jest **darmowa**.
Najlepiej zrób kroki 1–3 **na komputerze** (wygodniej), a potem korzystaj z aplikacji na iPhonie (krok 4).

Masz paczkę `portfel-app.zip`. Rozpakuj ją — w środku jest folder `portfel-app` z plikami aplikacji.

---

## Krok 1 — Konto GitHub (przechowalnia plików aplikacji)

1. Wejdź na **github.com** i załóż darmowe konto (przycisk **Sign up**).
2. Po zalogowaniu kliknij **„+”** w prawym górnym rogu → **New repository**.
3. W polu **Repository name** wpisz: `portfel`.
4. Zostaw resztę domyślnie, kliknij zielony **Create repository**.
5. Na nowej, pustej stronie repozytorium kliknij link **„uploading an existing file”**
   (zdanie: *Get started by … uploading an existing file*).
6. Otwórz rozpakowany folder `portfel-app`, **zaznacz wszystko w środku**
   (pliki `index.html`, `manifest.json`, obrazki oraz **folder `api`**) i przeciągnij je
   na stronę GitHub w zaznaczone pole.
   - Ważne: folder `api` musi zostać folderem (GitHub zachowa strukturę przy przeciąganiu).
7. Na dole kliknij zielony **Commit changes**.

Pliki są już w internecie. Przejdźmy do uruchomienia.

---

## Krok 2 — Konto Vercel (uruchamia aplikację + pobiera dane)

1. Wejdź na **vercel.com** → **Sign Up**.
2. Wybierz **Continue with GitHub** i potwierdź dostęp (to łączy oba konta).
3. Na pulpicie Vercel kliknij **Add New…** → **Project**.
4. Znajdź na liście repozytorium **portfel** i kliknij **Import**.
5. Nic nie zmieniaj w ustawieniach. Kliknij **Deploy**.
6. Poczekaj ~30 sekund. Zobaczysz napis *Congratulations* i adres aplikacji,
   np. **portfel-twojanazwa.vercel.app**. To jest Twoja aplikacja w internecie.

---

## Krok 3 — Test

1. Otwórz swój adres `…vercel.app`.
2. Wpisz ticker **CRWD**, kraj **US**, dowolną datę zakupu, kliknij **Pobierz dane**.
3. Powinien pojawić się wykres zwrotu i procent. Dane zapiszą się na stałe w tym urządzeniu.
4. Dla CD Projekt: ticker **CDR**, kraj **PL**.

Jeśli jedno źródło danych akurat nie odpowie, aplikacja automatycznie spróbuje drugiego — nie musisz nic robić.

---

## Krok 4 — Ikonka na ekranie iPhone'a

1. Otwórz adres `…vercel.app` **w przeglądarce Safari** (to ważne — musi być Safari).
2. Dotknij przycisku **Udostępnij** (kwadrat ze strzałką w górę, na dole ekranu).
3. Przewiń i wybierz **Dodaj do ekranu początkowego**.
4. Nazwa „Portfel” już się podpowie — dotknij **Dodaj**.
5. Na ekranie głównym pojawi się ikonka. Po dotknięciu aplikacja otwiera się na cały
   ekran, bez paska przeglądarki — jak normalna apka.

---

## Dobrze wiedzieć

- **Wszystko darmowe.** Darmowy adres `…vercel.app` działa bezterminowo. (Opcjonalnie można
  później kupić ładniejszą nazwę, np. `mojportfel.pl` — ale nie trzeba.)
- **Gdzie są zapisane dane?** W pamięci przeglądarki/urządzenia, na którym z aplikacji korzystasz
  (mechanizm „localStorage”). Zostają po zamknięciu i po ponownym wejściu. Uwaga: są przypisane
  do danego urządzenia — telefon i komputer mają osobne zapisy. Gdybyś chciał wspólną bazę dla
  wszystkich urządzeń, to kolejny, większy krok — daj znać.
- **Jak coś poprawić w aplikacji?** Wgrywasz nową wersję pliku na GitHub, a Vercel sam zaktualizuje
  stronę w kilkadziesiąt sekund. Wygląd i adres zostają te same.
- **To nie jest porada inwestycyjna** — narzędzie tylko pokazuje dane historyczne.
