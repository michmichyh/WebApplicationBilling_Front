document.addEventListener('DOMContentLoaded', function () {
    // Llamar a la función para cargar los clientes cuando la página esté completamente cargada
    loadCustomers();
});

function loadCustomers() {
    fetch('/Customers/GetAll') // Asegúrate de reemplazar con la ruta correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            renderCustomers(data.data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            // Aquí podrías mostrar un mensaje de error en la vista, si lo deseas
        });
}

function renderCustomers(customers) {
    const container = document.getElementById('customersContainer');
    container.innerHTML = ''; // Limpia el contenedor

    // Crear la tabla y su cabecera
    const table = document.createElement('table');
    table.className = 'customer-table'; // Agrega una clase para estilos
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Pa&iacute;s</th>
            <th>Tel&eacute;fono</th>
        </tr>`;
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${escapeHtml(customer.firstName)}</td>
            <td>${escapeHtml(customer.lastName)}</td>
            <td>${escapeHtml(customer.country)}</td>
            <td>${escapeHtml(customer.phone)}</td>`;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Agregar la tabla al contenedor
    container.appendChild(table);
}

function escapeHtml(text) {
    // Función para prevenir inyección de HTML
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}