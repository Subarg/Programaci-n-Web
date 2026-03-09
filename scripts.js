/* SELECCIÓN DE ELEMENTOS DEL DOM */

const signUpButton = document.getElementById('signUp'); // Botón "Registrarse" del panel superpuesto
const signInButton = document.getElementById('signIn'); // Botón "Iniciar Sesión" del panel superpuesto
const container = document.getElementById('container'); // El cuadro blanco principal que contiene todo
const loginForm = document.getElementById('loginForm'); // El formulario completo de Iniciar Sesión (<form>)
const registerForm = document.getElementById('registerForm'); // El formulario completo de Registro (<form>)

/* ANIMACIÓN DE DESLIZAMIENTO DE PANELES*/

// Escuchamos (escucha de eventos) cuando el usuario le da 'click' al botón de Registrarse
signUpButton.addEventListener('click', () => {
    // Al darle clic, le agregamos la clase 'right-panel-active' al contenedor principal.
    // Al agregar esta clase, el CSS detecta el cambio y ejecuta todas las animaciones de transform: translateX().
    container.classList.add('right-panel-active');
});

// Escuchamos cuando el usuario le da 'click' al botón de Iniciar Sesión (para regresar)
signInButton.addEventListener('click', () => {
    // Le quitamos la clase 'right-panel-active' al contenedor.
    // Al quitarla, el CSS revierte las animaciones y todo se desliza de vuelta a la izquierda.
    container.classList.remove('right-panel-active');
});

/* LÓGICA DEL FORMULARIO: INICIAR SESIÓN */

// Escuchamos el evento 'submit' (cuando el usuario le da Enter o clic al botón de enviar del form)
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

/* LÓGICA DEL FORMULARIO: REGISTRO */

// Escuchamos el evento 'submit' del formulario de registro
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