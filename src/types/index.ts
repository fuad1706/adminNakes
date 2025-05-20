export interface HeroImage {
  _id: string;
  public_id: string;
  url: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotionVideo {
  _id: string;
  public_id?: string;
  url: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  title: string;
  order: number;
  isActive: boolean;
}

export interface FormValues {
  _id?: string;
  title: string;
  order: string;
  isActive: boolean;
  videoFile?: File | null;
  thumbnailFile?: File | null;
}
export interface News {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | { url: string; publicId?: string };
  author: string;
  published: boolean;
  publishedAt: string;
  slug: string;
  categories: string[];
  createdAt: string;
  date?: string;
  updatedAt: string;
}

export type ActiveTab = "hero" | "photography" | "icre8" | "motion" | "news";
export type NotificationType = "success" | "error" | null;

export interface Notification {
  type: NotificationType;
  message: string;
}
