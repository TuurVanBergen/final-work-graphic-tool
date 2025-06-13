# Beeldbox

## Functies

- **LetterAtelier (Tool1)**: vorm een letter met verschillende transformatie-effecten.
- **KarakterAtelier (Tool2)**: selecteer vooraf ingestelde afbeeldingen via hardware-potmeters of sliders.
- **PosterEditor**: combineer je ontworpen letter of karakter met poster-specifieke instellingen (kleur, positie, schaal, blend-mode) en exporteer naar PNG.
- **Gallerij**: blader door opgeslagen ontwerpen in de lokale gallerij, zowel letters als posters.
- **Hardware-integratie**: gebruik Arduino-potmeters en fysieke knoppen (A–D) voor realtime aansturing met cooldown.
- **Offline**: standalone Electron-app met volledige contextIsolation en preload API.

## Documentatie

- **README.md** (dit bestand)
- **CODE_OF_CONDUCT.md**: gedragsregels voor bijdragen.
- **CONTRIBUTING.md**: richtlijnen voor bijdragen.
- **NAMING_CONVENTIONS.md**: naamgevingsconventies.
- **API Documentation** (`API.md`): IPC-endpoints.

Zie de `docs/`-map voor meer informatie.

## Projectstructuur

```
/src
  /components  React-componenten
  /pages       Router-pagina's (Home, Tool1, Tool2, Gallerij, PosterEditor)
  /hooks       Custom React hooks
  /utils       Hulpprogramma's en canvas-effecten
  /config      Slider- en andere configuraties
  index.html
  App.jsx      Router setup
/electron-main.js  Main-process code
/electron-preload.js       Preload-script voor IPC
/package.json
```

## Bronnen

P5
https://www.youtube.com/watch?v=2K6nRgSJ8dI
https://www.patreon.com/c/timrodenbroeker/posts
https://www.youtube.com/watch?v=xOCUrAN7rjs
https://www.youtube.com/watch?v=sDbwT6vUmCU&t=645s
https://www.youtube.com/watch?v=97VC4PZTX7U
https://www.makingsoftware.com/
https://www.burrowlab.com/learn
https://p5js.org/reference/
https://timrodenbroeker.de/courses/

Electron
https://www.electronjs.org/docs/latest
https://www.youtube.com/watch?v=fP-371MN0Ck
https://www.electronjs.org/docs/latest/tutorial/ipc
https://www.youtube.com/watch?v=a2aJmETdz7M

React
https://react.dev/learn

Vite
https://vite.dev/guide/

JsPDF
https://www.npmjs.com/package/jspdf

Serialcommunication
https://serialport.io/docs/
https://docs.arduino.cc/language-reference/en/functions/communication/serial/
https://github.com/serialport/electron-serialport/blob/master/main.js
https://stackoverflow.com/questions/78302100/mapping-p5-js-to-arduino-potentiometers-and-push-buttons

Hulp van Chatgpt
https://chatgpt.com/g/g-p-67e00e8783048191b3a8fa4fa7653566-final-work/c/684b36c4-eec0-8009-9260-5421e56dafdf
https://chatgpt.com/c/684b0a3a-7118-8009-82a1-c92d84d6ff8e
https://chatgpt.com/g/g-p-67e00e8783048191b3a8fa4fa7653566-final-work/c/683b75d9-1b08-8009-81ed-9828b31dc0f8
https://chatgpt.com/c/6829c1cb-f164-8009-b84e-611256b8fdd4
https://chatgpt.com/g/g-p-67e00e8783048191b3a8fa4fa7653566-final-work/c/6838315b-ec20-8009-a37e-1b6986725d6b
