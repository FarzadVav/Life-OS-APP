export type SkillCategory = {
  id: number;
  name: string;
};

export type SkillType = string;

export type Skill = {
  id: number;
  title: string;
  content: string;
  type?: SkillType;
  createdAt: string;
};
