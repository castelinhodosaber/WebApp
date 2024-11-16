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
  birthDate: string;
  cpf: string;
  photo?: string;
  createdAt: string;
  gender: Gender;
};

export type MealTypes =
  | "afternoonFruit"
  | "afternoonSnack"
  | "lunch"
  | "milkFeeding"
  | "morningFruit"
  | "morningSnack";

export type MealType = {
  id: number;
  name: MealTypes;
};

export type Nap = {
  id?: number;
  date: string;
  student?: Person;
  studentId: number;
  hour: string;
  napTimeMinutes: number;
};

export type Meal = {
  id?: number;
  rating: number;
  date: string;
  student?: Person;
  studentId: number;
  mealTypeId: number;
  mealType?: MealTypes;
};

export type Attendance = {
  id?: number;
  comments?: string;
  date: string;
  present: boolean;
  student?: Person;
  studentId: number;
};
