
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CoffeeProduct } from "@/data/coffeeProducts";

interface CoffeeCardProps {
  product: CoffeeProduct;
  onBuy: (product: CoffeeProduct) => void;
}

const CoffeeCard: React.FC<CoffeeCardProps> = ({ product, onBuy }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold text-coffee-dark">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-4 pt-2 flex items-center justify-between">
        <div className="text-lg font-semibold text-coffee">
          KES {product.price}
        </div>
        <Button
          onClick={() => onBuy(product)}
          className="bg-mpesa hover:bg-mpesa/90 text-white"
        >
          Buy with M-PESA
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoffeeCard;
