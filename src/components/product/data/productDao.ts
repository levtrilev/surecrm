import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = 'view_products';

export async function postNewProduct(newProduct: ProductType) {
  let { id, ...product } = newProduct; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + TOKEN },
    body: JSON.stringify([{ ...product }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newProductId = location !== null ? location.split("eq.").pop() : "0";
  return newProductId !== undefined ? +newProductId : 0;
}
export async function putUpdatedProduct(product: ProductType) {

  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    body: JSON.stringify([{ ...product }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${product.id}`, requestOptions);
  console.log(response.status);
}

export async function deleteProduct(id: number) {
  //if (!yesCancel) return;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  // body: JSON.stringify([{ ...product }])
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
  console.log(response.status, response.url);
}

export const productsQueryDao = async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  const products = await response.json();
  // .then((response) => response.json())
  if (response.status !== 200) {
    // throw `Bad HTTP request status ${response.status}`;
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return products;
};

export const productsFullQueryDao = async () => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?select=*,product_categories:view_product_categories(id,name)`, requestOptions);
  const products = await response.json();
  // .then((response) => response.json())
  if (response.status !== 200) {
    // throw `Bad HTTP request status ${response.status}`;
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return products;
};

export const productQueryDao = async (id: number) => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
  const product = await response.json();
  // .then((response) => response.json())
  if (response.status !== 200) {
    // throw `Bad HTTP request status ${response.status}`;
    console.log(`Bad HTTP request status ${response.status}`);
  }
  if (product.length === 1) {
    return product[0];
  } else {
    console.log("if (product.length === 1)", "false");
    return null;
  }
};
