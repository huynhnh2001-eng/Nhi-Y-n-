# VSTEP B2 30-day course — content brief

Learner: Vietnamese adult, currently ~B1, target VSTEP score 6.5–7.0 (solid B2) in 30 days.
Explanations, lessons, tips, vocab meanings: **Vietnamese (with full diacritics)**. Passages, scripts, questions, options, prompts, model answers: **English**.
All content must be ORIGINAL (do not copy real exam papers or published books). Realistic VSTEP style and difficulty.

## VSTEP format reminders
- Listening (35 q, ~40'): Part 1 = 8 short announcements/messages/instructions, 1 question each. Part 2 = 3 conversations, 4 questions each. Part 3 = 3 talks/lectures, 5 questions each. 4-option multiple choice (A–D). Audio played ONCE.
- Reading (40 q, 60'): 4 passages × 10 questions, difficulty rising from passage 1 (~300 words, B1) to passage 4 (~550 words, B2–C1). Question types: main idea, detail, NOT TRUE / NOT mentioned, vocabulary in context ("closest in meaning"), reference ("the word 'it' refers to"), inference, author's purpose/attitude, best title.
- Writing (60'): Task 1 letter/email ≥120 words (20'); Task 2 essay ≥250 words (40').
- Speaking (~12'): Part 1 social interaction (2 topics × 3 questions); Part 2 solution discussion (situation + 3 options, 1' prep, ~2' talk); Part 3 topic development (topic + 3 suggested ideas in a mind map + your own idea, 1' prep, ~2' talk, then follow-up questions).

## Output file format
Write ONE file per day: `/home/user/Nhi-Y-n-/vstep/data/dayNN.js` (NN two digits, e.g. day05.js). Plain JavaScript, no imports:

```js
(window.VSTEP_DAYS = window.VSTEP_DAYS || {})[5] = {
  day: 5,
  title: "Short Vietnamese title of the lesson",
  topic: "Health",                       // English topic word(s)
  goal: "1–2 câu tiếng Việt: hôm nay học gì, đạt được gì.",
  sections: [ /* exactly the two sections listed for the day, in order */ ],
  vocab: [["a balanced diet","chế độ ăn cân bằng"], ...],   // 10 items, topic words that appear in today's texts
  tip: "Một mẹo thi tiếng Việt, 1–2 câu."
};
```

Only these inline tags may appear inside strings: `<b>`, `<em>`, `<br>`. No other HTML. Use straight quotes inside strings carefully (escape or use the other quote type). Use “curly” or ’ apostrophes freely in English text if convenient.

### Section: listening
```js
{
  type: "listening",
  part: 1,                 // 1, 2, 3, or "mix"
  lesson: ["Bước/chiến lược 1 (tiếng Việt)", "..."],   // 4–6 bullets: concrete strategy for THIS part, progressively deeper than earlier days
  items: [
    {
      label: "Announcement 1",          // or "Conversation 1", "Talk 1"
      context: "At a train station",    // short English setting line
      script: [                          // the audio transcript, line by line
        { sp: "M", text: "..." },        // sp: "M" male voice, "F" female voice, "N" narrator (neutral)
        { sp: "F", text: "..." }
      ],
      questions: [
        { q: "What time will the train to Hue now leave?",
          opts: ["7:15", "7:50", "8:15", "8:50"],
          a: 2,                          // index 0–3 of correct option
          why: "Giải thích tiếng Việt: trích câu then chốt trong bài nghe, chỉ ra bẫy nếu có." }
      ]
    }
  ]
}
```
Amounts: Part 1 day → 8 items, each one speaker, 50–80 words, 1 question. Part 2 day → 2 conversations, each 2 speakers (M/F), 220–300 words, 4 questions. Part 3 day → 2 talks, each one speaker (lecture/radio talk/presentation, may begin with a short N intro line), 330–420 words, 5 questions. "mix" day → 3 Part-1 items (1 q each) + 1 conversation (4 q) + 1 talk (5 q).
Build in realistic distractors: changed plans ("sorry, it's actually..."), numbers that sound alike (15/50), options mentioned but rejected, paraphrase rather than word-for-word answers. Vary the correct-answer index across A–D roughly evenly.

### Section: reading
```js
{
  type: "reading",
  passage: 1,               // 1–4 = exam passage level (length/difficulty as above)
  lesson: ["...", "..."],   // 4–6 Vietnamese strategy bullets for the question types emphasised today
  title: "Passage title",
  text: ["Paragraph 1 ...", "Paragraph 2 ...", ...],   // 4–6 paragraphs
  questions: [ { q, opts:[4], a, why } ]               // exactly 10 questions; why = Vietnamese explanation citing the paragraph/line
}
```
Lengths: passage 1 ≈ 280–330 words, passage 2 ≈ 350–400, passage 3 ≈ 430–480, passage 4 ≈ 520–600. Mix question types (include at least one vocabulary-in-context, one reference, one NOT TRUE/NOT mentioned, one inference from passage 2 upward, main idea/title). Vary answer index.

### Section: writing
```js
{
  type: "writing",
  task: 1,                  // 1 or 2
  kind: "Informal email",   // e.g. "Formal letter – enquiry", "Opinion essay", "Discussion essay"
  lesson: ["...", "..."],   // 4–6 Vietnamese bullets: structure + what examiners reward for this kind
  prompt: "Full exam-style task in English (use <br> for line breaks / bullet points).",
  minWords: 120,            // 120 for task 1, 250 for task 2
  minutes: 20,              // 20 or 40
  outline: ["Đoạn 1 – ...", "..."],    // Vietnamese paragraph-by-paragraph plan for the model answer
  model: ["Paragraph 1 ...", "..."],   // a model answer at band ~7.0: natural, B2+, correct length (task 1: 150–180 words; task 2: 280–320 words)
  notes: ["Phân tích tiếng Việt: cụm/ cấu trúc hay trong bài mẫu và vì sao ăn điểm", "..."],  // 4–6 bullets
  phrases: [["I am writing to enquire about…","Tôi viết thư để hỏi về…"], ...]                 // 6–8 reusable phrases
}
```

### Section: speaking
```js
{
  type: "speaking",
  part: 1,                  // 1, 2, 3, or "full"
  lesson: ["...", "..."],   // 4–6 Vietnamese bullets
  tasks: [
    { label: "Part 1 – Topic: Free time",
      prompt: "English prompt shown to learner (questions separated by <br>; for Part 2 give situation + the 3 options; for Part 3 give the topic + 3 ideas + 'your own idea' + follow-up questions)",
      prep: 0,              // seconds of preparation (Part 1: 0, Part 2/3: 60)
      time: 90,             // seconds to speak (Part 1 topic of 3 questions: 90; Part 2: 120; Part 3: 150)
      model: ["Model answer paragraph(s) in natural spoken English at band ~7", "..."] }
  ],
  phrases: [["Of the three options, I'd go for…","Trong ba phương án, tôi chọn…"], ...]   // 6–8
}
```
Part 1 day → 2 tasks (2 topics × 3 questions; model = one short answer per question, prefixed "Q1:", "Q2:"...). Part 2 day → 1 task. Part 3 day → 1 task. "full" day → 3 tasks (Part 1 one topic with 3 questions, Part 2, Part 3).

## Quality bar
- Natural English, accurate grammar, B2 vocabulary in passages/scripts. Topic vocab list words must actually occur in that day's texts.
- Explanations must be specific (quote the key phrase), not generic.
- Lessons must progress: later days teach more advanced tactics, not repeat day 1.
- After writing each file, run `node -e "require('vm').runInNewContext(require('fs').readFileSync(process.argv[1],'utf8'),{window:{}})" /home/user/Nhi-Y-n-/vstep/data/dayNN.js` and fix any syntax error. Also check every question has 4 opts and a valid `a`.
- Do not create any other files. Do not commit.

## Full schedule (for context; write only your assigned days)
| Day | Section 1 | Section 2 | Topic |
|---|---|---|---|
| 1 | listening part 1 | reading passage 1 | Education & campus life |
| 2 | writing task 1 – informal email | speaking part 1 | Free time & hobbies |
| 3 | listening part 1 | reading passage 1 | Travel |
| 4 | writing task 1 – formal letter (enquiry) | speaking part 1 | Work & study |
| 5 | listening part 1 | reading passage 2 | Health |
| 6 | writing task 1 – complaint letter | speaking part 1 | Shopping & services |
| 7 | listening part 1 | reading passage 2 | Technology (week-1 review) |
| 8 | listening part 2 | reading passage 2 | Family |
| 9 | writing task 2 – opinion essay | speaking part 2 | Environment |
| 10 | listening part 2 | reading passage 3 | Culture & festivals |
| 11 | writing task 2 – discussion (both views + opinion) | speaking part 2 | City life & transport |
| 12 | listening part 2 | reading passage 3 | Media & news |
| 13 | writing task 2 – advantages/disadvantages | speaking part 2 | Children & technology |
| 14 | listening part 2 | reading passage 3 | Work & careers |
| 15 | listening part 3 | reading passage 4 | Science & discovery |
| 16 | writing task 2 – problem–solution | speaking part 3 | Urbanisation |
| 17 | listening part 3 | reading passage 4 | Psychology & learning |
| 18 | writing task 2 – cause–effect | speaking part 3 | Lifestyle & health |
| 19 | listening part 3 | reading passage 4 | Climate change |
| 20 | writing task 1 – formal request / application | speaking part 3 | Online learning |
| 21 | listening part 3 | reading passage 4 | Economy & consumerism |
| 22 | listening mix | reading passage 3 | Tourism |
| 23 | writing task 2 – opinion essay | speaking full | Working from home |
| 24 | listening mix | reading passage 4 | Sport |
| 25 | writing task 1 – semi-formal email | speaking full | Volunteering & community |
| 26 | listening mix | reading passage 2 | History & heritage |
| 27 | writing task 2 – discussion | speaking full | Artificial intelligence |
| 28 | listening mix | reading passage 4 | Food & farming |
| 29 | writing task 2 – advantages/disadvantages | speaking full | Higher education & tuition |
| 30 | listening part 1 (4 items only, warm-up) | speaking part 1 (1 task, warm-up) | Exam day – light warm-up; goal/tip should be an exam-day checklist |
