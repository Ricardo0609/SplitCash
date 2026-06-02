// ===== CONSTANTES =====
const ICONS = [
    'ti-piggy-bank', 'ti-chart-line', 'ti-shopping-cart', 'ti-home',
    'ti-device-laptop', 'ti-car', 'ti-heart', 'ti-plane',
    'ti-book', 'ti-music', 'ti-basketball', 'ti-coffee'
];

const COLORS = [
    'icon-blue', 'icon-teal', 'icon-amber', 'icon-coral',
    'icon-purple', 'icon-pink', 'icon-green', 'icon-gray'
];

const BAR_COLORS = [
    '#185FA5', '#0F6E56', '#BA7517', '#993C1D',
    '#534AB7', '#993556', '#3B6D11', '#5F5E5A'
];

const DEFAULT_APARTADOS = [
    { id: 'ahorro',    nombre: 'Ahorro',    cantidad: 20, icon: 'ti-piggy-bank',    color: 0 },
    { id: 'inversion', nombre: 'Inversión', cantidad: 20, icon: 'ti-chart-line',    color: 1 },
    { id: 'salidas',   nombre: 'Salidas',   cantidad: 20, icon: 'ti-ticket',        color: 2 },
    { id: 'despensa',  nombre: 'Despensa',  cantidad: 20, icon: 'ti-shopping-cart', color: 3 },
    { id: 'ocio',      nombre: 'Ocio',      cantidad: 20, icon: 'ti-music',         color: 4 },
];

// ===== ESTADO =====
let currentKey = null;
let sueldo = 0;

// ===== PERSISTENCIA =====
function getApartados() {
    try { return JSON.parse(localStorage.getItem('ap_data')) || null; }
    catch { return null; }
}

function setApartados(data) {
    localStorage.setItem('ap_data', JSON.stringify(data));
}

function getSueldo() {
    return parseFloat(localStorage.getItem('ap_sueldo')) || 0;
}

function setSueldo(v) {
    localStorage.setItem('ap_sueldo', v);
}

// ===== HELPERS =====
function totalPct(data) {
    return data.reduce((s, a) => s + (parseFloat(a.cantidad) || 0), 0);
}

function formatMXN(n) {
    return '$' + Math.round(n).toLocaleString('es-MX');
}

// ===== RENDER =====
function renderApartados() {
    const data = getApartados() || DEFAULT_APARTADOS;
    const sec = document.getElementById('secap');
    sec.innerHTML = '';

    const total = totalPct(data);

    data.forEach((ap, i) => {
        const colorIdx = ap.color !== undefined ? ap.color : (i % COLORS.length);
        const pct = parseFloat(ap.cantidad) || 0;
        const monto = sueldo ? Math.round(sueldo * pct / 100) : 0;
        const barColor = BAR_COLORS[colorIdx] || BAR_COLORS[0];
        const barW = total > 0 ? Math.min(100, (pct / total) * 100) : 0;

        const div = document.createElement('div');
        div.className = 'apartado';
        div.dataset.id = ap.id;
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Editar ${ap.nombre}`);

        div.innerHTML = `
            <div class="apartado-inner">
                <div class="apartado-left">
                    <div class="apartado-icon ${COLORS[colorIdx]}">
                        <i class="ti ${ap.icon || 'ti-category'}" aria-hidden="true"></i>
                    </div>
                    <div class="apartado-info">
                        <span class="apartado-nombre">${ap.nombre}</span>
                        <span class="apartado-pct">${pct}% del sueldo</span>
                    </div>
                </div>
                <span class="apartado-cantidad">${formatMXN(monto)}</span>
            </div>
            <div class="apartado-barra">
                <div class="apartado-barra-fill" style="width:${barW}%;background:${barColor}"></div>
            </div>`;

        div.addEventListener('click', () => openModal(ap.id));
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openModal(ap.id); });
        sec.appendChild(div);
    });

    // Actualizar indicador de porcentaje total
    const pctEl = document.getElementById('pctTotal');
    pctEl.textContent = `${total}% de 100%`;
    pctEl.className = 'pct-total ' + (total > 100 ? 'over' : total === 100 ? 'ok' : '');

    // Actualizar conteo de categorías
    document.getElementById('resCat').textContent = data.length;

    actualizarResumen(data, total);
}

function actualizarResumen(data, total) {
    if (!data) data = getApartados() || DEFAULT_APARTADOS;
    if (total === undefined) total = totalPct(data);

    const asignado = sueldo ? Math.round(sueldo * total / 100) : 0;
    const libre = sueldo ? Math.round(sueldo * (100 - total) / 100) : 0;

    document.getElementById('resAsignado').textContent = formatMXN(asignado);
    document.getElementById('resPct').textContent = total + '%';

    const libreEl = document.getElementById('resLibre');
    libreEl.textContent = formatMXN(Math.abs(libre));
    libreEl.className = 'res-val' + (libre < 0 ? ' warn' : '');
}

// ===== MODAL =====
function openModal(id) {
    const data = getApartados() || DEFAULT_APARTADOS;
    const ap = data.find(a => a.id === id);
    if (!ap) return;

    currentKey = id;
    document.getElementById('modalTitle').textContent = 'Editar ' + ap.nombre;
    document.getElementById('inpTitcam').value = ap.nombre;
    document.getElementById('inpCant').value = ap.cantidad;
    updatePctHint();

    document.getElementById('overlay').classList.add('active');
    document.getElementById('inpTitcam').focus();
}

function closeModal() {
    document.getElementById('overlay').classList.remove('active');
    currentKey = null;
}

function updatePctHint() {
    const data = getApartados() || DEFAULT_APARTADOS;
    const val = parseFloat(document.getElementById('inpCant').value) || 0;
    const sinActual = data.filter(a => a.id !== currentKey);
    const total = totalPct(sinActual) + val;
    const hint = document.getElementById('pctHint');

    if (total > 100) {
        hint.textContent = `Total quedaría en ${total}% (excede 100%)`;
        hint.className = 'pct-hint warn';
    } else {
        hint.textContent = `Total asignado: ${total}%`;
        hint.className = 'pct-hint';
    }
}

// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== EVENT LISTENERS =====

// Input de sueldo — formatear con separador de miles
document.getElementById('inp').addEventListener('input', function () {
    const raw = this.value.replace(/[^0-9]/g, '');
    sueldo = parseInt(raw) || 0;
    setSueldo(sueldo);
    // Mostrar formateado pero sin símbolo (más limpio para editar)
    const pos = this.selectionStart;
    this.value = sueldo ? sueldo.toLocaleString('es-MX') : '';
    renderApartados();
});

// Hint en tiempo real al cambiar porcentaje
document.getElementById('inpCant').addEventListener('input', updatePctHint);

// Guardar cambios en modal
document.getElementById('btnmdce').addEventListener('click', () => {
    if (!currentKey) return;

    const nombre = document.getElementById('inpTitcam').value.trim();
    const cantidad = parseFloat(document.getElementById('inpCant').value) || 0;

    if (!nombre) { showToast('Ingresa un nombre'); return; }
    if (cantidad < 0 || cantidad > 100) { showToast('El % debe ser entre 0 y 100'); return; }

    const data = getApartados() || DEFAULT_APARTADOS;
    const idx = data.findIndex(a => a.id === currentKey);
    if (idx >= 0) {
        data[idx].nombre = nombre;
        data[idx].cantidad = cantidad;
    }

    setApartados(data);
    renderApartados();
    closeModal();
    showToast('Guardado ✓');
});

// Eliminar categoría
document.getElementById('btnbrr').addEventListener('click', () => {
    if (!currentKey) return;
    const data = getApartados() || DEFAULT_APARTADOS;
    const filtered = data.filter(a => a.id !== currentKey);
    setApartados(filtered);
    renderApartados();
    closeModal();
    showToast('Categoría eliminada');
});

// Cancelar modal
document.getElementById('btnCancel').addEventListener('click', closeModal);

// Cerrar modal al tocar el fondo
document.getElementById('overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Añadir nueva categoría
document.getElementById('agregar').addEventListener('click', () => {
    const data = getApartados() || DEFAULT_APARTADOS;
    const id = 'ap' + Date.now();
    const colorIdx = data.length % COLORS.length;
    const iconIdx = data.length % ICONS.length;
    const newAp = { id, nombre: 'Nueva', cantidad: 0, icon: ICONS[iconIdx], color: colorIdx };
    data.push(newAp);
    setApartados(data);
    renderApartados();
    setTimeout(() => openModal(id), 80);
});

// Reiniciar datos
document.getElementById('btnReset').addEventListener('click', () => {
    if (confirm('¿Reiniciar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('ap_data');
        localStorage.removeItem('ap_sueldo');
        sueldo = 0;
        document.getElementById('inp').value = '';
        setApartados(DEFAULT_APARTADOS);
        renderApartados();
        showToast('Datos reiniciados');
    }
});

// ===== REGISTRO DE SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registrado:', reg.scope))
            .catch(err => console.warn('SW no registrado:', err));
    });
}

// ===== INIT =====
sueldo = getSueldo();
if (sueldo) {
    document.getElementById('inp').value = sueldo.toLocaleString('es-MX');
}
if (!getApartados()) {
    setApartados(DEFAULT_APARTADOS);
}
renderApartados();
