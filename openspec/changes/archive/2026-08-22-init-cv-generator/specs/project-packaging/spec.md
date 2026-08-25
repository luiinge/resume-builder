## ADDED Requirements

### Requirement: Imagen Docker del backend
El sistema SHALL proporcionar un Dockerfile que empaquete el backend como una imagen ejecutable de producción, incluyendo las dependencias necesarias para el renderizado a PDF.

#### Scenario: Construcción de la imagen de backend
- **WHEN** se ejecuta la construcción de la imagen Docker del backend
- **THEN** se obtiene una imagen que arranca el servicio backend y es capaz de generar PDFs sin dependencias adicionales instaladas manualmente en el host

### Requirement: Imagen Docker del frontend
El sistema SHALL proporcionar un Dockerfile que empaquete el frontend compilado como una imagen ejecutable, servida como contenido estático.

#### Scenario: Construcción de la imagen de frontend
- **WHEN** se ejecuta la construcción de la imagen Docker del frontend
- **THEN** se obtiene una imagen que sirve la aplicación web compilada y lista para recibir tráfico HTTP

### Requirement: Orquestación completa con Docker Compose
El sistema SHALL proporcionar un fichero `docker-compose` que levante el backend, el frontend y la base de datos PostgreSQL como un stack funcional con un único comando.

#### Scenario: Arranque del stack completo
- **WHEN** se ejecuta el comando de arranque del `docker-compose`
- **THEN** los servicios de backend, frontend y base de datos quedan operativos y accesibles entre sí, y la aplicación web es accesible desde el navegador

### Requirement: Configuración mediante variables de entorno
El sistema SHALL permitir configurar los aspectos desplegables (credenciales de base de datos, puertos, URLs) mediante variables de entorno, con un fichero de ejemplo documentado.

#### Scenario: Arranque con configuración por defecto
- **WHEN** se arranca el stack sin modificar la configuración de ejemplo proporcionada
- **THEN** el sistema arranca correctamente usando los valores por defecto documentados en el fichero de ejemplo de variables de entorno

### Requirement: Carga de datos iniciales en el arranque
El sistema SHALL cargar automáticamente las plantillas de ejemplo predefinidas en la base de datos la primera vez que se despliega el stack, sin intervención manual.

#### Scenario: Primer arranque del stack
- **WHEN** el stack se levanta por primera vez sobre una base de datos vacía
- **THEN** al finalizar el arranque las plantillas de ejemplo predefinidas están disponibles a través de la API sin que el usuario haya ejecutado ningún paso adicional
