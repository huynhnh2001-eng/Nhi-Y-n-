(window.VSTEP_DAYS = window.VSTEP_DAYS || {})[3] = {
  day: 3,
  title: "Nghe thông báo du lịch & Đọc đoạn 1",
  topic: "Travel",
  goal: "Luyện tiếp Listening Part 1 với thông báo ở sân bay, nhà ga, tour du lịch: nhận diện từ tín hiệu và bẫy số. Đọc bài 1 về du lịch và học cách đoán nghĩa từ bằng manh mối ngữ cảnh.",
  sections: [
    {
      type: "listening",
      part: 1,
      lesson: [
        "<b>Phân loại câu hỏi trước khi nghe:</b> câu hỏi <em>mục đích</em> (<em>Why is the speaker calling? What is the announcement mainly about?</em>) cần ý tổng quát – thường nằm ở 1–2 câu đầu; câu hỏi <em>chi tiết</em> (giờ, số, địa điểm) cần nghe chính xác một cụm.",
        "<b>Bám vào từ tín hiệu:</b> <em>unfortunately, however, but, actually, please note, instead</em> báo hiệu thông tin quan trọng hoặc thông tin bị thay đổi sắp xuất hiện. Thông tin đứng sau những từ này thường là đáp án.",
        "<b>Bẫy số:</b> -teen và -ty khác nhau ở trọng âm (<em>thir<b>TEEN</b></em> nhấn cuối, <em><b>THIR</b>ty</em> nhấn đầu). Với giờ, nhớ các cách nói <em>quarter to eight</em> (7:45), <em>half past seven</em> (7:30), <em>delayed by 35 minutes</em> (phải tự cộng).",
        "<b>Ghi chú siêu nhanh:</b> khi câu hỏi liên quan đến con số, viết ngay mọi con số nghe được kèm một ký hiệu: “7:15 ✗ → 7:50 ✓”, “gate 12”. Không cố viết cả câu.",
        "<b>Cả 4 phương án thường đều được nhắc đến:</b> đề VSTEP hay đưa mọi phương án vào bài nghe, nhưng chỉ một phương án đúng với <em>câu hỏi</em>. Hãy tự hỏi: “Phương án này được nói đến trong vai trò gì – bị hủy, là lựa chọn khác, hay là đáp án?”",
        "<b>Câu hỏi NOT:</b> (<em>Which is NOT included?</em>) – vừa nghe vừa gạch bỏ những phương án được xác nhận; phương án còn lại hoặc phương án bị phủ định (<em>not included, isn’t available</em>) là đáp án."
      ],
      items: [
        {
          label: "Announcement 1",
          context: "At a railway station",
          tip: "Câu hỏi giờ khởi hành hiện tại: bài sẽ có giờ gốc, số phút bị trễ và giờ mới. Đừng chọn giờ in trên vé hay tự cộng nhẩm; chờ nghe câu nêu giờ dự kiến mới (<em>now expected to…</em>).",
          script: [
            { sp: "F", text: "Good morning. This is an announcement for passengers travelling on the seven fifteen service to Hue. Unfortunately, this train has been delayed by thirty-five minutes because of a technical problem further down the line. It is now expected to depart at seven fifty from platform four, not platform two as shown on your ticket. Refreshments are available in the waiting room. We apologise for the delay." }
          ],
          questions: [
            { q: "What time is the train to Hue now expected to leave?",
              opts: ["7:15", "7:35", "7:50", "8:15"],
              a: 2,
              why: "“It is now expected to depart at <b>seven fifty</b>” (7:15 + 35 phút = 7:50). 7:15 là giờ cũ; 7:35 là bẫy ghép số “thirty-five”; 8:15 không xuất hiện." }
          ]
        },
        {
          label: "Announcement 2",
          context: "At an airport departure gate",
          tip: "Câu hỏi “Who … first”: nghe lời mời lên máy bay trước (<em>invite … to board first</em>) và phân biệt với nhóm được yêu cầu chờ (<em>remain seated</em>). Đáp án thường được diễn đạt lại bằng từ khác.",
          script: [
            { sp: "M", text: "Ladies and gentlemen, flight VN two-five-four to Singapore is now ready for boarding at gate twelve. We would like to invite passengers travelling with young children, and anyone who needs special assistance, to board first. All other passengers are kindly asked to remain seated until their row number is called. Please have your passport and boarding pass ready to show to our staff." }
          ],
          questions: [
            { q: "Who will be allowed to board the plane first?",
              opts: ["Families with small children and people who need help", "Passengers with seats in the front rows", "Business class passengers", "Passengers without hand luggage"],
              a: 0,
              why: "“invite passengers <b>travelling with young children</b>, and anyone who <b>needs special assistance</b>, to board first” → paraphrase: <em>small children, people who need help</em>. Số hàng ghế (<em>row number</em>) dành cho những hành khách còn lại." }
          ]
        },
        {
          label: "Announcement 3",
          context: "A tour guide speaking to a group",
          tip: "Câu hỏi điểm hẹn: hướng dẫn viên sẽ nhắc một địa điểm rồi phủ định nó (<em>we won't meet…</em>). Chờ nghe từ <em>Instead</em> để biết điểm hẹn thật.",
          script: [
            { sp: "F", text: "OK, everyone, we'll stop here at the Imperial City for about an hour and a half. You're free to explore on your own. Please be back by eleven thirty. And just to be clear, we won't meet at the main entrance where we came in – it gets far too crowded. Instead, come straight back to the car park and look for our bus. It's number twenty-seven, with a blue stripe." }
          ],
          questions: [
            { q: "Where should the tourists meet at the end of the visit?",
              opts: ["At the main entrance", "Inside the Imperial City", "At the ticket office", "At the bus in the car park"],
              a: 3,
              why: "“we won't meet at the main entrance … <b>Instead, come straight back to the car park and look for our bus</b>”. Main entrance là phương án bị loại bằng <em>won't</em> – bẫy kinh điển." }
          ]
        },
        {
          label: "Announcement 4",
          context: "A telephone message from a hotel",
          tip: "Câu hỏi mục đích cuộc gọi: thông tin đặt phòng chỉ là bối cảnh. Nghe phần sau <em>I'm afraid…</em> – nơi người gọi nêu vấn đề và hướng xử lý – rồi tóm lại bằng một động từ (hủy? đổi? đề nghị?).",
          script: [
            { sp: "M", text: "Hello, this is Daniel from the Sunrise Hotel calling for Mr Kim about your booking for three nights from the twelfth of July. I'm afraid the sea-view room you requested is no longer available. We can offer you a garden-view room at the same price, or a sea-view suite for an extra twenty dollars a night. Could you call us back on 0236 555 0199 to let us know which you'd prefer?" }
          ],
          questions: [
            { q: "Why is Daniel calling Mr Kim?",
              opts: ["To cancel his hotel booking", "To offer him a choice of other rooms", "To change the dates of his stay", "To ask him to pay a deposit"],
              a: 1,
              why: "“the sea-view room you requested is <b>no longer available</b>. We can offer you a garden-view room … or a sea-view suite” → khách sạn đưa ra các lựa chọn thay thế. Đặt phòng không bị hủy và ngày ở (<em>three nights from the twelfth</em>) không đổi." }
          ]
        },
        {
          label: "Announcement 5",
          context: "At a ferry terminal",
          tip: "Câu hỏi về một mốc giờ cụ thể: bài có rất nhiều giờ (chuyến bị hủy, chuyến thay thế, giờ thông báo, giờ đóng cửa). Ghi nhanh “giờ – sự việc” khi nghe để không ghép nhầm.",
          script: [
            { sp: "F", text: "Attention, please. Because of strong winds, the two o'clock ferry to Cat Ba Island has been cancelled. Passengers may transfer their tickets to the four thirty ferry, but please be aware that this sailing has not yet been confirmed. We will make a further announcement at three thirty. Alternatively, you can get a full refund at the ticket office, which is open until six." }
          ],
          questions: [
            { q: "What will happen at 3:30?",
              opts: ["The next ferry will leave for Cat Ba.", "The ticket office will close.", "Passengers will receive more information.", "Refunds will start to be given."],
              a: 2,
              why: "“We will make <b>a further announcement at three thirty</b>” → sẽ có thêm thông tin. Chuyến tiếp theo là 4:30 (chưa chắc chạy), phòng vé mở <em>until six</em>." }
          ]
        },
        {
          label: "Announcement 6",
          context: "A radio advertisement for a travel agency",
          tip: "Câu hỏi NOT included: khi nghe danh sách trong giá tour, gạch từng phương án được nhắc là có; chú ý paraphrase (<em>transport</em> = vé xe, <em>accommodation</em> = khách sạn) và câu phủ định <em>are not included</em>.",
          script: [
            { sp: "M", text: "Looking for a cool escape this summer? Green Hills Travel is offering a four-day tour of Da Lat for just three point five million dong. The price includes return coach tickets, three nights in a comfortable hotel and breakfast every morning. Lunch and dinner are not included, so you can try the local restaurants yourself. Book before the thirtieth of June and you'll get a ten per cent discount." }
          ],
          questions: [
            { q: "Which of the following is NOT included in the price of the tour?",
              opts: ["Hotel accommodation", "Breakfast", "Transport to Da Lat", "Evening meals"],
              a: 3,
              why: "“Lunch and <b>dinner are not included</b>” → <em>evening meals</em> = dinner. Ba thứ còn lại đều được liệt kê: <em>return coach tickets</em> (xe đi về), <em>three nights in a hotel</em>, <em>breakfast</em>." }
          ]
        },
        {
          label: "Announcement 7",
          context: "On a city sightseeing bus",
          tip: "Câu hỏi việc phải làm cuối hành trình: nghe cụm thời gian <em>When you finish…</em> rồi động từ mệnh lệnh theo sau; thông tin về vé, tần suất xe và ngôn ngữ thuyết minh chỉ là nhiễu.",
          script: [
            { sp: "F", text: "Welcome aboard the City Explorer sightseeing bus. Your ticket is valid for twenty-four hours, so you can get off and back on at any of our twelve stops. Buses run every fifteen minutes. You'll find headphones in the pocket of the seat in front of you, with commentary in eight languages. When you finish your journey, please leave the headphones in the box by the door." }
          ],
          questions: [
            { q: "What are passengers asked to do at the end of their journey?",
              opts: ["Return the headphones", "Show their tickets to the driver", "Buy a ticket for the next day", "Choose a commentary language"],
              a: 0,
              why: "“When you finish your journey, please <b>leave the headphones in the box by the door</b>” → trả lại tai nghe. Chọn ngôn ngữ là việc làm trong lúc đi, không phải lúc kết thúc." }
          ]
        },
        {
          label: "Announcement 8",
          context: "A voicemail message from a friend",
          tip: "Câu hỏi điểm hẹn: bài nhắc nhiều nơi (sân bay, xe buýt, quán cà phê). Chú ý câu phủ định <em>Please don't…</em> và cụm <em>we can meet at…</em> để chọn đúng nơi gặp cuối cùng.",
          script: [
            { sp: "M", text: "Hi Mai, it's Jack. Bad news, I'm afraid – my flight from Bangkok has been delayed, so I'll land at about nine forty instead of eight. Please don't drive to the airport to pick me up; it'll be too late for you. I'll take the airport bus into town, and we can meet at the café opposite the Opera House at around eleven. See you there!" }
          ],
          questions: [
            { q: "Where will Mai and Jack meet?",
              opts: ["At the airport", "At a café near the Opera House", "At the bus station", "At Mai's house"],
              a: 1,
              why: "“we can meet at <b>the café opposite the Opera House</b>” (<em>opposite</em> = đối diện, được diễn đạt lại thành <em>near</em>). Jack bảo Mai <em>don't drive to the airport</em>, nên A là bẫy." }
          ]
        }
      ]
    },
    {
      type: "reading",
      passage: 1,
      lesson: [
        "<b>Đoán nghĩa từ bằng manh mối ngữ cảnh:</b> tìm (1) từ đồng nghĩa hoặc giải thích ngay sau dấu phẩy/gạch ngang; (2) từ trái nghĩa sau <em>but, however, instead of, rather than</em>; (3) ví dụ sau <em>such as, for example</em>.",
        "<b>Nhận ra paraphrase trong câu hỏi chi tiết:</b> đáp án đúng hầu như không chép nguyên văn bài đọc. Phương án lặp lại nhiều từ trong bài nhưng sai ý thường là bẫy.",
        "<b>Câu NOT TRUE:</b> với mỗi phương án, tìm câu tương ứng trong bài và ghi T/F bên cạnh. Phương án <em>sai so với bài</em> (F) là đáp án – khác với <em>NOT mentioned</em> (không được nhắc đến).",
        "<b>Quy chiếu với <em>this/that/these</em>:</b> các từ này có thể thay cho <em>cả một ý</em> ở câu trước chứ không chỉ một danh từ. Đọc lại toàn bộ câu trước để xác định.",
        "<b>Câu hỏi về mục đích của đoạn văn:</b> hỏi “Tại sao tác giả viết đoạn này?” – đoạn có ví dụ thì mục đích thường là <em>to illustrate</em>, đoạn có <em>however</em> thì thường là <em>to present a problem/contrast</em>.",
        "<b>Phân bổ thời gian:</b> bài 1 dễ nhất – cố gắng làm trong 12 phút để dành thời gian cho bài 3 và 4 khó hơn."
      ],
      title: "The Rise of Slow Travel",
      text: [
        "For many years, the typical holiday involved visiting as many famous places as possible in a short time. Tourists rushed from one city to the next, took hundreds of photos and returned home exhausted. Recently, however, a growing number of travellers have chosen a different approach, known as “slow travel”.",
        "The idea is simple: instead of seeing ten places in ten days, slow travellers stay in one area for a longer period. They often rent an apartment rather than book a hotel, shop at local markets and use public transport or bicycles. Some even sign up for short cooking or language classes during their stay. This allows them to experience daily life in a destination, not just its tourist attractions.",
        "Supporters say that slow travel has several benefits. First, it is less stressful, because there is no need to pack a suitcase every two days. Second, it can be cheaper, since weekly or monthly rentals usually cost less per night than hotels. Third, it is better for the environment, as travellers take fewer flights and long car journeys.",
        "Slow travel also benefits local communities. When visitors spend their money in small family-run cafés and shops, the income stays in the area instead of going to large international companies. In addition, travellers who stay longer are more likely to learn a few words of the local language and form genuine connections with residents.",
        "Of course, this style of travel is not for everyone. People with only a few days of annual leave may feel they cannot afford to spend their whole holiday in a single town. Nevertheless, even a short trip can be slower: choosing two destinations instead of five, and spending whole days in each, might be the first step."
      ],
      gloss: [
        ["For many years,","Trong nhiều năm,","cụm thời gian mở đầu đoạn"],
        ["visiting as many famous places as possible","tham quan càng nhiều nơi nổi tiếng càng tốt","as many + N + as possible: càng nhiều… càng tốt"],
        ["rushed from one city to the next","vội vã đi từ thành phố này sang thành phố khác","from one … to the next"],
        ["returned home exhausted","trở về nhà kiệt sức","V + adj: trạng thái khi làm việc gì"],
        ["a growing number of travellers have chosen","ngày càng nhiều du khách đã chọn","a growing number of + N số nhiều + V số nhiều"],
        ["a different approach, known as","một cách tiếp cận khác, được gọi là","Mệnh đề quan hệ rút gọn bị động: (which is) known as"],
        ["instead of seeing ten places in ten days","thay vì xem mười nơi trong mười ngày","instead of + V-ing"],
        ["rent an apartment rather than book a hotel","thuê căn hộ thay vì đặt khách sạn","A rather than B: hai vế cùng dạng (V – V)"],
        ["sign up for short cooking or language classes","đăng ký các lớp nấu ăn hoặc ngôn ngữ ngắn hạn","sign up for + N: đăng ký"],
        ["This allows them to experience daily life","Điều này cho phép họ trải nghiệm cuộc sống thường ngày","allow sb to + V"],
        ["not just its tourist attractions","chứ không chỉ các điểm du lịch","not just: không chỉ"],
        ["there is no need to pack a suitcase","không cần phải xếp vali","there is no need to + V"],
        ["since weekly or monthly rentals usually cost less per night","vì thuê theo tuần hoặc tháng thường rẻ hơn tính theo đêm","since = because; cost less: rẻ hơn"],
        ["take fewer flights and long car journeys","đi ít chuyến bay và hành trình ô tô dài hơn","fewer + N đếm được số nhiều"],
        ["small family-run cafés and shops","quán cà phê và cửa hàng nhỏ do gia đình tự kinh doanh","Tính từ ghép: family-run"],
        ["the income stays in the area instead of going to","thu nhập ở lại trong vùng thay vì chảy về","stay in + nơi; instead of + V-ing"],
        ["In addition,","Ngoài ra,","từ nối bổ sung ý"],
        ["are more likely to learn a few words","có nhiều khả năng học được vài từ","be more likely to + V: có khả năng cao hơn"],
        ["form genuine connections with residents","tạo mối quan hệ chân thành với người dân","form a connection with sb"],
        ["this style of travel is not for everyone","kiểu du lịch này không dành cho tất cả mọi người","be not for everyone: không hợp với ai cũng"],
        ["cannot afford to spend their whole holiday","không thể để dành cả kỳ nghỉ","can’t afford to + V: không đủ điều kiện (thời gian/tiền) để"],
        ["Nevertheless,","Tuy vậy,","từ nối nhượng bộ, trang trọng hơn however"]
      ],
      questions: [
        { q: "According to paragraph 1, how did tourists often feel after a typical holiday?",
          opts: ["Relaxed", "Very tired", "Disappointed", "Excited"],
          a: 1,
          why: "Đoạn 1: “returned home <b>exhausted</b>” → exhausted = rất mệt (very tired)." },
        { q: "Which of the following is NOT typical of slow travellers, according to paragraph 2?",
          opts: ["Renting an apartment", "Buying food at local markets", "Travelling by bicycle", "Visiting many cities in a short time"],
          a: 3,
          why: "Đoạn 2 mô tả slow travellers “stay in one area for a longer period”, trái ngược với việc đi nhiều thành phố trong thời gian ngắn. A, B, C đều được nhắc: <em>rent an apartment, shop at local markets, use … bicycles</em>." },
        { q: "The word “This” in paragraph 2 refers to",
          opts: ["the way slow travellers live during their stay", "a hotel", "public transport", "a famous tourist attraction"],
          a: 0,
          why: "“<b>This</b> allows them to experience daily life” – <em>This</em> thay cho cả ý ở câu trước: thuê căn hộ, đi chợ địa phương, dùng phương tiện công cộng, học lớp nấu ăn…, tức là <em>cách sống</em> của họ trong chuyến đi." },
        { q: "According to paragraph 3, why can slow travel be cheaper?",
          opts: ["Public transport is free in most cities.", "Travellers do not need to buy souvenirs.", "Long-term rentals cost less per night than hotels.", "Flights are cheaper for long stays."],
          a: 2,
          why: "Đoạn 3: “weekly or monthly rentals usually <b>cost less per night than hotels</b>” → <em>long-term rentals</em> là cách diễn đạt lại của <em>weekly or monthly rentals</em>." },
        { q: "The phrase “family-run” in paragraph 4 is closest in meaning to",
          opts: ["very popular with families", "owned and managed by a family", "selling food for children", "open only at weekends"],
          a: 1,
          why: "“small <b>family-run</b> cafés” được đặt đối lập với “large international companies” → quán do một gia đình sở hữu và điều hành." },
        { q: "According to paragraph 4, how does slow travel help local communities?",
          opts: ["Visitors spend money in small local businesses.", "Tourists teach residents foreign languages.", "International companies open more shops.", "Local people get free holidays."],
          a: 0,
          why: "Đoạn 4: “When visitors spend their money in small family-run cafés and shops, <b>the income stays in the area</b>”. B đảo ngược ý: chính du khách học tiếng địa phương." },
        { q: "The word “genuine” in paragraph 4 is closest in meaning to",
          opts: ["short", "expensive", "real", "official"],
          a: 2,
          why: "“form <b>genuine</b> connections with residents” – mối quan hệ thật sự, chân thành → <em>real</em>." },
        { q: "Which statement is NOT TRUE according to the passage?",
          opts: ["Slow travel is less stressful than a typical holiday.", "Slow travellers usually take fewer flights.", "Slow travel is suitable for everyone.", "Even a short trip can be made slower."],
          a: 2,
          why: "Đoạn 5: “this style of travel is <b>not for everyone</b>” → C sai so với bài. A (đoạn 3: less stressful), B (đoạn 3: fewer flights), D (đoạn 5: even a short trip can be slower) đều đúng." },
        { q: "Why does the writer mention people with only a few days of annual leave?",
          opts: ["To show that slow travel has become very popular", "To give an example of a group who may find slow travel difficult", "To criticise companies that give short holidays", "To explain how to find a cheap apartment"],
          a: 1,
          why: "Đoạn 5 mở đầu bằng “this style of travel is <b>not for everyone</b>”, ngay sau đó là ví dụ về người có ít ngày nghỉ → họ là nhóm khó áp dụng slow travel." },
        { q: "What is the passage mainly about?",
          opts: ["The problems of mass tourism in big cities", "How to plan a cheap holiday abroad", "A different way of travelling and its advantages", "The history of public transport for tourists"],
          a: 2,
          why: "Bài giới thiệu “slow travel” (đoạn 1–2), lợi ích cho du khách và cộng đồng (đoạn 3–4) và hạn chế (đoạn 5). B quá hẹp (chỉ là một lợi ích ở đoạn 3)." }
      ]
    }
  ],
  vocab: [
    ["delayed", "bị hoãn, bị trễ"],
    ["depart", "khởi hành"],
    ["boarding pass", "thẻ lên máy bay"],
    ["platform", "sân ga"],
    ["refund", "tiền hoàn lại"],
    ["destination", "điểm đến"],
    ["tourist attractions", "điểm tham quan du lịch"],
    ["exhausted", "kiệt sức"],
    ["residents", "cư dân, người dân địa phương"],
    ["annual leave", "kỳ nghỉ phép năm"]
  ],
  tip: "Nghe thấy <em>Unfortunately…</em> hoặc <em>I’m afraid…</em> ở đầu thông báo thì gần như chắc chắn sắp có thay đổi (hoãn, hủy, đổi địa điểm) – hãy chuẩn bị ghi lại thông tin MỚI ngay sau đó."
};
