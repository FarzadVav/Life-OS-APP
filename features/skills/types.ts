export type SkillType =
  | "Lessons"
  | "Playbooks"
  | "Knowledge"
  | "Informations";

export type Skill = {
  id: number;
  title: string;
  content: string;
  type: SkillType;
  level: number;
  createdAt: string;
};
