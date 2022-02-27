const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImNybV91c2VyIn0.Gbw2YATAjD8E8hXxaT3sLbo2IgPibpNbVUg1sX0imvc';
const DOMAIN = 'http://95.165.6.202:3000';

export async function postNewCustomer(newCustomer: CustomerType) {
    let { id, ...customer } = newCustomer; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...customer }])
    };
    // console.log(requestOptions);
    const response = await fetch(`${DOMAIN}/customers`, requestOptions);
    console.log(response.status);
}

export async function deleteCustomer(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/customers?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export async function putUpdatedCustomer(customer: CustomerType) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...customer }])
    };
    const response = await fetch(`${DOMAIN}/customers?id=eq.${customer.id}`, requestOptions);
    console.log(response.status);
}

export const customersQueryDao = async () => {
    const response = await fetch(
        `${DOMAIN}/customers`
      );
      const customers = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      return customers;
  };

export const customerQueryDao = async (id: number) => {
    const response = await fetch(
        `${DOMAIN}/customers?id=eq.${id}`
      );
      const customer = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      if (customer.length === 1) {
        return customer[0];
      } else {
        console.log('if (customer.length === 1)', 'false');
        return null;
      }
};

export const customersFullQueryDao = async () => {
  const response = await fetch(`${DOMAIN}/customers?select=*,customer_categories(id,name)`);
  const customers = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return customers;
};

// export const customerFullQueryDao = async (id: number) => {
//   const response = await fetch(`${DOMAIN}/select=*,customer_categories(id,name)&id=eq.${id}`);
//   const customer = await response.json();
//   if (response.status !== 200) {
//     console.log(`Bad HTTP request status ${response.status}`);
//   }
//   if (customer.length === 1) {
//     return customer[0];
//   } else {
//     console.log("if (customer.length === 1)", "false");
//     return null;
//   }
// };
