const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");

const hero = document.querySelector(".hero");
const quizArea = document.getElementById("quizArea");
const resultArea = document.getElementById("resultArea");

const questionCount = document.getElementById("questionCount");
const questionText = document.getElementById("questionText");
const choices = document.getElementById("choices");
const progressBar = document.getElementById("progressBar");

const resultRarity = document.getElementById("resultRarity");
const resultTitle = document.getElementById("resultTitle");
const resultCatch = document.getElementById("resultCatch");
const resultDescription = document.getElementById("resultDescription");
const resultStrength = document.getElementById("resultStrength");
const resultWeakness = document.getElementById("resultWeakness");
const resultMatch = document.getElementById("resultMatch");

let currentQuestion = 0;
let scores = {};
let finalResult = null;

const questions = [
  {
    text: "休日、急に予定が空いた。どうする？",
    answers: [
      { text: "外に出て面白そうな場所を探す", tags: ["action", "free", "chaos"] },
      { text: "家で好きなものを作る・見る", tags: ["creative", "solo", "world"] },
      { text: "友達や誰かに連絡する", tags: ["social", "bright", "love"] },
      { text: "寝る。まず回復が大事", tags: ["calm", "stable", "myspace"] }
    ]
  },
  {
    text: "人からよく言われるのは？",
    answers: [
      { text: "自由すぎる", tags: ["free", "chaos", "cat"] },
      { text: "発想が変わってる", tags: ["idea", "creative", "magic"] },
      { text: "なんか人気ある", tags: ["social", "charm", "bright"] },
      { text: "意外としっかりしてる", tags: ["stable", "realist", "support"] }
    ]
  },
  {
    text: "一番テンションが上がる瞬間は？",
    answers: [
      { text: "いいアイデアを思いついた時", tags: ["idea", "spark", "creative"] },
      { text: "勝負で勝てそうな時", tags: ["action", "king", "power"] },
      { text: "自分の世界観が形になった時", tags: ["world", "artist", "magic"] },
      { text: "誰かに喜ばれた時", tags: ["love", "support", "gentle"] }
    ]
  },
  {
    text: "苦手なのはどれ？",
    answers: [
      { text: "細かいルールで縛られること", tags: ["free", "rebel", "cat"] },
      { text: "何も起きない退屈な時間", tags: ["action", "chaos", "hero"] },
      { text: "自分のこだわりを雑に扱われること", tags: ["artist", "world", "magic"] },
      { text: "空気が悪い場所にいること", tags: ["support", "gentle", "calm"] }
    ]
  },
  {
    text: "あなたの強みは？",
    answers: [
      { text: "ノリと行動力", tags: ["action", "bright", "hero"] },
      { text: "観察力と分析力", tags: ["observe", "realist", "shadow"] },
      { text: "感性と世界観", tags: ["artist", "world", "magic"] },
      { text: "人を安心させる力", tags: ["gentle", "support", "love"] }
    ]
  },
  {
    text: "ピンチの時のあなたは？",
    answers: [
      { text: "とりあえず動く", tags: ["action", "hero", "power"] },
      { text: "一回黙って考える", tags: ["observe", "shadow", "realist"] },
      { text: "勢いで突破する", tags: ["chaos", "rebel", "spark"] },
      { text: "誰かを守る側に回る", tags: ["support", "gentle", "king"] }
    ]
  },
  {
    text: "創作や仕事で大事にしたいのは？",
    answers: [
      { text: "面白さ", tags: ["chaos", "idea", "bright"] },
      { text: "完成度", tags: ["realist", "stable", "craft"] },
      { text: "世界観", tags: ["world", "artist", "magic"] },
      { text: "人に届くこと", tags: ["love", "social", "support"] }
    ]
  },
  {
    text: "あなたの中にある“裏の顔”は？",
    answers: [
      { text: "明るいけど、実はかなり考えてる", tags: ["bright", "shadow", "observe"] },
      { text: "優しいけど、譲れないものがある", tags: ["gentle", "king", "world"] },
      { text: "ふざけてるけど、勝負には本気", tags: ["action", "power", "hero"] },
      { text: "静かだけど、内側はかなり濃い", tags: ["solo", "artist", "magic"] }
    ]
  },
  {
    text: "自分を動物に例えるなら？",
    answers: [
      { text: "猫", tags: ["cat", "free", "charm"] },
      { text: "狼", tags: ["solo", "king", "power"] },
      { text: "狐", tags: ["magic", "observe", "shadow"] },
      { text: "犬", tags: ["love", "support", "bright"] }
    ]
  },
  {
    text: "最後に。あなたが一番ほしいものは？",
    answers: [
      { text: "自由", tags: ["free", "cat", "rebel"] },
      { text: "刺激", tags: ["action", "chaos", "hero"] },
      { text: "自分だけの世界", tags: ["world", "artist", "magic"] },
      { text: "安心できる居場所", tags: ["love", "support", "calm"] }
    ]
  }
];

const types = [
  {
    name: "安定の村人タイプ",
    title: "番人",
    rarity: "N",
    image: "images/guardian-villager.png",
    tags: ["stable", "calm", "support"],
    catch: "普通に見えて、実は一番生活力がある人。",
    description: "派手ではないけど、周りをちゃんと見ていて安定感があるタイプ。困った時にいてくれると地味に最強です。",
    strength: "落ち着き、継続力、安心感。",
    weakness: "刺激が強すぎる場所では疲れやすい。",
    match: "ノリで世界を変えるタイプ"
  },
  {
    name: "リアクション芸人タイプ",
    title: "盛り上げ役",
    rarity: "N",
    image: "images/reaction-entertainer.png",
    tags: ["bright", "social", "chaos"],
    catch: "いるだけで空気が死なないタイプ。",
    description: "反応がいいので、周りが話しやすくなる人。本人は普通にしているつもりでも場を明るくしています。",
    strength: "空気を軽くする力、親しみやすさ。",
    weakness: "疲れていても明るく振る舞いすぎる。",
    match: "観察眼バケモノタイプ"
  },
  {
    name: "なんとなく人気者タイプ",
    title: "人たらし",
    rarity: "N",
    image: "images/natural-charmer.png",
    tags: ["social", "charm", "bright"],
    catch: "理由は分からない。でも人が寄ってくる。",
    description: "自然体なのに人を惹きつけるタイプ。狙っていない時ほど魅力が出ます。",
    strength: "親しみやすさ、愛嬌、人を巻き込む力。",
    weakness: "人間関係の面倒ごとに巻き込まれやすい。",
    match: "一匹狼クリエイタータイプ"
  },
  {
    name: "マイペース職人タイプ",
    title: "職人",
    rarity: "N",
    image: "images/my-pace-craftsperson.png",
    tags: ["craft", "solo", "stable"],
    catch: "黙って作って、気づいたら完成させる人。",
    description: "自分のペースを大事にする職人タイプ。派手な宣言より、手を動かすことで力を出します。",
    strength: "集中力、作業力、自分のペースを守る力。",
    weakness: "急かされると一気にやる気が落ちる。",
    match: "優しき常識人タイプ"
  },
  {
    name: "優しき常識人タイプ",
    title: "ブレーキ役",
    rarity: "N",
    image: "images/kind-common-sense.png",
    tags: ["gentle", "support", "stable"],
    catch: "暴走する人たちの命綱。",
    description: "周りの空気を見ながら、ちゃんと支えられるタイプ。優しいだけじゃなく、現実を見る力もあります。",
    strength: "気配り、調整力、安心感。",
    weakness: "自分の本音を後回しにしがち。",
    match: "愛されトラブルメーカータイプ"
  },

  {
    name: "気まぐれ天才タイプ",
    title: "天才肌",
    rarity: "R",
    image: "images/whimsical-genius.png",
    tags: ["idea", "spark", "free"],
    catch: "やる時は神。やらない時は石。",
    description: "ひらめきに全振りしたタイプ。気分が乗った時の爆発力がすごいです。",
    strength: "発想力、瞬発力、独自性。",
    weakness: "継続とルーティンがかなり苦手。",
    match: "現実主義の夢追い人タイプ"
  },
  {
    name: "ノリで世界を変えるタイプ",
    title: "革命児",
    rarity: "R",
    image: "images/vibe-revolutionary.png",
    tags: ["action", "bright", "rebel"],
    catch: "考える前に動く。結果、何かが起きる。",
    description: "勢いと行動力で場を動かすタイプ。雑に見えて、突破力はかなり高いです。",
    strength: "行動力、突破力、巻き込み力。",
    weakness: "細かい確認を飛ばして事故ることがある。",
    match: "優しき常識人タイプ"
  },
  {
    name: "一匹狼クリエイタータイプ",
    title: "一匹狼",
    rarity: "R",
    image: "images/lone-wolf-creator.png",
    tags: ["solo", "creative", "craft"],
    catch: "群れない。でも作品が強い。",
    description: "一人の時間で力を育てるタイプ。自分の好きなものにはかなり深く潜れます。",
    strength: "集中力、独自性、制作力。",
    weakness: "人に説明する前に自己完結しがち。",
    match: "なんとなく人気者タイプ"
  },
  {
    name: "ツッコミ支配者タイプ",
    title: "ツッコミ役",
    rarity: "R",
    image: "images/tsukkomi-master.png",
    tags: ["observe", "realist", "social"],
    catch: "周りのボケを全部処理する有能。",
    description: "空気のズレや違和感にすぐ気づくタイプ。場を整える能力が高いです。",
    strength: "観察力、判断力、言語化力。",
    weakness: "ツッコミ役を背負いすぎて疲れる。",
    match: "リアクション芸人タイプ"
  },
  {
    name: "癒し系ラスボスタイプ",
    title: "ラスボス",
    rarity: "R",
    image: "images/healing-final-boss.png",
    tags: ["gentle", "king", "calm"],
    catch: "優しい。でも芯が強すぎる。",
    description: "柔らかい雰囲気なのに、内側に強い信念を持っているタイプ。怒らせると一番怖いかもしれません。",
    strength: "包容力、芯の強さ、落ち着き。",
    weakness: "限界まで我慢してから急に離れる。",
    match: "カリスマ野良猫タイプ"
  },

  {
    name: "深夜に覚醒するタイプ",
    title: "夜型",
    rarity: "SR",
    image: "images/midnight-awakener.png",
    tags: ["creative", "world", "spark"],
    catch: "夜になるほど創造力がバグる。",
    description: "静かな時間に本領発揮するタイプ。頭の中で物語やアイデアが勝手に育ちます。",
    strength: "発想力、没入力、妄想力。",
    weakness: "生活リズムが犠牲になりやすい。",
    match: "安定の村人タイプ"
  },
  {
    name: "感情ジェットコースタータイプ",
    title: "表現者",
    rarity: "SR",
    image: "images/emotional-rollercoaster.png",
    tags: ["love", "artist", "chaos"],
    catch: "感情の振れ幅が作品の燃料。",
    description: "感じる力が強いタイプ。良くも悪くも心が動きやすく、それが魅力になります。",
    strength: "表現力、共感力、熱量。",
    weakness: "気分に振り回されやすい。",
    match: "癒し系ラスボスタイプ"
  },
  {
    name: "計画破壊型チャレンジャータイプ",
    title: "挑戦者",
    rarity: "SR",
    image: "images/plan-breaker-challenger.png",
    tags: ["action", "chaos", "rebel"],
    catch: "予定通りに進まない。でも面白い。",
    description: "決められた道より、現場判断で進むタイプ。トラブルすらイベントに変えます。",
    strength: "対応力、勢い、チャレンジ精神。",
    weakness: "計画を守るのが苦手。",
    match: "現実主義の夢追い人タイプ"
  },
  {
    name: "観察眼バケモノタイプ",
    title: "観察者",
    rarity: "SR",
    image: "images/monster-observer.png",
    tags: ["observe", "shadow", "realist"],
    catch: "人の違和感にすぐ気づく。",
    description: "言葉よりも態度や空気を読むタイプ。細かい変化を見抜く力があります。",
    strength: "洞察力、分析力、危機察知。",
    weakness: "見えすぎて疲れる。",
    match: "リアクション芸人タイプ"
  },
  {
    name: "愛されトラブルメーカータイプ",
    title: "問題児",
    rarity: "SR",
    image: "images/lovable-troublemaker.png",
    tags: ["charm", "chaos", "bright"],
    catch: "問題を起こす。でもなぜか嫌われない。",
    description: "場を引っかき回すけど、どこか憎めないタイプ。存在そのものがイベントです。",
    strength: "愛嬌、勢い、場を動かす力。",
    weakness: "やりすぎると本気で怒られる。",
    match: "優しき常識人タイプ"
  },

  {
    name: "陽キャな陰の参謀タイプ",
    title: "参謀",
    rarity: "SSR",
    image: "images/bright-shadow-strategist.png",
    tags: ["bright", "shadow", "observe"],
    catch: "明るいのに、裏でめちゃくちゃ考えてる。",
    description: "ノリがいいのに頭の中はかなり冷静なタイプ。表と裏のギャップが強いです。",
    strength: "社交性、分析力、立ち回り力。",
    weakness: "本音を見せる相手を選びすぎる。",
    match: "主人公補正タイプ"
  },
  {
    name: "孤独を楽しむ王様タイプ",
    title: "王様",
    rarity: "SSR",
    image: "images/solitary-king.png",
    tags: ["solo", "king", "power"],
    catch: "一人でも強い。誰かといても強い。",
    description: "群れなくても自分の価値を保てるタイプ。自分の城を持っています。",
    strength: "自立心、決断力、存在感。",
    weakness: "頼るのが下手。",
    match: "癒し系ラスボスタイプ"
  },
  {
    name: "ロマン暴走機関車タイプ",
    title: "夢追い人",
    rarity: "SSR",
    image: "images/romantic-runaway-train.png",
    tags: ["action", "world", "hero"],
    catch: "夢と勢いで突き進む。止まらない。",
    description: "理屈よりロマンで動くタイプ。熱量が高く、周りを巻き込む力があります。",
    strength: "情熱、行動力、夢を見る力。",
    weakness: "現実の細かい部分を後回しにしがち。",
    match: "現実主義の夢追い人タイプ"
  },
  {
    name: "感性爆発アーティストタイプ",
    title: "芸術家",
    rarity: "SSR",
    image: "images/sensibility-artist.png",
    tags: ["artist", "creative", "magic"],
    catch: "理屈より雰囲気で全部持っていく。",
    description: "感覚で魅せるタイプ。言葉にしにくい魅力を作品や雰囲気で出せます。",
    strength: "センス、表現力、独自の空気感。",
    weakness: "説明を求められると困る。",
    match: "観察眼バケモノタイプ"
  },
  {
    name: "現実主義の夢追い人タイプ",
    title: "実現者",
    rarity: "SSR",
    image: "images/practical-dreamer.png",
    tags: ["realist", "world", "craft"],
    catch: "夢を見る。でもちゃんと形にする。",
    description: "理想だけで終わらせず、現実に落とし込もうとするタイプ。かなり強い作り手です。",
    strength: "実行力、構成力、現実を見る力。",
    weakness: "理想と現実の差で苦しくなりやすい。",
    match: "ロマン暴走機関車タイプ"
  },

  {
    name: "カリスマ野良猫タイプ",
    title: "カリスマ",
    rarity: "UR",
    image: "images/charisma-cat.png",
    tags: ["cat", "free", "charm"],
    catch: "自由すぎるのに、なぜか人を惹きつける。",
    description: "縛られるのが苦手だけど、自由にしている時ほど魅力が出るタイプ。懐く相手は自分で決めます。",
    strength: "自由さ、魅力、直感的な行動力。",
    weakness: "管理されると一気に冷める。",
    match: "癒し系ラスボスタイプ"
  },
  {
    name: "笑顔の革命家タイプ",
    title: "反逆者",
    rarity: "UR",
    image: "images/smiling-rebel.png",
    tags: ["rebel", "bright", "idea"],
    catch: "楽しそうに既存ルールを壊す。",
    description: "重い空気を軽くしながら、新しい道を作るタイプ。反骨心がポップに出ます。",
    strength: "発想力、改革力、明るさ。",
    weakness: "退屈なルールに耐えられない。",
    match: "ツッコミ支配者タイプ"
  },
  {
    name: "美学で生きる魔術師タイプ",
    title: "魔術師",
    rarity: "UR",
    image: "images/aesthetic-magician.png",
    tags: ["magic", "artist", "world"],
    catch: "自分の世界観が強い。センスで殴る。",
    description: "独自の美学を持つタイプ。好き嫌いがはっきりしていて、世界観で人を惹きつけます。",
    strength: "センス、世界観、こだわり。",
    weakness: "理解されないと一気に距離を取る。",
    match: "一匹狼クリエイタータイプ"
  },
  {
    name: "爆速ひらめきモンスタータイプ",
    title: "発明家",
    rarity: "UR",
    image: "images/rapid-idea-monster.png",
    tags: ["spark", "idea", "chaos"],
    catch: "思いつく速度が異常。ただし飽きるのも早い。",
    description: "アイデアの出力が早いタイプ。頭の中で常に何かが動いています。",
    strength: "ひらめき、スピード、発想量。",
    weakness: "形にする前に次へ行きがち。",
    match: "現実主義の夢追い人タイプ"
  },
  {
    name: "優しい狂気タイプ",
    title: "異端者",
    rarity: "UR",
    image: "images/gentle-madness.png",
    tags: ["gentle", "magic", "chaos"],
    catch: "人には優しい。でも発想が普通じゃない。",
    description: "優しさと変な発想が同居しているタイプ。穏やかな顔でかなり尖ったことを考えています。",
    strength: "独創性、優しさ、深み。",
    weakness: "普通を求められると苦しい。",
    match: "感性爆発アーティストタイプ"
  },

  {
    name: "世界観の創造主タイプ",
    title: "創造主",
    rarity: "LR",
    image: "images/world-creator.png",
    tags: ["world", "creative", "king"],
    catch: "自分の中に一つの国がある。",
    description: "頭の中に濃い世界を持っているタイプ。作品、思想、雰囲気すべてに自分らしさが出ます。",
    strength: "構築力、創造力、世界観。",
    weakness: "現実に戻るのが面倒になる。",
    match: "美学で生きる魔術師タイプ"
  },
  {
    name: "混沌を飼いならす王タイプ",
    title: "支配者",
    rarity: "LR",
    image: "images/chaos-ruler.png",
    tags: ["chaos", "king", "power"],
    catch: "トラブルも素材にする。強すぎ。",
    description: "普通なら崩れる場面でも、むしろ燃えるタイプ。混乱の中で存在感が増します。",
    strength: "胆力、対応力、支配力。",
    weakness: "平和すぎると退屈する。",
    match: "計画破壊型チャレンジャータイプ"
  },
  {
    name: "主人公補正タイプ",
    title: "主人公",
    rarity: "LR",
    image: "images/main-character.png",
    tags: ["hero", "action", "charm"],
    catch: "なぜか事件が起きる。なぜか乗り越える。",
    description: "人生にイベントが起きやすいタイプ。本人が望んでいなくても、物語の中心に立ちがちです。",
    strength: "存在感、行動力、逆境への強さ。",
    weakness: "平穏に暮らしたい時も騒がしくなる。",
    match: "陽キャな陰の参謀タイプ"
  },
  {
    name: "幻のラスボス味方タイプ",
    title: "隠しボス",
    rarity: "LR",
    image: "images/hidden-boss-ally.png",
    tags: ["shadow", "king", "magic"],
    catch: "敵に回したくない。でも味方なら最強。",
    description: "普段は目立たなくても、いざという時の圧がすごいタイプ。静かに強いです。",
    strength: "洞察力、威圧感、切り札感。",
    weakness: "本気を出すまで分かりにくい。",
    match: "カリスマ野良猫タイプ"
  },
  {
    name: "自由に愛された伝説タイプ",
    title: "伝説",
    rarity: "LR",
    image: "images/free-legend.png",
    tags: ["free", "love", "cat"],
    catch: "縛られるほど逃げる。自由なほど輝く。",
    description: "自由でいることが魅力になるタイプ。誰かに所有されるより、信頼されることで力を出します。",
    strength: "魅力、自由さ、愛され力。",
    weakness: "束縛や過干渉にかなり弱い。",
    match: "癒し系ラスボスタイプ"
  }
];

function startQuiz() {
  currentQuestion = 0;
  scores = {};

  hero.classList.add("hidden");
  resultArea.classList.add("hidden");
  quizArea.classList.remove("hidden");

  showQuestion();
}

function showQuestion() {
  const question = questions[currentQuestion];

  questionCount.textContent = `Q${currentQuestion + 1} / ${questions.length}`;
  questionText.textContent = question.text;
  choices.innerHTML = "";

  const progress = (currentQuestion / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = answer.text;

    button.addEventListener("click", () => {
      addScore(answer.tags);
      nextQuestion();
    });

    choices.appendChild(button);
  });
}

function addScore(tags) {
  tags.forEach((tag) => {
    scores[tag] = (scores[tag] || 0) + 1;
  });
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  progressBar.style.width = "100%";

  finalResult = getBestType();

  quizArea.classList.add("hidden");
  resultArea.classList.remove("hidden");

  resultRarity.textContent = `${finalResult.rarity}｜${finalResult.title}`;
  resultTitle.textContent = finalResult.name;
  resultCatch.textContent = finalResult.catch;
  resultDescription.textContent = finalResult.description;
  resultStrength.textContent = finalResult.strength;
  resultWeakness.textContent = finalResult.weakness;
  resultMatch.textContent = finalResult.match;

  resultImage.src = finalResult.image;
  resultImage.alt = finalResult.name;
}

function getBestType() {
  let bestType = types[0];
  let bestScore = -1;

  types.forEach((type) => {
    let typeScore = 0;

    type.tags.forEach((tag) => {
      typeScore += scores[tag] || 0;
    });

    // 同点なら少しだけランダムにして結果が固定されすぎないようにする
    typeScore += Math.random() * 0.3;

    if (typeScore > bestScore) {
      bestScore = typeScore;
      bestType = type;
    }
  });

  return bestType;
}

function retryQuiz() {
  resultArea.classList.add("hidden");
  hero.classList.remove("hidden");
}

async function copyResult() {
  if (!finalResult) return;

  const text = `レアキャラ性格診断の結果は…
【${finalResult.rarity}】${finalResult.name}

${finalResult.catch}

#レアキャラ性格診断
https://yuruori.com/type/`;

  try {
    await navigator.clipboard.writeText(text);
    shareBtn.textContent = "コピーした！";
    setTimeout(() => {
      shareBtn.textContent = "結果をコピー";
    }, 1600);
  } catch (error) {
    alert("コピーに失敗しました。");
  }
}

const typeListToggle = document.getElementById("typeListToggle");
const typeList = document.getElementById("typeList");

typeListToggle.addEventListener("click", () => {
  typeList.classList.toggle("hidden");

  typeListToggle.textContent = typeList.classList.contains("hidden")
    ? "タイプ一覧を見る"
    : "タイプ一覧を閉じる";
});

startBtn.addEventListener("click", startQuiz);
retryBtn.addEventListener("click", retryQuiz);
shareBtn.addEventListener("click", copyResult);
