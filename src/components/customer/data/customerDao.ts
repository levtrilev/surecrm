import { DOMAIN } from "../../../shared/appConsts";
import { tokenState } from "../../auth/signInState";
import { getRecoil } from "recoil-nexus";

const ENDPOINT = 'customers';
const customer_categories_ENDPOINT = 'customer_categories';

export async function postNewCustomer(newCustomer: CustomerType): Promise<number> {
  const token: string = getRecoil(tokenState);
  let { id, ...customer } = newCustomer; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify([{ ...customer }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newCustomerId = location !== null ? location.split("eq.").pop() : "0";
  return newCustomerId !== undefined ? +newCustomerId : 0;
}

export async function deleteCustomer(id: number): Promise<void> {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
  console.log(response.status, response.url);
}

export async function putUpdatedCustomer(customer: CustomerType): Promise<void> {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify([{ ...customer }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${customer.id}`, requestOptions);
  console.log(response.status);
}

export const customersQueryDao = async (): Promise<CustomerType[]> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  const customers = await response.json() as CustomerType[];
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return customers;
};

export const customerQueryDao = async (id: number): Promise<CustomerType|null> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
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

export const customersFullQueryDao = async (): Promise<CustomerFullType[]> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?select=*,${customer_categories_ENDPOINT}:customer_categories(id,name)`,
    requestOptions
  );
  const customers = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return customers;
};
