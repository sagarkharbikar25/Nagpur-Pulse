export interface Ward {
  id: string;
  name: string;
  zone: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}