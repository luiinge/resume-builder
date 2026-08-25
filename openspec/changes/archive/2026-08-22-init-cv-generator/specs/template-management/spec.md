## ADDED Requirements

### Requirement: Crear plantilla
El sistema SHALL permitir crear una nueva plantilla definiendo su configuración de layout (visibilidad y posición de secciones y datos personales) y su hoja de estilos CSS.

#### Scenario: Creación de una plantilla nueva
- **WHEN** el usuario envía un nombre, una configuración de layout y un CSS para una nueva plantilla
- **THEN** el sistema crea la plantilla, le asigna un identificador único y la marca como no predefinida (`isPredefined: false`)

### Requirement: Consultar plantillas
El sistema SHALL permitir listar todas las plantillas disponibles y consultar el detalle completo de una plantilla concreta.

#### Scenario: Listado de plantillas
- **WHEN** el usuario solicita la lista de plantillas
- **THEN** el sistema devuelve todas las plantillas con su identificador, nombre, miniatura y si son predefinidas

#### Scenario: Detalle de una plantilla
- **WHEN** el usuario solicita una plantilla por su identificador
- **THEN** el sistema devuelve la configuración de layout completa y el CSS de esa plantilla

### Requirement: Editar plantilla
El sistema SHALL permitir modificar el nombre, la configuración de layout y el CSS de una plantilla existente que no sea predefinida.

#### Scenario: Actualización de una plantilla propia
- **WHEN** el usuario envía cambios de layout o CSS para una plantilla no predefinida existente
- **THEN** el sistema actualiza la plantilla y devuelve la configuración actualizada

#### Scenario: Intento de edición de una plantilla predefinida
- **WHEN** el usuario intenta modificar directamente una plantilla marcada como predefinida
- **THEN** el sistema rechaza la operación indicando que las plantillas predefinidas no son editables y sugiere duplicarla

### Requirement: Eliminar plantilla
El sistema SHALL permitir eliminar una plantilla que no sea predefinida. Las plantillas predefinidas no pueden eliminarse.

#### Scenario: Borrado de una plantilla propia
- **WHEN** el usuario solicita eliminar una plantilla no predefinida existente
- **THEN** el sistema elimina la plantilla de forma permanente

#### Scenario: Intento de borrado de una plantilla predefinida
- **WHEN** el usuario solicita eliminar una plantilla marcada como predefinida
- **THEN** el sistema rechaza la operación indicando que las plantillas predefinidas no pueden eliminarse

### Requirement: Duplicar plantilla
El sistema SHALL permitir duplicar cualquier plantilla existente (predefinida o propia) como punto de partida para una nueva plantilla editable.

#### Scenario: Duplicar una plantilla predefinida
- **WHEN** el usuario duplica una plantilla predefinida
- **THEN** el sistema crea una nueva plantilla con el mismo layout y CSS, marcada como no predefinida, editable de forma independiente

### Requirement: Plantillas de ejemplo predefinidas
El sistema SHALL incluir un conjunto de plantillas de ejemplo predefinidas, disponibles desde el primer arranque, sin necesidad de que el usuario cree ninguna manualmente.

#### Scenario: Disponibilidad tras el despliegue inicial
- **WHEN** el sistema se despliega por primera vez y se ejecuta la carga de datos iniciales
- **THEN** la lista de plantillas incluye al menos una plantilla predefinida lista para usarse con cualquier perfil

### Requirement: Control del CSS de una plantilla
El sistema SHALL validar el CSS de una plantilla al guardarla, rechazando construcciones que carguen recursos remotos no confiables.

#### Scenario: CSS con referencia remota no permitida
- **WHEN** el usuario intenta guardar una plantilla cuyo CSS contiene una regla `@import` o `url()` apuntando a un origen externo no permitido
- **THEN** el sistema rechaza el guardado indicando qué regla no está permitida

### Requirement: Vista previa de plantilla
El sistema SHALL permitir previsualizar el aspecto de una plantilla aplicada sobre un perfil de ejemplo o sobre un perfil elegido por el usuario, sin necesidad de generar un PDF.

#### Scenario: Previsualizar una plantilla con un perfil existente
- **WHEN** el usuario selecciona una plantilla y un perfil existente para previsualizar
- **THEN** el sistema devuelve el HTML resultante de combinar ese perfil con esa plantilla, respetando la visibilidad, posición y aspecto definidos por la plantilla
