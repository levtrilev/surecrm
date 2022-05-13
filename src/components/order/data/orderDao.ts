import { DOMAIN } from "../../../shared/appConsts";
import { tokenState } from "../../auth/signInState";
import { getRecoil } from "recoil-nexus";
const ENDPOINT = 'orders';
const ENDPOINT_view_order_products = 'order_products';

export async function postNewOrder(newOrder: OrderType): Promise<number> {
    const token: string = getRecoil(tokenState);
    let { id, date, ...order } = newOrder; // look at https://stackoverflow.com/questions/34698905/how-can-i-clone-a-javascript-object-except-for-one-key

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify([{ ...order }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}`, requestOptions);
    console.log(response.status);
    let location = response.headers.get('Location');
    let newOrderId = location !== null ? location.split("eq.").pop() : "0";
    // response.headers.get('Location');
    return newOrderId !== undefined ? +newOrderId : 0;
}

export async function postOrderProducts(newOrderProducts: OrderProductsFullType[]): Promise<void> {
    const token: string = getRecoil(tokenState);
    const orderProducts = newOrderProducts.map(el => { let { id, products, ...orderProductLine } = el; return orderProductLine; });
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify([...orderProducts ])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_view_order_products}`, requestOptions);
    console.log(response.status);
}

export async function putUpdatedOrder(order: OrderType): Promise<void> {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify([{ ...order }])
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${order.id}`, requestOptions);
    console.log(response.status);
}

export async function deleteOrder(id: number): Promise<void> {

    const token: string = getRecoil(tokenState);
    await deleteOrderProducts(id);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?id=eq.${id}`, requestOptions);
    console.log(response.status, response.url);
}

export async function deleteOrderProducts(orderId: number): Promise<void> {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_view_order_products}?order_id=eq.${orderId}`, requestOptions);
    console.log(response.status, response.url);
}
export const ordersQueryDao = async (): Promise<OrderType[]> => {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    };
    const response = await fetch(
        `${DOMAIN}/${ENDPOINT}`, requestOptions
    );
    const orders = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return orders;
};

export const orderQueryDao = async (id: number): Promise<OrderType|null> => {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
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

export const ordersFullQueryDao = async (): Promise<OrderFullType[]> => {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT}?select=*,customers:view_customers(id,name)`, requestOptions);
    const orders = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return orders;
};

export const orderProductsQueryDao = async (orderId: number): Promise<OrderProductsType[]> => {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    };
    const response = await fetch(`${DOMAIN}/${ENDPOINT_view_order_products}?order_id=eq.${orderId}`, requestOptions);
    const orderProducts = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return orderProducts;
};

export const orderProductsFullQueryDao = async (orderId: number): Promise<OrderProductsFullType[]> => {

    const token: string = getRecoil(tokenState);
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    };
    const response = await fetch(`${DOMAIN}/view_order_products?select=*,products:view_products(id,name)&order_id=eq.${orderId}`, requestOptions); //,select=*,products:view_products(id,name) == order_id=eq.${orderId}
    const orderProducts = await response.json();
    if (response.status !== 200) {
        console.log(`Bad HTTP request status ${response.status}`);
    }
    return orderProducts;
};