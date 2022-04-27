import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = 'view_product_categories';

export async function postNewProdCateg(newProdCateg: ProductCategoryType) {
    let { id, ...prodCateg } = newProdCateg;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...prodCateg }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
    console.log(response.status);
    let location = response.headers.get('Location');
    let newProdCategId = location !== null ? location.split("eq.").pop() : "0";
    return newProdCategId !== undefined ? +newProdCategId : 0;
}

export async function putUpdatedProdCateg(prodCateg: ProductCategoryType) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...prodCateg }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${prodCateg.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteProdCateg(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export const prodCategsQueryDao = async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
    const response = await fetch(
        `${DOMAIN}/${ENDPOINT}`, requestOptions
      );
      const categories = await response.json();
      if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
      }
      return categories;
};

export const prodCategQueryDao = async (id: number) => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
    const response = await fetch(
        `${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions
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

