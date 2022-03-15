import { DOMAIN, TOKEN } from "../../../shared/appConsts";
const ENDPOINT = 'view_orders';

export async function postNewOrder(newOrder: OrderType) {
    let { id, date, ...order } = newOrder; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...order }])
    };
    // console.log(requestOptions);
    const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
    console.log(response.status);
}

export async function putUpdatedOrder(order: OrderType) {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
        body: JSON.stringify([{ ...order }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${order.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteOrder(id: number) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export const ordersQueryDao = async () => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(
        `${DOMAIN}/orders`, requestOptions
    );
    const orders = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return orders;
};

export const orderQueryDao = async (id: number) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(
        `${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions
    );
    const order = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    if (order.length === 1) {
        return order[0];
    } else {
        console.log('if (order.length === 1)', 'false');
        return null;
    }
}

export const ordersFullQueryDao = async () => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?select=*,customers:view_customers(id,name)`, requestOptions);
    const orders = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return orders;
};
