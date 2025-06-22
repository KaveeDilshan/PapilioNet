import React, { useState, useEffect } from "react";
import axios from "axios";

const questions = [
  {
    question: "Which is the largest butterfly in Sri Lanka?",
    options: ["Common Jezebel", "Sri Lankan Birdwing", "Tree Nymph"],
    answer: "Sri Lankan Birdwing"
  },
  {
    question: "Why do butterflies have bright colors?",
    options: ["To attract mates", "To warn predators", "For camouflage"],
    answer: "To warn predators"
  },
  {
    question: "Which butterfly is known for its slow, floating flight?",
    options: ["Blue Mormon", "Tree Nymph", "Tawny Coster"],
    answer: "Tree Nymph"
  },
  {
    question: "Which butterfly has transparent wings?",
    options: ["Glasswing", "Common Rose", "Blue Tiger"],
    answer: "Glasswing"
  },
  {
    question: "How many butterfly species are endemic to Sri Lanka?",
    options: ["10", "23", "45"],
    answer: "23"
  }
];

function Quiz() {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizDone, setQuizDone] = useState(false);

  const handleSubmit = () => {
    if (selected === questions[current].answer) {
      setScore(prev => prev + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
    } else {
      setQuizDone(true);
    }
    setSelected(null);
  };

  useEffect(() => {
    if (quizDone) {
      axios.post("http://localhost:5000/api/quiz-result", {
        score,
        total: questions.length
      })
      .then(res => console.log("Quiz score sent to backend."))
      .catch(err => console.error("Error sending quiz score:", err));
    }
  }, [quizDone]);

  return (
    <section className="text-center py-10 px-4" id="quiz">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">🦋 Test Your Knowledge</h2>

      {!quizDone ? (
        <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg max-w-xl mx-auto transition-all">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {questions[current].question}
          </h3>

          <div className="space-y-3">
            {questions[current].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelected(option)}
                className={`w-full py-2 px-4 rounded-md border text-lg transition-all
                  ${
                    selected === option
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="text-xl font-bold text-green-700 dark:text-green-400 mt-6">
          🎉 Quiz Complete! Your Score: {score} / {questions.length}
        </div>
      )}
    </section>
  );
}

export default Quiz;
