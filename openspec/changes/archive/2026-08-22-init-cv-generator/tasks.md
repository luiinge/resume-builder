## 1. Bootstrap del monorepo

- [x] 1.1 Crear estructura de workspaces npm: `apps/backend`, `apps/frontend`, `packages/shared`
- [x] 1.2 Inicializar `apps/backend` con NestJS + TypeScript
- [x] 1.3 Inicializar `apps/frontend` con React + TypeScript + Vite
- [x] 1.4 Crear `packages/shared` con los tipos TypeScript comunes (DTOs de perfil, plantilla, secciones)
- [x] 1.5 Configurar linting/formatting comunes (ESLint + Prettier) en el monorepo
- [x] 1.6 Añadir scripts raíz (`dev`, `build`, `lint`, `test`) que orquesten los tres paquetes

## 2. Base de datos y modelo de datos

- [x] 2.1 Configurar Prisma en `apps/backend` apuntando a SQLite (fichero)
- [x] 2.2 Definir el esquema de `Profile` y sus entidades relacionadas (skills, languages, education, workExperience, projects)
- [x] 2.3 Definir el esquema de `Template` (metadatos, `layoutConfig` JSON, `css`, `isPredefined`)
- [x] 2.4 Generar la migración inicial de Prisma
- [x] 2.5 Crear script de seed de Prisma con las plantillas de ejemplo predefinidas

## 3. Backend: gestión de perfiles (profile-management)

- [x] 3.1 Crear `ProfilesModule` con controlador, servicio y DTOs validados (`class-validator`)
- [x] 3.2 Implementar endpoints CRUD de perfil (crear, listar, detalle, actualizar datos personales, eliminar)
- [x] 3.3 Implementar endpoints CRUD para cada sección (skills, languages, education, workExperience, projects), incluyendo reordenación
- [x] 3.4 Añadir validaciones de negocio (campos obligatorios de datos personales, existencia del perfil)
- [x] 3.5 Documentar los endpoints en Swagger/OpenAPI
- [x] 3.6 Tests de integración del CRUD de perfiles y sus secciones

## 4. Backend: gestión de plantillas (template-management)

- [x] 4.1 Crear `TemplatesModule` con controlador, servicio y DTOs validados
- [x] 4.2 Implementar endpoints CRUD de plantilla (crear, listar, detalle, actualizar, eliminar)
- [x] 4.3 Implementar protección contra edición/borrado de plantillas `isPredefined: true`
- [x] 4.4 Implementar endpoint de duplicado de plantilla
- [x] 4.5 Implementar validación/sanitizado del CSS al guardar (bloquear `@import`/`url()` a orígenes no confiables)
- [x] 4.6 Implementar endpoint de vista previa (perfil + plantilla → HTML)
- [x] 4.7 Documentar los endpoints en Swagger/OpenAPI
- [x] 4.8 Tests de integración del CRUD de plantillas, protección de predefinidas y sanitizado de CSS

## 5. Backend: renderizado y exportación (cv-rendering-export)

- [x] 5.1 Definir el esqueleto HTML semántico fijo (`data-section="..."`) usado por el motor de renderizado
- [x] 5.2 Implementar `RenderModule`: combinar `Profile` + `Template.layoutConfig` + `Template.css` en HTML final
- [x] 5.3 Ocultar automáticamente en el render las secciones sin contenido, aunque la plantilla las marque visibles
- [x] 5.4 Integrar Playwright (Chromium headless) para exportar el HTML a PDF
- [x] 5.5 Integrar librería de conversión HTML→DOCX para exportar a Word
- [x] 5.6 Implementar endpoints de exportación (`/cv/render`, `/cv/export/pdf`, `/cv/export/docx`)
- [x] 5.7 Tests de integración de generación de PDF y DOCX (contenido presente, secciones vacías ocultas)

## 6. Frontend: gestión de perfiles

- [x] 6.1 Vista de listado de perfiles con acciones crear/editar/eliminar
- [x] 6.2 Formulario de datos personales
- [x] 6.3 Editor de secciones (habilidades, idiomas, estudios, carrera laboral, proyectos) con alta/edición/borrado/reordenación
- [x] 6.4 Validaciones de formulario alineadas con las reglas del backend
- [x] 6.5 Integración con la API de perfiles (`packages/shared` para tipos)

## 7. Frontend: gestión de plantillas

- [x] 7.1 Vista de listado de plantillas (predefinidas y propias) con miniatura
- [x] 7.2 Editor de plantilla: configuración de layout (visibilidad/posición de secciones) y editor de CSS
- [x] 7.3 Vista previa en vivo de la plantilla (sandboxed, p. ej. iframe) aplicada sobre un perfil de ejemplo
- [x] 7.4 Acción de duplicar plantilla predefinida como punto de partida
- [x] 7.5 Bloqueo en la UI de edición/borrado directo sobre plantillas predefinidas

## 8. Frontend: generación y exportación de CV

- [x] 8.1 Vista de selección de perfil + plantilla para generar el CV
- [x] 8.2 Vista previa del CV combinado (perfil + plantilla) antes de exportar
- [x] 8.3 Botones de exportación a PDF y a Word, con descarga del fichero resultante
- [x] 8.4 Mensaje informativo sobre la posible menor fidelidad visual de la exportación a Word

## 9. Empaquetado Docker (contenedor único)

- [x] 9.1 Escribir `Dockerfile` único multi-stage basado en la imagen oficial de Playwright para Node, que compila y empaqueta backend y frontend en la misma aplicación (el backend sirve los estáticos del frontend)
- [x] 9.2 Servir el frontend compilado desde el propio backend (estáticos + fallback SPA a `index.html`, sin tocar las rutas `/api/*`)
- [x] 9.3 Escribir `docker-compose.yml` con un único servicio `app` y volumen persistente para el fichero SQLite
- [x] 9.4 Crear `.env.example` documentando las variables de entorno necesarias
- [x] 9.5 Ejecutar migraciones y seed de plantillas automáticamente en el arranque del contenedor
- [x] 9.6 Verificar arranque completo con `docker compose up` desde cero (base de datos vacía) y comprobar que las plantillas de ejemplo están disponibles

## 10. Verificación final

- [x] 10.1 Recorrer manualmente el flujo completo: crear perfil → crear/elegir plantilla → previsualizar → exportar a PDF → exportar a Word
- [x] 10.2 Ejecutar toda la suite de tests (backend) y linters (backend + frontend)
- [x] 10.3 Revisar que `openspec validate init-cv-generator --strict` pasa antes de archivar el cambio
