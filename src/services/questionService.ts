import api from "./api";

import type {
  Question,
  QuestionsResponse,
} from "../types/test.types";

const getQuestionsStorageKey = (testId: string) =>
  `test-questions-${testId}`;

export const createQuestions = async (
  questions: Question[]
) => {
  const response =
    await api.post<QuestionsResponse>(
      "/questions/bulk",
      {
        questions,
      }
    );

  localStorage.setItem(
    getQuestionsStorageKey(questions[0].test_id),
    JSON.stringify(response.data.data)
  );

  return response.data;
};

export const fetchQuestionsBulk = async (
  questionIds: string[]
): Promise<Question[]> => {
  const response =
    await api.post<QuestionsResponse>(
      "/questions/fetchBulk",
      {
        question_ids: questionIds,
      }
    );

  return response.data.data;
};

export const getQuestionsByTestId = async (
  testId: string
): Promise<Question[]> => {
  try {
    const response =
      await api.get<QuestionsResponse>(
        `/questions/test/${testId}`
      );

    return response.data.data;
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    const storedQuestions = localStorage.getItem(
      getQuestionsStorageKey(testId)
    );

    return storedQuestions
      ? (JSON.parse(storedQuestions) as Question[])
      : [];
  }
};