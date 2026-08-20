import api from "./api";

import type {
  Test,
  TestsResponse,
  TestFormData,
} from "../types/test.types";

export const getTests = async (): Promise<Test[]> => {
  const response = await api.get<TestsResponse>("/tests");

  return response.data.data;
};

export const getTestById = async (
  testId: string
): Promise<Test> => {
  const response = await api.get<{
    success: boolean;
    data: Test;
  }>(`/tests/${testId}`);

  return response.data.data;
};

export const deleteTest = async (
  testId: string
) => {
  const response = await api.delete(
    `/tests/${testId}`
  );

  return response.data;
};

export const createTest = async (
  data: TestFormData
): Promise<Test> => {
  const response = await api.post<{
    success: boolean;
    data: Test;
    message?: string;
  }>("/tests", data);

  return response.data.data;
};

export const updateTestDetails = async (
  testId: string,
  data: TestFormData
): Promise<Test> => {
  const response = await api.put<{
    success: boolean;
    data: Test;
    message?: string;
  }>(`/tests/${testId}`, data);

  return response.data.data;
};

export const publishTest = async (
  testId: string
) => {
  const response = await api.put<{
    success: boolean;
    data: Test;
    message?: string;
  }>(`/tests/${testId}`, {
    status: "live",
  });

  return response.data;
};

export const updateTest = async (
  testId: string,
  data: {
    questions: string[];
    total_questions: number;
    total_marks?: number;
  }
) => {
  const response = await api.put<{
    success: boolean;
    data: Test;
    message?: string;
  }>(`/tests/${testId}`, data);

  return response.data;
};