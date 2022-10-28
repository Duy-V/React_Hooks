import { useState, useEffect, createRef } from "react";
import Title from "./components/Title";
import QuestionsBlock from "./components/QuestionsBlock";
import AnswerBlock from "./components/AnswerBlock";
function App() {
  const [quiz, setQuiz] = useState(null);
  const [chosenAnswerItems, setChosenAnswerItems] = useState([]);
  const [unansweredQuestionIds, setUnansweredQuestionIds] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const refs = unansweredQuestionIds?.reduce((acc, id) => {
    acc[id] = createRef();
    return acc;
  }, {});
  const answerRef = createRef();
  console.log(refs);
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/quiz");
      const json = await response.json();
      console.log(json);
      setQuiz(json);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unansweredIds = quiz?.content?.map(({ id }) => id);
    setUnansweredQuestionIds(unansweredIds);
  }, [quiz]);
  useEffect(() => {
    if (chosenAnswerItems.length > 0) {
      if (showAnswer) {
        answerRef.current.scrollIntoView({ behavior: "smooth" });
      }
      if (unansweredQuestionIds.length <= 0 && chosenAnswerItems.length >= 1) {
        //scroll to answer block
        setShowAnswer(true);
      } else {
        //scroll to highest unansweredQuestionId
        const highestId = Math.min(...unansweredQuestionIds);
        refs[highestId].current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [unansweredQuestionIds, showAnswer, chosenAnswerItems, answerRef, refs]);
  console.log(unansweredQuestionIds);
  console.log(quiz?.answers);
  return (
    <div className="App">
      <Title title={quiz?.title} subtitle={quiz?.subtitle} />
      {refs &&
        quiz &&
        quiz?.content.map((contentItem) => (
          <QuestionsBlock
            quizItem={contentItem}
            key={contentItem.id}
            setChosenAnswerItems={setChosenAnswerItems}
            chosenAnswerItems={chosenAnswerItems}
            setUnansweredQuestionIds={setUnansweredQuestionIds}
            unansweredQuestionIds={unansweredQuestionIds}
            ref={refs[contentItem.id]}
          />
        ))}
      {showAnswer && (
        <AnswerBlock
          answerOptions={quiz?.answers}
          chosenAnswers={chosenAnswerItems}
          ref={answerRef}
        />
      )}
    </div>
  );
}

export default App;
