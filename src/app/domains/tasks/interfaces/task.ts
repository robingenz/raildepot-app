export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
