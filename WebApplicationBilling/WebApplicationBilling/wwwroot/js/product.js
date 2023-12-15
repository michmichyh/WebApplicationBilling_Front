document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});

function loadProducts() {
    fetch('/Products/GetAllProduct') // Asegúrate de reemplazar con la ruta correcta
        .then(response => response.json())
        .then(data => {
            initializeDataTable(data.data);
        })
        .catch(error => console.error('Error:', error));
}


function initializeDataTable(products) {
    let table = document.getElementById('productsTable');
    if (!table) {
        table = document.createElement('table');
        table.id = 'productsTable';
        table.className = 'display'; // Clase necesaria para DataTables
        document.getElementById('ProductsContainer').appendChild(table);
    }

    $(table).DataTable({
        responsive: true,
        data: products,
        columns: [
            { title: "Id", data: "id", className: "column-Id" },
            { title: "ProductName", data: "productName", className: "column-ProductName" },
            { title: "SupplierId", data: "supplierId", className: "column-SupplierId" },
            { title: "UnitPrice", data: "unitPrice", className: "column-UnitPrice" },
            { title: "Package", data: "package", className: "column-Package" },
            { title: "IsDiscontinued", data: "isDiscontinued", className: "column-IsDiscontinued" },
            {
                title: "Acciones",
                data: "id",
                render: function (data) {
                    return `<div class="text-center">
                                <a href="/Products/Detail/${data}" class="btn btn-primary"><i class="fa fa-eye"></i></a>
                                <a href="/Products/Edit/${data}" class="btn btn-secondary"><i class="fa fa-edit"></i></a>
                                <a onclick="Delete('/Products/Delete/${data}')" class="btn btn-danger"><i class="fa fa-trash"></i></a>
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
                        $('#productsTable').DataTable().clear().destroy();
                        loadProducts();
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