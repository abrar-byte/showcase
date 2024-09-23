export type obj = { [key: string]: any };

// export type Car = {
//   id: number | string;
//   name: string;
//   type: string;
//   featuredImage: string;
//   gasoline: string;
//   steering: string;
//   capacity: number;
//   price: number;
//   originalPrice: number;
//   popular: boolean;
// };

export type CarMediaItem = {
  id: string;
  car_id: string;
  name: string;
  link: string;
  type: string;
  cover: boolean;
};

export type DetailRate = {
  avg: number;
  respondent: number;
};

export type Car = {
  id: string;
  created_at: string;
  garage_id: string;
  plate: string;
  name: string;
  description: string;
  amount: number;
  discount: number;
  gasoline: number;
  capacity: number;
  type: string;
  steering: string;
  active: boolean;
  inactive_at: string | null;
  inactive_reason: string | null;
  can_drop_off: boolean;
  CarMedia?: CarMediaItem[] | any[];
  Favorite?: Favorite[] | [];
  rating?: DetailRate;
};

export type Order = {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  user_id: string;
  car_id: string;
  amount: number;
  discount: number | null;
  total: number;
  payment_id: string | null;
  payment_at: string | null;
  invoice: string | null;
  note: string | null;
  drop_off: boolean;
  drop_location: string;
  rating: number | null;
  review: string | null;
  status: string;
  car?: Car;
  CarMedia?: CarMediaItem[];
};
export type Favorite = {
  id: string;
  created_at: string;
  car_id: string;
  user_id: string;
  car?: Car;

  CarMedia?: CarMediaItem[] | any[];
  Favorite?: Favorite[] | [];
};

export type Selected = {
  capacity: number[];
  type: string[];
  amount: number;
  [key: string]: any; // Allows dynamic key access
};
export type FilterOptionCars = {
  type: 'checkbox' | 'range';
  key: string;
  label: string;
  options: any[];
};

export type CommentType = {
  image: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  message: string;
};
export type Props = {
  params?: obj;
  searchParams?: obj;
};

export type User = {
  fullname: string;
  image: string;
};

export type Review = {
  rating: number;
  review: string;
  review_at: string;
  user: User;
};
