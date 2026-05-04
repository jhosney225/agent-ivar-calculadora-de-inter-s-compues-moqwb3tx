```javascript
#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Calculadora de interés compuesto
class CalculadoraInteresCompuesto {
  constructor() {
    this.resultados = [];
  }

  // Fórmula: A = P(1 + r/n)^(nt)
  // A = Monto final
  // P = Principal (monto inicial)
  // r = Tasa de interés anual (decimal)
  // n = Número de veces que se compone por año
  // t = Número de años
  calcular(principal, tasaAnual, tiempoAnios, frecuenciaCompuesto = 12) {
    if (principal <= 0 || tasaAnual < 0 || tiempoAnios <= 0) {
      throw new Error('Los valores deben ser positivos (excepto tasa que puede ser 0)');
    }

    const tasaDecimal = tasaAnual / 100;
    const montoFinal = principal * Math.pow(
      1 + tasaDecimal / frecuenciaCompuesto,
      frecuenciaCompuesto * tiempoAnios
    );

    const interesgenerado = montoFinal - principal;

    const resultado = {
      principal,
      tasaAnual,
      tiempoAnios,
      frecuenciaCompuesto,
      montoFinal: Math.round(montoFinal * 100) / 100,
      interesgenerado: Math.round(interesgenerado * 100) / 100,
      fecha: new Date().toLocaleString()
    };

    this.resultados.push(resultado);
    return resultado;
  }

  // Calcula el tiempo necesario para alcanzar un monto objetivo
  calcularTiempoObjetivo(principal, tasaAnual, montoObjetivo, frecuenciaCompuesto = 12) {
    if (montoObjetivo <= principal) {
      throw new Error('El monto objetivo debe ser mayor al principal');
    }

    const tasaDecimal = tasaAnual / 100;
    const tiempo = Math.log(montoObjetivo / principal) / 
                   (frecuenciaCompuesto * Math.log(1 + tasaDecimal / frecuenciaCompuesto));

    return Math.round(tiempo * 100) / 100;
  }

  // Calcula la tasa anual necesaria para alcanzar un objetivo
  calcularTasaObjetivo(principal, tiempoAnios, montoObjetivo, frecuenciaCompuesto = 12) {
    if (montoObjetivo <= principal) {
      throw new Error('El monto objetivo debe ser mayor al principal');
    }

    const raiz = Math.pow(montoObjetivo / principal, 1 / (frecuenciaCompuesto * tiempoAnios));
    const tasaDecimal = (raiz - 1) * frecuenciaCompuesto;
    const tasaAnual = tasaDecimal * 100;

    return Math.round(tasaAnual * 100) / 100;
  }

  // Proyección año a año
  proyeccionAnual(principal, tasaAnual, tiempoAnios, frecuenciaCompuesto = 12) {
    const tasaDecimal = tasaAnual / 100;
    const proyecciones = [];

    for (let anio = 1; anio <= tiempoAnios; anio++) {
      const montoAnio = principal * Math.pow(
        1 + tasaDecimal / frecuenciaCompuesto,
        frecuenciaCompuesto * anio
      );
      proyecciones.push({
        anio,
        monto: Math.round(montoAnio * 100) / 100,
        interes: Math.round((montoAnio - principal) * 100) / 100
      });
    }

    return proyecciones;
  }

  // Obtener historial de cálculos
  obtenerHistorial() {
    return this.resultados;
  }

  // Limpiar historial
  limpiarHistorial() {
    this.resultados = [];
  }

  // Comparar dos inversiones
  compararInversiones(inversion1, inversion2) {
    return {
      inversion1,
      inversion2,
      diferencia: Math.round((inversion1.montoFinal - inversion2.montoFinal) * 100) / 100,
      porcentajeDiferencia: Math.round(
        ((inversion1.montoFinal - inversion2.montoFinal) / inversion2.montoFinal * 100) * 100
      ) / 100
    };
  }
}

// Demo y menú interactivo
async function main() {
  const calc = new CalculadoraInteresCompuesto();
  let ejecutando = true;

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   CALCULADORA DE INTERÉS COMPUESTO PARA       ║');
  console.log('║         INVERSIONES - v1.0                     ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  while (ejecutando) {
    console.log('\n┌─────────────────────────────────────┐');
    console.log('│         MENÚ PRINCIPAL              │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ 1. Calcular interés compuesto       │');
    console.