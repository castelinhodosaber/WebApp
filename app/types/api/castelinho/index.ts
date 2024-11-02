export type Gender = "male" | "female";
export type Role = "teacher" | "student" | "principal" | "guardian";
export type Classes = {
  id: number;
  year: number;
  name: string;
};
export type Person = {
  id: number;
  personId: number;
  name: string;
  birthData: string;
  cpf: string;
  createdAt: string;
  gender: Gender;
};
