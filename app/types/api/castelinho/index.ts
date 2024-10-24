export type FemaleGender = "Female" | "Feminino";
export type MaleGender = "Male" | "Masculino";
export type Gender = FemaleGender | MaleGender;

export type TeacherRole = "Professor" | "Professora" | "Teacher";
export function isTeacherRole(role: string): role is TeacherRole {
  return ["professor", "professora", "teacher"].includes(
    role.toLocaleLowerCase()
  );
}
export type StudentRole = "Student" | "Aluno" | "Aluna";
export type PrincipalRole = "Diretor" | "Diretora" | "Principal";
export type GuardianRole = "Responsável" | "Guardian";
export type Role = TeacherRole | StudentRole | PrincipalRole | GuardianRole;
