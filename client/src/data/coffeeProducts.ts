export interface CoffeeProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const coffeeProducts: CoffeeProduct[] = [
  {
    id: 1,
    name: "Espresso",
    description: "Strong and bold single shot of pure coffee essence",
    price: 120,
    image: "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?q=80&w=450&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Perfect balance of espresso, steamed milk and foam",
    price: 180,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=450&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Latte",
    description: "Smooth espresso with steamed milk and light foam",
    price: 200,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=450&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Mocha",
    description: "Chocolate-infused espresso topped with steamed milk",
    price: 20,
    image: "https://images.unsplash.com/photo-1579767121724-15aea324fdfb?q=80&w=450&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Cold Brew",
    description: "Smooth, naturally sweet coffee steeped for 12 hours",
    price: 250,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=450&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Americano",
    description: "Espresso diluted with hot water for a milder flavor",
    price: 150,
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=450&auto=format&fit=crop"
  }
];
