/* SELECCIÓN DE ELEMENTOS DEL DOM */

const signUpButton = document.getElementById('signUp'); // Botón "Registrarse" del panel superpuesto
const signInButton = document.getElementById('signIn'); // Botón "Iniciar Sesión" del panel superpuesto
const container = document.getElementById('container'); // El cuadro blanco principal que contiene todo
const loginForm = document.getElementById('loginForm'); // El formulario completo de Iniciar Sesión (<form>)
const registerForm = document.getElementById('registerForm'); // El formulario completo de Registro (<form>)

const CART_STORAGE_KEY = 'hotelTherianCart';

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(amount);
}

function parseItemAmount(item) {
    if (!item || typeof item !== 'object') return 0;
    if (typeof item.amount === 'number' && Number.isFinite(item.amount)) return item.amount;

    const details = typeof item.details === 'string' ? item.details : '';
    const match = details.match(/\$\s*([\d.,]+)/);
    if (!match) return 0;

    const normalized = match[1].replace(/,/g, '');
    const value = Number.parseFloat(normalized);
    return Number.isFinite(value) ? value : 0;
}

function calculateCartTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + parseItemAmount(item), 0);
    const tax = subtotal * 0.16;
    return {
        subtotal,
        tax,
        total: subtotal + tax
    };
}

function getCartItems() {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function addToCart(item) {
    const items = getCartItems();
    items.push({
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        ...item,
        amount: Number.isFinite(Number(item?.amount)) ? Number(item.amount) : parseItemAmount(item)
    });
    saveCartItems(items);
    renderCart();
}

function clearCart() {
    saveCartItems([]);
    renderCart();
}

function updateCartCounter() {
    const contador = document.getElementById('contador-carrito');
    if (!contador) return;
    contador.textContent = String(getCartItems().length);
}

function renderCart() {
    const lista = document.getElementById('lista-carrito');
    const emptyState = document.getElementById('carrito-vacio');
    if (!lista || !emptyState) {
        updateCartCounter();
        return;
    }

    const items = getCartItems();
    lista.innerHTML = '';

    if (items.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'item-carrito';
        li.innerHTML = `
            <strong>${item.type || 'Servicio'}</strong>
            <span>${item.name || 'Sin nombre'}</span>
            <span>${item.details || ''}</span>
        `;
        lista.appendChild(li);
    });

    updateCartCounter();
}

function openCartPanel() {
    const panel = document.getElementById('panel-carrito');
    const overlay = document.getElementById('overlay-carrito');
    if (!panel || !overlay) return;
    panel.classList.add('abierto');
    panel.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
}

function closeCartPanel() {
    const panel = document.getElementById('panel-carrito');
    const overlay = document.getElementById('overlay-carrito');
    if (!panel || !overlay) return;
    panel.classList.remove('abierto');
    panel.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
}

function setupCartUI() {
    const btnCarrito = document.getElementById('btn-carrito');
    const cerrarCarrito = document.getElementById('cerrar-carrito');
    const overlay = document.getElementById('overlay-carrito');
    const vaciarCarrito = document.getElementById('vaciar-carrito');
    const reservarCarrito = document.getElementById('reservar-carrito');

    if (!btnCarrito) return;

    btnCarrito.addEventListener('click', openCartPanel);
    if (cerrarCarrito) cerrarCarrito.addEventListener('click', closeCartPanel);
    if (overlay) overlay.addEventListener('click', closeCartPanel);
    if (vaciarCarrito) vaciarCarrito.addEventListener('click', clearCart);
    if (reservarCarrito) {
        reservarCarrito.addEventListener('click', () => {
            const total = getCartItems().length;
            if (total === 0) {
                alert('Tu carrito esta vacio. Agrega una reservacion o servicio primero.');
                return;
            }
            window.location.href = 'pago.html';
        });
    }

    renderCart();
}

function setupBookingForm() {
    const bookingForm = document.querySelector('.booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const llegada = document.getElementById('llegada')?.value;
        const salida = document.getElementById('salida')?.value;
        const huespedes = document.getElementById('huespedes')?.value;

        if (!llegada || !salida || !huespedes) {
            alert('Completa todos los campos de la reservacion.');
            return;
        }

        addToCart({
            type: 'Reservacion',
            name: 'Estadia en Hotel Therian',
            details: `Llegada: ${llegada} | Salida: ${salida} | Huespedes: ${huespedes}`,
            amount: 0
        });

        alert('Reservacion agregada al carrito.');
        openCartPanel();
    });
}

window.hotelCart = {
    addItem(item) {
        addToCart(item);
    },
    getItems() {
        return getCartItems();
    },
    clear() {
        clearCart();
    }
};

window.agregarAlCarrito = function(nombre, precio) {
    const amount = Number(precio);
    addToCart({
        type: 'Experiencia',
        name: nombre,
        details: Number.isFinite(amount) ? `Precio estimado: $${amount}` : 'Precio por confirmar',
        amount: Number.isFinite(amount) ? amount : 0
    });
    alert(`${nombre} fue agregado al carrito.`);
    openCartPanel();
};

function setupCheckoutPage() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutEmpty = document.getElementById('checkout-empty');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    const paymentForm = document.getElementById('payment-form');
    const confirmButton = document.getElementById('confirm-payment');

    if (!checkoutItems || !checkoutEmpty || !subtotalElement || !taxElement || !totalElement) return;

    const items = getCartItems();
    checkoutItems.innerHTML = '';

    items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'checkout-item';
        const amount = parseItemAmount(item);
        li.innerHTML = `
            <strong>${item.type || 'Servicio'}: ${item.name || 'Sin nombre'}</strong>
            <span>${item.details || ''}</span>
            <em>${amount > 0 ? formatCurrency(amount) : 'Precio por confirmar'}</em>
        `;
        checkoutItems.appendChild(li);
    });

    checkoutEmpty.style.display = items.length === 0 ? 'block' : 'none';

    const totals = calculateCartTotals(items);
    subtotalElement.textContent = formatCurrency(totals.subtotal);
    taxElement.textContent = formatCurrency(totals.tax);
    totalElement.textContent = formatCurrency(totals.total);

    if (confirmButton) {
        confirmButton.disabled = items.length === 0;
    }

    if (!paymentForm) return;

    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (items.length === 0) {
            alert('No hay elementos en el carrito para procesar pago.');
            return;
        }

        clearCart();
        alert(`Pago confirmado por ${formatCurrency(totals.total)}. Gracias por tu reservacion.`);
        window.location.href = 'Inicio.html';
    });
}

/* ANIMACIÓN DE DESLIZAMIENTO DE PANELES*/

// Escuchamos (escucha de eventos) cuando el usuario le da 'click' al botón de Registrarse
if (signUpButton && container) {
    signUpButton.addEventListener('click', () => {
        // Al darle clic, le agregamos la clase 'right-panel-active' al contenedor principal.
        // Al agregar esta clase, el CSS detecta el cambio y ejecuta todas las animaciones de transform: translateX().
        container.classList.add('right-panel-active');
    });
}

// Escuchamos cuando el usuario le da 'click' al botón de Iniciar Sesión (para regresar)
if (signInButton && container) {
    signInButton.addEventListener('click', () => {
        // Le quitamos la clase 'right-panel-active' al contenedor.
        // Al quitarla, el CSS revierte las animaciones y todo se desliza de vuelta a la izquierda.
        container.classList.remove('right-panel-active');
    });
}

/* LÓGICA DEL FORMULARIO: INICIAR SESIÓN */

// Escuchamos el evento 'submit' (cuando el usuario le da Enter o clic al botón de enviar del form)
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        // e.preventDefault() Evita que la página se recargue por defecto al enviar el formulario.
        // Si no lo ponemos, la página parpadea y perdemos los datos que el usuario escribió.
        e.preventDefault();
        
        // Obtenemos el texto exacto que el usuario escribió en los inputs (.value)
        const userId = document.getElementById('loginId').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validación básica: Si 'userId' Y (&&) 'password' NO están vacíos...
        if (userId && password) {
            // Redirigimos al usuario a la página principal del hotel
            window.location.href = 'Inicio.html';
        }

    });
}

/* LÓGICA DEL FORMULARIO: REGISTRO */

// Escuchamos el evento 'submit' del formulario de registro
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        // Detenemos la recarga automática de la página
        e.preventDefault();
        
        // Extraemos los valores que el usuario escribió en cada input del registro
        const user = document.getElementById('registerUser').value;
        const id = document.getElementById('registerId').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        // Validación básica: Verificamos que absolutamente TODOS los campos tengan texto
        if (user && id && email && password) {
            // Si todo está lleno, simulamos un registro exitoso y lo mandamos a la página principal
            window.location.href = 'Inicio.html';
        }
    });
}

setupCartUI();
setupBookingForm();
setupCheckoutPage();