# validadores-rd

Validación de **formato y dígito verificador** de la cédula, el RNC, el NCF / e-NCF y el teléfono de República Dominicana. Sin dependencias, en JavaScript (Node 18+ o navegador).

Solo comprueba la forma. **No consulta** si un RNC existe o está activo, ni si un NCF está vigente ante la DGII; para eso están nuestras herramientas gratis: [Consulta RNC](https://zagirova.com/consulta-rnc) y [Consulta NCF](https://zagirova.com/consulta-ncf). Lo mantiene [Zagirova](https://zagirova.com).

## Uso

```js
import { cedulaValida, rncValido, identificacion, leerNcf, telefonoRd } from "validadores-rd";

rncValido("401-50625-4");        // true (el RNC de la DGII)
cedulaValida("001-0000000-0");   // true o false según el verificador (Luhn)
identificacion("401506254");     // { tipo: "rnc", valor: "401506254", valido: true }
leerNcf("E310000000123");        // { ncf, serie: "E", tipo: "E31", nombre: "Factura de crédito fiscal electrónica", valido: true, error: "" }
leerNcf("B0100000");             // { …, valido: false, error: "Un NCF tiene 11 caracteres." }
telefonoRd("(829) 946-0260");    // "+18299460260"
```

## Qué comprueba

| Dato | Regla |
|---|---|
| Cédula | 11 dígitos; el último es el verificador de Luhn sobre los 10 primeros. |
| RNC | 9 dígitos; pesos 7 9 8 6 5 4 3 2 sobre los 8 primeros, módulo 11 (resto 0 → 2, resto 1 → 1, otro → 11 − resto). |
| NCF | Serie B (11 caracteres) o E (13, electrónico, Ley 32-23), tipo vigente (B01…B17, E31…E47), solo números después de la letra. La serie antigua de 19 caracteres no se admite. |
| Teléfono | Códigos de área 809, 829 y 849; devuelve E.164. |

## Pruebas

```
node test.js
```

MIT · [Zagirova](https://zagirova.com) · hola@zagirova.com
