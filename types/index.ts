
export interface Tour {
  id: string | number;
  category_id?: number | null;
  category: string;
  subcategory?: string | null;
  name: string;
  slug?: string | null;
  description: string;
  price: number;
  image_url: string;
  duration?: number | null;
  link?: string | null;
  program?: string | null;
  created_at?: string | null;
  is_featured?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  photo_urls?: string[];
  tg_link?: string | null;
  capacity?: number | null;
  telegram_link?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string | null;
}
