import requests from "./httpService";

const CustomerServices = {
  getAllCustomers: async ({ searchText = "" }) => {
    return requests.get(`/customer?searchText=${searchText}`);
  },
  getCustomer: async (body) => {
    console.log("execute the path")
    return requests.get('/customer/allcustomer', body);
  },
  addAllCustomers: async (body) => {
    return requests.post("/customer/add/all", body);
  },
  // user create
  createCustomer: async (body) => {
    // console.log("create", body)
    return requests.post(`/customer/addcustomer`, body);
  },

  filterCustomer: async (email) => {
    return requests.post(`/customer/filter/${email}`);
  },

  getCustomerById: async (id) => {
    return requests.get(`/customer/${id}`);
  },

  updateCustomer: async (id, body) => {
    return requests.put(`/customer/${id}`, body);
  },

  deleteCustomer: async (id) => {
    return requests.delete(`/customer/${id}`);
  },
};

export default CustomerServices;
