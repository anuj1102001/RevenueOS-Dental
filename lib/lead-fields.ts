export const leadStatuses = [
  "NEW",
  "QUALIFIED",
  "CONSULTATION_REQUESTED",
  "FOLLOW_UP",
  "APPOINTMENT_BOOKED",
  "WON",
  "LOST",
] as const;
export const leadTemperatures = ["HOT", "WARM", "COLD"] as const;
export function label(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (c) => c.toUpperCase());
}
export type LeadView = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  treatment: string;
  preferredTime: string | null;
  source: string;
  temperature: (typeof leadTemperatures)[number];
  status: (typeof leadStatuses)[number];
  consent: boolean;
  notes: string | null;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
};
