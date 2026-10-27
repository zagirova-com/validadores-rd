// validadores-rd · formato y dígito verificador de la cédula, el RNC y el NCF / e-NCF de República Dominicana.
// Solo comprueba la forma: NO consulta si existen ni si están activos. Para eso: https://zagirova.com/consulta-rnc y https://zagirova.com/consulta-ncf
// Sin dependencias. Node 18+ o navegador (ESM).

const limpiar = (s) => String(s ?? "").replace(/[\s-]/g, "");

/** Cédula de identidad (11 dígitos): algoritmo de Luhn sobre los 10 primeros, el 11.º es el verificador. */
export function cedulaValida(cedula) {
  const c = limpiar(cedula);
  if (!/^\d{11}$/.test(c)) return false;
  let suma = 0;
  for (let i = 0; i < 10; i++) {
    let n = Number(c[i]) * (i % 2 === 0 ? 1 : 2);
    if (n > 9) n = Math.floor(n / 10) + (n % 10);
    suma += n;
  }
  return (10 - (suma % 10)) % 10 === Number(c[10]);
}

/** RNC (9 dígitos): pesos 7 9 8 6 5 4 3 2 sobre los 8 primeros, módulo 11; el 9.º es el verificador. */
export function rncValido(rnc) {
  const r = limpiar(rnc);
  if (!/^\d{9}$/.test(r)) return false;
  const pesos = [7, 9, 8, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((s, p, i) => s + p * Number(r[i]), 0);
  const resto = suma % 11;
  const dv = resto === 0 ? 2 : resto === 1 ? 1 : 11 - resto;
  return dv === Number(r[8]);
}

/** Identificación fiscal: RNC (9) o cédula (11). Devuelve { tipo, valor, valido }. */
export function identificacion(valor) {
  const v = limpiar(valor);
  if (v.length === 9) return { tipo: "rnc", valor: v, valido: rncValido(v) };
  if (v.length === 11) return { tipo: "cedula", valor: v, valido: cedulaValida(v) };
  return { tipo: null, valor: v, valido: false };
}

/** Tipos de comprobante fiscal vigentes (serie B: impresos o de sistema; serie E: electrónicos, Ley 32-23). */
export const TIPOS_NCF = {
  B01: "Factura de crédito fiscal", B02: "Factura de consumo", B03: "Nota de débito", B04: "Nota de crédito",
  B11: "Comprobante de compras", B12: "Registro único de ingresos", B13: "Comprobante para gastos menores",
  B14: "Comprobante para regímenes especiales", B15: "Comprobante gubernamental", B16: "Comprobante para exportaciones", B17: "Comprobante para pagos al exterior",
  E31: "Factura de crédito fiscal electrónica", E32: "Factura de consumo electrónica", E33: "Nota de débito electrónica", E34: "Nota de crédito electrónica",
  E41: "Comprobante de compras electrónico", E43: "Comprobante para gastos menores electrónico", E44: "Comprobante para regímenes especiales electrónico",
  E45: "Comprobante gubernamental electrónico", E46: "Comprobante para exportaciones electrónico", E47: "Comprobante para pagos al exterior electrónico",
};

/** NCF «B0100000123» (11 caracteres) o e-NCF «E310000000123» (13). Devuelve { ncf, serie, tipo, nombre, valido, error }. */
export function leerNcf(raw) {
  const ncf = limpiar(raw).toUpperCase();
  const serie = ncf[0]; const codigo = ncf.slice(0, 3); const nombre = TIPOS_NCF[codigo] ?? null;
  const largo = serie === "B" ? 11 : 13;
  let error = "";
  if (serie !== "B" && serie !== "E") error = "Un NCF empieza por B, o por E si es electrónico.";
  else if (!nombre) error = `El tipo ${codigo} no existe.`;
  else if (!/^[BE]\d+$/.test(ncf)) error = "Después de la letra solo van números.";
  else if (ncf.length !== largo) error = `Un ${serie === "B" ? "NCF" : "e-NCF"} tiene ${largo} caracteres.`;
  return { ncf, serie: error ? null : serie, tipo: nombre ? codigo : null, nombre, valido: !error, error };
}
export const ncfValido = (raw) => leerNcf(raw).valido;

/** Teléfono dominicano: códigos de área 809, 829 y 849, diez dígitos. Devuelve el número en formato E.164 o null. */
export function telefonoRd(raw) {
  const d = String(raw ?? "").replace(/\D/g, "").replace(/^1/, "");
  return /^(809|829|849)\d{7}$/.test(d) ? `+1${d}` : null;
}
