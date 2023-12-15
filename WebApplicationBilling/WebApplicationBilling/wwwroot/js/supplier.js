document.addEventListener('DOMContentLoaded', function () {
    loadSuppliers();
});

function loadSuppliers() {
    fetch('/Suppliers/GetAllSuppliers') // Asegúrate de reemplazar con la ruta correcta
        .then(response => response.json())
        .then(data => {
            initializeDataTable(data.data);
        })
        .catch(error => console.error('Error:', error));
}


function initializeDataTable(suppliers) {
    let table = document.getElementById('suppliersTable');
    if (!table) {
        table = document.createElement('table');
        table.id = 'suppliersTable';
        table.className = 'display'; // Clase necesaria para DataTables
        document.getElementById('suppliersContainer').appendChild(table);
    }

    $(table).DataTable({
        responsive: true,
        data: suppliers,
        columns: [
            { title: "ID", data: "id", className: "column-id" },
            { title: "CompanyName", data: "companyName", className: "column-companyName" },
            { title: "ContactName", data: "contactName", className: "column-contactName" },
            { title: "ContactTitle", data: "contactTitle", className: "column-contactTitle" },
            { title: "City", data: "city", className: "column-city" },
            { title: "Country", data: "country", className: "column-country" },
            { title: "Phone", data: "phone", className: "column-phone" },
            { title: "Email", data: "email", className: "column-email" },
            {
                title: "Acciones",
                data: "id",
                render: function (data) {
                    return `<div class="text-center">
                                <a href="/Suppliers/Detail/${data}" class="btn btn-primary"><i class="fa fa-eye"></i></a>
                                <a href="/Suppliers/Edit/${data}" class="btn btn-secondary"><i class="fa fa-edit"></i></a>
                                <a onclick="Delete('/Suppliers/Delete/${data}')" class="btn btn-danger"><i class="fa fa-trash"></i></a>
                            </div>`;
                },
                className: "column-actions"
            }
        ]
    });
}


function Delete(url) {
    Swal.fire({
        title: "¿Está seguro de querer borrar el registro?",
        text: "¡Esta acción no puede ser revertida!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: url,
                success: function (response) {
                    if (response && response.success) {
                        toastr.success(response.message || "Registro eliminado con éxito.");
                        // Recargar DataTables
                        $('suppliersTable').DataTable().clear().destroy();
                        loadSuppliers();
                    } else {
                        toastr.error(response.message || "Ocurrió un error desconocido.");
                    }
                },
                error: function (error) {
                    toastr.error("Error al intentar eliminar el registro.");
                    console.error('Error:', error);
                }
            });
        }
    });
}