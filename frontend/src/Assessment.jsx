// App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  CheckCircle2,
  Volume2,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function Assessment() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [loading, setLoading] = useState(true);

  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    fetch("/assessment.json")
      .then((res) => res.json())
      .then((data) => {
        setAssessmentData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const allQuestions = useMemo(() => {
    if (!assessmentData) return [];

    return assessmentData.sections.flatMap((section) =>
      section.questions.map((q) => ({
        ...q,
        section_name: section.section_name,
        section_type: section.section_type,
      }))
    );
  }, [assessmentData]);

  const currentQuestion = allQuestions[currentQuestionIndex];

  const progress =
    allQuestions.length > 0
      ? ((currentQuestionIndex + 1) / allQuestions.length) * 100
      : 0;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_id]: option,
    }));
  };

  const handleTextAnswer = (e) => {
    setTextAnswer(e.target.value);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_id]: e.target.value,
    }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();

      setVoiceRecorded(true);

      mediaRecorder.onstop = () => {
        console.log("Recording Stopped");
      };
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleNext = () => {
    setSelectedOption("");
    setTextAnswer("");
    setVoiceRecorded(false);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert("Assessment Completed!");
      console.log(answers);
    }
  };

  const isAnswered = () => {
    const type = currentQuestion?.question_type;
    const sectionType = currentQuestion?.section_type;

    if (
      sectionType === "voice" ||
      sectionType === "voice_roleplay"
    ) {
      return voiceRecorded;
    }

    if (
      type === "mcq" ||
      type === "contextual_vocabulary" ||
      type === "professional_communication"
    ) {
      return selectedOption !== "";
    }

    if (
      type === "sentence_correction" ||
      type === "fill_in_blank"
    ) {
      return textAnswer.trim() !== "";
    }

    if (sectionType === "listening") {
      return selectedOption !== "";
    }

    return false;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-100 flex flex-col">
      {/* Header */}
      <div className="bg-white-100 px-8 py-5">
        <div className="flex items-center justify-between mb-3">
          {/* <h1 className="text-2xl font-bold  text-slate-800">
            English Initial Assessment
          </h1> */}

          <div className="text-sm text-slate-500">
            Question {currentQuestionIndex + 1} / {allQuestions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-center">
          <div className="max-w-3xl w-full mx-auto h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8347ad] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-top bg-white-100 justify-center mt-5">
        <div className="w-full max-w-3xl bg-white-100 rounded-3xl ">
          {/* Section */}
          <div className=" bg-white-100">
            <div className="text-sm text-indigo-600 font-semibold mb-2">
              {/* session name */}
              {/* {currentQuestion.section_name} */}
            </div>

            <h2 className="text-2xl font-semibold text-slate-800 leading-relaxed text-justify">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Voice Question */}
          {(currentQuestion.section_type === "voice" ||
            currentQuestion.section_type === "voice_roleplay") && (
              <div className="flex flex-col items-center mt-10">
                <button
                  onClick={
                    !voiceRecorded ? startRecording : stopRecording
                  }
                  className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                ${voiceRecorded
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-[#8347ad] hover:bg-[#8355ad]"
                    }`}
                >
                  {!voiceRecorded ? (
                    <Mic className="text-white w-10 h-10" />
                  ) : (
                    <CheckCircle2 className="text-white w-10 h-10" />
                  )}
                </button>

                <p className="mt-10 py-5 text-slate-500">
                  {!voiceRecorded
                    ? "Click to start recording"
                    : "Voice response recorded"}
                </p>
              </div>
            )}

          {/* MCQ */}
          {(currentQuestion.question_type === "mcq" ||
            currentQuestion.question_type ===
            "contextual_vocabulary" ||
            currentQuestion.question_type ===
            "professional_communication" ||
            currentQuestion.section_type === "listening") && (
              <div className="mt-5 grid gap-4">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200
                  ${selectedOption === option
                        ? "border-[#8347ad] bg-[#8347ad]"
                        : "border-slate-200 hover:border-[#8347ad] hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold">
                        {String.fromCharCode(65 + index)}
                      </div>

                      <span className={`${selectedOption === option ? "text-white" : "text-slate-700"}`}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

          {/* Listening Audio */}
          {currentQuestion.section_type === "listening" && (
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-slate-700">
                <Volume2 className="w-5 h-5" />
                <span className="font-medium">
                  Audio Script (Demo)
                </span>
              </div>

              <p className="mt-3 text-slate-600 leading-relaxed">
                {currentQuestion.audio_script}
              </p>
            </div>
          )}

          {/* Text Input */}
          {(currentQuestion.question_type ===
            "sentence_correction" ||
            currentQuestion.question_type ===
            "fill_in_blank") && (
              <div className="mt-8">
                <textarea
                  value={textAnswer}
                  onChange={handleTextAnswer}
                  placeholder="Type your answer here..."
                  className="w-full h-40 border border-slate-300 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            )}

          {/* Next Button */}
          <div className="mt-10 flex justify-end">
            <button
              disabled={!isAnswered()}
              onClick={handleNext}
              className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold transition-all duration-300
              ${isAnswered()
                  ? "bg-[#8347ad] hover:bg-[#8355ad] text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}