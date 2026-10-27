import assert from "node:assert/strict";
import { cedulaValida, rncValido, identificacion, leerNcf, ncfValido, telefonoRd } from "./index.js";
// RNC de la propia DGII, público en su sitio: 401-50625-4
assert.equal(rncValido("401-50625-4"), true);
assert.equal(rncValido("401506255"), false);
assert.equal(rncValido("12345"), false);
// cédula: generamos una válida con el algoritmo y alteramos el verificador
function dv(c10) { let s = 0; for (let i = 0; i < 10; i++) { let n = Number(c10[i]) * (i % 2 === 0 ? 1 : 2); if (n > 9) n = Math.floor(n / 10) + (n % 10); s += n; } return (10 - (s % 10)) % 10; }
const base = "0010100019"; const ok = base + dv(base);
assert.equal(cedulaValida(ok), true);
assert.equal(cedulaValida(base + ((dv(base) + 1) % 10)), false);
assert.equal(identificacion("401-50625-4").tipo, "rnc");
assert.equal(identificacion(ok).tipo, "cedula");
assert.equal(leerNcf("B0100000123").valido, true);
assert.equal(leerNcf("E310000000123").nombre, "Factura de crédito fiscal electrónica");
assert.equal(leerNcf("B0100000").error, "Un NCF tiene 11 caracteres.");
assert.equal(leerNcf("X0100000123").valido, false);
assert.equal(leerNcf("B9900000123").error, "El tipo B99 no existe.");
assert.equal(ncfValido("e31 0000 000 123"), true);
assert.equal(telefonoRd("(809) 973-1050"), "+18099731050");
assert.equal(telefonoRd("1 829 946 0260"), "+18299460260");
assert.equal(telefonoRd("305 555 0100"), null);
console.log("validadores-rd: pruebas ok");
