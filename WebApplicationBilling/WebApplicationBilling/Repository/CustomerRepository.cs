using System.Management.Automation;
using WebApplicationBilling.Models.DTO;
using WebApplicationBilling.Repository.Interfaces;

namespace WebApplicationBilling.Repository
{
    public class CustomerRepository : Repository<CustomerDTO>, ICustomerRepository
    {
        public CustomerRepository(IHttpClientFactory httpClientFactory)
            : base(httpClientFactory)
        {

        }
    }
}