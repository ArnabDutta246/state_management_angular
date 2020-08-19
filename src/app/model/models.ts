export interface Products {
  catId: string;
  id: string;
  name: string;
  displayPrice: string;
  price: number;
  prevPrice: number;
  origin: string;
  detailsTitle: string;
  details: string;
  detailsUsesTitle: string;
  detailsUses: string;
  image: string;
  quantity: string;
  preOrderable: boolean;
  bestSeller: boolean;
  limit: number;
  displayLimit: string;
  inStock: boolean;
}

export interface Customize {
  banner: [];
  entrepreneurs: [];
}
export interface Banner {
  sm: string;
  md: string;
  lg: string;
}
export interface Entrep {
  id: string;
  name: string;
  image: string;
  skill: string;
}
