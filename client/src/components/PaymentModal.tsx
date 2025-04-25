
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CoffeeProduct } from "@/data/coffeeProducts";
import { isValidKenyanPhone } from "@/lib/validators";
import { initiatePayment } from "@/lib/api";
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
  
  // Reset state when modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setPhoneNumber("");
      setPhoneError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setPhoneError("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
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
      
      if (result.success) {
        toast.success("M-PESA payment initiated! Please check your phone.");
        onClose();
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-coffee">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter your Safaricom number (07XXXXXXXX)"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
