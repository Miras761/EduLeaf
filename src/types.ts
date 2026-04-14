export interface Question {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id?: string;
  title: string;
  creatorId: string;
  questions: Question[];
  createdAt: any; // Firestore Timestamp
}
