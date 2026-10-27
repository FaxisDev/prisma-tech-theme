# Prisma-Tech

Tema oscuro y personalizable para VS Code que mezcla la paleta de **Aura** (verde `#61FFCA`, púrpura `#ACA0FF`, tonos brillantes) con la estructura y colores de sintaxis de **Material**, sobre un fondo `#1B2126`.

## Personalización

### Panel visual
Haz clic en el icono de **Prisma-Tech** en la barra de actividad, o abre la paleta de comandos (`Cmd + Shift + P`) y ejecuta **Prisma-Tech: Personalizar tema**. Desde ahí puedes:

- Cambiar el color de acento (con atajos de colores rápidos) y el fondo del editor.
- Cambiar cada color de sintaxis: comentarios, strings, keywords, funciones, clases, etc.
- Activar o desactivar cursivas en comentarios, keywords y parámetros.
- Activar el **texto brillante** para tener más contraste.
- Ver el resultado al instante: desde la barra lateral, la vista previa se abre en una pestaña del editor y se cierra al salir de la sección.
- Cambiar de lenguaje en la vista previa: TypeScript, JavaScript, Dart, Python, SCSS, HTML, JSON, PHP, Java, C++, Go y Rust, cada uno con su icono.
- Hacer clic en cualquier palabra de la vista previa para saltar al color que la controla.
- Ver el contraste de cada color contra el fondo; los que se leen mal se marcan con ⚠.
- Pulsar **✦ Modo prisma** para repartir los colores de sintaxis por todo el espectro a partir del acento.
- Ver los cambios aplicados en VS Code mientras editas, sin recargar la ventana. Si sales sin guardar, vuelven los colores guardados.
- El título del panel tiene un brillo prismático que respira; se desactiva con «Brillo animado en el título» o con `prismaTech.titleGlow`.
- Volver cualquier color a su valor original con el botón ↺, o restablecer todo.

Al pulsar **Guardar y aplicar**, el tema se regenera y se aplica al momento, sin recargar la ventana.

### Desde Ajustes
También puedes editarlo en `settings.json`:

```json
{
  "prismaTech.accentColor": "#61FFCA",
  "prismaTech.background": "#1B2126",
  "prismaTech.italicComments": true,
  "prismaTech.italicKeywords": true,
  "prismaTech.italicParameters": true,
  "prismaTech.brightText": false,
  "prismaTech.syntax": {
    "keyword": "#ACA0FF",
    "function": "#6E9CFF"
  }
}
```

El fondo de paneles, barra lateral, bordes, números de línea y terminal se calcula automáticamente a partir de `prismaTech.background`.

### Comandos
| Comando | Qué hace |
|---|---|
| Prisma-Tech: Personalizar tema | Abre el panel visual |
| Prisma-Tech: Restablecer colores originales | Borra tus cambios |
| Prisma-Tech: Abrir ajustes del tema | Abre la sección del tema en Ajustes |

## Paleta original
| Uso | Color |
|---|---|
| Fondo editor | `#1B2126` |
| Acento | `#61FFCA` |
| Strings | `#CCFF4D` |
| Keywords | `#ACA0FF` |
| Storage / atributos | `#C8B9FF` |
| Funciones | `#6E9CFF` |
| Propiedades | `#5CDFFF` |
| Claves de objetos (severity:, detail:) | `#FF6EB6` |
| Clases / tipos | `#FFD21F` |
| Clases usadas (imports, new X) | `#C4EAFF` |
| Servicios inyectados (http, messageService) | `#9AD1FF` |
| Parámetros | `#C4EAFF` |
| Números | `#CCFF4D` |
| Constantes (null, enums) | `#F77BFF` |
| Booleanos (true, false) | `#3BA9F5` |
| Variables const | `#FF3B4E` |
| Tags | `#FF5370` |
| Operadores | `#5ED3FF` |
| this / self | `#FFD21F` |
| Comentarios | `#5C6B75` |

## Desarrollo
- `F5` abre una ventana de prueba con el tema cargado.
- `npm run build` regenera `themes/prisma-tech-color-theme.json` con los colores por defecto.
- El generador del tema está en `src/generator.js`; ahí se cambian los colores base para todos.
