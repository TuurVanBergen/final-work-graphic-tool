# API Documentation

> TODO: Hierin komen alle publieke service-endpoints.

## Services

- **fontService**
  - `loadLocalFont(path: string): Promise<{ font, url }>`
- **fontExportService**
  - `generateModifiedFontBlobUrl(buffer, modifiedGlyphs): Promise<string>`
  - `exportModifiedFont(buffer, modifiedGlyphs): Promise<void>`
