import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = "tenants";

export async function postNewTenant(
  newTenant: TenantType
): Promise<number> {
  let { id, ...tenant } = newTenant;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Prefer': 'return=representation',
      Authorization: "Bearer " + TOKEN,
    },
    body: JSON.stringify([{ ...tenant }]),
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newTenantId = location !== null ? location.split("eq.").pop() : "0";
  return newTenantId !== undefined ? +newTenantId : 0;
}

export async function putUpdatedTenant(
  tenant: TenantType
): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
    body: JSON.stringify([{ ...tenant }]),
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${tenant.id}`,
    requestOptions
  );
  console.log(response.status);
}

export async function deleteTenant(id: number): Promise<void> {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${id}`,
    requestOptions
  );
  console.log(response.status, response.url);
}

export const tenantsQueryDao = async (): Promise<TenantType[]> => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  const tenants = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return tenants;
};

export const tenantQueryDao = async (id: number): Promise<TenantType|null> => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${id}`,
    requestOptions
  );
  const tenant = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  if (tenant.length === 1) {
    return tenant[0];
  } else {
    console.log("if (tenant.length === 1)", "false");
    return null;
  }
};
