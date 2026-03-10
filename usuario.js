// ============================================================
// usuario.js — Lógica genérica para todas las preguntas
// Usa data-pista en la imagen principal para la ruta de pista.
// Detecta opciones correctas/incorrectas por clase CSS.
// ============================================================

const imagenPrincipal = document.getElementById("portada_laboratorio");
const botonSalida     = document.getElementsByClassName("salida_boton");
const botonPista      = document.getElementsByClassName("boton_pista");
const botonX          = document.getElementsByClassName("boton_X");
const botonSiguiente  = document.getElementsByClassName("boton_siguiente");
const cartelCorrecto  = document.getElementsByClassName("cartel_correcto");
const cartelIncorrecto = document.getElementsByClassName("cartel_incorrecto");

// Opciones visibles (las que el jugador puede hacer clic)
const opcionA = document.getElementsByClassName("opcion_a");
const opcionB = document.getElementsByClassName("opcion_b");
const opcionC = document.getElementsByClassName("opcion_c");

// Rutas de la pregunta y la pista leídas desde el HTML
const rutaPregunta = imagenPrincipal.src;
const rutaPista    = imagenPrincipal.dataset.pista;

// Función genérica: detecta las imágenes de resultado dentro de un slot
// Busca clases que contengan "_correcto", "_incorrecto" o "_base"
function getSlotImages(slot) {
    const imgs = slot.querySelectorAll("img");
    let correcto   = null;
    let incorrecto = null;
    let base       = null;

    imgs.forEach(img => {
        const classes = img.className;
        if (classes.includes("_correcto"))   correcto   = img;
        else if (classes.includes("_incorrecto")) incorrecto = img;
        else if (classes.includes("_base"))  base       = img;
    });

    return { correcto, incorrecto, base };
}

// Obtener los tres slots de opciones
const slots     = document.querySelectorAll(".slot");
const slotA     = slots[0];
const slotB     = slots[1];
const slotC     = slots[2];

const imgsA = getSlotImages(slotA);
const imgsB = getSlotImages(slotB);
const imgsC = getSlotImages(slotC);

// Estado inicial: ocultar elementos que no se muestran al inicio
botonSiguiente[0].style.display  = "none";
botonX[0].style.display          = "none";
cartelIncorrecto[0].style.display = "none";
cartelCorrecto[0].style.display  = "none";

// Ocultar variantes de resultado de cada slot al inicio
[imgsA, imgsB, imgsC].forEach(({ correcto, incorrecto, base }) => {
    if (correcto)   correcto.style.display   = "none";
    if (incorrecto) incorrecto.style.display = "none";
    if (base)       base.style.display       = "none";
});

// ── BOTÓN PISTA ──────────────────────────────────────────────
botonPista[0].addEventListener("click", function () {
    imagenPrincipal.src = rutaPista;

    botonPista[0].style.display    = "none";
    botonSalida[0].style.display   = "none";
    cartelCorrecto[0].style.display  = "none";
    cartelIncorrecto[0].style.display = "none";

    // Ocultar todas las imágenes de opciones mientras se ve la pista
    [opcionA[0], opcionB[0], opcionC[0]].forEach(op => {
        if (op) op.style.display = "none";
    });
    [imgsA, imgsB, imgsC].forEach(({ correcto, incorrecto, base }) => {
        if (correcto)   correcto.style.display   = "none";
        if (incorrecto) incorrecto.style.display = "none";
        if (base)       base.style.display       = "none";
    });

    botonX[0].style.display = "block";
});

// ── BOTÓN CERRAR PISTA (X) ───────────────────────────────────
botonX[0].addEventListener("click", function () {
    imagenPrincipal.src = rutaPregunta;

    botonPista[0].style.display  = "block";
    botonSalida[0].style.display = "block";
    botonX[0].style.display      = "none";
    cartelIncorrecto[0].style.display = "none";

    // Restaurar opciones originales
    [opcionA[0], opcionB[0], opcionC[0]].forEach(op => {
        if (op) op.style.display = "block";
    });
    [imgsA, imgsB, imgsC].forEach(({ correcto, incorrecto, base }) => {
        if (correcto)   correcto.style.display   = "none";
        if (incorrecto) incorrecto.style.display = "none";
        if (base)       base.style.display       = "none";
    });
});

// ── FUNCIÓN GENÉRICA AL ELEGIR UNA OPCIÓN ───────────────────
// elegida: {correcto, incorrecto, base} — el slot del botón pulsado
// correctaFlag: true si este slot tiene _correcto (es la respuesta correcta)
function handleOpcion(elegidaImgs, esCorrecta, opcionClickeada) {
    // Ocultar los tres botones de opción
    [opcionA[0], opcionB[0], opcionC[0]].forEach(op => {
        if (op) op.style.display = "none";
    });

    // Para cada slot, mostrar la imagen de resultado correspondiente
    [imgsA, imgsB, imgsC].forEach(slotImgs => {
        const { correcto, incorrecto, base } = slotImgs;

        // El slot elegido muestra su variante correcta o incorrecta
        if (slotImgs === elegidaImgs) {
            if (esCorrecta && correcto)   correcto.style.display = "block";
            if (!esCorrecta && incorrecto) incorrecto.style.display = "block";
        } else {
            // Los slots no elegidos: si tienen _correcto lo muestran, si no tienen _correcto
            // muestran su _base (si existe)
            if (correcto) {
                correcto.style.display = "block";  // siempre revelar la correcta
            } else if (base) {
                base.style.display = "block";
            }
        }
    });

    // Mostrar el cartel correspondiente
    if (esCorrecta) {
        cartelCorrecto[0].style.display = "block";
    } else {
        cartelIncorrecto[0].style.display = "block";
        // Si es incorrecto, redireccionar el botón siguiente a la página de error
        const linkSiguiente = botonSiguiente[0].parentElement;
        if (linkSiguiente && linkSiguiente.tagName === "A") {
            linkSiguiente.href = "mensaje_incorrecto.html";
        }
    }

    botonSiguiente[0].style.display = "block";
    opcionClickeada.style.pointerEvents = "none";
}

// ── EVENTOS DE OPCIONES ──────────────────────────────────────
opcionA[0].addEventListener("click", function () {
    const esCorrecta = !!imgsA.correcto;
    handleOpcion(imgsA, esCorrecta, opcionA[0]);
});

opcionB[0].addEventListener("click", function () {
    const esCorrecta = !!imgsB.correcto;
    handleOpcion(imgsB, esCorrecta, opcionB[0]);
});

opcionC[0].addEventListener("click", function () {
    const esCorrecta = !!imgsC.correcto;
    handleOpcion(imgsC, esCorrecta, opcionC[0]);
});
