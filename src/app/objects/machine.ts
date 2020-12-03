export interface Machine {
  id: number;
  hostname: string;
  label: string;
  description: string;
  is_virtualized: boolean;
  serial_number: string;
  perimeter_id: number;
  location_id: number;
  operating_system_id: number;
  machine_type_id: number;
  omnis_version: string;
}
