import React, { Component } from "react";
import { questionAPI } from "../data";
import Questions from "../components/Questions";
import Result from "../components/Result";
import { Container, Row, Form, Button } from "react-bootstrap";

export default class Quiz extends Component {
  constructor() {
    super();
    this.state = {
      questionBank: [],
      score: 0,
      responses: 0,
      answerObject: {},
      error: {},
      showResult: false,
    };
  }

  // Function to get question from ./question
  getQuestions = () => {
    const AnswerObj = questionAPI.reduce(
      (o, id) => ({ ...o, [id.id]: "" }),
      {}
    );
    const hasError = questionAPI.reduce(
      (o, id) => ({ ...o, [id.id]: false }),
      {}
    );
    this.setState({
      questionBank: questionAPI,
      answerObject: AnswerObj,
      score: 0,
      responses: 0,
      error: hasError,
      showResult: false,
    });

    // questionAPI().then((question) => {
    //   this.setState({ questionBank: question });
    // });
  };

  // Set state back to default and call function
  playAgain = () => {
    this.getQuestions();
  };

  // Function to compute scores
  computeAnswer = (answer, id) => {
    console.log(answer, id);
    const ansObj = { ...this.state.answerObject };
    ansObj[id] = answer;
    this.setState({
      answerObject: ansObj,
    });
  };

  handleSubmit = () => {
    if (Object.values(this.state.answerObject).every((a) => a !== "")) {
      let scoreCount = 0;
      for (let i = 0; i < this.state.questionBank.length; i++) {
        if (
          this.state.questionBank[i].correct ===
          this.state.answerObject[this.state.questionBank[i].id]
        ) {
          scoreCount = scoreCount + 1;
        }
        this.setState({
          score: scoreCount,
          showResult: true,
        });
      }
    } else {
      const errorObj = {};
      Object.keys(this.state.answerObject).forEach((a) => {
        this.state.answerObject[a] === ""
          ? (errorObj[a] = true)
          : (errorObj[a] = false);
      });
      this.setState({
        error: errorObj,
      });
    }
  };
  clearAll = () => {
    this.getQuestions();
  };

  // componentDidMount function to get question
  componentDidMount() {
    this.getQuestions();
  }

  render() {
    const { showResult, questionBank, score, answerObject, error } = this.state;
    return (
      <Container>
        <Row className="justify-center">
          <h3> Quiz </h3>
        </Row>
        <Row>
          {!showResult && (
            <Form>
              {questionBank.length > 0 &&
                questionBank.map((q) => (
                  <Questions
                    question={q.question}
                    options={q.answers}
                    id={q.id}
                    key={q.id}
                    selected={this.computeAnswer}
                    answerObject={answerObject}
                    hasError={error[q.id]}
                  />
                ))}
              <Button onClick={() => this.handleSubmit()}>Submit</Button>
              <Button
                className="m-2"
                variant="success"
                onClick={() => this.clearAll()}
              >
                Clear
              </Button>
            </Form>
          )}
          {showResult && (
            <Result
              score={score}
              total={questionBank.length}
              playAgain={this.playAgain}
            />
          )}
        </Row>
      </Container>
    );
  }
}
