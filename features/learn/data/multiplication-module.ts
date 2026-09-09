import { ModuleData } from "../types";

export const multiplicationModule: ModuleData = {
  id: "mod-multiplication",
  title: "Mental Multiplication & Speed Shortcuts",
  slug: "multiplication",
  description: "Master lightning-fast mental multiplication techniques without writing down scratch notes.",
  difficulty: "Beginner",
  lessons: [
    {
      id: "lesson-1",
      moduleId: "mod-multiplication",
      moduleTitle: "Mental Multiplication & Speed Shortcuts",
      title: "The 11 Sandwich Method",
      description: "Multiply any 2-digit number by 11 in less than 2 seconds using the digit-sum placement trick.",
      difficulty: "Beginner",
      estimatedMinutes: 5,
      orderIndex: 1,
      objectives: [
        "Understand how to split 2-digit numbers to multiply by 11",
        "Handle digit carries smoothly when the sum exceeds 9",
        "Calculate 2-digit by 11 multiplications instantly without scratchpad",
      ],
      sections: {
        explanation:
          "When multiplying any two-digit number by 11, you don't need standard long multiplication. The middle digit of the product is simply the sum of the two original digits! You 'sandwich' the sum between the first and last digits.",
        quickTips: [
          {
            title: "Standard Sandwich (Sum < 10)",
            description: "For AB x 11, the answer is A (A+B) B.",
            formula: "35 x 11 -> 3 | (3+5) | 5 = 385",
          },
          {
            title: "Overflow Sandwich (Sum >= 10)",
            description: "If A + B is 10 or greater, add 1 to the first digit and keep the unit digit in the middle.",
            formula: "78 x 11 -> (7+1) | (15-10) | 8 = 858",
          },
        ],
        examples: [
          {
            problem: "Calculate 43 x 11",
            solution: "473",
            steps: [
              "Step 1: Separate the digits 4 and 3.",
              "Step 2: Add the digits: 4 + 3 = 7.",
              "Step 3: Insert 7 between 4 and 3 -> Result is 473.",
            ],
          },
          {
            problem: "Calculate 85 x 11",
            solution: "935",
            steps: [
              "Step 1: Separate the digits 8 and 5.",
              "Step 2: Add the digits: 8 + 5 = 13.",
              "Step 3: Keep 3 in the middle, carry 1 to 8 (8 + 1 = 9) -> Result is 935.",
            ],
          },
        ],
        summary: [
          "For any AB x 11: Middle digit = A + B.",
          "If A + B >= 10, carry 1 over to the leftmost digit A.",
          "Practice visualizing the two digits pulling apart and dropping the sum inside.",
        ],
      },
    },
    {
      id: "lesson-2",
      moduleId: "mod-multiplication",
      moduleTitle: "Mental Multiplication & Speed Shortcuts",
      title: "Squaring Numbers Ending in 5",
      description: "Instantly square numbers like 25, 45, 75, or 105 in your head.",
      difficulty: "Beginner",
      estimatedMinutes: 6,
      orderIndex: 2,
      objectives: [
        "Master the N x (N + 1) shortcut for numbers ending in 5",
        "Apply the rule to both 2-digit and 3-digit numbers ending in 5",
        "Achieve sub-3-second mental response times",
      ],
      sections: {
        explanation:
          "Any number ending in 5 always ends in '25' when squared! To find the first part of the answer, take the leading number (N) and multiply it by the next consecutive integer (N + 1).",
        quickTips: [
          {
            title: "The N(N+1) Rule",
            description: "For (N5)^2, calculate N x (N + 1) and append '25'.",
            formula: "(N5)^2 = [N x (N + 1)] 25",
          },
        ],
        examples: [
          {
            problem: "Calculate 65^2 (65 x 65)",
            solution: "4225",
            steps: [
              "Step 1: Identify N = 6.",
              "Step 2: Multiply N by (N + 1): 6 x 7 = 42.",
              "Step 3: Append 25 to 42 -> Result is 4225.",
            ],
          },
          {
            problem: "Calculate 95^2 (95 x 95)",
            solution: "9025",
            steps: [
              "Step 1: Identify N = 9.",
              "Step 2: Multiply N by (N + 1): 9 x 10 = 90.",
              "Step 3: Append 25 to 90 -> Result is 9025.",
            ],
          },
        ],
        summary: [
          "Every square of a number ending in 5 ends in 25.",
          "Multiply the leading number by its successor.",
          "Attach 25 to the end.",
        ],
      },
    },
    {
      id: "lesson-3",
      moduleId: "mod-multiplication",
      moduleTitle: "Mental Multiplication & Speed Shortcuts",
      title: "Multiplying Numbers Near Base 100",
      description: "Multiply numbers close to 100 (e.g. 96 x 97 or 104 x 103) using base deviation math.",
      difficulty: "Intermediate",
      estimatedMinutes: 8,
      orderIndex: 3,
      objectives: [
        "Understand base deviations from 100",
        "Calculate products of numbers slightly below 100",
        "Calculate products of numbers slightly above 100",
      ],
      sections: {
        explanation:
          "When multiplying numbers near 100, calculate their deviations (difference from 100). The answer consists of two parts: Left Part = Number 1 + Deviation 2, Right Part = Deviation 1 x Deviation 2.",
        quickTips: [
          {
            title: "Base-100 Deviation Rule",
            description: "For (100 - d1) x (100 - d2), Left = 100 - d1 - d2, Right = d1 x d2.",
            formula: "96 (-4) x 97 (-3) -> (96-3) | (-4 x -3) = 9312",
          },
        ],
        examples: [
          {
            problem: "Calculate 96 x 97",
            solution: "9312",
            steps: [
              "Step 1: Deviations from 100 are -4 and -3.",
              "Step 2: Left Part: 96 - 3 = 93 (or 97 - 4 = 93).",
              "Step 3: Right Part: (-4) x (-3) = 12.",
              "Step 4: Combine: 9312.",
            ],
          },
        ],
        summary: [
          "Find differences relative to 100.",
          "Cross-subtract to get the first two digits.",
          "Multiply deviations to get the last two digits.",
        ],
      },
    },
  ],
};
