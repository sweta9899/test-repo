export interface Test {
  id: string;
  name: string;
  subject: string;

  topics: string[];

  questions: string[];

  status: string;

  created_at: string;

  type?: string;
  sub_topics?: string[];
  difficulty?: string;

  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;

  total_time?: number;
  total_marks?: number;
  total_questions?: number;
}

export interface TestsResponse {
  success: boolean;
  data: Test[];
  message?: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface TestFormData {
  name: string;
  subject: string;
  type: string;
  topics: string[];
  sub_topics: string[];
  difficulty: string;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: string;
}

export interface Question {
  id?: string;
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: "option1" | "option2" | "option3" | "option4";
  explanation: string;
  difficulty: string;
  subject: string;
  topic_id?: string;
  sub_topic_id?: string;
  test_id: string;
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
  message?: string;
}