
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CoffeeProduct } from "@/data/coffeeProducts";
import { isValidKenyanPhone } from "@/lib/validators";
import { initiatePayment , API_BASE_URL} from "@/lib/api";
import { toast } from "sonner";

interface PaymentModalProps {
  product: CoffeeProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ product, isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<null | "pending" | "success" | "failed">(null);
  const [statusMessage, setStatusMessage] = useState("");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber("");
      setPhoneError("");
      setIsSubmitting(false);
      setPaymentStatus(null);
      setStatusMessage("");
    }
    // Clean up polling on close
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setPhoneError("");
  };

  const pollPaymentStatus = (checkoutRequestId: string) => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/status/${checkoutRequestId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "success" || data.status === "failed") {
            setPaymentStatus(data.status);
            setStatusMessage(
              data.status === "success"
                ? "Payment received! Your order is confirmed."
                : "Payment failed. Please try again."
            );
            clearInterval(pollingRef.current!);
          }
        }
      } catch (err) {
        // Optionally handle polling error
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!isValidKenyanPhone(phoneNumber)) {
      setPhoneError("Please enter a valid Safaricom number (e.g., 07XXXXXXXX)");
      return;
    }
    if (!product) return;
    setIsSubmitting(true);
    try {
      const result = await initiatePayment(phoneNumber, product.price);
      if (result.success && result.checkoutRequestId) {
        setPaymentStatus("pending");
        setStatusMessage("Waiting for payment confirmation...");
        pollPaymentStatus(result.checkoutRequestId);
        toast.success("M-PESA payment initiated! Please check your phone.");
      } else {
        toast.error(result.message || "Payment initiation failed");
      }
    } catch (error) {
      toast.error("Failed to process payment. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-coffee">Pay for {product.name}</span>
          </DialogTitle>
          <DialogDescription>
            Enter your M-PESA phone number to make payment of KES {product.price}.
          </DialogDescription>
        </DialogHeader>
        {paymentStatus && (
          <div className={`text-center font-bold my-2 ${paymentStatus === "success" ? "text-green-600" : paymentStatus === "failed" ? "text-red-600" : "text-mpesa"}`}>
            {statusMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-coffee">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter your Safaricom number (07XXXXXXXX)"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isSubmitting || paymentStatus === "pending"}
              className={phoneError ? "border-destructive" : ""}
            />
            {phoneError && (
              <p className="text-sm font-medium text-destructive">{phoneError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Formats accepted: 07XXXXXXXX, +2547XXXXXXXX, or 2547XXXXXXXX
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-mpesa hover:bg-mpesa/90 text-white" 
              disabled={isSubmitting || paymentStatus === "pending"}
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
