import api from "./api";

import type {
  Subject,
  Topic,
  SubTopic,
} from "../types/test.types";

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<{
    success: boolean;
    data: Subject[];
  }>("/subjects");

  return response.data.data;
};

export const getTopicsBySubject = async (
  subjectId: string
): Promise<Topic[]> => {
  const response = await api.get<{
    success: boolean;
    data: Topic[];
  }>(`/topics/subject/${subjectId}`);

  return response.data.data;
};

export const getSubTopicsByTopics = async (
  topicIds: string[]
): Promise<SubTopic[]> => {
  const normalizedTopicIds = Array.isArray(topicIds)
    ? topicIds.filter(Boolean)
    : [];

  const response = await api.post<{
    success: boolean;
    data: SubTopic[];
  }>("/sub-topics/multi-topics", {
    topicIds: normalizedTopicIds,
  });

  return response.data.data;
};