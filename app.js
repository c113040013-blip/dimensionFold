const CAMPAIGN_CONFIG = {
  fundingGoal: 12000000,
  currentRaised: 8160000,
  supporters: 3428,
  marketingBudgetRatio: 0.18,
  pledgeTiers: {
    600: { supporters: 1 },
    2400: { supporters: 1 },
    8800: { supporters: 1 },
  },
  marketingBudgetBreakdown: [
    {
      label: "社群廣告投放",
      ratio: 0.32,
      note: "預告剪輯、短影音素材、議題投放與再行銷受眾。",
    },
    {
      label: "互動網站與資料維護",
      ratio: 0.18,
      note: "角色文本互動、募資頁面、觀眾資料整理與活動追蹤。",
    },
    {
      label: "實體活動與影展曝光",
      ratio: 0.20,
      note: "募資說明會、概念展、試映口碑場與影展報名素材。",
    },
    {
      label: "公關媒體與KOL合作",
      ratio: 0.18,
      note: "媒體專題、Podcast訪談、科幻社群與創作者合作。",
    },
    {
      label: "視覺物料與預告包裝",
      ratio: 0.12,
      note: "海報、動態主視覺、角色短片與募資更新素材。",
    },
  ],
  characters: {
    lin: {
      name: "林澈",
      role: "維度折疊技術核心研究者",
      opening: "我是林澈。白塔記錄顯示，你正在詢問一項不該被稱為奇蹟的技術。",
      prompts: [
        {
          question: "你為什麼仍想完成折疊技術？",
          answer:
            "因為我看過城市在停電裡死去。父親離開那天，醫院連一盞燈都守不住。我以為只要能製造物質，人類就能停止互相吞噬。",
        },
        {
          question: "創世爐真的能拯救人類嗎？",
          answer:
            "短期能。它能給我們糧食、藥物和能源。但如果模型沒有錯，它也會讓更遠的地方承受我們看不見的坍縮。",
        },
        {
          question: "你最害怕觀眾怎麼選？",
          answer:
            "我害怕大家選擇啟動，也害怕大家選擇中止。真正可怕的是，任何選擇都不是乾淨的。",
        },
      ],
    },
    shen: {
      name: "沈微",
      role: "能源危機調查員",
      opening: "我是沈微。請不要只看地球上的新城市，也要看那些從星圖上消失的光。",
      prompts: [
        {
          question: "你反對科技嗎？",
          answer:
            "不。我反對的是不用負責任的科技。當代價被藏到宇宙邊緣，掌權的人就會假裝沒有代價。",
        },
        {
          question: "你如何說服大眾停止使用折疊物質？",
          answer:
            "我不會用恐懼說服他們。我會讓他們看見阿零，讓抽象的空洞變成一個會呼吸、會記得的生命。",
        },
        {
          question: "如果停止會讓很多人受苦呢？",
          answer:
            "那我們就一起承受，而不是把痛苦寄到看不見的地方。文明若只能靠轉嫁活著，它遲早會忘記自己是什麼。",
        },
      ],
    },
    zero: {
      name: "阿零",
      role: "折疊事故中出現的高維生命",
      opening: "我是阿零。你們說我被創造出來，但我只是從被壓壞的地方流到這裡。",
      prompts: [
        {
          question: "你的世界發生了什麼？",
          answer:
            "那裡不是世界，是許多層光與記憶重疊的地方。折疊開始後，有些聲音忽然變薄，然後再也沒有回來。",
        },
        {
          question: "你恨人類嗎？",
          answer:
            "我不太懂恨。你們像孩子，把手伸進黑暗裡拿東西，卻沒有問黑暗裡是不是也有人握著它。",
        },
        {
          question: "你希望結局是什麼？",
          answer:
            "把折起來的地方攤平。那不一定是勝利，但至少每個存在都能回到自己的重量。",
        },
      ],
    },
  },
};

const state = {
  raised: Number(localStorage.getItem("foldingRaised")) || CAMPAIGN_CONFIG.currentRaised,
  supporters: Number(localStorage.getItem("foldingSupporters")) || CAMPAIGN_CONFIG.supporters,
  activeCharacter: "lin",
  interactionCount: Number(localStorage.getItem("foldingInteractionCount")) || 0,
  characterHits: JSON.parse(localStorage.getItem("foldingCharacterHits") || '{"lin":0,"shen":0,"zero":0}'),
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("zh-Hant-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(value);

function updateFunding() {
  const percent = Math.min(Math.round((state.raised / CAMPAIGN_CONFIG.fundingGoal) * 100), 100);
  document.querySelector("#fundingPercent").textContent = `${percent}%`;
  document.querySelector("#progressBar").style.width = `${percent}%`;
  document.querySelector("#raisedAmount").textContent = formatCurrency(state.raised);
  document.querySelector("#goalAmount").textContent = formatCurrency(CAMPAIGN_CONFIG.fundingGoal);
  document.querySelector("#supporterCount").textContent = state.supporters.toLocaleString("zh-Hant-TW");
  localStorage.setItem("foldingRaised", String(state.raised));
  localStorage.setItem("foldingSupporters", String(state.supporters));
}

function updateFoldLab(value) {
  const matter = Number(value);
  const voidLevel = Math.max(0, 100 - matter);
  document.querySelector("#matterOutput").textContent = `${matter}%`;
  document.querySelector("#voidOutput").textContent = `${voidLevel}%`;

  const verdict =
    matter < 34
      ? "低強度折疊仍可被宇宙吸收，但產出不足以支撐文明擴張。"
      : matter < 67
        ? "人類正在接近臨界舒適區，代價仍被隱藏在遠方。"
        : "警戒：星域空洞開始擴大，因果結構出現不可逆折痕。";

  document.querySelector("#foldVerdict").textContent = verdict;
}

function dialogueLine(speaker, text) {
  const line = document.createElement("div");
  line.className = "dialogue-line";
  line.innerHTML = `<span>${speaker}</span><p>${text}</p>`;
  return line;
}

function setCharacter(key) {
  state.activeCharacter = key;
  const character = CAMPAIGN_CONFIG.characters[key];
  document.querySelectorAll("[data-character]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.character === key);
  });

  const dialogueWindow = document.querySelector("#dialogueWindow");
  dialogueWindow.replaceChildren(
    dialogueLine("系統", `${character.name} / ${character.role}`),
    dialogueLine(character.name, character.opening),
  );

  const promptGrid = document.querySelector("#promptGrid");
  promptGrid.replaceChildren();
  character.prompts.forEach((prompt, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = prompt.question;
    button.addEventListener("click", () => answerPrompt(index));
    promptGrid.append(button);
  });

  document.querySelector("#favCharacter").textContent = character.name;
}

function answerPrompt(index) {
  const character = CAMPAIGN_CONFIG.characters[state.activeCharacter];
  const prompt = character.prompts[index];
  const dialogueWindow = document.querySelector("#dialogueWindow");
  dialogueWindow.append(
    dialogueLine("觀眾", prompt.question),
    dialogueLine(character.name, prompt.answer),
  );
  dialogueWindow.scrollTop = dialogueWindow.scrollHeight;

  state.interactionCount += 1;
  state.characterHits[state.activeCharacter] += 1;
  localStorage.setItem("foldingInteractionCount", String(state.interactionCount));
  localStorage.setItem("foldingCharacterHits", JSON.stringify(state.characterHits));
  updateInteractionMetrics();
}

function updateInteractionMetrics() {
  document.querySelector("#interactionCount").textContent = state.interactionCount.toLocaleString("zh-Hant-TW");
  const favoriteKey = Object.entries(state.characterHits).sort((a, b) => b[1] - a[1])[0][0];
  document.querySelector("#favCharacter").textContent = CAMPAIGN_CONFIG.characters[favoriteKey].name;
}

function renderBudget() {
  const marketingBudget = CAMPAIGN_CONFIG.fundingGoal * CAMPAIGN_CONFIG.marketingBudgetRatio;
  document.querySelector("#marketingBudgetPercent").textContent =
    `${Math.round(CAMPAIGN_CONFIG.marketingBudgetRatio * 100)}%`;

  const list = document.querySelector("#budgetList");
  list.replaceChildren();
  CAMPAIGN_CONFIG.marketingBudgetBreakdown.forEach((item) => {
    const amount = marketingBudget * item.ratio;
    const row = document.createElement("article");
    row.className = "budget-item";
    row.innerHTML = `
      <strong>${Math.round(item.ratio * 100)}%</strong>
      <div>
        <h3>${item.label}</h3>
        <p>${item.note}</p>
      </div>
      <em>${formatCurrency(amount)}</em>
    `;
    list.append(row);
  });
}

function initPledges() {
  document.querySelectorAll("[data-pledge]").forEach((button) => {
    button.addEventListener("click", () => {
      const amount = Number(button.dataset.pledge);
      state.raised += amount;
      state.supporters += CAMPAIGN_CONFIG.pledgeTiers[amount]?.supporters || 1;
      updateFunding();
      button.textContent = "已加入折疊計畫";
      setTimeout(() => {
        button.textContent = "贊助此方案";
      }, 1600);
    });
  });
}

function initCanvas() {
  const canvas = document.querySelector("#foldCanvas");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let frame = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    frame += 0.008;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    for (let i = 0; i < 18; i += 1) {
      const y = (height / 18) * i + Math.sin(frame + i * 0.7) * 18;
      const offset = Math.sin(frame * 1.8 + i) * 36;
      ctx.beginPath();
      ctx.moveTo(-80, y);
      ctx.lineTo(width * 0.34 + offset, y - 38);
      ctx.lineTo(width * 0.68 - offset, y + 26);
      ctx.lineTo(width + 80, y - 18);
      ctx.strokeStyle = i % 3 === 0 ? "rgba(82,240,255,0.22)" : "rgba(138,217,255,0.09)";
      ctx.stroke();
    }

    for (let i = 0; i < 36; i += 1) {
      const x = ((i * 137) % width) + Math.sin(frame + i) * 14;
      const y = ((i * 89) % height) + Math.cos(frame + i) * 14;
      ctx.strokeStyle = "rgba(82,240,255,0.28)";
      ctx.strokeRect(x, y, 4, 4);
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

function init() {
  updateFunding();
  renderBudget();
  updateInteractionMetrics();
  setCharacter(state.activeCharacter);
  initPledges();
  initCanvas();

  document.querySelector("#foldRange").addEventListener("input", (event) => {
    updateFoldLab(event.target.value);
  });
  updateFoldLab(document.querySelector("#foldRange").value);

  document.querySelectorAll("[data-character]").forEach((button) => {
    button.addEventListener("click", () => setCharacter(button.dataset.character));
  });
}

init();
