export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Role {
  id: string;
  name: string;
  title: string;
  responsibility: string;
  tasks: string[];
  color: string;
  avatar: string;
  motto: string;
  specialSkill: string;
  pattern: string;
  stats: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  roleId: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: number;
  deadline?: number;
}
