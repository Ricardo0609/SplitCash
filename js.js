


// Constantes
const opmenu = document.getElementById("opmenu");
const nav = document.getElementById("nav");
const borr = document.getElementById("borr");
const cerr = document.getElementById("close");
const contc = document.getElementById("contc");
const circ = document.getElementById("circ");
const modo = document.getElementById("modo");
const body = document.getElementById("body");
const limtpm = document.getElementById("limtpm");
const agregar = document.getElementById("agregar");
const inp = document.getElementById("inp");
const btnmdce = document.getElementById("btnmdce");
const inpTitcam = document.getElementById("inpTitcam");
const inpCant = document.getElementById("inpCant");
const overlay = document.getElementById("overlay");
const secap = document.getElementById("secap");
const btnbrr = document.getElementById("btnbrr");
const cdap = document.getElementsByClassName("cantidad")

const Ahorro = document.getElementById("Ahorro");
const Inversión = document.getElementById("Inversión");
const Despensa = document.getElementById("Despensa");
const Osio = document.getElementById("Osio");
const Salidas = document.getElementById("Salidas");

let currentKey = "";

// Abrir y cerrar menú
opmenu.addEventListener("click", () => {
    nav.classList.add("vis");
    borr.classList.add("vis");
});

cerr.addEventListener("click", () => {
    nav.classList.remove("vis");
    borr.classList.remove("vis");
});

// Modo oscuro
function aplicarModoOscuro() {
    const isDarkMode = localStorage.getItem("modoOscuro") === "true";

    if (isDarkMode) {
        contc.classList.add("contc-obs");
        circ.classList.add("circ-obs");
        body.classList.add("mobs");



        const elements = [opmenu, inp, agregar, limtpm, Ahorro, Inversión, Despensa, Osio, Salidas];
        elements.forEach(el => {
            if (el) el.classList.add("tmobs");
        });

        modo.textContent = "Dark";
    } else {
        contc.classList.remove("contc-obs");
        circ.classList.remove("circ-obs");
        body.classList.remove("mobs");

        const elements = [opmenu, inp, agregar, limtpm, Ahorro, Inversión, Despensa, Osio, Salidas];
        elements.forEach(el => {
            if (el) el.classList.remove("tmobs");
        });

        modo.textContent = "Light";
    }
    actualizarValores(); // Actualizar valores después de cambiar el tema
}

document.addEventListener("DOMContentLoaded", aplicarModoOscuro);

contc.addEventListener("click", () => {
    const isDarkMode = circ.classList.toggle("circ-obs");
    contc.classList.toggle("contc-obs");
    body.classList.toggle("mobs");

    const elements = [opmenu, inp, agregar, limtpm, Ahorro, Inversión, Despensa, Osio, Salidas];
    elements.forEach(el => {
        if (el) el.classList.toggle("tmobs");
    });

    modo.textContent = isDarkMode ? "Dark" : "Light";
    localStorage.setItem("modoOscuro", isDarkMode);

    actualizarValores(); // Actualizar valores después de cambiar el tema
});

// Función para actualizar valores
function actualizarValores() {
    const sueldo = parseFloat(inp.value.replace(/[^0-9]/g, "")) || 0;
    const cantidadSpans = document.querySelectorAll('.cantidad');

    cantidadSpans.forEach(span => {
        const key = span.id;
        const porcentaje = parseFloat(localStorage.getItem(`${key}_cantidad`)) || 0;
        const cantidadCalculada = Math.round((sueldo * porcentaje) / 100);
        span.textContent = `$${cantidadCalculada.toLocaleString("en-US")}`;
    });

    if (limtpm) {
        limtpm.textContent = `$${Math.round(sueldo * 0.30).toLocaleString("en-US")}`;
    }
}

inp.addEventListener("input", () => {
    let rawValue = inp.value.replace(/[^0-9]/g, "");
    let sueldo = parseFloat(rawValue) || 0;
    inp.value = `$${sueldo.toLocaleString("en-US")}`;
    actualizarValores();
});

// Apartados
const apartados = {
    Ahorro: document.getElementById("Ahorro"),
    Inversión: document.getElementById("Inversión"),
    Despensa: document.getElementById("Despensa"),
    Osio: document.getElementById("Osio"),
    Salidas: document.getElementById("Salidas"),
};

window.addEventListener("DOMContentLoaded", () => {
    Object.keys(apartados).forEach((key) => {
        let titulo = localStorage.getItem(`${key}_titulo`) || key;
        let cantidad = localStorage.getItem(`${key}_cantidad`) || "0";
        document.getElementById(`${key}`).nextElementSibling.textContent = `${titulo}: ${cantidad}%`;
    });
    actualizarValores(); // Actualizar valores al cargar la página
});

Object.keys(apartados).forEach((key) => {
    apartados[key].parentElement.addEventListener("click", () => {
        currentKey = key;
        inpTitcam.value = localStorage.getItem(`${key}_titulo`) || "";
        inpCant.value = localStorage.getItem(`${key}_cantidad`) || "";
        overlay.classList.add("active");
    });
});

btnmdce.addEventListener("click", () => {
    let titulo = inpTitcam.value.trim();
    let cantidad = inpCant.value.trim();
    if (titulo && cantidad) {
        localStorage.setItem(`${currentKey}_titulo`, titulo);
        localStorage.setItem(`${currentKey}_cantidad`, cantidad);
        
        const apartado = document.getElementById(currentKey)?.parentElement;
        if (apartado) {
            const textoElemento = apartado.querySelector('.catPor');
            if (textoElemento) {
                textoElemento.textContent = `${titulo}: ${cantidad}%`;
            }
        }
        actualizarValores();
    }
    overlay.classList.remove("active");
});


// Agregar apartados
function guardarApartadoEnLocalStorage(id) {
    localStorage.setItem(`apartados_${id}`, "true");
    localStorage.setItem(`${id}_titulo`, "Nuevo");
    localStorage.setItem(`${id}_cantidad`, "0");
}

function cargarApartadosGuardados(secap) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("apartados_")) {
            const id = key.substring("apartados_".length);
            crearApartado(secap, id);
        }
    }
}
//Crear
function crearApartado(secap, id) {
    const isDarkMode = localStorage.getItem("modoOscuro") == "true";

    let contenidoHTML = `
    <div id="${id}" class="cantidad ${isDarkMode ? 'tmobs' : ''}">$0</div>
    <div class="catPor">Nuevo: 0%</div>`;

    const nuevoApartado = document.createElement("div");
    nuevoApartado.classList.add("apartado");
    nuevoApartado.innerHTML = contenidoHTML;

    secap.appendChild(nuevoApartado);

    const nuevoSpan = nuevoApartado.querySelector(`#${id}`);
    const nuevoParrafo = nuevoApartado.querySelector('.catPor');

    const tituloGuardado = localStorage.getItem(`${id}_titulo`) || "Nuevo";
    const cantidadGuardada = localStorage.getItem(`${id}_cantidad`) || "0";

    nuevoParrafo.textContent = `${tituloGuardado}: ${cantidadGuardada}%`;

    nuevoApartado.addEventListener("click", () => {
        currentKey = id;
        inpTitcam.value = tituloGuardado;
        inpCant.value = cantidadGuardada;
        overlay.classList.add("active");
    });

    actualizarValores(); // Actualizar valores al crear un nuevo apartado
}

document.addEventListener("DOMContentLoaded", () => {
    const secap = document.getElementById("secap");
    const agregar = document.getElementById("agregar");

    if (!secap) {
        console.error("El contenedor de apartados no existe en el DOM.");
        return;
    }

    cargarApartadosGuardados(secap);

    agregar.addEventListener("click", () => {
        const id = `apartado${Date.now()}`;
        guardarApartadoEnLocalStorage(id);
        crearApartado(secap, id);
    });
});

// Borrar apartado

btnbrr.addEventListener("click", () => {
    if (currentKey) {
        const apartado = document.getElementById(currentKey)?.parentElement;
        if (apartado) {
            apartado.remove();
            localStorage.removeItem(`apartados_${currentKey}`);
            localStorage.removeItem(`${currentKey}_titulo`);
            localStorage.removeItem(`${currentKey}_cantidad`);
        } currentKey = "";
        overlay.classList.remove("active"); // Cierra el modal
    }
});