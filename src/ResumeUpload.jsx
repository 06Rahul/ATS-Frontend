import React, { useState } from "react";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8080/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>AI Resume Analyzer</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.result}>
          <h2>Overall Score: {result.overallScore}</h2>
          <h3>ATS Score: {result.atsScore}</h3>

          <h3>Section Scores</h3>
          <ul>
            {Object.entries(result.sectionScores).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>

          <h3>Strengths</h3>
          <ul>
            {result.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h3>Weaknesses</h3>
          <ul>
            {result.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>

          <h3>Improvement Suggestions</h3>
          <ul>
            {result.improvementSuggestions.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Arial",
    textAlign: "center",
  },
  error: {
    color: "red",
  },
  result: {
    textAlign: "left",
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};

export default ResumeUpload;
