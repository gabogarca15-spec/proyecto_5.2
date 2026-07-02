const visor = document.getElementById("resultado");
const expresion = document.getElementById("expresion");

let reiniciar = false;

function convertirExpresion(texto) {
  return texto
    .replace(/×/g, "*")
    .replace(/÷/g, "/");
}

function mostrarExpresion(texto) {
  expresion.textContent = texto || "";
}

function mostrarVisor(valor, clase = "") {
  visor.classList.remove("error", "resultado-ok", "resultado-anim");

  if (clase !== "") {
    visor.classList.add(clase);
  }

  void visor.offsetWidth;
  visor.classList.add("resultado-anim");
  visor.value = valor;
}

function agregarNumero(numero) {
  let actual = visor.value;

  if (reiniciar) {
    reiniciar = false;
    mostrarExpresion("");
    mostrarVisor(numero === "." ? "0." : numero);
    return;
  }

  if (numero === ".") {
    let partes = actual.split(/[+\-×÷]/);
    let ultimoBloque = partes[partes.length - 1];

    if (ultimoBloque.includes(".")) {
      return;
    }

    if (actual === "0") {
      mostrarVisor("0.");
      return;
    }

    mostrarVisor(actual + ".");
    return;
  }

  if (actual === "0") {
    mostrarVisor(numero);
  } else {
    mostrarVisor(actual + numero);
  }
}

function agregarOperador(operador) {
  let actual = visor.value;
  let operadores = ["+", "-", "×", "÷"];

  reiniciar = false;

  if (actual === "0" || actual === "") {
    return;
  }

  let ultimo = actual.slice(-1);

  if (operadores.includes(ultimo)) {
    mostrarVisor(actual.slice(0, -1) + operador);
  } else {
    mostrarVisor(actual + operador);
  }
}

function limpiarTodo() {
  reiniciar = false;
  mostrarExpresion("");
  mostrarVisor("0");
}

function borrarUno() {
  reiniciar = false;
  let actual = visor.value;

  if (actual.length <= 1 || actual === "Error") {
    mostrarVisor("0");
    return;
  }

  mostrarVisor(actual.slice(0, -1));
}

function aplicarPorcentaje() {
  let actual = visor.value;
  let numero = parseFloat(actual);

  if (isNaN(numero)) {
    return;
  }

  mostrarExpresion(actual + " %");
  mostrarVisor(String(numero / 100), "resultado-ok");
  reiniciar = true;
}

function calcularResultado() {
  let actual = visor.value;

  if (actual === "" || actual === "0") {
    return;
  }

  mostrarExpresion(actual + " =");

  try {
    let expresionFinal = convertirExpresion(actual);

    if (/\/0(?!\d)/.test(expresionFinal)) {
      throw new Error("No se puede dividir entre cero");
    }

    let resultado = eval(expresionFinal);

    if (!isFinite(resultado)) {
      throw new Error("Resultado inválido");
    }

    let resultadoFormateado = parseFloat(resultado.toFixed(10)).toString();
    mostrarVisor(resultadoFormateado, "resultado-ok");
    reiniciar = true;

  } catch (error) {
    mostrarVisor("Error", "error");
    mostrarExpresion("");
    reiniciar = true;
  }
}