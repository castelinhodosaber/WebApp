export type Gender = "male" | "female";
export type Role = "teacher" | "student" | "principal" | "guardian";
export type Classes = {
  id: number;
  year: number;
  name: string;
};
export type Person = {
  id?: number;
  personId?: number;
  name: string;
  birthDate: string;
  cpf?: string;
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

export type Bath = {
  id?: number;
  date: string;
  student?: Person;
  studentId?: number;
  status: boolean;
};

export const BATHROOM_ACTIONS = ["PEE", "POOP"] as const;

export type BathroomAction = (typeof BATHROOM_ACTIONS)[number];

export const BATHROOM_ACTIONS_DETAILS = ["NORMAL", "HARD", "DIARRHEA"] as const;

export type BathroomActionDetails = (typeof BATHROOM_ACTIONS_DETAILS)[number];

export type Bathroom = {
  id?: number;
  date: string;
  student?: Person;
  studentId?: number;
  amount: number;
  action: BathroomAction;
  actionDetail: BathroomActionDetails;
};

export type Nap = {
  id?: number;
  date: string;
  student?: Person;
  studentId?: number;
  hour: string;
  napTimeMinutes: number;
};

export type Meal = {
  id?: number;
  rating: number;
  date: string;
  student?: Person;
  studentId?: number;
  mealTypeId: number;
  mealType?: MealTypes;
};

export type Attendance = {
  id?: number;
  comments?: string;
  date: string;
  present: boolean;
  student?: Person;
  studentId?: number;
};

export type StudentGuardianRelationship =
  | "grandparent"
  | "parent"
  | "guardian"
  | "stepparent"
  | "uncle";

export type GuardianAnnotation = {
  id?: number;
  date: string;
  description: string;
  student: Person;
  guardian: Person;
  viewers: {
    name: string;
    gender: Gender;
    photo?: string;
    date: string;
    time: string;
  }[];
  relationship: StudentGuardianRelationship;
};

export type Announcement = {
  id?: number;
  date: string;
  description: string;
  title: string;
  photo: string;
  viewers?: {
    name: string;
    gender: Gender;
    photo?: string;
    date: string;
    time: string;
  }[];
};
