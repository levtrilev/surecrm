import { DOMAIN } from "../../shared/appConsts";
import { tokenState, userSectionTenantDefault } from "../auth/signInState";
import { getRecoil } from "recoil-nexus";

const ENDPOINT = "rpc/login";
const view_user_section_tenant_ENDPOINT = "view_user_section_tenant";

export async function postGetToken(
  emailPass: EmailPassType
): Promise<{token: string, message: string}> {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPass),
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  const tokenJson = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
    console.log(tokenJson.message);
  }
  return {"token": tokenJson.token, "message": tokenJson.message};
}

export const userSectionTenantQueryDao = async (): Promise<UserSectionTenantType> => {
  const token: string = getRecoil(tokenState);
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  };
  const response = await fetch(`${DOMAIN}/${view_user_section_tenant_ENDPOINT}`, requestOptions);
  const userSectionTenant: UserSectionTenantType[] = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  if (userSectionTenant.length === 1) {
    return userSectionTenant[0];
  } else {
    console.log('if (userSectionTenant.length === 1)', 'false');
    return userSectionTenantDefault;
  }
};