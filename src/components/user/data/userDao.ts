import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = 'view_users';

export async function postNewUser(newUser: UserType): Promise<number> {
  let { id, ...user } = newUser; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + TOKEN },
    body: JSON.stringify([{ ...user }])
  };

  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newUserId = location !== null ? location.split("eq.").pop() : "0";
  return newUserId !== undefined ? +newUserId : 0;
}

export async function deleteUser(id: number): Promise<void> {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
  console.log(response.status, response.url);
}

export async function putUpdatedUser(user: UserType): Promise<void> {

  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    body: JSON.stringify([{ ...user }])
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${user.id}`, requestOptions);
  console.log(response.status);
}

export const usersQueryDao = async (): Promise<UserType[]> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  const users = await response.json() as UserType[];
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return users;
};

export const userQueryDao = async (id: number): Promise<UserType|null> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
  const user = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  if (user.length === 1) {
    return user[0];
  } else {
    console.log('if (user.length === 1)', 'false');
    return null;
  }
};

export const usersFullQueryDao = async (): Promise<UserFullType[]> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?select=*,tenants:tenants!users_tenant_id_fkey(id,name,blocked)`,
    requestOptions
  );
  const users = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return users;
};
