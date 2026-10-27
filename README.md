# Prisma-Tech

Tema oscuro y personalizable para VS Code que mezcla la paleta de **Aura** (verde `#61FFCA`, púrpura `#A277FF`, tonos brillantes) con la estructura y colores de sintaxis de **Material**, sobre un fondo `#1B2126`.

## Personalización

### Panel visual
Abre la paleta de comandos (`Cmd + Shift + P`) y ejecuta **Prisma-Tech: Personalizar tema**. Desde ahí puedes:

- Cambiar el color de acento (con atajos de colores rápidos) y el fondo del editor.
- Cambiar cada color de sintaxis: comentarios, strings, keywords, funciones, clases, etc.
- Activar o desactivar cursivas en comentarios, keywords y parámetros.
- Activar el **texto brillante** para tener más contraste.
- Ver el resultado al instante en una vista previa.
- Volver cualquier color a su valor original con el botón ↺, o restablecer todo.

Al pulsar **Guardar y aplicar**, el tema se regenera y VS Code te pedirá recargar la ventana.

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
    "keyword": "#A277FF",
    "function": "#82AAFF"
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
| Acento / strings | `#61FFCA` |
| Keywords | `#A277FF` |
| Storage / atributos | `#C792EA` |
| Funciones | `#82AAFF` |
| Propiedades | `#82E2FF` |
| Clases / tipos | `#FFCB6B` |
| Parámetros | `#FFCA85` |
| Números | `#F78C6C` |
| Constantes | `#F694FF` |
| Tags | `#F07178` |
| Operadores | `#89DDFF` |
| this / self | `#FF6767` |
| Comentarios | `#5C6B75` |

## Desarrollo
- `F5` abre una ventana de prueba con el tema cargado.
- `npm run build` regenera `themes/prisma-tech-color-theme.json` con los colores por defecto.
- El generador del tema está en `src/generator.js`; ahí se cambian los colores base para todos.
