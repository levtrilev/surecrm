import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = 'roles';
const ENDPOINT_role_user = 'role_user';

export async function postNewRole(newRole: RoleType): Promise<number> {
    let { id, ...role } = newRole;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...role }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
    console.log(response.status);
    let location = response.headers.get('Location');
    let newRoleId = location !== null ? location.split("eq.").pop() : "0";
    return newRoleId !== undefined ? +newRoleId : 0;
}

export async function postRoleUsers(newRoleUsers: RoleUsersFullType[]): Promise<void> {
    const roleUsers = newRoleUsers.map(el => { let { id, users, ...roleUserLine } = el; return roleUserLine; });
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([...roleUsers ])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_role_user}`, requestOptions);
    console.log(response.status);
}

export async function putUpdatedRole(role: RoleType): Promise<void> {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...role }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${role.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteRole(id: number): Promise<void> {
    await deleteRoleUsers(id);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export async function deleteRoleUsers(roleId: number): Promise<void> {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_role_user}?role_id=eq.${roleId}`, requestOptions);
    console.log(response.status, response.url);
}
export const rolesQueryDao = async (): Promise<RoleType[]> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(
        `${DOMAIN}/${ENDPOINT}`, requestOptions
    );
    const roles = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return roles;
};

export const roleQueryDao = async (id: number): Promise<RoleType|null> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(
        `${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions
    );
    const role = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    if (role.length === 1) {
        return role[0];
    } else {
        console.log('if (role.length === 1)', 'false');
        return null;
    }
}

export const rolesFullQueryDao = async (): Promise<RoleFullType[]> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?select=*,tenants:tenants!roles_tenant_id_fkey(id,name,blocked)`, requestOptions);
    const roles = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return roles;
};

export const roleUsersQueryDao = async (roleId: number): Promise<RoleUsersType[]> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_role_user}?role_id=eq.${roleId}`, requestOptions);
    const roleUsers = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return roleUsers;
};

export const roleUsersFullQueryDao = async (roleId: number): Promise<RoleUsersFullType[]> => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_role_user}?select=*,users:users(id,name)&role_id=eq.${roleId}`, requestOptions);
    const roleUsers = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return roleUsers;
};