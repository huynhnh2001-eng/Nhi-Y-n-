# Pass 2 — add study aids to existing day files

Read `/home/user/Nhi-Y-n-/vstep/data/BRIEF.md` for background. The day files already exist and are complete. In this pass you ADD new fields to your assigned day files. Do not rewrite or shorten existing content (fix only clear errors you notice). Vietnamese must have full diacritics.

The learner asked for:
- a tip right next to each listening item, before they answer;
- reading passages where useful phrases are highlighted and show a Vietnamese translation + grammar note on hover, "so I learn structures and translation while doing the test";
- for writing and speaking, ready-made topic-specific opening sentences, linking sentences etc. to memorise, and highlighted phrases with translations in the model answers.

## New fields

### listening — every item gets `tip`
```js
{ label:"Announcement 1", context:"...", tip:"Mẹo cho bài này (tiếng Việt, 1–2 câu): nghe gì, bẫy nằm ở đâu — KHÔNG được lộ đáp án.", script:[...], questions:[...] }
```
The tip must help with that item's specific question type (e.g. "Câu hỏi về giờ: người nói sẽ đổi giờ giữa chừng, chờ nghe hết câu", "Câu hỏi 'why': nghe sau because / so that / the reason is") but must not give away the answer.

### reading section — add `gloss`
```js
gloss: [
  ["exact phrase copied from the text", "nghĩa tiếng Việt", "ghi chú cấu trúc (tuỳ chọn)"],
  ...
]
```
- 16–22 entries per passage, spread across ALL paragraphs.
- Choose what a B1→B2 learner should memorise: collocations ("play a key role in"), phrasal verbs, linking words/phrases ("By contrast,", "As a result,"), and grammar chunks (passive, relative clause, inversion, "it is + adj + that", "not only … but also", reduced clauses, comparatives). 2–8 words each typically; up to ~10 for a grammar chunk.
- The first string must appear in the passage EXACTLY (same case, same punctuation, same apostrophe character, not split by a `<b>/<em>` tag). Copy-paste from the text.
- Third element: short structure note when useful, e.g. "be likely to + V: có khả năng sẽ…", "Bị động hiện tại hoàn thành: have been + V3". Use "" if none.
- Do not create overlapping entries (one phrase inside another).

### writing section — add `gloss` and `bank`
- `gloss`: same format, 12–18 entries, every first string must appear exactly in the `model` paragraphs.
- `bank`: topic-specific sentence bank to memorise, grouped:
```js
bank: [
  { h: "Mở bài", items: [["Full English sentence usable for THIS topic …", "Dịch tiếng Việt"], ...] },
  ...
]
```
Task 1 groups (3–4 sentences each): "Mở đầu thư", "Nêu lý do viết thư", "Trình bày từng ý", "Câu nối & chuyển ý", "Kết thư". Task 2 groups: "Mở bài (paraphrase + quan điểm)", "Câu chủ đề thân bài", "Giải thích & đưa ví dụ", "Câu nối & chuyển ý", "Nhượng bộ – phản bác", "Kết bài". Sentences should be complete, natural, about today's topic (they can include "…" slots), different from the existing `phrases` list.

### speaking section — add `bank`; every task gets `gloss`
- Each task: `gloss` 8–14 entries, each first string appears exactly in that task's `model` paragraphs.
- Section `bank` (same format as writing), topic-specific, 3–4 sentences per group:
  - Part 1: "Trả lời trực tiếp", "Đưa lý do", "Ví dụ bản thân", "Câu câu giờ tự nhiên".
  - Part 2: "Nêu lựa chọn", "Lý do ủng hộ", "Bác bỏ phương án khác", "Kết luận".
  - Part 3: "Mở đầu", "Chuyển ý", "Ý riêng của bạn", "Kết luận", "Trả lời câu hỏi phụ".
  - "full" days: combine — use groups "Part 1 – trả lời & lý do", "Part 2 – chọn & bác bỏ", "Part 3 – mở đầu & chuyển ý", "Part 3 – kết luận & câu hỏi phụ".

## Validate
After editing each file run:
`node /home/user/Nhi-Y-n-/vstep/data/validate2.js /home/user/Nhi-Y-n-/vstep/data/dayNN.js`
It prints every problem (missing tip, gloss phrase not found, overlapping gloss, missing bank). Fix until it prints `OK`. Do not create other files in the repo; do not commit.
