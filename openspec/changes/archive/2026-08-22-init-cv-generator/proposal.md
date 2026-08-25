## Why

Hoy no existe ninguna herramienta propia para generar currículums: crear un CV nuevo o adaptarlo a una oferta implica editar documentos manualmente y repetir el mismo trabajo de maquetación. Este proyecto arranca desde cero un generador de currículums que separa el **contenido** (perfiles de candidato) del **aspecto visual** (plantillas), de modo que un mismo perfil se pueda exportar con distintas plantillas sin duplicar datos, y una plantilla nueva se pueda reutilizar con cualquier perfil.

## What Changes

- Se crea el proyecto desde cero como monorepo: backend en Node.js/NestJS + TypeScript, frontend en React + TypeScript, base de datos SQLite en fichero. Backend y frontend se despliegan como una única aplicación (el backend sirve también los estáticos del frontend).
- Se añade un **CRUD de perfiles**: datos personales y secciones (habilidades, idiomas, estudios, carrera laboral, proyectos), con soporte para múltiples perfiles por usuario.
- Se añade un **CRUD de plantillas**: cada plantilla define, mediante CSS, la visibilidad, posición y aspecto de cada sección y de los datos personales; las plantillas son independientes del contenido de cualquier perfil concreto.
- Se añade un **motor de renderizado**: combina un perfil + una plantilla y genera el CV final en HTML, exportable a **PDF** y a **Word (.docx)**.
- Se incluyen **plantillas de ejemplo predefinidas** (seed data) para que el sistema sea usable nada más desplegarlo.
- Se añade **empaquetado Docker**: Dockerfiles para backend y frontend, y un `docker-compose.yml` que levanta backend + frontend + base de datos, preparado para publicación futura.

Al ser un proyecto nuevo, no hay cambios que rompan comportamiento existente (no aplica **BREAKING**).

## Capabilities

### New Capabilities
- `profile-management`: CRUD de perfiles de candidato (datos personales + secciones: habilidades, idiomas, estudios, carrera laboral, proyectos).
- `template-management`: CRUD de plantillas visuales (definición vía CSS de visibilidad, posición y aspecto de secciones y datos personales), incluyendo plantillas de ejemplo predefinidas.
- `cv-rendering-export`: generación del CV final combinando un perfil y una plantilla, con exportación a PDF y a Word (.docx).
- `project-packaging`: empaquetado de todo el sistema (backend, frontend, base de datos) mediante Docker/Docker Compose para su despliegue.

### Modified Capabilities
_(ninguna — proyecto nuevo, sin specs previas)_

## Impact

- **Código nuevo**: monorepo completo (backend NestJS + frontend React), sin código previo afectado.
- **APIs nuevas**: API REST para perfiles (`/profiles`) y plantillas (`/templates`), y endpoint(s) de generación/exportación de CV (`/cv/render`).
- **Infraestructura**: base de datos SQLite en fichero (nuevo esquema, persistido en volumen Docker), motor headless para generación de PDF (Playwright) y librería de conversión a `.docx`.
- **Despliegue**: nuevo artefacto Docker (un único `Dockerfile` que empaqueta backend y frontend en la misma aplicación, `docker-compose.yml` con un solo servicio) sin infraestructura de despliegue previa que migrar.
