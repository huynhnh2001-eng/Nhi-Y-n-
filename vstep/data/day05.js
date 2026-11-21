(window.VSTEP_DAYS = window.VSTEP_DAYS || {})[5] = {
  day: 5,
  title: "Nghe thông báo y tế & Đọc đoạn 2",
  topic: "Health",
  goal: "Luyện Listening Part 1 với tin nhắn phòng khám, hướng dẫn dùng thuốc và thông báo sức khỏe: tập suy ra người nói, bối cảnh và lời khuyên. Lần đầu làm bài đọc số 2 (dài hơn, có câu hỏi suy luận).",
  sections: [
    {
      type: "listening",
      part: 1,
      lesson: [
        "<b>Suy ra bối cảnh từ từ khóa:</b> một số câu hỏi là <em>Who is probably speaking? / Where is this announcement?</em>. Nghe cụm “đặc trưng”: <em>prescription, tablets</em> → hiệu thuốc; <em>ward, visiting hours</em> → bệnh viện; <em>check-up, appointment</em> → phòng khám.",
        "<b>Câu hỏi “người nghe nên làm gì”:</b> đáp án thường theo sau các cấu trúc mệnh lệnh và khuyên bảo: <em>Please…, Make sure you…, Remember to…, You’ll need to…, It’s important to…</em>. Còn <em>Don’t…, Avoid…</em> báo hiệu điều KHÔNG nên làm – hay bị đảo thành bẫy.",
        "<b>Câu điều kiện là nơi giấu bẫy:</b> <em>If you need to cancel, … / Unless …</em> – đáp án chỉ đúng khi điều kiện khớp với câu hỏi. Đọc kỹ câu hỏi đang hỏi trường hợp nào.",
        "<b>Nghe đến hết câu cuối:</b> người nói hay thêm ngoại lệ ở cuối (<em>except…, but not if…</em>). Đừng khoanh đáp án khi mới nghe được nửa đoạn.",
        "<b>Xây “ngân hàng từ đồng nghĩa” theo chủ đề:</b> với Health: <em>GP = doctor, medicine = medication, tablets = pills, sleepy = drowsy, appointment = booking</em>. Đề VSTEP rất hay paraphrase theo các cặp này.",
        "<b>Tự kiểm tra 2 giây:</b> sau khi chọn, đọc lại từ để hỏi (When/Why/What should…) và xác nhận đáp án trả lời <em>đúng</em> câu đó – nhiều bạn chọn một thông tin đúng nhưng trả lời cho câu hỏi khác."
      ],
      items: [
        {
          label: "Announcement 1",
          context: "A voicemail from a medical centre",
          script: [
            { sp: "F", text: "Hello, this message is for Ms Thu. This is Riverside Medical Centre calling to remind you about your appointment with Dr Patel tomorrow morning at ten forty. As this is your first visit, please arrive ten minutes early so that you can fill in a short registration form. Please also bring your insurance card and a list of any medication you're currently taking. Thank you." }
          ],
          questions: [
            { q: "What time should Ms Thu arrive at the medical centre?",
              opts: ["10:10", "10:30", "10:40", "10:50"],
              a: 1,
              why: "Lịch hẹn lúc 10:40, nhưng “please <b>arrive ten minutes early</b>” → phải đến lúc 10:30. 10:40 là giờ hẹn với bác sĩ – bẫy cho người chỉ nghe con số." }
          ]
        },
        {
          label: "Announcement 2",
          context: "At a pharmacy",
          script: [
            { sp: "M", text: "Right, here's your prescription. You need to take two tablets three times a day, always after meals, because they can upset your stomach if you take them on an empty stomach. They might make you feel a bit drowsy, so I'd avoid driving while you're taking them. And it's important to finish the whole packet, even if you start to feel better after a few days." }
          ],
          questions: [
            { q: "What does the pharmacist advise?",
              opts: ["Taking the tablets before meals", "Stopping the medicine once the patient feels better", "Not driving while taking the tablets", "Taking one tablet a day"],
              a: 2,
              why: "“They might make you feel a bit drowsy, so <b>I'd avoid driving</b>” → không lái xe. A sai (<em>always after meals</em>), B sai (<em>finish the whole packet, even if you start to feel better</em>), D sai (<em>two tablets three times a day</em>)." }
          ]
        },
        {
          label: "Announcement 3",
          context: "At a fitness centre",
          script: [
            { sp: "F", text: "Attention, all members. The swimming pool will be closed from Monday to Wednesday next week for its annual deep clean. We're sorry for any inconvenience. During this time, you're welcome to use the pool at our Northside branch free of charge – just show your membership card at reception there. Please note that the gym and all fitness classes here will run as normal." }
          ],
          questions: [
            { q: "What can members do while the pool is closed?",
              opts: ["Get a refund for those days", "Join extra fitness classes for free", "Use the gym at a reduced price", "Swim at another branch without paying"],
              a: 3,
              why: "“you're welcome to use the pool at <b>our Northside branch free of charge</b>” → bơi ở chi nhánh khác miễn phí. Gym và các lớp “will run as normal” – không có gì thêm hay giảm giá." }
          ]
        },
        {
          label: "Announcement 4",
          context: "A health tip on the radio",
          script: [
            { sp: "M", text: "And now for today's health tip. Doctors recommend that adults do at least one hundred and fifty minutes of moderate exercise every week. That's just thirty minutes, five days a week. The good news is that it doesn't have to happen in a gym – brisk walking, cycling to work or even gardening all count. And if you're busy, you can split it into shorter sessions of ten minutes at a time." }
          ],
          questions: [
            { q: "According to the speaker, which statement is true?",
              opts: ["Exercise only counts if it is done in a gym.", "Adults should exercise for fifty minutes a day.", "Exercise can be done in several short sessions.", "Gardening is not a useful form of exercise."],
              a: 2,
              why: "“you can <b>split it into shorter sessions</b> of ten minutes at a time” → C. A trái với “it doesn't have to happen in a gym”; B là bẫy số (150 phút/tuần, không phải 50 phút/ngày); D sai vì gardening “all count”." }
          ]
        },
        {
          label: "Announcement 5",
          context: "At a hospital",
          script: [
            { sp: "F", text: "Welcome to Ward Six. Visiting hours are from two to four in the afternoon and from six to eight in the evening. To allow patients to rest, a maximum of two visitors per patient is allowed at any one time. For hygiene reasons, flowers are not permitted on the ward, so please leave them with the staff at the main reception. Thank you for your cooperation." }
          ],
          questions: [
            { q: "What are visitors told to do with flowers?",
              opts: ["Leave them at the main reception", "Put them beside the patient's bed", "Buy them from the hospital shop", "Take them home after the visit"],
              a: 0,
              why: "“flowers are not permitted on the ward, so please <b>leave them with the staff at the main reception</b>”. B là điều bị cấm (<em>not permitted on the ward</em>)." }
          ]
        },
        {
          label: "Announcement 6",
          context: "An announcement on a university campus",
          script: [
            { sp: "M", text: "The Red Cross will be holding a blood donation day this Saturday in the sports hall, from eight a.m. until four p.m. Anyone aged between eighteen and sixty who is in good health can donate. Please make sure you eat a proper breakfast and drink plenty of water beforehand. However, if you've had a cold or flu in the past week, we kindly ask you to wait until next time." }
          ],
          questions: [
            { q: "What should donors do before giving blood?",
              opts: ["Avoid eating breakfast", "Drink a lot of water", "Register online", "Bring a friend to donate"],
              a: 1,
              why: "“Please <b>make sure you</b> eat a proper breakfast and <b>drink plenty of water</b> beforehand” → <em>plenty of</em> = <em>a lot of</em>. A ngược với lời khuyên; C, D không được nhắc đến." }
          ]
        },
        {
          label: "Announcement 7",
          context: "A voicemail from a dental clinic",
          script: [
            { sp: "F", text: "Hi, this is Lisa from Bright Smile Dental Clinic. I'm calling about your check-up with Dr Nam this Thursday at three. Unfortunately, Dr Nam is ill and won't be in on Thursday, so we need to move your appointment. We can offer you Friday at nine a.m. or Monday at four fifteen. Friday is filling up quickly, so please ring us back as soon as you can." }
          ],
          questions: [
            { q: "What is the main purpose of the message?",
              opts: ["To remind the patient about a check-up on Thursday", "To tell the patient about a new dentist", "To ask the patient to pay for a missed appointment", "To arrange a new time for an appointment"],
              a: 3,
              why: "“Dr Nam is ill … so <b>we need to move your appointment</b>. We can offer you Friday … or Monday” → đổi lịch hẹn. A là bẫy: lịch thứ Năm đã bị hủy, không phải được nhắc lại." }
          ]
        },
        {
          label: "Announcement 8",
          context: "In an office building",
          script: [
            { sp: "M", text: "Good morning, everyone. From next month, the staff canteen will be offering a healthier menu. Every day there'll be at least two dishes marked with a green leaf symbol, which means the meal contains fewer than six hundred calories and plenty of vegetables. Prices will stay the same. We'll also be giving out free fruit every Friday, so do come and help yourselves." }
          ],
          questions: [
            { q: "What does the green leaf symbol on a dish show?",
              opts: ["The meal is low in calories and contains plenty of vegetables.", "The meal is suitable for vegetarians.", "The meal is cheaper than other dishes.", "The meal includes free fruit."],
              a: 0,
              why: "“a green leaf symbol, which means the meal contains <b>fewer than six hundred calories and plenty of vegetables</b>”. Bài không nói món chay (B); giá “will stay the same” (C); trái cây miễn phí chỉ có vào thứ Sáu (D)." }
          ]
        }
      ]
    },
    {
      type: "reading",
      passage: 2,
      lesson: [
        "<b>Bài 2 khác bài 1 ở đâu:</b> dài hơn (~370 từ), từ vựng khó hơn và bắt đầu có <b>câu hỏi suy luận</b> (<em>It can be inferred…, The writer suggests…</em>). Thời gian khuyến nghị: khoảng 14 phút.",
        "<b>Câu suy luận (inference):</b> đáp án KHÔNG được viết thẳng trong bài nhưng phải được bài <em>chứng minh</em>. Tìm đoạn liên quan, rồi chọn phương án là hệ quả hợp lý nhất. Loại các phương án quá mạnh (<em>never, always, all</em>) hoặc thêm thông tin bài không có.",
        "<b>Phân biệt NOT TRUE và NOT mentioned:</b> NOT TRUE = phương án <em>mâu thuẫn</em> với bài (ví dụ bài nói <em>including weekends</em>, phương án nói <em>sleep longer at weekends</em>). NOT mentioned = phương án <em>không xuất hiện</em> trong bài.",
        "<b>Câu hỏi mục đích của bài (purpose):</b> xem tác giả đang <em>giải thích</em> (explain), <em>thuyết phục</em> (persuade), <em>so sánh</em> (compare) hay <em>phê phán</em> (criticise). Bài có phần “vấn đề – nguyên nhân – giải pháp” thường có mục đích <em>to explain… and suggest…</em>.",
        "<b>Quy chiếu xa:</b> ở bài 2, đại từ (<em>they, this</em>) có thể chỉ danh từ ở câu trước đó nữa. Thay thử từng phương án vào chỗ đại từ, phương án nào làm câu hợp nghĩa thì chọn.",
        "<b>Đọc câu hỏi trước, đọc bài sau:</b> lướt nhanh 10 câu hỏi để biết cần tìm gì; gạch chân tên riêng, con số, từ khóa – chúng giúp bạn định vị nhanh khi đọc."
      ],
      title: "Why We Should Take Sleep Seriously",
      text: [
        "Ask people what they do to stay healthy, and most will mention eating well and exercising regularly. Far fewer will mention sleep. Yet scientists increasingly agree that a good night’s rest is just as important as diet and exercise. In many countries, however, people are sleeping less than ever before. Surveys suggest that around one in three adults regularly gets fewer than the seven hours a night recommended by health experts.",
        "Lack of sleep affects the body in a number of ways. In the short term, it makes people less alert and slows their reaction times, which is why tired drivers are responsible for a significant number of road accidents. Over longer periods, poor sleep has been linked to weight gain, high blood pressure and a weaker immune system. People who sleep badly for years are also more likely to suffer from depression and anxiety.",
        "The reasons for this growing problem are not hard to find. Long working hours and long commutes leave less time for rest. Modern technology also plays a part. Many people check their phones in bed, and the blue light from screens tells the brain that it is still daytime. As a result, it becomes harder to fall asleep, even when they feel exhausted.",
        "Fortunately, there are simple steps that can make a real difference. Experts advise going to bed and waking up at the same time every day, including weekends, so that the body develops a regular rhythm. They also recommend keeping the bedroom cool, dark and quiet, and avoiding caffeine in the afternoon. Perhaps most importantly, screens should be switched off at least an hour before bedtime. Some people find it helpful to replace this habit with reading a paper book or listening to calm music.",
        "Some employers have begun to recognise the value of sleep as well. A few companies now allow staff to start work later or even provide quiet rooms where employees can take a short nap during the day. They have found that well-rested workers make fewer mistakes and take fewer sick days. If this trend continues, the old idea that sleeping less is a sign of hard work may finally disappear."
      ],
      questions: [
        { q: "What is the main purpose of the passage?",
          opts: ["To compare sleeping habits in different countries", "To explain why sleep matters and how to improve it", "To advertise a new product that helps people sleep", "To criticise companies that make staff work long hours"],
          a: 1,
          why: "Bài nêu tầm quan trọng của giấc ngủ (đoạn 1), tác hại khi thiếu ngủ (đoạn 2), nguyên nhân (đoạn 3), cách cải thiện (đoạn 4–5) → giải thích + gợi ý. D chỉ là một chi tiết nhỏ ở đoạn 3." },
        { q: "According to paragraph 1, how much sleep do health experts recommend for adults?",
          opts: ["At least five hours a night", "Around six hours a night", "Seven hours a night", "Nine hours a night"],
          a: 2,
          why: "Đoạn 1: “fewer than <b>the seven hours a night recommended by health experts</b>”. Cụm “one in three” là bẫy số, không liên quan đến số giờ ngủ." },
        { q: "The word “alert” in paragraph 2 is closest in meaning to",
          opts: ["awake and able to react quickly", "worried and nervous", "strong and healthy", "calm and relaxed"],
          a: 0,
          why: "“makes people less <b>alert</b> and slows their reaction times” – đi cùng ý phản xạ chậm → <em>alert</em> = tỉnh táo, phản ứng nhanh." },
        { q: "What can be inferred from paragraph 2?",
          opts: ["Tired people should never drive at all.", "Lack of sleep can put other people in danger.", "Most road accidents are caused by poor sleep.", "Sleeping badly for a few days causes depression."],
          a: 1,
          why: "Bài nói “tired drivers are responsible for a significant number of road accidents” → suy ra thiếu ngủ có thể gây nguy hiểm cho người khác. A quá mạnh (<em>never</em>); C sai vì bài chỉ nói <em>a significant number</em>, không phải <em>most</em>; D sai vì bài nói <em>for years</em>." },
        { q: "Which effect of poor sleep is NOT mentioned in paragraph 2?",
          opts: ["Weight gain", "High blood pressure", "Anxiety", "Skin problems"],
          a: 3,
          why: "Đoạn 2 liệt kê “weight gain, high blood pressure and a weaker immune system … depression and anxiety”. Không có <em>skin problems</em>." },
        { q: "According to paragraph 3, why does using a phone in bed make it harder to sleep?",
          opts: ["The light from the screen makes the brain think it is still day.", "People receive too many stressful messages.", "Phones make people feel exhausted.", "The noise from the phone wakes people up."],
          a: 0,
          why: "Đoạn 3: “the blue light from screens <b>tells the brain that it is still daytime</b>”. B và D nghe hợp lý nhưng không có trong bài." },
        { q: "According to paragraph 4, which of the following is NOT advised by experts?",
          opts: ["Going to bed at the same time every night", "Sleeping later than usual at weekends", "Keeping the bedroom dark and quiet", "Not drinking coffee in the afternoon"],
          a: 1,
          why: "Đoạn 4: đi ngủ và thức dậy cùng giờ “every day, <b>including weekends</b>” → ngủ muộn hơn vào cuối tuần là trái với lời khuyên. D là paraphrase của <em>avoiding caffeine in the afternoon</em>." },
        { q: "The word “nap” in paragraph 5 is closest in meaning to",
          opts: ["light meal", "exercise break", "team meeting", "short sleep"],
          a: 3,
          why: "“quiet rooms where employees can take a short <b>nap</b>” – phòng yên tĩnh, ngay sau đó nói về <em>well-rested workers</em> → nap = giấc ngủ ngắn." },
        { q: "The word “They” in paragraph 5 refers to",
          opts: ["employees", "quiet rooms", "companies that support their staff’s rest", "sick days"],
          a: 2,
          why: "“A few <b>companies</b> now allow staff to start work later or even provide quiet rooms… <b>They</b> have found that well-rested workers make fewer mistakes” – chủ thể “nhận thấy” nhân viên ít mắc lỗi hơn là các công ty, không phải bản thân nhân viên." },
        { q: "What does the writer suggest about the idea that sleeping less shows hard work?",
          opts: ["It is supported by scientific research.", "It is becoming more popular among managers.", "It may soon be seen as old-fashioned.", "It only applies to people with long commutes."],
          a: 2,
          why: "Câu cuối: “the <b>old idea</b> that sleeping less is a sign of hard work <b>may finally disappear</b>” → quan niệm này có thể sớm bị coi là lỗi thời. Cả bài chứng minh điều ngược lại với A." }
      ]
    }
  ],
  vocab: [
    ["appointment", "cuộc hẹn (khám bệnh)"],
    ["prescription", "đơn thuốc"],
    ["drowsy", "buồn ngủ, lơ mơ"],
    ["check-up", "buổi khám tổng quát, kiểm tra định kỳ"],
    ["hygiene", "vệ sinh"],
    ["alert", "tỉnh táo"],
    ["immune system", "hệ miễn dịch"],
    ["blood pressure", "huyết áp"],
    ["caffeine", "chất caffeine (trong cà phê, trà)"],
    ["well-rested", "được nghỉ ngơi đầy đủ"]
  ],
  tip: "Gặp câu suy luận ở phần Đọc, hãy loại ngay các phương án chứa từ tuyệt đối như <em>never, always, all, most</em> nếu bài chỉ nói <em>some, a significant number, may</em> – đây là bẫy phổ biến nhất của bài 2."
};
