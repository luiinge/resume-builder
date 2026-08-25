# cv-rendering-export Specification

## Purpose
TBD - created by archiving change init-cv-generator. Update Purpose after archive.
## Requirements
### Requirement: Generar CV combinando perfil y plantilla
El sistema SHALL generar el documento de CV combinando el contenido de un perfil existente con el aspecto y layout de una plantilla existente, respetando la visibilidad y posición de secciones definidas por la plantilla.

#### Scenario: Generación con secciones vacías ocultas
- **WHEN** se genera un CV para un perfil que no tiene ninguna entrada en la sección de proyectos
- **THEN** el documento generado no muestra la sección de proyectos, aunque la plantilla la tenga configurada como visible

#### Scenario: Combinación de perfil y plantilla inexistentes
- **WHEN** se solicita generar un CV referenciando un perfil o una plantilla que no existen
- **THEN** el sistema rechaza la generación con un error indicando cuál de los dos recursos no existe

### Requirement: Exportar CV a PDF
El sistema SHALL permitir exportar el CV generado (perfil + plantilla) como un fichero PDF descargable, con la mayor fidelidad posible respecto a la vista previa HTML.

#### Scenario: Exportación exitosa a PDF
- **WHEN** el usuario solicita exportar a PDF un perfil combinado con una plantilla
- **THEN** el sistema devuelve un fichero PDF cuyo contenido y aspecto se corresponden con la vista previa HTML de esa combinación

### Requirement: Exportar CV a Word
El sistema SHALL permitir exportar el CV generado (perfil + plantilla) como un fichero Word (.docx) descargable.

#### Scenario: Exportación exitosa a Word
- **WHEN** el usuario solicita exportar a Word un perfil combinado con una plantilla
- **THEN** el sistema devuelve un fichero `.docx` que incluye todas las secciones visibles del perfil según la configuración de la plantilla

#### Scenario: Aviso de fidelidad reducida en Word
- **WHEN** el usuario solicita exportar a Word una plantilla que usa características CSS avanzadas no soportadas por el formato `.docx`
- **THEN** el sistema genera igualmente el fichero `.docx` aplicando la mejor aproximación posible al aspecto original

