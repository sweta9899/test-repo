import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestions } from "../../services/questionService";
import { getTestById, updateTest } from "../../services/testService";
import type { Question } from "../../types/test.types";
import "./Questions.css";

const Questions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState("");
  const [testName, setTestName] = useState("Test");
  const [testDifficulty, setTestDifficulty] = useState("easy");
  const [testTopics, setTestTopics] = useState<string[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalMarks, setTotalMarks] = useState<number>();
  const [totalTime, setTotalTime] = useState<number>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState<Question["correct_option"] | "">("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    if (!id) {
      setError("Test ID is missing");
      return;
    }

    getTestById(id)
      .then((test) => {
        setSubject(test.subject);
        setTestName(test.name);
        setTestDifficulty(test.difficulty || "easy");
        setTestTopics(test.topics || []);
        setTotalQuestions(test.total_questions ?? 0);
        setTotalMarks(test.total_marks);
        setTotalTime(test.total_time);
      })
      .catch((loadError) => {
        console.error("Failed to load test:", loadError);
        setError("Failed to load test details");
      });
  }, [id]);

  const clearForm = () => {
    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectOption("");
    setExplanation("");
    setDifficulty("easy");
  };

  const handleAddQuestion = () => {
    setError("");
    if (!id || !subject) return setError("Test details are not available");
    if (!question.trim()) return setError("Question is required");
    if (!option1.trim() || !option2.trim() || !option3.trim() || !option4.trim()) return setError("All four options are required");
    if (!correctOption) return setError("Please select the correct option");

    setQuestions((previous) => [...previous, {
      type: "mcq",
      question: question.trim(),
      option1: option1.trim(),
      option2: option2.trim(),
      option3: option3.trim(),
      option4: option4.trim(),
      correct_option: correctOption,
      explanation: explanation.trim(),
      difficulty,
      subject,
      test_id: id,
    }]);
    clearForm();
  };

  const handleContinue = async () => {
    setError("");
    if (!id) return setError("Test ID is missing");
    if (!questions.length) return setError("Please add at least one question");

    try {
      setSaving(true);
      const response = await createQuestions(questions);
      const questionIds = response.data.map((item) => item.id).filter((item): item is string => Boolean(item));
      if (!questionIds.length) throw new Error("Question IDs were not returned by API");
      await updateTest(id, { questions: questionIds, total_questions: questionIds.length });
      navigate(`/tests/${id}/preview`);
    } catch (saveError: any) {
      console.error("Failed to save questions:", saveError);
      setError(saveError?.response?.data?.message || saveError?.message || "Failed to save questions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="question-creation-page">
      <aside className="question-rail">
        <div className="rail-title">Question creation <span>«</span></div>
        <div className="rail-total">Total Questions · {totalQuestions || questions.length}</div>
        <div className="rail-list">
          {Array.from({ length: Math.max(questions.length, Math.min(totalQuestions || 0, 6)) }, (_, index) => {
            const completed = index < questions.length;
            return <button className={`rail-question ${completed ? "completed" : ""} ${index === questions.length ? "selected" : ""}`} key={index} type="button" onClick={() => setError("")}><span>{completed ? "●" : "○"}</span>Question {index + 1}<b>»</b></button>;
          })}
        </div>
      </aside>

      <section className="question-workspace">
        <div className="question-breadcrumb"><span>Test Creation</span><b>/</b><span>Create Test</span><b>/</b><strong>Chapter Wise</strong><button type="button" onClick={handleContinue} disabled={saving}>{saving ? "Saving..." : "Publish"}</button></div>

        <div className="test-summary-card">
          <div className="summary-top"><span className="chapter-pill">Chapter Wise</span><button type="button" className="edit-summary" onClick={() => navigate(`/tests/${id}/edit`)}>✎</button></div>
          <div className="summary-title"><span className="book-icon">◈</span><strong>{testName}</strong><span className="difficulty-pill">◉ {testDifficulty === "hard" ? "Difficult" : testDifficulty.charAt(0).toUpperCase() + testDifficulty.slice(1)}</span></div>
          <div className="summary-details">
            <div><span>Subject</span><b>:</b><strong>{subject || "-"}</strong></div>
            <div><span>Topic</span><b>:</b><em>{testTopics.length ? testTopics.join(", ") : "-"}</em></div>
            <div><span>Sub Topic</span><b>:</b><em>-</em></div>
          </div>
          <div className="summary-stats"><span>◷ {totalTime || 0} Min</span><i /> <span>▣ {totalQuestions || questions.length} Q’s</span><i /> <span>▥ {totalMarks || 0} Marks</span></div>
        </div>

        <div className="question-heading"><h1>Question <strong>{Math.min(questions.length + 1, totalQuestions || questions.length + 1)}</strong>/{totalQuestions || questions.length || 1}</h1><div><button type="button" className="ghost-action" onClick={handleAddQuestion}>＋ MCQ</button><button type="button" className="ghost-action">⇩ CSV</button></div></div>
        {error && <p className="question-error">{error}</p>}

        <button type="button" className="delete-all" onClick={() => setQuestions([])}>♧ Delete All Edits</button>

        <div className="editor-card">
          <div className="editor-toolbar"><i>I</i><b>B</b><u>U</u><s>U</s><span>↗</span><span>■</span><span>≡</span><span>≡</span><span>≡</span><span>≡</span><span>⊞</span><span>≡</span><span>▧</span><span>ƒx</span></div>
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Type here" aria-label="Question text" />
          <button type="button" className="editor-delete" onClick={() => setQuestion("")}>♧</button>
        </div>

        <div className="answer-panel">
          {[ ["Option 1", option1, setOption1], ["Option 2", option2, setOption2], ["Option 3", option3, setOption3], ["Option 4", option4, setOption4] ].map(([label, value, setter]) => <label key={label as string}><span>{label as string}</span><input value={value as string} onChange={(event) => (setter as (value: string) => void)(event.target.value)} /></label>)}
          <label><span>Correct option</span><select value={correctOption} onChange={(event) => setCorrectOption(event.target.value as Question["correct_option"] | "")}><option value="">Choose answer</option><option value="option1">Option 1</option><option value="option2">Option 2</option><option value="option3">Option 3</option><option value="option4">Option 4</option></select></label>
          <label><span>Explanation</span><input value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Optional" /></label>
          <button type="button" className="add-question" onClick={handleAddQuestion}>＋ Add Question</button>
        </div>
      </section>
    </main>
  );
};

export default Questions;