## Context

Proyecto nuevo, sin código ni infraestructura previa. Se decide de una vez la arquitectura base porque el resto de capacidades (perfiles, plantillas, renderizado, empaquetado) dependen de ella y son transversales (backend + frontend + base de datos + infraestructura Docker).

Stack acordado con el usuario:
- Backend: Node.js + TypeScript.
- Frontend: React + TypeScript.
- Base de datos: PostgreSQL.
- Render final: HTML+CSS → PDF, con exportación adicional a Word.
- Empaquetado: Docker, pensado para publicación futura.

## Goals / Non-Goals

**Goals:**
- Definir la estructura de monorepo y la separación de responsabilidades entre backend, frontend y base de datos.
- Definir el modelo de datos de perfiles y plantillas, y cómo se relacionan en tiempo de renderizado.
- Definir el mecanismo por el que una plantilla (CSS) controla visibilidad, posición y aspecto de las secciones de un perfil sin acoplarse a un perfil concreto.
- Definir el pipeline de generación del CV final (HTML → PDF, HTML → Word).
- Definir cómo se empaqueta todo el sistema en Docker para poder publicarlo en el futuro.

**Non-Goals:**
- Autenticación/autorización multiusuario. Se deja como capacidad futura explícita (ver Open Questions); esta fase asume despliegue single-tenant/local.
- Editor visual "drag & drop" de plantillas. En esta fase, las plantillas se definen mediante CSS (y un layout/config JSON), no mediante un editor gráfico.
- Integraciones externas (LinkedIn import, IA para redactar contenido, etc.).

## Decisions

**1. Monorepo con npm workspaces**
`apps/backend` (NestJS), `apps/frontend` (React + Vite), `packages/shared` (tipos TypeScript compartidos: DTOs de perfil, plantilla y modelo de secciones). Se descarta Nx/Turborepo por ser complejidad innecesaria para un proyecto de este tamaño; npm workspaces es suficiente y no añade herramientas nuevas que aprender.

**2. Backend: NestJS**
Framework modular con inyección de dependencias, pipes de validación (`class-validator`/`class-transformer`) y generación de documentación OpenAPI/Swagger de serie. Encaja bien con dos CRUDs claramente delimitados (`ProfilesModule`, `TemplatesModule`) más un módulo de renderizado (`RenderModule`). Alternativa descartada: Express "a pelo" — más rápido de arrancar pero exige montar a mano validación, estructura modular y documentación de API, coste que no compensa aquí.

**3. ORM: Prisma sobre SQLite (fichero)**
Prisma da tipado end-to-end, migraciones declarativas y un seed script de primera clase (necesario para las plantillas de ejemplo predefinidas). Se eligió SQLite en fichero (en vez de PostgreSQL) para mantener el despliegue como un único contenedor sin servicio de base de datos aparte, acorde al tamaño de la aplicación; el fichero se persiste en un volumen Docker. Alternativa descartada: TypeORM — más flexible con entidades pero con peor DX en migraciones y tipado. Alternativa descartada: PostgreSQL en un contenedor separado — añade un segundo servicio y complejidad de orquestación que esta aplicación no necesita; si el volumen de datos o la concurrencia lo justificaran en el futuro, migrar a PostgreSQL es un cambio acotado gracias a Prisma.

**4. Modelo de datos**

`Profile`:
- `personalData`: nombre, email, teléfono, dirección, foto, resumen/summary, enlaces (LinkedIn, web, etc.).
- `skills[]`, `languages[]`, `education[]`, `workExperience[]`, `projects[]`: cada una como tabla propia relacionada 1:N con `Profile`, con un campo `order` para permitir reordenar dentro de la sección.

`Template`:
- Metadatos: `name`, `description`, `thumbnailUrl`, `isPredefined` (true para las plantillas de ejemplo, protegidas contra borrado).
- `layoutConfig` (JSON): qué secciones son visibles y en qué posición/columna/orden se ubican (incluye datos personales como una "sección" más posicionable).
- `css`: hoja de estilos que define el aspecto (tipografías, colores, espaciados, bordes...) de las secciones y datos personales.

El renderizador combina un `Profile` + un `Template` en tiempo de generación; ninguna plantilla referencia datos de un perfil concreto, y ningún perfil referencia una plantilla concreta — la relación es siempre N:M en tiempo de uso, no en el modelo de datos.

**5. HTML semántico fijo + CSS de plantilla**
Para que el CSS de una plantilla pueda controlar de forma predecible visibilidad/posición/aspecto, el backend renderiza siempre el mismo esqueleto HTML semántico (contenedores con `data-section="skills"`, `data-section="languages"`, etc., más `data-section="personal-data"`). `layoutConfig` decide qué contenedores se pintan y en qué orden/columna (vía CSS Grid/Flexbox), y `css` decide el aspecto. Esto evita que cada plantilla tenga que reimplementar el marcado y permite validar el CSS contra un contrato estable.

**6. Pipeline de renderizado y exportación**
1. `RenderModule` genera el HTML canónico (motor de plantillas de servidor, p. ej. Handlebars) a partir de `Profile` + `Template.layoutConfig`, inyectando `Template.css` en un `<style>` con scope propio.
2. **PDF**: el HTML se imprime a PDF con un navegador headless (Playwright/Chromium), garantizando máxima fidelidad visual respecto a lo que se ve en la vista previa web.
3. **Word (.docx)**: el mismo HTML se convierte a `.docx` mediante una librería de conversión HTML→DOCX (p. ej. `html-to-docx`). Se documenta como limitación conocida que Word no soporta CSS Grid/Flexbox avanzado, por lo que la fidelidad visual en `.docx` será menor que en PDF (ver Riesgos).

**7. Empaquetado Docker: un único contenedor**
Backend y frontend se despliegan como una sola aplicación: el proceso NestJS sirve tanto la API (`/api/...`) como los estáticos del frontend compilado (con fallback a `index.html` para las rutas de cliente), en el mismo puerto. Se descarta tener contenedores/servicios separados para frontend y backend — para el tamaño de esta aplicación no aporta ninguna ventaja (escalado independiente, distintos ciclos de despliegue...) y sí añade complejidad de orquestación (Nginx, proxy inverso, red interna). `Dockerfile` único con build multi-stage: compila `packages/shared`, el frontend (Vite) y el backend (Nest), y la imagen final (basada en la imagen oficial de Playwright, con Chromium ya instalado) copia el resultado del backend junto con los estáticos del frontend dentro de su carpeta `public`. `docker-compose.yml` con un único servicio `app` + volumen para el fichero SQLite, variables vía `.env.example`.

## Risks / Trade-offs

- [Riesgo] El CSS de una plantilla es esencialmente código que el propio sistema ejecuta al renderizar → Mitigación: el CSS se sirve siempre dentro de un contenedor con scope propio (o iframe con `sandbox` en la vista previa del editor de plantillas) y se descartan construcciones peligrosas (`@import` remoto, `url()` a orígenes no confiables) antes de guardar la plantilla.
- [Riesgo] La exportación a Word tendrá menor fidelidad visual que el PDF por las limitaciones de `.docx` con CSS moderno → Mitigación: documentarlo explícitamente en la UI ("vista previa optimizada para PDF; la versión Word puede variar ligeramente") y cubrir con tests solo el contenido, no el pixel-perfect, del `.docx`.
- [Riesgo] Playwright/Chromium headless incrementa notablemente el tamaño de la imagen Docker del backend y sus dependencias de sistema → Mitigación: usar la imagen base oficial de Playwright para Node en el Dockerfile de producción en vez de instalar dependencias de Chromium a mano.
- [Riesgo] Sin autenticación, cualquiera con acceso a la API puede leer/escribir todos los perfiles → Mitigación: aceptable para uso local/desarrollo en esta fase; debe resolverse en una capacidad futura de autenticación antes de cualquier despliegue público (ver Open Questions).

## Open Questions

- ¿Se necesita autenticación/multiusuario antes de la publicación pública mencionada por el usuario, o se aborda en un cambio posterior una vez validado el MVP?
- Almacenamiento de fotos de perfil: volumen local de Docker (suficiente para esta fase) vs. almacenamiento de objetos (S3-compatible) si en el futuro se despliega en un entorno sin disco persistente.
- Estrategia exacta de sandboxing del CSS en la vista previa del editor de plantillas (iframe `sandbox` vs. sanitizado de CSS en backend) — se decidirá durante la implementación de `template-management`.
