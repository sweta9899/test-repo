import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createTest, getTestById, updateTestDetails } from "../../services/testService";

import {
  getSubjects,
  getTopicsBySubject,
  getSubTopicsByTopics,
} from "../../services/metadataService";

import type {
  Subject,
  Topic,
  SubTopic,
  TestFormData,
} from "../../types/test.types";
import "./TestForm.css";

const TestForm = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loadingSubjects, setLoadingSubjects] =
    useState(false);

  const [loadingTopics, setLoadingTopics] =
    useState(false);

  const [loadingSubTopics, setLoadingSubTopics] =
    useState(false);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
  } = useForm<TestFormData>({
    defaultValues: {
      name: "",
      subject: "",
      type: "chapterwise",
      topics: [],
      sub_topics: [],
      difficulty: "",
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_time: 60,
      total_marks: 250,
      total_questions: 1,
    },
  });

  const selectedSubject = watch("subject");
  const selectedTopicsValue = watch("topics");
  const selectedTopics = Array.isArray(selectedTopicsValue)
    ? selectedTopicsValue
    : selectedTopicsValue
      ? [selectedTopicsValue]
      : [];

  useEffect(() => {
    if (!id) return;

    getTestById(id)
      .then((test) => {
        reset({
          name: test.name,
          subject: test.subject,
          type: test.type || "chapterwise",
          topics: test.topics || [],
          sub_topics: test.sub_topics || [],
          difficulty: test.difficulty || "easy",
          correct_marks: test.correct_marks ?? 4,
          wrong_marks: test.wrong_marks ?? -1,
          unattempt_marks: test.unattempt_marks ?? 0,
          total_time: test.total_time ?? 60,
          total_marks: test.total_marks ?? 250,
          total_questions: test.total_questions ?? 1,
        });
      })
      .catch((loadError) => {
        console.error("Failed to load test:", loadError);
        setError("Failed to load test details");
      });
  }, [id, reset]);

  // 1. Load subjects
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);

        const data = await getSubjects();

        setSubjects(data);
      } catch (error) {
        console.error(
          "Failed to load subjects:",
          error
        );
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // 2. Load topics when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setTopics([]);
      setSubTopics([]);

      setValue("topics", []);
      setValue("sub_topics", []);

      return;
    }

    const loadTopics = async () => {
      try {
        setLoadingTopics(true);

        const data =
          await getTopicsBySubject(
            selectedSubject
          );

        setTopics(data);

        setSubTopics([]);

        setValue("topics", []);
        setValue("sub_topics", []);
      } catch (error) {
        console.error(
          "Failed to load topics:",
          error
        );
      } finally {
        setLoadingTopics(false);
      }
    };

    loadTopics();
  }, [selectedSubject, setValue]);

  // 3. Load sub-topics when topics change
  useEffect(() => {
    if (!selectedTopics.length) {
      setSubTopics([]);

      setValue("sub_topics", []);

      return;
    }

    const loadSubTopics = async () => {
      try {
        setLoadingSubTopics(true);

        const data =
          await getSubTopicsByTopics(
            selectedTopics
          );

        setSubTopics(data);

        setValue("sub_topics", []);
      } catch (error) {
        console.error(
          "Failed to load sub-topics:",
          error
        );
      } finally {
        setLoadingSubTopics(false);
      }
    };

    loadSubTopics();
  }, [selectedTopics, setValue]);



const onSubmit = async (data: TestFormData) => {
  try {
    setSaving(true);
    setError("");

    if (isEditMode && id) {
      await updateTestDetails(id, data);
      navigate(`/tests/${id}/questions`);
    } else {
      const createdTest = await createTest({ ...data, status: "draft" });
      navigate(`/tests/${createdTest.id}/questions`);
    }
  } catch (error: any) {
    console.error("Create test failed:", error);

    setError(error.response?.data?.message || "Failed to save test");
  } finally {
    setSaving(false);
  }
};

  return (
    <main className={`test-form-page ${isEditMode ? "edit-test-page" : ""}`}>
      <div className="test-form-container">
        {isEditMode && <div className="edit-form-title">Edit Test creation <button type="button" onClick={() => navigate(-1)} aria-label="Close">×</button></div>}
        {!isEditMode && <div className="test-form-breadcrumb">
          <span>Test Creation</span><b>/</b><span>Create Test</span><b>/</b><strong>Chapter Wise</strong>
        </div>}

        <div className="test-type-tabs" role="tablist" aria-label="Test type">
          <button className={watch("type") === "chapterwise" ? "active" : ""} type="button" onClick={() => setValue("type", "chapterwise")}>Chapterwise</button>
          <button className={watch("type") === "pyq" ? "active" : ""} type="button" onClick={() => setValue("type", "pyq")}>PYQ</button>
          <button className={watch("type") === "mock" ? "active" : ""} type="button" onClick={() => setValue("type", "mock")}>Mock Test</button>
        </div>

        <form className="test-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("type", { required: "Test type is required" })} />

          <div className="form-field">
            <label htmlFor="subject">Subject</label>
            <select id="subject" {...register("subject")}>
              <option value="">{loadingSubjects ? "Loading subjects..." : "Choose from Drop-down"}</option>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="name">Name of Test</label>
            <input id="name" {...register("name", { required: true })} placeholder="Enter name of Test" />
          </div>

          <div className="form-field">
            <label htmlFor="topics">Topic</label>
            <select
              id="topics"
              {...register("topics", {
                setValueAs: (value) =>
                  Array.isArray(value)
                    ? value
                    : value
                      ? [value]
                      : [],
              })}
              disabled={!selectedSubject || loadingTopics}
            >
              <option value="">{loadingTopics ? "Loading topics..." : "Choose from Drop-down"}</option>
              {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="sub_topics">Sub Topic</label>
            <select
              id="sub_topics"
              {...register("sub_topics", {
                setValueAs: (value) =>
                  Array.isArray(value)
                    ? value
                    : value
                      ? [value]
                      : [],
              })}
              disabled={!selectedTopics.length || loadingSubTopics}
            >
              <option value="">{loadingSubTopics ? "Loading sub-topics..." : "Choose from Drop-down"}</option>
              {subTopics.map((subTopic) => <option key={subTopic.id} value={subTopic.id}>{subTopic.name}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="total_time">Duration (Minutes)</label>
            <input id="total_time" type="number" {...register("total_time", { valueAsNumber: true })} placeholder="Enter the time" />
          </div>

          <fieldset className="difficulty-field">
            <legend>Test Difficulty Level</legend>
            {[
              ["easy", "Easy"],
              ["medium", "Medium"],
              ["hard", "Difficult"],
            ].map(([value, label]) => (
              <label key={value} className="radio-option">
                <input type="radio" value={value} {...register("difficulty")} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

          <div className="marking-scheme">
            <h2>Marking Scheme:</h2>
            <div className="marking-grid">
              <div className="form-field"><label htmlFor="wrong_marks">Wrong Answer</label><input id="wrong_marks" type="number" {...register("wrong_marks", { valueAsNumber: true })} /></div>
              <div className="form-field"><label htmlFor="unattempt_marks">Unattempted</label><input id="unattempt_marks" type="number" {...register("unattempt_marks", { valueAsNumber: true })} /></div>
              <div className="form-field"><label htmlFor="correct_marks">Correct Answer</label><input id="correct_marks" type="number" {...register("correct_marks", { valueAsNumber: true })} /></div>
              <div className="form-field"><label htmlFor="total_questions">No of Questions</label><input id="total_questions" type="number" min="1" step="1" {...register("total_questions", { valueAsNumber: true, required: true, min: 1, validate: (value) => Number.isInteger(value) })} placeholder="Ex:250 Marks" /></div>
              <div className="form-field"><label htmlFor="total_marks">Total Marks</label><input id="total_marks" type="number" {...register("total_marks", { valueAsNumber: true })} placeholder="Ex:250 Marks" /></div>
            </div>
          </div>

          {error && <p className="api-error">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                if (isEditMode) {
                  navigate(-1);
                } else {
                  navigate("/dashboard");
                }
              }}
            >
              Cancel
            </button>
            <button type="submit" className="next-button" disabled={saving}>{saving ? "Saving..." : isEditMode ? "Save" : "Next"}</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TestForm;