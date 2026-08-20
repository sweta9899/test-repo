import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTestById,
  publishTest,
} from "../../services/testService";

import {
  getQuestionsByTestId,
} from "../../services/questionService";



import type {
  Test,
  Question,
} from "../../types/test.types";

import "./Preview.css";

const Preview = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [test, setTest] =
    useState<Test | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [publishing, setPublishing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPublish, setShowPublish] = useState(false);
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState("custom");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Test ID is missing");
      setLoading(false);
      return;
    }

    loadPreview(id);
  }, [id]);

  const loadPreview = async (
    testId: string
  ) => {
    try {
      setLoading(true);
      setError("");

      const testData = await getTestById(testId);

      setTest(testData);

      try {
        const questionData =
          await getQuestionsByTestId(testId);

        setQuestions(questionData);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setQuestions([]);
          setError(
            "Test loaded, but the questions preview endpoint is not available."
          );
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error(
        "Failed to load preview:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load test preview"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!id) return;

    try {
      setPublishing(true);
      setError("");

      const response =
        await publishTest(id);

      console.log(
        "Published test:",
        response
      );

      alert(
        "Test published successfully!"
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error(
        "Failed to publish test:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to publish test"
      );
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="preview-page">
        <div className="preview-container">
          <p>Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error && !test) {
    return (
      <div className="preview-page">
        <div className="preview-container">
          <div className="error-message">
            {error}
          </div>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  if (showPublish) {
    return (
      <div className="publish-page">
        <div className="publish-header">
          <span>Test creation</span>
          <button type="button" onClick={() => setShowPublish(false)} aria-label="Close publish view">×</button>
        </div>

        <div className="publish-status-row">
          <strong>Test created</strong>
          <span>● &nbsp; All {questions.length || test.total_questions || 0} Questions done</span>
        </div>

        <div className="publish-summary">
          <div className="publish-summary-top"><span>Chapter Wise</span><button type="button" onClick={() => navigate(`/tests/${id}/edit`)}>✎</button></div>
          <div className="publish-summary-title">◈ <strong>{test.name}</strong><em>◉ {test.difficulty || "Easy"}</em></div>
          <div className="publish-summary-details">
            <p><span>Subject</span><b>:</b>{test.subject}</p>
            <p><span>Topic</span><b>:</b><i>{test.topics?.join("   ") || "-"}</i></p>
            <p><span>Sub Topic</span><b>:</b><i>-</i></p>
          </div>
          <div className="publish-stats"><span>◷ {test.total_time || 0} Min</span><i /> <span>▣ {test.total_questions || questions.length} Q’s</span><i /> <span>▥ {test.total_marks || 0} Marks</span></div>
        </div>

        <div className="publish-tabs">
          <button type="button" className={publishMode === "now" ? "active" : ""} onClick={() => setPublishMode("now")}>Publish Now</button>
          <button type="button" className={publishMode === "schedule" ? "active" : ""} onClick={() => setPublishMode("schedule")}>Schedule Publish</button>
        </div>

        <section className="live-until">
          <h2>Live Until</h2>
          <p>Choose how long this test should remain available on the platform.</p>
          <div className="live-options">
            {[["always", "Always Available"], ["3weeks", "3 Weeks"], ["1week", "1 Week"], ["1month", "1 Month"], ["2weeks", "2 Weeks"], ["custom", "Custom Duration"]].map(([value, label]) => (
              <label key={value}><input type="radio" name="liveUntil" value={value} checked={liveUntil === value} onChange={() => setLiveUntil(value)} /><span>{label}</span></label>
            ))}
          </div>
          {liveUntil === "custom" && <div className="schedule-fields"><label><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} placeholder="Select End Date" /></label><label><input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div>}
        </section>

        {error && <p className="publish-error">{error}</p>}
        <div className="publish-actions"><button type="button" onClick={() => setShowPublish(false)}>Cancel</button><button type="button" className="confirm-publish" onClick={handlePublish} disabled={publishing}>{publishing ? "Publishing..." : "Confirm"}</button></div>
      </div>
    );
  }

  return (
    <div className="preview-page">

      <div className="preview-container">

        {/* Header */}
        <div className="preview-header">

          <div>
            <h1>
              Preview Test
            </h1>

            <p>
              Review your test before publishing.
            </p>
          </div>

          <span className="draft-badge">
            {test.status || "draft"}
          </span>

        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Test Details */}
        <div className="test-details">

          <h2>
            {test.name}
          </h2>

          <div className="details-grid">

            <div>
              <strong>
                Subject
              </strong>

              <p>
                {test.subject}
              </p>
            </div>

            <div>
              <strong>
                Difficulty
              </strong>

              <p>
                {test.difficulty || "-"}
              </p>
            </div>

            <div>
              <strong>
                Total Questions
              </strong>

              <p>
                {questions.length}
              </p>
            </div>

            <div>
              <strong>
                Total Marks
              </strong>

              <p>
                {test.total_marks ?? "-"}
              </p>
            </div>

            <div>
              <strong>
                Duration
              </strong>

              <p>
                {test.total_time
                  ? `${test.total_time} minutes`
                  : "-"}
              </p>
            </div>

          </div>

          {test.topics &&
            test.topics.length > 0 && (
              <div className="topics">
                <strong>
                  Topics
                </strong>

                <div>
                  {test.topics.map(
                    (topic) => (
                      <span
                        key={topic}
                        className="topic-tag"
                      >
                        {topic}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

        </div>

        {/* Questions */}
        <div className="preview-questions">

          <h2>
            Questions
          </h2>

          {questions.length === 0 ? (
            <div className="empty-state">
              No questions found.
            </div>
          ) : (
            questions.map(
              (item, index) => (
                <div
                  className="preview-question"
                  key={
                    item.id ||
                    `${index}-${item.question}`
                  }
                >

                  <h3>
                    Q{index + 1}.{" "}
                    {item.question}
                  </h3>

                  <div className="preview-options">

                    <div>
                      A. {item.option1}
                    </div>

                    <div>
                      B. {item.option2}
                    </div>

                    <div>
                      C. {item.option3}
                    </div>

                    <div>
                      D. {item.option4}
                    </div>

                  </div>

                  <div className="answer-info">

                    <span>
                      Correct Answer:{" "}
                      {item.correct_option}
                    </span>

                    <span>
                      Difficulty:{" "}
                      {item.difficulty}
                    </span>

                  </div>

                  {item.explanation && (
                    <div className="preview-explanation">
                      <strong>
                        Explanation:
                      </strong>{" "}
                      {item.explanation}
                    </div>
                  )}

                </div>
              )
            )
          )}

        </div>

        {/* Footer */}
        <div className="preview-footer">

          <button
            className="back-button"
            onClick={() =>
              navigate(
                `/tests/${id}/questions`
              )
            }
          >
            Back to Questions
          </button>

          <button
            className="publish-button"
            onClick={() => setShowPublish(true)}
            disabled={
              publishing ||
              questions.length === 0
            }
          >
            {publishing
              ? "Publishing..."
              : "Publish Test"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Preview;