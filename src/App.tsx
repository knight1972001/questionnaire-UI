import React, { useState, useEffect } from "react";
import "./App.css";
import { getAllQuestions, submitAllAnswer } from "./actions/actionsDB";
import Button from "@mui/material/Button";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

function App() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionIds, setQuestionsIds] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [answersArray, setAnswers] = useState<{ id: number; answer: any }[]>(
    []
  ); // Save answers in { id, answer } format
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [point, setPoint] = useState<number>(0);

  // Temporary answers validation
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]); // Track selected checkboxes
  const [dropdownOptions, setDropdownOptions] = useState<{
    [key: number]: string;
  }>({}); // track menu dropdown options
  const [radioOptions, setRadioOptions] = useState<string>("");
  const [textFieldValue, setTextFieldValue] = useState<string>("");

  // Dropdown matching state
  const [dropdownMatching, setDropdownMatching] = useState<{
    [key: number]: string;
  }>({});

  interface QuestionProps {
    id: number;
    type: "checkbox" | "dropdown" | "radio button" | "text";
    question: string;
    answerOptions?: string[]; // Optional based on type
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      console.log("Fetching Questions");
      const res = await getAllQuestions();

      // Update the state with the questions and answers-options
      if (res !== undefined) {
        // console.log(res[1]);
        setQuestions(res);
        // Extracting ids into an array
        const ids: number[] = res.map((item: QuestionProps) => item.id);
        setQuestionsIds(ids);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    submitAnswer();
  }, [isSubmit]);

  const submitAnswer = async () => {
    if (isSubmit) {
      setIsSubmitting(true);
      const res = await submitAllAnswer(answersArray);
      setIsSubmitting(false);
      setPoint(res.points);
    }
  };

  const saveAnswer = (id: number) => {
    // Save answer before moving to next question
    const currentQuestion = questions.find((question) => question.id === id);
    // Check if the answer with the same id already exists in answersArray
    const existingIndex = answersArray.findIndex((answer) => answer.id === id);

    if (currentQuestion.type === "checkbox") {
      if (existingIndex !== -1) {
        // If answer exists, update it
        const updatedAnswers = [...answersArray];
        updatedAnswers[existingIndex] = {
          id: id,
          answer: selectedCheckboxes,
        };
        setAnswers(updatedAnswers);
      } else {
        // If answer does not exist, push new answer to answersArray
        const newAnswer = {
          id: id,
          answer: selectedCheckboxes,
        };
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      }
    }

    if (currentQuestion.type === "radio button") {
      if (existingIndex !== -1) {
        // If answer exists, update it
        const updatedAnswers = [...answersArray];
        updatedAnswers[existingIndex] = {
          id: id,
          answer: radioOptions,
        };
        setAnswers(updatedAnswers);
      } else {
        // If answer does not exist, push new answer to answersArray
        const newAnswer = {
          id: id,
          answer: radioOptions,
        };
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      }
    }

    if (currentQuestion.type === "dropdown-rank") {
      if (existingIndex !== -1) {
        // If answer exists, update it
        const updatedAnswers = [...answersArray];
        updatedAnswers[existingIndex] = {
          id: id,
          answer: dropdownOptions,
        };
        setAnswers(updatedAnswers);
      } else {
        // If answer does not exist, push new answer to answersArray
        const newAnswer = {
          id: id,
          answer: dropdownOptions,
        };
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      }
    }

    if (currentQuestion.type === "dropdown-matching") {
      if (existingIndex !== -1) {
        // If answer exists, update it
        const updatedAnswers = [...answersArray];
        updatedAnswers[existingIndex] = {
          id: id,
          answer: dropdownMatching,
        };
        setAnswers(updatedAnswers);
      } else {
        // If answer does not exist, push new answer to answersArray
        const newAnswer = {
          id: id,
          answer: dropdownMatching,
        };
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      }
    }

    if (currentQuestion.type === "text") {
      if (existingIndex !== -1) {
        // If answer exists, update it
        const updatedAnswers = [...answersArray];
        updatedAnswers[existingIndex] = {
          id: id,
          answer: textFieldValue,
        };
        setAnswers(updatedAnswers);
      } else {
        // If answer does not exist, push new answer to answersArray
        const newAnswer = {
          id: id,
          answer: textFieldValue,
        };
        setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
      }
    }

    console.log("Go through saved answers");
  };

  const handleNext = (id: number) => {
    // console.log(answersArray);
    saveAnswer(id);
    setCurrentQuestionIndex((prev) => prev + 1);
    loadAnswers("next");
  };

  const handleBack = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
    loadAnswers("back");
  };

  const loadAnswers = (trigger: string) => {
    let loadAnswerID = 0;
    if (trigger === "back") {
      loadAnswerID = currentQuestionIndex - 1;
    }
    if (trigger === "next") {
      loadAnswerID = currentQuestionIndex + 1;
    }

    const QuestionId = questionIds[loadAnswerID];
    const previousAnswer = answersArray.find(
      (answer) => answer.id === QuestionId
    );

    if (previousAnswer) {
      switch (questions[loadAnswerID].type) {
        case "checkbox":
          setSelectedCheckboxes(previousAnswer.answer);
          break;
        case "dropdown-rank":
          setDropdownOptions(previousAnswer.answer);
          break;
        case "radio button":
          setRadioOptions(previousAnswer.answer);
          break;
        case "dropdown-matching":
          setDropdownMatching(previousAnswer.answer);
          break;
        case "text":
          setTextFieldValue(previousAnswer.answer);
          break;
        default:
          break;
      }
    } else {
      resetAllValues();
    }
  };

  const handleDropdownMatchingChange = (leftValue: any, rightValue: any) => {
    console.log(leftValue + " | " + rightValue);

    setDropdownMatching((prevState) => ({
      ...prevState,
      [leftValue]: rightValue,
    }));
  };

  const handleSubmit = async (id: number) => {
    // Logic to handle submission of answers
    saveAnswer(id);
    setIsSubmit(true);
  };

  const handleCheckboxChange = (option: string) => {
    if (selectedCheckboxes.includes(option)) {
      setSelectedCheckboxes((prev) => prev.filter((item) => item !== option));
    } else {
      setSelectedCheckboxes((prev) => [...prev, option]);
    }
  };

  const resetAllValues = () => {
    setSelectedCheckboxes([]);
    setDropdownOptions({});
    setRadioOptions("");
    setTextFieldValue("");
    setDropdownMatching({});
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    setDropdownOptions((prevState) => ({
      ...prevState,
      [optionIndex + 1]: value, // +1 because optionIndex is zero-based
    }));
  };

  const renderQuestion = () => {
    const question = questions.find(
      (q) => q.id === questionIds[currentQuestionIndex]
    );
    if (!question) return null;

    switch (question.type) {
      case "checkbox":
        return (
          <div className="m-[10px]">
            <FormControl
              required
              component="fieldset"
              sx={{ m: 3 }}
              variant="standard"
            >
              <FormLabel component="legend">{question.question}</FormLabel>
              <FormGroup>
                {question.option &&
                  question.option.map((option: any) => (
                    <FormControlLabel
                      control={<Checkbox name={option} />}
                      label={option}
                      onChange={() => handleCheckboxChange(option)}
                      checked={selectedCheckboxes.includes(option)}
                    />
                  ))}
              </FormGroup>
            </FormControl>
          </div>
        );
      case "dropdown-rank":
        return (
          // Render dropdown component
          <div className="m-[10px]">
            <InputLabel>{question.question}</InputLabel>
            {question.option.map((option: any, index: any) => (
              <div key={index}>
                <Select
                  value={dropdownOptions[index + 1] || ""}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value as string)
                  }
                  style={{ minWidth: 200, margin: "5px 0" }}
                >
                  <MenuItem value="">{`Select option ${index + 1}`}</MenuItem>
                  {question.option.map((opt: any, idx: any) => (
                    <MenuItem key={idx} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        );
      case "radio button":
        return (
          // Render single-choice component
          <div className="m-[10px]">
            <FormControl component="fieldset">
              <FormLabel component="legend">{question.question}</FormLabel>
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={radioOptions}
                onChange={(e) => setRadioOptions(e.target.value)}
                className="m-[10px]"
              >
                {question.option &&
                  question.option.map((option: string, index: number) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </div>
        );
      case "text":
        return (
          <div className="m-[10px]">
            <FormControl component="fieldset">
              <FormLabel component="legend">{question.question}</FormLabel>
              <TextField
                required
                id={`outlined-required-${question.id}`}
                label="Answers"
                value={textFieldValue}
                onChange={(e) => setTextFieldValue(e.target.value)}
              />
            </FormControl>
          </div>
        );
      case "dropdown-matching":
        return (
          // Render dropdown component
          <div className="m-[10px]">
            <InputLabel>{question.question}</InputLabel>
            {question.option.left.map((leftValue: any, index: any) => (
              <div key={index}>
                <div className="flex justify-between items-center space-x-4">
                  <div className="flex-1">{leftValue}</div>
                  <Select
                    labelId="demo-simple-select-label-right"
                    id={`demo-simple-select-right-${index}`}
                    label="right"
                    className="flex-1"
                    value={dropdownMatching[leftValue] || ""}
                    onChange={(e) =>
                      handleDropdownMatchingChange(leftValue, e.target.value)
                    }
                  >
                    {question.option.right.map((rightValue: any, idx: any) => (
                      <MenuItem key={idx} value={rightValue}>
                        {rightValue}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <hr className="my-2"></hr>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={(currentQuestionIndex / questionIds.length) * 100}
        />
      </Box>
      <div>
        {renderQuestion()}
        <div className="flex items-stretchflex justify-between m-[20px]">
          {currentQuestionIndex > 0 && (
            <Button
              onClick={handleBack}
              variant="contained"
              startIcon={<KeyboardDoubleArrowLeftRoundedIcon />}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              // Save current answer without progressing to the next question
              saveAnswer(questionIds[currentQuestionIndex]);
            }}
            endIcon={<SaveAsRoundedIcon />}
            disabled={
              questions.length === 0 ||
              !questions[currentQuestionIndex] ||
              (questions[currentQuestionIndex].type === "checkbox" &&
                selectedCheckboxes.length === 0) ||
              (questions[currentQuestionIndex].type === "dropdown-rank" &&
                Object.keys(dropdownOptions).length === 0) ||
              Object.values(dropdownOptions).some((option) => option === "") ||
              (questions[currentQuestionIndex].type === "radio button" &&
                radioOptions === "") ||
              (questions[currentQuestionIndex].type === "text" &&
                textFieldValue.trim() === "") ||
              (questions[currentQuestionIndex].type === "dropdown-matching" &&
                Object.keys(dropdownMatching).length <
                  (questions[currentQuestionIndex].option?.left.length || 0))
            }
          >
            Save
          </Button>
          {questions.length > 0 && questions[currentQuestionIndex] ? (
            currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleNext(questionIds[currentQuestionIndex]);
                }}
                endIcon={<KeyboardDoubleArrowRightRoundedIcon />}
                disabled={
                  (questions[currentQuestionIndex].type === "checkbox" &&
                    selectedCheckboxes.length === 0) ||
                  (questions[currentQuestionIndex].type === "dropdown-rank" &&
                    Object.keys(dropdownOptions).length === 0) ||
                  Object.values(dropdownOptions).some(
                    (option) => option === ""
                  ) ||
                  (questions[currentQuestionIndex].type === "radio button" &&
                    radioOptions === "") ||
                  (questions[currentQuestionIndex].type === "text" &&
                    textFieldValue.trim() === "") ||
                  (questions[currentQuestionIndex].type ===
                    "dropdown-matching" &&
                    Object.keys(dropdownMatching).length <
                      (questions[currentQuestionIndex].option?.left.length ||
                        0))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit(questionIds[currentQuestionIndex]);
                }}
                endIcon={<ArrowUpwardRoundedIcon />}
                disabled={
                  (questions[currentQuestionIndex].type === "checkbox" &&
                    selectedCheckboxes.length === 0) ||
                  (questions[currentQuestionIndex].type === "dropdown-rank" &&
                    Object.keys(dropdownOptions).length === 0) ||
                  Object.values(dropdownOptions).some(
                    (option) => option === ""
                  ) ||
                  (questions[currentQuestionIndex].type === "radio button" &&
                    radioOptions === "") ||
                  (questions[currentQuestionIndex].type === "text" &&
                    textFieldValue.trim() === "") ||
                  (questions[currentQuestionIndex].type ===
                    "dropdown-matching" &&
                    Object.keys(dropdownMatching).length <
                      (questions[currentQuestionIndex].option?.left.length ||
                        0))
                }
              >
                Submit
              </Button>
            )
          ) : null}
        </div>
      </div>

      {isSubmit ? (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            {isSubmitting ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <div className="p-[20px] bg-slate-800 rounded-md">
                  <p className="text-white font-bold text-[20px]">
                    Your point is:{" "}
                    <span className="text-amber-200">{point}</span>
                  </p>
                </div>
              </>
            )}
          </Backdrop>
        </>
      ) : null}
    </>
  );
}

export default App;
