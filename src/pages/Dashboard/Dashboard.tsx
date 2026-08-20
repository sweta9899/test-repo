import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTests } from "../../services/testService";
import type { Test } from "../../types/test.types";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTests();

      setTests(data);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load tests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateTest = () => {
    navigate("/tests/create");
  };

  const handleViewTest = (testId: string) => {
    navigate(`/tests/${testId}/preview`);
  };

  const handleEditTest = (testId: string) => {
    navigate(`/tests/${testId}/edit`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-state">
        Loading tests...
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Tests</h1>
          <p>
            Manage your tests and assessments
          </p>
        </div>

        <button
          className="create-test-btn"
          onClick={handleCreateTest}
        >
          + Create New Test
        </button>
      </header>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {!loading && !error && tests.length === 0 && (
        <div className="empty-state">
          <h2>No tests found</h2>

          <p>
            Create your first test to get started.
          </p>

          <button onClick={handleCreateTest}>
            Create New Test
          </button>
        </div>
      )}

      {tests.length > 0 && (
        <div className="test-table-wrapper">
          <table className="test-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>
                    <strong>{test.name}</strong>
                  </td>

                  <td>{test.subject}</td>

                  <td>
                    <span
                      className={`status status-${test.status}`}
                    >
                      {test.status}
                    </span>
                  </td>

                  <td>
                    {formatDate(test.created_at)}
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        onClick={() =>
                          handleViewTest(test.id)
                        }
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleEditTest(test.id)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          alert(
                            "Delete API needs to be verified from the backend."
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;