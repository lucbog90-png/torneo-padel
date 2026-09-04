# Video promocional X3 Padel Suardi

Animación cinematográfica de 25 segundos (vertical, 1080x1920, ideal para
Instagram/WhatsApp Stories) que invita al torneo **Suma 13 Libres**.

- `x3-padel-suardi-promo.html` — la animación en si (HTML/CSS/JS, sin
  dependencias externas). Abrila en un navegador para verla reproducirse
  en vivo.
- `x3-padel-suardi-promo.webm` — el video ya renderizado, listo para
  compartir.
- `assets/` — fotos de las canchas, logo del torneo y mockup de la
  camiseta oficial, usados dentro de la animación.
- `render-video.js` — script que re-renderiza el `.webm` a partir del
  `.html`, usando Chromium headless (Playwright) + ffmpeg (con soporte
  VP8/libvpx). Uso:

  ```bash
  npm i -D playwright
  npx playwright install chromium
  node promo/render-video.js
  ```

## Guion / timeline

1. **0-9s** — Una pelota de pádel cae desde el espacio; la cámara la
   sigue mientras se ve el planeta Tierra.
2. **9-12s** — Zoom hacia Argentina, con la pelota descendiendo justo
   sobre Suardi (Santa Fe).
3. **12-16s** — Aparecen las canchas reales de X3 Padel Suardi; la
   pelota "aterriza" entre ambas. Breve pausa.
4. **16-17s** — Pantalla en negro.
5. **17-25s** — La pelota junto a dos trofeos, banderas con el logo del
   torneo, la camiseta oficial y el llamado a inscribirse al torneo
   **Suma 13 Libres**.
