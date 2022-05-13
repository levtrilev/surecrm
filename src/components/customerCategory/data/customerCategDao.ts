import { DOMAIN } from "../../../shared/appConsts";
import { tokenState } from "../../auth/signInState";
import { getRecoil } from "recoil-nexus";
const ENDPOINT = "customer_categories";

export async function postNewCustomerCateg(
  newCustomerCateg: CustomerCategoryType
): Promise<number> {
  const token: string = getRecoil(tokenState);
  let { id, ...customerCateg } = newCustomerCateg;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Prefer': 'return=representation',
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify([{ ...customerCateg }]),
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newСustomerCategId = location !== null ? location.split("eq.").pop() : "0";
  return newСustomerCategId !== undefined ? +newСustomerCategId : 0;
}

export async function putUpdatedCustomerCateg(
  customerCateg: CustomerCategoryType
): Promise<void> {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify([{ ...customerCateg }]),
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${customerCateg.id}`,
    requestOptions
  );
  console.log(response.status);
}

export async function deleteCustomerCateg(id: number): Promise<void> {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${id}`,
    requestOptions
  );
  console.log(response.status, response.url);
}

export const custCategsQueryDao = async (): Promise<CustomerCategoryType[]> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  const categories = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return categories;
};

export const custCategQueryDao = async (id: number): Promise<CustomerCategoryType|null> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${id}`,
    requestOptions
  );
  const customer_category = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  if (customer_category.length === 1) {
    return customer_category[0];
  } else {
    console.log("if (customer_category.length === 1)", "false");
    return null;
  }
};
