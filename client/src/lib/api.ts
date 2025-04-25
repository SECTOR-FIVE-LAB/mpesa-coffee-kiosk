
import axios from "axios";
import { formatPhoneForApi } from "./validators";

const API_BASE_URL = "http://localhost:3000";

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
export const initiatePayment = async (
  phone: string,
  amount: number
): Promise<PaymentResponse> => {
  try {
    // Format the phone number for the API
    const formattedPhone = formatPhoneForApi(phone);
    
    const response = await axios.post<PaymentResponse>(`${API_BASE_URL}/pay`, {
      phone: formattedPhone,
      amount: amount,
    });
    
    return response.data;
  } catch (error) {
    console.error("Payment request failed:", error);
    
    if (axios.isAxiosError(error)) {
      // Handle API errors
      const errorMessage = error.response?.data?.message || 
                          "Failed to connect to payment service";
      
      return {
        success: false,
        message: errorMessage,
      };
    }
    
    // Handle other errors
    return {
      success: false,
      message: "An unexpected error occurred while processing your payment",
    };
  }
};
