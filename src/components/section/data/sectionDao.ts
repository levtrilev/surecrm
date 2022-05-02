import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = "sections";

export async function postNewSection(
  newSection: SectionType
): Promise<number> {
  let { id, ...section } = newSection;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Prefer': 'return=representation',
      Authorization: "Bearer " + TOKEN,
    },
    body: JSON.stringify([{ ...section }]),
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  console.log(response.status);
  let location = response.headers.get('Location');
  let newSectionId = location !== null ? location.split("eq.").pop() : "0";
  return newSectionId !== undefined ? +newSectionId : 0;
}

export async function putUpdatedSection(
  section: SectionType
): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
    body: JSON.stringify([{ ...section }]),
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?id=eq.${section.id}`,
    requestOptions
  );
  console.log(response.status);
}

export async function deleteSection(id: number): Promise<void> {
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

export const sectionsQueryDao = async (): Promise<TenantType[]> => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    },
  };
  const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
  const sections = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return sections;
};

export const sectionQueryDao = async (id: number): Promise<SectionType|null> => {
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
  const section = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  if (section.length === 1) {
    return section[0];
  } else {
    console.log("if (tenant.length === 1)", "false");
    return null;
  }
};

export const sectionsFullQueryDao = async (): Promise<SectionFullType[]> => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
  };
  const response = await fetch(
    `${DOMAIN}/${ENDPOINT}?select=*,tenants:tenants!sections_tenant_id_fkey(id,name,blocked)`,
    requestOptions
  );
  const sections = await response.json();
  if (response.status !== 200) {
    console.log(`Bad HTTP request status ${response.status}`);
  }
  return sections;
};
