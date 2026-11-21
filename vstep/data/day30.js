(window.VSTEP_DAYS = window.VSTEP_DAYS || {})[30] = {
  day: 30,
  title: "Ngày thi: Khởi động nhẹ và danh sách kiểm tra",
  topic: "Exam day",
  goal: "Hôm nay KHÔNG học thêm kiến thức mới. ✔ Khởi động tai với 4 câu nghe Part 1 và khởi động miệng với 1 chủ đề Nói Part 1 (tổng ~15 phút). ✔ Kiểm tra giấy tờ: CCCD/CMND, giấy báo dự thi, bút chì 2B, tẩy, đồng hồ không thông minh. ✔ Ăn sáng đầy đủ, đến điểm thi sớm 30 phút, tắt điện thoại trước khi vào phòng.",
  sections: [
    {
      type: "listening",
      part: 1,
      lesson: [
        "<b>Trước khi vào phòng:</b> nghe 5–10 phút tiếng Anh nhẹ nhàng (bài nghe quen thuộc, podcast ngắn) trên đường đi để ‘làm nóng tai’. Không nghe bài mới quá khó gây mất tự tin.",
        "<b>Khi kiểm tra âm thanh:</b> nếu tai nghe nhỏ, rè hoặc lệch một bên, giơ tay báo giám thị NGAY trong lúc thử âm – sau khi bài thi bắt đầu sẽ không được dừng lại.",
        "<b>Tận dụng thời gian đọc đề:</b> lướt câu hỏi Part 1, gạch chân từ để hỏi (When, Why, What… do) và đoán trước loại thông tin cần nghe (giờ, lý do, hành động).",
        "<b>Bẫy quen thuộc:</b> thông tin bị sửa lại (<em>not… as I said earlier, instead of</em>), số dễ nhầm (15/50, 6:15/6:30) và phương án lặp lại đúng từ trong bài nhưng sai ý. Đáp án đúng thường là paraphrase.",
        "<b>Tâm lý:</b> bài chỉ phát MỘT lần. Lỡ một câu thì đoán ngay, bỏ qua và dồn sức cho câu tiếp theo. Không bao giờ để trống – sai không bị trừ điểm.",
        "<b>Cuối phần nghe:</b> tô/chuyển đáp án cẩn thận nếu thi giấy, hoặc kiểm tra lại đã chọn đủ 35 câu nếu thi máy trước khi hết giờ."
      ],
      items: [
        {
          label: "Announcement 1",
          context: "At an exam centre",
          script: [
            { sp: "M", text: "Attention, all candidates for the morning English test. Please note that the listening section will now take place in room 204, not room 202 as printed on your admission slip, because there is a problem with the speakers in room 202. Bring only your ID card, pencils and an eraser into the room. Mobile phones must be switched off and left in the lockers on the ground floor. The doors will close at seven forty-five sharp." }
          ],
          questions: [
            { q: "Why has the room for the listening section been changed?",
              opts: ["The original room is too small.", "More candidates have registered.", "There is a problem with the audio equipment.", "The admission slips were printed incorrectly."],
              a: 2,
              why: "Câu then chốt: “because there is <b>a problem with the speakers</b> in room 202” – speakers (loa) được paraphrase thành ‘audio equipment’. Phiếu dự thi không in sai, chỉ là phòng đã đổi sau khi in." }
          ]
        },
        {
          label: "Message 2",
          context: "A voicemail from a friend",
          script: [
            { sp: "M", text: "Hi Mai, it’s Duc. I know you’re nervous about tomorrow, so here’s the plan. My dad can drive us both to the test centre. He’ll pick you up at six fifteen — not six thirty as I said earlier — because there are roadworks on Tran Phu Street and it might take longer. Don’t forget to have a proper breakfast, and I’ll bring some water for both of us. See you in the morning!" }
          ],
          questions: [
            { q: "What time will Mai be picked up?",
              opts: ["6:15", "6:30", "6:50", "7:15"],
              a: 0,
              why: "“He’ll pick you up at <b>six fifteen — not six thirty</b> as I said earlier”. 6:30 là thông tin cũ đã bị sửa – bẫy điển hình của Part 1." }
          ]
        },
        {
          label: "Instructions 3",
          context: "Before a speaking test",
          script: [
            { sp: "F", text: "Good morning, everyone. I’m the invigilator for this session. In a moment I’ll call your number and you’ll go into the speaking room. When you enter, hand the examiner your ID card and sit in front of the microphone, as you’ll be recorded throughout. For parts two and three, you’ll have one minute to prepare. You may write notes on the paper provided, but you must leave it on the desk when you finish." }
          ],
          questions: [
            { q: "What must candidates do with their notes?",
              opts: ["Give them to the examiner at the start", "Take them home after the test", "Read them aloud into the microphone", "Leave them on the desk"],
              a: 3,
              why: "Câu cuối: “you must <b>leave it on the desk</b> when you finish”. Thứ đưa cho giám khảo lúc vào phòng là ID card, không phải giấy ghi chú." }
          ]
        },
        {
          label: "Announcement 4",
          context: "In a university library",
          script: [
            { sp: "F", text: "This is a reminder that during exam week the self-study area will stay open until midnight, three hours later than usual. However, the café on the first floor will close at eight p.m. Students are asked to keep noise to a minimum at all times. Please also note that group discussion rooms can no longer be booked at the front desk; they must now be reserved online at least one day in advance." }
          ],
          questions: [
            { q: "What has changed about the group discussion rooms?",
              opts: ["They are closed during exam week.", "They must be reserved a day in advance.", "They are only open until 8 p.m.", "They are now free of charge."],
              a: 1,
              why: "“they must now be <b>reserved online at least one day in advance</b>”. 8 p.m. là giờ đóng cửa của quán café – bẫy gán nhầm thông tin." }
          ]
        }
      ]
    },
    {
      type: "speaking",
      part: 1,
      lesson: [
        "<b>Khởi động giọng:</b> trước giờ thi, đọc to 2–3 phút (một đoạn bài mẫu đã học) để miệng ‘quen’ tiếng Anh. Uống nước, tránh nói chuyện bằng tiếng Việt quá nhiều ngay trước khi vào phòng.",
        "<b>Khi vào phòng:</b> chào giám khảo tự nhiên (<em>Good morning</em>), nói rõ họ tên và số báo danh khi được yêu cầu, ngồi thẳng, nói gần micro vừa đủ – bài nói được ghi âm.",
        "<b>Part 1:</b> mỗi câu 2–3 câu: trả lời thẳng + lý do + ví dụ. Nếu nghe không rõ câu hỏi, được phép hỏi lại: <em>Sorry, could you repeat the question, please?</em> – không bị trừ điểm.",
        "<b>Part 2 & 3:</b> dùng hết 1 phút chuẩn bị để ghi từ khoá (không viết câu). Nói cho đến khi giám khảo dừng – nói hết giờ tốt hơn kết thúc quá sớm.",
        "<b>Nếu bí:</b> dùng câu câu giờ (<em>That’s an interesting question…, Let me think…</em>), tự sửa lỗi nhanh rồi nói tiếp. Giám khảo chấm sự trôi chảy tổng thể, không bắt lỗi từng câu.",
        "<b>Tâm lý:</b> đã có 30 ngày chuẩn bị. Hít thở sâu 3 lần trước khi vào phòng, nói chậm và rõ hơn bình thường một chút. Mỉm cười – nó giúp giọng nói tự tin hơn."
      ],
      tasks: [
        {
          label: "Part 1 – Topic: Exams and preparation",
          prompt: "Let’s talk about exams.<br>1. How do you usually feel before an important exam?<br>2. What do you normally do the night before a big test?<br>3. Do you think exams are a good way to measure a person’s ability? Why or why not?",
          prep: 0,
          time: 90,
          model: [
            "Q1: To be honest, I usually feel a bit nervous, especially in the morning. But I’ve learnt that a little stress is actually helpful, because it keeps me focused. Once the test starts, I normally calm down.",
            "Q2: I try not to study anything new. Instead, I quickly review my notes, prepare everything I need — my ID card, pencils and admission slip — and then go to bed early. A good night’s sleep makes a huge difference.",
            "Q3: Partly, yes. Exams are a fair way to compare many people under the same conditions. However, they only show how someone performs on one particular day, so they can’t measure things like creativity or teamwork. I think they should be combined with other kinds of assessment."
          ]
        }
      ],
      phrases: [
        ["Sorry, could you repeat the question, please?", "Xin lỗi, thầy/cô có thể nhắc lại câu hỏi được không ạ?"],
        ["To be honest, …", "Thành thật mà nói, …"],
        ["That’s an interesting question. Let me think…", "Đó là một câu hỏi thú vị. Để tôi nghĩ một chút…"],
        ["What I mean is…", "Ý tôi là…"],
        ["Partly, yes. However, …", "Một phần là vậy. Tuy nhiên, …"],
        ["… makes a huge difference.", "… tạo ra khác biệt rất lớn."],
        ["I think they should be combined with…", "Tôi nghĩ chúng nên được kết hợp với…"]
      ]
    }
  ],
  vocab: [
    ["candidate", "thí sinh"],
    ["admission slip", "giấy báo dự thi"],
    ["ID card", "căn cước / chứng minh thư"],
    ["invigilator", "giám thị"],
    ["examiner", "giám khảo"],
    ["be switched off", "được tắt (thiết bị)"],
    ["locker", "tủ khoá cá nhân"],
    ["in advance", "trước, sớm"],
    ["nervous", "lo lắng, hồi hộp"],
    ["assessment", "sự đánh giá, bài kiểm tra"]
  ],
  tip: "Checklist ngày thi: ✔ Ngủ đủ 7–8 tiếng đêm trước ✔ Mang CCCD + giấy báo dự thi + bút chì, tẩy ✔ Đến sớm 30 phút ✔ Nghe: lỡ câu nào bỏ qua ngay ✔ Đọc: ~15 phút/bài, không sa lầy ✔ Viết: Task 2 trước nếu muốn chắc điểm (40 phút), để 5 phút soát lỗi ✔ Nói: nói hết giờ, hỏi lại khi không nghe rõ. Bạn đã sẵn sàng – chúc thi tốt!"
};
