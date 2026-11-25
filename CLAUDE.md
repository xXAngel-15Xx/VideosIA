# Especificaciones de los videos

Proyecto de Remotion. Todo video nuevo que se cree en este proyecto debe cumplir estas especificaciones, salvo que se indique lo contrario.

## Idioma
- Todo el contenido en **español**: textos en pantalla, subtítulos, títulos y narración.

## Formato
- **Vertical**, **1080 x 1920** (9:16).
- Al registrar una `<Composition>` usar `width={1080}` y `height={1920}`.
- Diseñar el contenido para pantalla vertical: texto grande y legible, elementos centrados y márgenes seguros arriba y abajo.

## Dónde va cada video
- Cada video vive en su propia carpeta `Videos/<Nombre>/` (código `.tsx`, `audio/` y `scripts/`), no en `src/`.
- Se registra en [src/Root.tsx](src/Root.tsx) dentro de un `<Folder>` con el nombre del video.
- Los audios se importan directamente (`import voz from './audio/voz.wav'`) en vez de usar `public/`.
- Ejemplo completo: [Videos/Prueba/](Videos/Prueba/) (volcán).

## Audio
- Narración: voz de Windows "Microsoft Helena Desktop" (es-ES) con `System.Speech`. Ver `Videos/Prueba/scripts/narracion.ps1`.
  - Guardar con el formato por defecto (22050 Hz). La velocidad se ajusta con `$synth.Rate`, porque el `rate` de SSML se ignora.
  - Los tiempos por palabra de Windows (`SpeakProgress`) NO son fiables. Se miden con Whisper: `Videos/Prueba/scripts/subtitulos.mts`.
- Música y efectos: se sintetizan con Node (`scripts/sonidos.mts`), sin archivos de terceros.
- Git no está en el PATH: antes de `create-video` u otros comandos que lo necesiten, añadir `C:\Program Files\Git\cmd`.

## Subtítulos
- Subtítulos **por oraciones**: se muestra una oración completa a la vez y no palabra por palabra.
- Cada oración aparece cuando empieza a decirse y desaparece cuando termina.
- Deben ser legibles en vertical: buen contraste (texto claro con contorno o fondo), centrados y sin tapar el contenido principal.
- Usar la skill `remotion-captions` como referencia para generar y mostrar los subtítulos.
