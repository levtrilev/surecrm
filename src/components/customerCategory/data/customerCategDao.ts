import { DOMAIN, TOKEN } from "../../../shared/appConsts";

export async function postNewCustomerCateg(newCustomerCateg: CustomerCategoryType) {
    let { id, ...customerCateg } = newCustomerCateg;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...customerCateg }])
    };
    const response = await fetch(`${DOMAIN}/customer_categories`, requestOptions);
    console.log(response.status);
}

export async function putUpdatedCustomerCateg(customerCateg: CustomerCategoryType) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...customerCateg }])
    };
    const response = await fetch(`${DOMAIN}/customer_categories?id=eq.${customerCateg.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteCustomerCateg(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/customer_categories?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export const custCategsQueryDao = async () => {
    const response = await fetch(
        `${DOMAIN}/customer_categories`
      );
      const categories = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      return categories;
};

export const custCategQueryDao = async (id: number) => {
    const response = await fetch(
        `${DOMAIN}/customer_categories?id=eq.${id}`
      );
      const customer_category = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      if (customer_category.length === 1) {
        return customer_category[0];
      } else {
        console.log('if (customer_category.length === 1)', 'false');
        return null;
      }
}

