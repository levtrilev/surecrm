const DOMAIN = 'http://95.165.6.202:3000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImNybV91c2VyIn0.Gbw2YATAjD8E8hXxaT3sLbo2IgPibpNbVUg1sX0imvc';

export async function postNewProduct(newProduct: ProductType) {
    let { id, ...product } = newProduct; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...product }])
    };
    const response = await fetch(`${DOMAIN}/products`, requestOptions);
    console.log(response.status);
    // .then(response => response.json())
    // .then(data => console.log(data.status));
}
export async function putUpdatedProduct(product: ProductType) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...product }])
    };
    const response = await fetch(`${DOMAIN}/products?id=eq.${product.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteProduct(id: number) {
    //if (!yesCancel) return;
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    // body: JSON.stringify([{ ...product }])
    const response = await fetch(`${DOMAIN}/products?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export const productsQueryDao = async () => {
    const response = await fetch(`${DOMAIN}/products`);
    const products = await response.json();
    // .then((response) => response.json())
    if (response.status !== 200) {
      // throw `Bad HTTP request status ${response.status}`;
      console.log(`Bad HTTP request status ${response.status}`);
    }
    return products;
};

export const productsFullQueryDao = async () => {
    const response = await fetch(`${DOMAIN}/products?select=*,product_categories(id,name)`);
    const products = await response.json();
    // .then((response) => response.json())
    if (response.status !== 200) {
      // throw `Bad HTTP request status ${response.status}`;
      console.log(`Bad HTTP request status ${response.status}`);
    }
    return products;
};

export const productQueryDao = async (id: number) => {
    const response = await fetch(`${DOMAIN}/products?id=eq.${id}`);
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

// export const productFullQueryDao = async (id: number) => {
//     const response = await fetch(`${DOMAIN}/select=*,product_categories(id,name)&id=eq.${id}`);
//     const product = await response.json();
//     // .then((response) => response.json())
//     if (response.status !== 200) {
//       // throw `Bad HTTP request status ${response.status}`;
//       console.log(`Bad HTTP request status ${response.status}`);
//     }
//     if (product.length === 1) {
//       return product[0];
//     } else {
//       console.log("if (product.length === 1)", "false");
//       return null;
//     }
// };