import React from "react";
import {
  User,
  LayoutDashboard,
  Flame,
  Lock,
  Check,
} from "lucide-react";

// ---------------- PERSONALIZED LEARNING PATH JSON ----------------

// Backend / LLM Response Example

const learningPath = [
  {
    day: 1,
    title: "Say Hello in English",
    duration_minutes: 30,
    status: "completed",
  },
  {
    day: 2,
    title: "Talk About Your Daily Routine",
    duration_minutes: 35,
    status: "completed",
  },
  {
    day: 3,
    title: "Talk About Your Family",
    duration_minutes: 35,
    status: "completed",
  },
  {
    day: 4,
    title: "Shopping Conversation",
    duration_minutes: 35,
    status: "current",
  },

  // Remaining locked lessons

  ...Array.from({ length: 86 }, (_, index) => ({
    day: index + 5,
    title: `English Lesson ${index + 5}`,
    duration_minutes: 35,
    status: "locked",
  })),
];

// ---------------- STREAK DATA ----------------

const streakData = {
  currentStreak: 12,
  week: [
    { day: "M", active: true },
    { day: "T", active: true },
    { day: "W", active: true },
    { day: "T", active: true },
    { day: "F", active: true },
    { day: "S", active: false },
    { day: "S", active: false },
  ],
};

// ---------------- STREAK COMPONENT ----------------

const DailyStreak = ({ data }) => {
  return (
    <div className="bg-white border border-[#ede7f3] rounded-[28px] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#f3ebf8] flex items-center justify-center text-[#8347ad]">
          <Flame size={22} />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 text-[17px]">
            Daily Streak
          </h3>

          <p className="text-sm text-gray-500">
            {data.currentStreak} Days Active
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        {data.week.map((item, index) => (
          <div
            key={index}
            className={`
              w-10
              h-12
              rounded-2xl
              flex
              items-center
              justify-center
              text-sm
              font-semibold
              transition-all

              ${
                item.active
                  ? "bg-[#8347ad] text-white shadow-md"
                  : "bg-gray-100 text-gray-500"
              }
            `}
          >
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- LEARNING NODE ----------------

const LearningNode = ({ item, index }) => {
  const curvePattern = [
    "ml-0",
    "ml-16",
    "ml-28",
    "ml-20",
    "ml-8",
    "ml-0",
    "mr-8",
    "mr-20",
    "mr-28",
    "mr-16",
  ];

  const curveClass = curvePattern[index % curvePattern.length];

  const isCompleted = item.status === "completed";
  const isCurrent = item.status === "current";
  const isLocked = item.status === "locked";

  return (
    <div
      className={`relative flex justify-center group ${curveClass}`}
    >
      {/* HOVER CARD */}

      <div
        className="
          absolute
          left-1/2
          translate-x-12
          top-1/2
          -translate-y-1/2
          opacity-0
          invisible
          group-hover:opacity-100
          group-hover:visible
          transition-all
          duration-300
          z-50
        "
      >
        <div
          className="
            w-[260px]
            bg-white
            border
            border-[#ede7f3]
            rounded-2xl
            p-5
            shadow-[0_15px_40px_rgba(0,0,0,0.12)]
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-[16px] font-semibold text-gray-900">
                Day {item.day}
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                {item.title}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {item.duration_minutes} mins
              </p>
            </div>

            <div>
              {isCompleted ? (
                <Check
                  size={18}
                  className="text-green-500"
                />
              ) : isLocked ? (
                <Lock
                  size={18}
                  className="text-gray-400"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* NODE */}

      <button
        disabled={isLocked}
        className={`
          relative
          w-[88px]
          h-[88px]
          rounded-full
          flex
          items-center
          justify-center
          transition-all
          duration-300
          z-10

          ${
            isCompleted
              ? `
                bg-green-500
                shadow-[0_12px_30px_rgba(34,197,94,0.35)]
                hover:scale-110
              `
              : isCurrent
              ? `
                bg-[#8347ad]
                shadow-[0_12px_30px_rgba(131,71,173,0.35)]
                hover:scale-110
              `
              : `
                bg-gray-300
                cursor-not-allowed
                opacity-80
              `
          }
        `}
      >
        {/* INNER CIRCLE */}

        <div
          className={`
            w-[64px]
            h-[64px]
            rounded-full
            flex
            items-center
            justify-center
            text-white
            text-2xl
            shadow-inner

            ${
              isCompleted
                ? "bg-green-400"
                : isCurrent
                ? "bg-[#9f6ac4]"
                : "bg-gray-400"
            }
          `}
        >
          {isCompleted ? (
            <Check size={24} />
          ) : isLocked ? (
            <Lock size={20} />
          ) : (
            <span className="font-bold">
              {item.day}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

// ---------------- MAIN PAGE ----------------

export default function Home() {
  const completedLessons = learningPath.filter(
    (item) => item.status === "completed"
  ).length;

  const progressPercentage = Math.floor(
    (completedLessons / learningPath.length) * 100
  );

  return (
    <div className="w-full h-screen bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto h-full flex">

        {/* LEARNING PATH SECTION */}

        <div className="flex-1 flex justify-center px-8 py-10 overflow-hidden">

          {/* SCROLLABLE PATH */}

          <div
            className="
              w-full
              h-full
              overflow-y-auto
              overflow-x-hidden
              scrollbar-none
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              flex
              justify-center
            "
          >
            {/* scroller size adjust */}
            <div className="w-full max-w-2xl flex flex-col scale-110 gap-20 origin-top py-16 px-6">

              {learningPath.map((item, index) => (
                <LearningNode
                  key={item.day}
                  item={item}
                  index={index}
                />
              ))}

            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div
          className="
            w-[360px]
            h-full
            border-l
            border-[#f0e8f5]
            bg-[#fcfbfd]
            px-6
            py-6
            flex
            flex-col
          "
        >
          {/* TOP BUTTONS */}

          <div className="flex justify-center gap-3 mb-8">

            <button
              className="
                w-12
                h-12
                rounded-2xl
                bg-white
                border
                border-[#ede7f3]
                flex
                items-center
                justify-center
                text-[#8347ad]
                shadow-sm
                hover:bg-[#f8f3fb]
                transition-all
              "
            >
              <LayoutDashboard size={20} />
            </button>

            <button
              className="
                w-12
                h-12
                rounded-2xl
                bg-white
                border
                border-[#ede7f3]
                flex
                items-center
                justify-center
                text-[#8347ad]
                shadow-sm
                hover:bg-[#f8f3fb]
                transition-all
              "
            >
              <User size={20} />
            </button>
          </div>

          {/* WELCOME CARD */}

          <div
            className="
              bg-[#8347ad]
              rounded-[32px]
              p-6
              text-white
              shadow-[0_15px_40px_rgba(131,71,173,0.25)]
              mb-6
            "
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white/15
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                👋
              </div>

              <div>
                <h2 className="text-[24px] font-semibold">
                  Welcome back
                </h2>

                <p className="text-sm text-white/80 mt-1">
                  Continue your AI English Journey
                </p>
              </div>
            </div>
          </div>

          {/* STREAK */}

          <div className="mb-6">
            <DailyStreak data={streakData} />
          </div>

          {/* PROGRESS */}

          <div className="bg-white border border-[#ede7f3] rounded-[28px] p-6 shadow-sm">

            <h3 className="text-[18px] font-semibold text-gray-900 mb-5">
              Learning Progress
            </h3>

            <div className="w-full h-3 bg-[#efe6f5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8347ad] rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {progressPercentage}% Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}