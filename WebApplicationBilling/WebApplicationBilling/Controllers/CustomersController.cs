using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NuGet.Packaging.Core;
using WebApplicationBilling.Models.DTO;
using WebApplicationBilling.Repository.Interfaces;
using WebApplicationBilling.Utilities;

namespace WebApplicationBilling.Controllers
{
    public class CustomersController : Controller
    {
        private readonly ICustomerRepository _customerRepository;


        public CustomersController(ICustomerRepository customerRepository)
        {
            this._customerRepository = customerRepository;
        }

        [HttpGet]
        // GET: CustomersController
        public ActionResult Index()
        {
            return View(new CustomerDTO() { });
        }


        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                //Llama al repositorio
                var data = await _customerRepository.GetAllAsync(UrlResources.UrlBase + UrlResources.UrlCustomers);
                return Json(new { data });
            }
            catch (Exception ex)
            {
                // Log the exception, handle it, or return an error message as needed
                return StatusCode(500, "Internal Server Error. Please try again later.");
            }
        }

        // GET: CustomersController/Details/5
        public ActionResult Details(int id) //Pendiente. Reto para el aprendiz
        {
            return View();
        }

        // GET: CustomersController/Create
        //Renderiza la vista
        public ActionResult Create()
        {
            return View();
        }

        // POST: CustomersController/Create
        //Captura los datos y los lleva hacia el endpointpasando por el repositorio --> Nube--> DB
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CustomerDTO customer)
        {
            try
            {
                await _customerRepository.PostAsync(UrlResources.UrlBase + UrlResources.UrlCustomers, customer);
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CustomersController/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {

            var customer = new CustomerDTO();

            customer = await _customerRepository.GetByIdAsync(UrlResources.UrlBase + UrlResources.UrlCustomers, id.GetValueOrDefault());
            if (customer == null)
            {
                return NotFound();
            }
            return View(customer);
        }

        // POST: CustomersController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(CustomerDTO customer)
        {
            if (ModelState.IsValid)
            {
                await _customerRepository.UpdateAsync(UrlResources.UrlBase + UrlResources.UrlCustomers + customer.id, customer);
                return RedirectToAction(nameof(Index));
            }

            return View();
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(UrlResources.UrlBase + UrlResources.UrlCustomers, id);
            if (customer == null)
            {
                return Json(new { success = false, message = "Cliente no encontrado." });
            }

            var deleteResult = await _customerRepository.DeleteAsync(UrlResources.UrlBase + UrlResources.UrlCustomers, id);
            if (deleteResult)
            {
                return Json(new { success = true, message = "Cliente eliminado correctamente." });
            }
            else
            {
                return Json(new { success = false, message = "Error al eliminar el cliente." });
            }
        }


    }
}