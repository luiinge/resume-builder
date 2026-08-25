## ADDED Requirements

### Requirement: Crear perfil
El sistema SHALL permitir crear un nuevo perfil de candidato con un nombre identificativo y datos personales iniciales.

#### Scenario: Creación de un perfil nuevo
- **WHEN** el usuario envía los datos personales mínimos (nombre completo y email) para un nuevo perfil
- **THEN** el sistema crea el perfil, le asigna un identificador único y lo devuelve con sus secciones vacías

#### Scenario: Datos personales incompletos
- **WHEN** el usuario intenta crear un perfil sin nombre completo o sin email
- **THEN** el sistema rechaza la creación con un error de validación indicando los campos obligatorios faltantes

### Requirement: Consultar perfiles
El sistema SHALL permitir listar todos los perfiles existentes y consultar el detalle completo de un perfil concreto, incluyendo todas sus secciones.

#### Scenario: Listado de perfiles
- **WHEN** el usuario solicita la lista de perfiles
- **THEN** el sistema devuelve todos los perfiles existentes con su identificador, nombre y datos personales básicos

#### Scenario: Detalle de un perfil
- **WHEN** el usuario solicita un perfil por su identificador
- **THEN** el sistema devuelve los datos personales y el contenido completo de habilidades, idiomas, estudios, carrera laboral y proyectos de ese perfil

#### Scenario: Perfil inexistente
- **WHEN** el usuario solicita un perfil con un identificador que no existe
- **THEN** el sistema devuelve un error 404 indicando que el perfil no existe

### Requirement: Editar datos personales
El sistema SHALL permitir modificar los datos personales de un perfil existente.

#### Scenario: Actualización de datos personales
- **WHEN** el usuario envía datos personales modificados para un perfil existente
- **THEN** el sistema actualiza el perfil y devuelve los datos personales actualizados

### Requirement: Eliminar perfil
El sistema SHALL permitir eliminar un perfil junto con todas sus secciones asociadas.

#### Scenario: Borrado de un perfil
- **WHEN** el usuario solicita eliminar un perfil existente
- **THEN** el sistema elimina el perfil y todas sus secciones (habilidades, idiomas, estudios, carrera laboral, proyectos) de forma permanente

### Requirement: Gestión de la sección de habilidades
El sistema SHALL permitir añadir, editar, eliminar y reordenar entradas de habilidades dentro de un perfil.

#### Scenario: Añadir una habilidad
- **WHEN** el usuario añade una habilidad con nombre y nivel a un perfil
- **THEN** el sistema guarda la habilidad asociada al perfil y la incluye en la lista de habilidades del perfil

#### Scenario: Reordenar habilidades
- **WHEN** el usuario cambia el orden de las habilidades de un perfil
- **THEN** el sistema persiste el nuevo orden y lo respeta en futuras consultas del perfil

### Requirement: Gestión de la sección de idiomas
El sistema SHALL permitir añadir, editar, eliminar y reordenar entradas de idiomas dentro de un perfil.

#### Scenario: Añadir un idioma
- **WHEN** el usuario añade un idioma con nombre y nivel a un perfil
- **THEN** el sistema guarda el idioma asociado al perfil y lo incluye en la lista de idiomas del perfil

### Requirement: Gestión de la sección de estudios
El sistema SHALL permitir añadir, editar, eliminar y reordenar entradas de formación académica dentro de un perfil.

#### Scenario: Añadir un estudio
- **WHEN** el usuario añade una entrada de estudios con centro, titulación y fechas a un perfil
- **THEN** el sistema guarda la entrada asociada al perfil y la incluye en la lista de estudios del perfil

### Requirement: Gestión de la sección de carrera laboral
El sistema SHALL permitir añadir, editar, eliminar y reordenar entradas de experiencia laboral dentro de un perfil.

#### Scenario: Añadir una experiencia laboral
- **WHEN** el usuario añade una entrada de experiencia laboral con empresa, puesto y fechas a un perfil
- **THEN** el sistema guarda la entrada asociada al perfil y la incluye en la lista de experiencia laboral del perfil

### Requirement: Gestión de la sección de proyectos
El sistema SHALL permitir añadir, editar, eliminar y reordenar entradas de proyectos dentro de un perfil.

#### Scenario: Añadir un proyecto
- **WHEN** el usuario añade un proyecto con nombre y descripción a un perfil
- **THEN** el sistema guarda el proyecto asociado al perfil y lo incluye en la lista de proyectos del perfil
