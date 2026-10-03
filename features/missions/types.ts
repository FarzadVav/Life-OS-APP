export type MissionAction = {
  id: number;
  title: string;
  deadline: string;
  isDone: boolean;
};

export type MissionDiscipline = {
  id: number;
  title: string;
  repeatInterval: string;
};

export type Mission = {
  id: number;
  title: string;
  deadline: string;
  difficulty: number;
  actions: MissionAction[];
  disciplines: MissionDiscipline[];
};