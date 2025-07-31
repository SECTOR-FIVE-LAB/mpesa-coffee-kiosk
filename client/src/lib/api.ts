
import axios from "axios";
import { formatPhoneForApi } from "./validators";

//const API_BASE_URL = "http://localhost:3000";
export const API_BASE_URL = "http://localhost:3000";

interface PaymentRequest {
  phone: string;
  amount: number;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Initiates M-PESA STK Push payment
 * 
 * @param phone The customer's phone number
 * @param amount The amount to charge in KES
 * @returns Promise with payment response
 */
export async function initiatePayment(phone, amount) {
  try {
    const formattedPhone = formatPhoneForApi(phone);
    const res = await fetch(`${API_BASE_URL}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formattedPhone, amount }),
    });
    const data = await res.json();
    if (res.ok && data.CheckoutRequestID) {
      return { success: true, checkoutRequestId: data.CheckoutRequestID };
    }
    return { success: false, message: data.error || 'Failed to initiate payment' };
  } catch (error) {
    return { success: false, message: error.message || 'Network error' };
  }
}

export async function register(username, password) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}
