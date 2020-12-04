export interface OmnisNetwork {
  id: number;
  name: string;
  ipv4: string;
  ipv4_mask: number;
  is_dmz: boolean;
  has_wifi: boolean;
  perimeter_id: number;
}
