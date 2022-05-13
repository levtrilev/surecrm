import { DOMAIN } from "../../../shared/appConsts";
import { tokenState } from "../../auth/signInState";
import { getRecoil } from "recoil-nexus";

const ENDPOINT = 'view_products';

export async function postNewProduct(newProduct: ProductType): Promise<number> {
  const token: string = getRecoil(tokenState);
  let { id, ...product } = newProduct; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify([{ ...product }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newProductId = location !== null ? location.split("eq.").pop() : "0";
  return newProductId !== undefined ? +newProductId : 0;
}

export async function putUpdatedProduct(product: ProductType): Promise<void> {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify([{ ...product }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${product.id}`, requestOptions);
  console.log(response.status);
}

export async function deleteProduct(id: number): Promise<void> {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
  console.log(response.status, response.url);
}

export const productsQueryDao = async (): Promise<ProductType[]> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
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

export const productsFullQueryDao = async (): Promise<ProductFullType[]> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?select=*,product_categories:view_product_categories(id,name)`, requestOptions);
  const products = await response.json();
  if (response.status !== 200) {
    // throw `Bad HTTP request status ${response.status}`;
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return products;
};

export const productQueryDao = async (id: number): Promise<ProductType|null> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
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
