# Contributing Guidelines

## 1. Fork en Clone

1. Fork de repository naar je eigen GitHub-account.
2. Clone jouw fork lokaal:

   ```bash
   git clone https://github.com/TuurVanBergen/final-work-graphic-tool.git
   ```

## 2. Installatie

Installeer de benodigde dependencies:

```bash
npm install
```

## 3. Nieuwe Feature Branch

Maak voor elke wijziging een nieuwe branch:

```bash
git checkout -b feature/<korte-beschrijving>
```

## 4. Ontwikkeling

- **Commit klein en vaak**: elke commit moet één logische wijziging bevatten.
- **Schrijf duidelijke commitberichten**:

  - Titelregel (max. 50 tekens).
  - Lege regel.
  - Korte beschrijving van wat en waarom.

## 5. Testen

- Draai de applicatie lokaal:

  ```bash
  npm run dev
  npm run dev:electron
  ```

- Controleer of alle bestaande functionaliteiten nog werken.

## 6. Pull Request (PR)

1. Push je branch naar je fork:

   ```bash
   git push origin feature/<korte-beschrijving>
   ```

2. Open een Pull Request tegen de `main` branch van dit project.

## 8. Cleanup

Haal je lokale en remote branches opgeruimd:

```bash
git checkout main
git pull upstream main
git branch -d feature/<korte-beschrijving>
git push origin --delete feature/<korte-beschrijving>
```
