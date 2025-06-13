# Naming Conventions

- **Componenten**

  - Bestandsnaam en export: **PascalCase**, `.jsx` extensie
  - Voorbeeld: `MyComponent.jsx`, `export default function MyComponent() { ... }`

- **Hooks**

  - Bestandsnaam en functie: **useCamelCase**, `.js` extensie
  - Moet altijd met `use` beginnen
  - Voorbeeld: `useFetchData.js`, `function useFetchData(url) { ... }`

- **Utils**

  - Bestandsnaam en exports: **camelCase**, `.js` extensie
  - Voorbeeld: `formatDate.js`, `export function formatDate(date) { ... }`

- **Config-bestanden**

  - Bestandsnaam: **UPPER_SNAKE_CASE**, `.js` extensie
  - Voorbeeld: `SLIDER_CONFIG.js`, `export const SLIDER_CONFIG = [ ... ];`

- **CSS-klassen**

  - Gebruik **kebab-case**
  - Voorbeeld: `<div className="poster-canvas-wrapper"></div>`

- **Variabelen en functies**

  - **camelCase**
  - Voorbeeld: `const userName = "Alice"; function handleClick() { ... }`

- **Constants**

  - **UPPER_SNAKE_CASE**
  - Voorbeeld: `const API_BASE_URL = "https://api.example.com";`
