export interface Question {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id?: string;
  title: string;
  creatorId: string;
  creatorName?: string;
  questions: Question[];
  createdAt: any; // Firestore Timestamp
  isPublic?: boolean;
}
