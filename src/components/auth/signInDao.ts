import { DOMAIN } from "../../shared/appConsts";
const ENDPOINT = "rpc/login";

export async function postGetToken(
  emailPass: EmailPassType
): Promise<string> {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailPass),
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  const token = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  console.log(token);
  return token.token;
}
