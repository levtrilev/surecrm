import { DOMAIN, TOKEN } from "../../../shared/appConsts";

export async function postNewProdCateg(newProdCateg: ProductCategoryType) {
    let { id, ...prodCateg } = newProdCateg;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...prodCateg }])
    };
    const response = await fetch(`${DOMAIN}/product_categories`, requestOptions);
    console.log(response.status);
}

export async function putUpdatedProdCateg(prodCateg: ProductCategoryType) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...prodCateg }])
    };
    const response = await fetch(`${DOMAIN}/product_categories?id=eq.${prodCateg.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteProdCateg(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/product_categories?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export const prodCategsQueryDao = async () => {
    const response = await fetch(
        `${DOMAIN}/product_categories`
      );
      const categories = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      return categories;
};

export const prodCategQueryDao = async (id: number) => {
    const response = await fetch(
        `${DOMAIN}/product_categories?id=eq.${id}`
      );
      const prod_category = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      if (prod_category.length === 1) {
        return prod_category[0];
      } else {
        console.log('if (prod_category.length === 1)', 'false');
        return null;
      }
}

