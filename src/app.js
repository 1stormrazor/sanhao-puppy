const STORAGE_KEY = "sanhaoPuppyGameState";

const ASSETS = {
  dogLogo: "assets/dog/samoyed-logo.png",
  dogMain: "assets/dog/samoyed-main.png",
  tasks: {
    wakeup: "assets/tasks/wakeup.svg",
    breakfast: "assets/tasks/breakfast.svg",
    study: "assets/tasks/study.svg",
    work: "assets/tasks/study.svg",
    sport: "assets/tasks/sport.svg",
    read: "assets/tasks/read.svg",
    sleep: "assets/tasks/sleep.svg",
    walk: "assets/tasks/walk.svg",
    wash: "assets/tasks/wash.svg",
    relax: "assets/items/teddy.svg",
    custom: "assets/tasks/study.svg",
  },
};

const TASK_TYPES = {
  wakeup: "起床",
  breakfast: "早餐",
  study: "学习",
  work: "工作",
  sport: "运动",
  read: "阅读",
  sleep: "睡觉",
  walk: "散步",
  wash: "洗漱",
  relax: "放松",
  custom: "自定义",
};

const TASK_EFFECTS = {
  wakeup: { health: 5, energy: 10, mood: 5 },
  breakfast: { hunger: 20, health: 5 },
  study: { intelligence: 15, energy: -5 },
  work: { intelligence: 15, energy: -5 },
  sport: { health: 15, energy: 5, mood: 10, cleanliness: -5 },
  read: { intelligence: 10, mood: 5 },
  sleep: { health: 10, energy: 20, mood: 5 },
  walk: { mood: 10, health: 5, energy: 5 },
  wash: { cleanliness: 20, mood: 5 },
  relax: { mood: 15, energy: 5 },
  custom: { mood: 5 },
};

const DEFAULT_TASKS = [
  ["起床", "wakeup", "07:30", 20, 20],
  ["早餐", "breakfast", "08:00", 20, 15],
  ["学习/工作", "study", "09:00", 40, 30],
  ["午餐后散步", "walk", "12:30", 20, 20],
  ["运动", "sport", "18:30", 30, 30],
  ["阅读", "read", "21:00", 20, 20],
  ["早睡", "sleep", "23:00", 30, 30],
];

const SHOP_ITEMS = [
  {
    id: "dogFood",
    name: "营养狗粮",
    category: "食物补给",
    price: 50,
    icon: "assets/items/dog-food.svg",
    description: "三好小狗的能量补给，好好吃饭才能更健康。",
    effect: { hunger: 20, health: 5 },
    consumable: true,
  },
  {
    id: "ball",
    name: "玩具球",
    category: "放松玩具",
    price: 60,
    icon: "assets/items/ball.svg",
    description: "三好小狗的放松道具，提醒自己劳逸结合。",
    effect: { mood: 20, energy: 5 },
    consumable: true,
  },
  {
    id: "bone",
    name: "骨头饼干",
    category: "食物补给",
    price: 80,
    icon: "assets/items/bone.svg",
    description: "认真生活后给自己的小奖励。",
    effect: { hunger: 10, mood: 10 },
    consumable: true,
  },
  {
    id: "bath",
    name: "洗澡泡泡",
    category: "清洁整理",
    price: 70,
    icon: "assets/items/bath.svg",
    description: "完成洗漱整理，让自己更清爽。",
    effect: { cleanliness: 25, mood: 5 },
    consumable: true,
  },
  {
    id: "comb",
    name: "梳子",
    category: "清洁整理",
    price: 40,
    icon: "assets/items/comb.svg",
    description: "整理自己，清爽值提升。",
    effect: { cleanliness: 15, mood: 5 },
    consumable: true,
  },
  {
    id: "dogBed",
    name: "小窝",
    category: "休息恢复",
    price: 200,
    icon: "assets/items/dog-bed.svg",
    description: "提醒三好小狗好好休息，当前版本作为收藏奖励。",
    effect: {},
    consumable: false,
  },
  {
    id: "hat",
    name: "小黄帽",
    category: "装饰奖励",
    price: 100,
    icon: "assets/items/hat.svg",
    description: "自律小狗的可爱装饰奖励。",
    effect: {},
    consumable: false,
  },
  {
    id: "feeder",
    name: "自动喂食器",
    category: "功能道具",
    price: 300,
    icon: "assets/items/feeder.svg",
    description: "提醒自己规律饮食，后续可扩展为饮食提醒。",
    effect: {},
    consumable: false,
  },
  {
    id: "teddy",
    name: "小熊玩偶",
    category: "放松玩具",
    price: 100,
    icon: "assets/items/teddy.svg",
    description: "放松一下，给心情充电。",
    effect: { mood: 30 },
    consumable: true,
  },
  {
    id: "shampoo",
    name: "沐浴露",
    category: "清洁整理",
    price: 80,
    icon: "assets/items/shampoo.svg",
    description: "清洁整理，状态焕新。",
    effect: { cleanliness: 20 },
    consumable: true,
  },
];

const ACHIEVEMENT_DEFS = [
  ["firstTask", "自律小狗出发！", "累计完成任务 >= 1", { coins: 20 }, (s) => s.statistics.totalCompletedTasks >= 1],
  ["streak3", "小狗开始变稳了", "连续打卡 3 天", { coins: 50 }, (s) => s.streakDays >= 3],
  ["streak7", "规律作息小狗", "连续打卡 7 天", { diamonds: 5 }, (s) => s.streakDays >= 7],
  ["complete10", "行动力小狗", "累计完成任务 >= 10", { coins: 100 }, (s) => s.statistics.totalCompletedTasks >= 10],
  ["complete50", "超级自律小狗", "累计完成任务 >= 50", { diamonds: 10 }, (s) => s.statistics.totalCompletedTasks >= 50],
  ["firstPurchase", "奖励自己一下", "第一次购买道具", { coins: 20 }, (s) => s.statistics.totalPurchases >= 1],
  ["firstUse", "学会照顾自己", "第一次使用道具", { coins: 20 }, (s) => s.statistics.totalUsedItems >= 1],
  ["level5", "成长中的三好小狗", "升到 5 级", { diamonds: 3 }, (s) => s.dog.level >= 5],
  ["level10", "成熟自律小狗", "升到 10 级", { diamonds: 8 }, (s) => s.dog.level >= 10],
];

const STAT_META = {
  health: ["健康值", "身体状态", "💪", "#62C96B"],
  mood: ["心情值", "情绪状态", "😊", "#FFB84D"],
  hunger: ["饱食值", "好好吃饭", "🍙", "#FF8A3D"],
  cleanliness: ["清洁值", "洗漱整理", "🫧", "#5BAEFF"],
  intelligence: ["聪明值", "学习投入", "📚", "#8A6DFF"],
  energy: ["活力值", "精力状态", "⚡", "#F2C94C"],
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  panels: $$(".view"),
  navButtons: $$(".nav-button"),
  dateLabel: $("#dateLabel"),
  encourageText: $("#encourageText"),
  todayProgress: $("#todayProgress"),
  coinLabel: $("#coinLabel"),
  diamondLabel: $("#diamondLabel"),
  streakLabel: $("#streakLabel"),
  saveStatus: $("#saveStatus"),
  todaySummary: $("#todaySummary"),
  todayTaskList: $("#todayTaskList"),
  todayTaskListAlt: $("#todayTaskListAlt"),
  allTaskList: $("#allTaskList"),
  dogBubble: $("#dogBubble"),
  dogName: $("#dogName"),
  dogIdentity: $("#dogIdentity"),
  dogStage: $("#dogStage"),
  dogLevel: $("#dogLevel"),
  expText: $("#expText"),
  expBar: $("#expBar"),
  statBars: $("#statBars"),
  growthPanel: $("#growthPanel"),
  shopGrid: $("#shopGrid"),
  inventoryGrid: $("#inventoryGrid"),
  achievementGrid: $("#achievementGrid"),
  calendarTitle: $("#calendarTitle"),
  calendarGrid: $("#calendarGrid"),
  calendarDetail: $("#calendarDetail"),
  saveText: $("#saveText"),
  taskDialog: $("#taskDialog"),
  taskForm: $("#taskForm"),
  taskDialogTitle: $("#taskDialogTitle"),
  taskIdInput: $("#taskIdInput"),
  taskTitleInput: $("#taskTitleInput"),
  taskTypeInput: $("#taskTypeInput"),
  taskTimeInput: $("#taskTimeInput"),
  taskCoinsInput: $("#taskCoinsInput"),
  taskExpInput: $("#taskExpInput"),
  toastHost: $("#toastHost"),
};

let state = normalizeState(loadState());
let currentView = "home";
let selectedCalendarDate = getDateKey(new Date());
let visibleMonth = startOfMonth(new Date());

function createDefaultState() {
  const today = getDateKey(new Date());
  return {
    coins: 100,
    diamonds: 5,
    dog: {
      name: "三好小狗",
      level: 1,
      exp: 0,
      stage: "幼年期",
      identity: "自律小狗",
      stats: {
        health: 80,
        mood: 80,
        hunger: 80,
        cleanliness: 80,
        intelligence: 60,
        energy: 80,
      },
    },
    tasks: [],
    inventory: {},
    achievements: {},
    checkinHistory: {},
    streakDays: 0,
    lastActiveDate: today,
    statistics: {
      totalCompletedTasks: 0,
      totalMissedTasks: 0,
      totalEarnedCoins: 0,
      totalPurchases: 0,
      totalUsedItems: 0,
    },
    settings: {
      theme: "warm",
    },
  };
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || createDefaultState();
  } catch {
    return createDefaultState();
  }
}

function normalizeState(raw) {
  const base = createDefaultState();
  const merged = {
    ...base,
    ...raw,
    dog: { ...base.dog, ...(raw.dog || {}) },
    statistics: { ...base.statistics, ...(raw.statistics || {}) },
    settings: { ...base.settings, ...(raw.settings || {}) },
  };
  merged.dog.stats = { ...base.dog.stats, ...(raw.dog?.stats || {}) };
  ACHIEVEMENT_DEFS.forEach(([id]) => {
    if (!merged.achievements[id]) {
      merged.achievements[id] = { unlocked: false, claimed: false, unlockedAt: null };
    }
  });
  refreshStage(merged);
  return merged;
}

function saveGame(showSaved = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (showSaved) {
    elements.saveStatus.textContent = "已自动保存";
  }
}

function getDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayKey() {
  return getDateKey(new Date());
}

function getTasksForDate(dateKey) {
  return state.tasks.filter((task) => task.date === dateKey);
}

function taskStatus(task) {
  if (task.status === "completed" || task.status === "missed") return task.status;
  const now = new Date();
  const taskTime = new Date(`${task.date}T${task.time || "23:59"}:00`);
  const missTime = new Date(taskTime.getTime() + 2 * 60 * 60 * 1000);
  if (now > missTime && task.date <= todayKey()) return "missed";
  if (now >= taskTime && task.date === todayKey()) return "active";
  return "pending";
}

function updateMissedTasks() {
  let changed = false;
  state.tasks.forEach((task) => {
    if (task.status !== "completed" && task.status !== "missed" && taskStatus(task) === "missed") {
      task.status = "missed";
      state.statistics.totalMissedTasks += 1;
      applyStats({ mood: -5, energy: -5 });
      changed = true;
    }
  });
  if (changed) saveGame(false);
}

function ensureDailyRefresh() {
  const today = todayKey();
  if (state.lastActiveDate !== today) {
    state.lastActiveDate = today;
    state.tasks.forEach((task) => {
      if (task.repeatDaily) {
        state.tasks.push({
          ...task,
          id: uid("task"),
          date: today,
          status: "pending",
          completedAt: null,
          createdAt: new Date().toISOString(),
        });
      }
    });
    updateStreak();
    saveGame(false);
  }
}

function ensureHistory(dateKey) {
  const tasks = getTasksForDate(dateKey);
  const completed = tasks.filter((task) => task.status === "completed");
  state.checkinHistory[dateKey] = {
    completedCount: completed.length,
    totalCount: tasks.length,
    earnedCoins: completed.reduce((sum, task) => sum + Number(task.rewardCoins || 0), 0),
    earnedExp: completed.reduce((sum, task) => sum + Number(task.rewardExp || 0), 0),
    fullCompleted: tasks.length > 0 && completed.length === tasks.length,
    tasks: tasks.map((task) => ({
      id: task.id,
      title: task.title,
      type: task.type,
      status: task.status,
      rewardCoins: Number(task.rewardCoins || 0),
      completedAt: task.completedAt,
    })),
  };
}

function updateStreak() {
  let streak = 0;
  let cursor = parseDate(todayKey());
  while (true) {
    const key = getDateKey(cursor);
    ensureHistory(key);
    if ((state.checkinHistory[key]?.completedCount || 0) < 1) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  state.streakDays = streak;
}

function refreshStage(target = state) {
  const level = target.dog.level;
  target.dog.stage = level >= 10 ? "成熟期" : level >= 5 ? "成长期" : "幼年期";
  target.dog.identity = level >= 10 ? "成熟自律小狗" : level >= 5 ? "学习小狗" : "自律小狗";
}

function applyStats(effect) {
  Object.entries(effect).forEach(([key, amount]) => {
    state.dog.stats[key] = clamp((state.dog.stats[key] || 0) + amount);
  });
}

function addExp(amount) {
  state.dog.exp += Number(amount || 0);
  let leveled = false;
  while (state.dog.exp >= state.dog.level * 100) {
    state.dog.exp -= state.dog.level * 100;
    state.dog.level += 1;
    state.coins += 50;
    leveled = true;
  }
  refreshStage();
  if (leveled) toast(`三好小狗升级啦！现在是 Lv.${state.dog.level}，获得 50 金币奖励！`, "success");
}

function checkAchievements() {
  ACHIEVEMENT_DEFS.forEach(([id, , , , condition]) => {
    const ach = state.achievements[id];
    if (!ach.unlocked && condition(state)) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      toast("新成就达成，三好小狗又进步啦！", "success");
    }
  });
}

function completeTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task || task.status === "completed") return;
  task.status = "completed";
  task.completedAt = new Date().toISOString();
  state.coins += Number(task.rewardCoins || 0);
  state.statistics.totalEarnedCoins += Number(task.rewardCoins || 0);
  state.statistics.totalCompletedTasks += 1;
  applyStats(TASK_EFFECTS[task.type] || TASK_EFFECTS.custom);
  addExp(task.rewardExp);
  ensureHistory(task.date);
  updateStreak();
  checkAchievements();
  saveGame();
  toast(randomText(["三好小狗完成任务啦！", "小狗本狗今天也很努力！", "规律生活 +1，三好小狗变强了！"]), "success");
  render();
}

function randomText(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function openTaskDialog(task = null) {
  elements.taskDialogTitle.textContent = task ? "编辑任务" : "新增任务";
  elements.taskIdInput.value = task?.id || "";
  elements.taskTitleInput.value = task?.title || "";
  elements.taskTypeInput.value = task?.type || "study";
  elements.taskTimeInput.value = task?.time || "09:00";
  elements.taskCoinsInput.value = task?.rewardCoins ?? 20;
  elements.taskExpInput.value = task?.rewardExp ?? 20;
  elements.taskDialog.showModal();
}

function saveTaskFromForm() {
  const id = elements.taskIdInput.value;
  const payload = {
    title: elements.taskTitleInput.value.trim(),
    type: elements.taskTypeInput.value,
    time: elements.taskTimeInput.value,
    rewardCoins: Number(elements.taskCoinsInput.value),
    rewardExp: Number(elements.taskExpInput.value),
  };
  if (!payload.title) return;
  if (id) {
    const task = state.tasks.find((item) => item.id === id);
    Object.assign(task, payload);
    toast("任务已更新，自律小狗继续前进！", "success");
  } else {
    state.tasks.push({
      id: uid("task"),
      ...payload,
      status: "pending",
      date: todayKey(),
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
    toast("新任务已加入今日计划！", "success");
  }
  ensureHistory(todayKey());
  saveGame();
  render();
}

function deleteTask(taskId) {
  if (!confirm("确定要删除这个任务吗？")) return;
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  ensureHistory(todayKey());
  saveGame();
  toast("任务已删除。", "normal");
  render();
}

function generateTemplate() {
  const today = todayKey();
  const existing = getTasksForDate(today);
  if (existing.length && !confirm("是否用默认作息覆盖今天的任务？")) return;
  state.tasks = state.tasks.filter((task) => task.date !== today);
  DEFAULT_TASKS.forEach(([title, type, time, rewardCoins, rewardExp]) => {
    state.tasks.push({
      id: uid("task"),
      title,
      type,
      time,
      rewardCoins,
      rewardExp,
      status: "pending",
      date: today,
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
  });
  ensureHistory(today);
  saveGame();
  toast("默认作息已生成，今天的三好小狗也要变好！", "success");
  render();
}

function buyItem(itemId) {
  const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
  if (state.coins < item.price) {
    toast("金币不够啦，先完成几个任务再来买吧！", "warning");
    return;
  }
  state.coins -= item.price;
  state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;
  state.statistics.totalPurchases += 1;
  checkAchievements();
  saveGame();
  toast("购买成功！这是三好小狗给自己的奖励。", "success");
  render();
}

function useItem(itemId) {
  const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
  if (!item) return;
  if (!item.consumable) {
    toast(`${item.name}收藏中，提醒三好小狗继续认真生活。`, "normal");
    return;
  }
  if ((state.inventory[itemId] || 0) <= 0) return;
  state.inventory[itemId] -= 1;
  applyStats(item.effect);
  addExp(5);
  state.statistics.totalUsedItems += 1;
  checkAchievements();
  saveGame();
  toast("小狗本狗今天也在好好照顾自己！", "success");
  render();
}

function quickAction(action) {
  const useFirst = (ids) => ids.find((id) => (state.inventory[id] || 0) > 0);
  if (action === "eat") {
    const item = useFirst(["dogFood", "bone"]);
    if (!item) return toast("背包里没有能量补给啦，去商店兑换后再好好吃饭吧！", "warning");
    useItem(item);
    return;
  }
  if (action === "relax") {
    const item = useFirst(["ball", "teddy"]);
    if (!item) return toast("没有放松道具啦，给自己兑换一点小奖励吧！", "warning");
    useItem(item);
    return;
  }
  if (action === "wash") {
    const item = useFirst(["bath", "shampoo", "comb"]);
    if (!item) return toast("没有清洁整理道具啦，先去商店补充一下。", "warning");
    useItem(item);
    return;
  }
  if (action === "study") {
    if (state.dog.stats.energy < 10) return toast("活力有点低，三好小狗先休息一下再学习吧。", "warning");
    applyStats({ intelligence: 10, energy: -10 });
    addExp(5);
    toast("认真学习的小狗最闪亮！", "success");
  }
  if (action === "rest") {
    applyStats({ energy: 20, mood: 5 });
    toast("早睡成功，明天也会更有精神！", "success");
  }
  checkAchievements();
  saveGame();
  render();
}

function claimAchievement(id) {
  const def = ACHIEVEMENT_DEFS.find(([achId]) => achId === id);
  const ach = state.achievements[id];
  if (!def || !ach.unlocked || ach.claimed) return;
  const reward = def[3];
  state.coins += reward.coins || 0;
  state.diamonds += reward.diamonds || 0;
  ach.claimed = true;
  saveGame();
  toast("成就奖励已领取，三好小狗继续发光！", "success");
  render();
}

function render() {
  updateMissedTasks();
  ensureHistory(todayKey());
  updateStreak();
  checkAchievements();
  renderTopbar();
  renderDogCard();
  renderTasks();
  renderShop();
  renderInventory();
  renderAchievements();
  renderCalendar();
}

function renderTopbar() {
  const today = new Date();
  const todayTasks = getTasksForDate(todayKey());
  const completed = todayTasks.filter((task) => task.status === "completed").length;
  elements.dateLabel.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${"日一二三四五六"[today.getDay()]}`;
  elements.encourageText.textContent = randomText([
    "自律的人会发光，三好小狗陪你一起变好！",
    "今天的三好小狗也要认真生活！",
    "小狗本狗上线，开始今日打卡！",
  ]);
  elements.todayProgress.textContent = `今日 ${completed}/${todayTasks.length}`;
  elements.coinLabel.textContent = `🪙 ${state.coins}`;
  elements.diamondLabel.textContent = `💎 ${state.diamonds}`;
  elements.streakLabel.textContent = `🔥 ${state.streakDays} 天`;
}

function renderDogCard() {
  const need = state.dog.level * 100;
  elements.dogName.textContent = state.dog.name;
  elements.dogIdentity.textContent = state.dog.identity;
  elements.dogStage.textContent = state.dog.stage;
  elements.dogLevel.textContent = `Lv.${state.dog.level}`;
  elements.expText.textContent = `${state.dog.exp}/${need}`;
  elements.expBar.style.width = `${Math.min(100, (state.dog.exp / need) * 100)}%`;
  elements.dogBubble.textContent = state.streakDays >= 3 ? "小狗开始变稳了！" : "自律小狗上线！";
  elements.statBars.innerHTML = Object.entries(STAT_META).map(([key, [name, desc, icon, color]]) => {
    const value = state.dog.stats[key];
    return `
      <div class="stat-bar">
        <div class="progress-label"><span>${icon} ${name}</span><strong>${value}/100</strong></div>
        <div class="mini-desc">${desc}</div>
        <div class="progress-track"><div class="progress-bar" style="width:${value}%;background:${color}"></div></div>
      </div>
    `;
  }).join("");
  elements.growthPanel.innerHTML = `
    <h2>Lv.${state.dog.level} ${state.dog.stage}</h2>
    <p>累计完成任务：${state.statistics.totalCompletedTasks} 个</p>
    <p>累计获得金币：${state.statistics.totalEarnedCoins} 枚</p>
    <p>连续打卡：${state.streakDays} 天</p>
  `;
}

function renderTasks() {
  const todayTasks = getTasksForDate(todayKey()).sort((a, b) => a.time.localeCompare(b.time));
  const allTasks = [...state.tasks].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  const htmlToday = todayTasks.length ? todayTasks.map(taskCard).join("") : emptyState("今天还没有任务，先新增一个小目标吧。");
  elements.todayTaskList.innerHTML = htmlToday;
  elements.todayTaskListAlt.innerHTML = htmlToday;
  elements.allTaskList.innerHTML = allTasks.length ? allTasks.map(taskCard).join("") : emptyState("还没有任何任务记录。");
  const completed = todayTasks.filter((task) => task.status === "completed");
  elements.todaySummary.innerHTML = [
    ["今日已获得金币", completed.reduce((s, t) => s + Number(t.rewardCoins || 0), 0)],
    ["今日获得经验", completed.reduce((s, t) => s + Number(t.rewardExp || 0), 0)],
    ["今日任务进度", `${completed.length}/${todayTasks.length}`],
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
}

function taskCard(task) {
  const status = taskStatus(task);
  const labels = { pending: "未开始", active: "进行中", completed: "已完成", missed: "已错过" };
  return `
    <article class="task-card">
      <img src="${ASSETS.tasks[task.type] || ASSETS.tasks.custom}" alt="" />
      <div class="task-copy">
        <h3>${task.title}</h3>
        <p>${TASK_TYPES[task.type] || "自定义"} · ${task.date} ${task.time} · 🪙${task.rewardCoins} · EXP ${task.rewardExp}</p>
      </div>
      <span class="status-pill ${status}">${labels[status]}</span>
      <div class="task-actions">
        <button ${status === "completed" ? "disabled" : ""} data-complete="${task.id}">完成</button>
        <button data-edit="${task.id}">编辑</button>
        <button data-delete="${task.id}">删除</button>
      </div>
    </article>
  `;
}

function renderShop() {
  elements.shopGrid.innerHTML = SHOP_ITEMS.map((item) => `
    <article class="item-card">
      <img src="${item.icon}" alt="${item.name}" />
      <span>${item.category}</span>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <strong>🪙 ${item.price}</strong>
      <button class="primary-button" data-buy="${item.id}">购买</button>
    </article>
  `).join("");
}

function renderInventory() {
  const owned = SHOP_ITEMS.filter((item) => state.inventory[item.id] > 0);
  elements.inventoryGrid.innerHTML = owned.length ? owned.map((item) => `
    <article class="item-card">
      <img src="${item.icon}" alt="${item.name}" />
      <span>${item.category}</span>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <strong>数量：${state.inventory[item.id]}</strong>
      <button class="primary-button" data-use="${item.id}">${item.consumable ? "使用" : "收藏中"}</button>
    </article>
  `).join("") : emptyState("背包还是空的，去商店兑换一点自我奖励吧。");
}

function renderAchievements() {
  elements.achievementGrid.innerHTML = ACHIEVEMENT_DEFS.map(([id, name, condition, reward]) => {
    const ach = state.achievements[id];
    const rewardText = `${reward.coins ? `金币 +${reward.coins}` : ""}${reward.diamonds ? `钻石 +${reward.diamonds}` : ""}`;
    return `
      <article class="achievement-card ${ach.unlocked ? "is-unlocked" : ""}">
        <div>🏅</div>
        <h3>${name}</h3>
        <p>${condition}</p>
        <strong>${rewardText}</strong>
        <button data-claim="${id}" ${!ach.unlocked || ach.claimed ? "disabled" : ""}>${ach.claimed ? "已领取" : ach.unlocked ? "领取" : "未达成"}</button>
      </article>
    `;
  }).join("");
}

function renderCalendar() {
  elements.calendarTitle.textContent = `${visibleMonth.getFullYear()} 年 ${visibleMonth.getMonth() + 1} 月`;
  const first = startOfMonth(visibleMonth);
  const offset = (first.getDay() + 6) % 7;
  const start = addDays(first, -offset);
  let html = "";
  for (let i = 0; i < 42; i += 1) {
    const date = addDays(start, i);
    const key = getDateKey(date);
    ensureHistory(key);
    const day = state.checkinHistory[key];
    html += `
      <button class="calendar-day ${date.getMonth() === visibleMonth.getMonth() ? "" : "is-outside"} ${key === selectedCalendarDate ? "is-selected" : ""} ${day.fullCompleted ? "is-complete" : ""}" data-calendar-date="${key}">
        <span>${date.getDate()}</span>
        <small>${day.completedCount}/${day.totalCount}</small>
        <small>🪙${day.earnedCoins}</small>
      </button>
    `;
  }
  elements.calendarGrid.innerHTML = html;
  const selected = state.checkinHistory[selectedCalendarDate];
  elements.calendarDetail.innerHTML = selected && selected.totalCount
    ? `<h2>${selectedCalendarDate}</h2><p>完成 ${selected.completedCount}/${selected.totalCount}，获得 🪙${selected.earnedCoins}，经验 ${selected.earnedExp}</p>${selected.tasks.map((task) => `<p>${task.title} · ${task.status}</p>`).join("")}`
    : `<h2>${selectedCalendarDate}</h2><p>这天还没有打卡记录。</p>`;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function switchView(view) {
  currentView = view;
  elements.panels.forEach((panel) => panel.classList.toggle("is-visible", panel.dataset.panel === view));
  elements.navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
}

function toast(message, type = "normal") {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;
  elements.toastHost.append(node);
  setTimeout(() => node.remove(), 2600);
}

function exportSave() {
  elements.saveText.value = JSON.stringify(state, null, 2);
  toast("存档已导出到文本框。", "success");
}

function importSave() {
  try {
    const parsed = JSON.parse(elements.saveText.value);
    state = normalizeState(parsed);
    saveGame();
    render();
    toast("存档导入成功！", "success");
  } catch {
    toast("导入失败，请检查 JSON 格式。", "error");
  }
}

function resetGame() {
  if (!confirm("确定要重置游戏数据吗？这会清空本地存档。")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = createDefaultState();
  saveGame();
  render();
  toast("游戏数据已重置。", "warning");
}

function bindEvents() {
  elements.taskTypeInput.innerHTML = Object.entries(TASK_TYPES).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  elements.navButtons.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  $("#addTaskButton").addEventListener("click", () => openTaskDialog());
  $$("[data-open-task]").forEach((button) => button.addEventListener("click", () => openTaskDialog()));
  $("#templateButton").addEventListener("click", generateTemplate);
  $("#cancelTaskButton").addEventListener("click", () => elements.taskDialog.close());
  elements.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveTaskFromForm();
    elements.taskDialog.close();
  });
  document.body.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.complete) completeTask(target.dataset.complete);
    if (target.dataset.edit) openTaskDialog(state.tasks.find((task) => task.id === target.dataset.edit));
    if (target.dataset.delete) deleteTask(target.dataset.delete);
    if (target.dataset.buy) buyItem(target.dataset.buy);
    if (target.dataset.use) useItem(target.dataset.use);
    if (target.dataset.claim) claimAchievement(target.dataset.claim);
    if (target.dataset.action) quickAction(target.dataset.action);
    if (target.dataset.calendarDate) {
      selectedCalendarDate = target.dataset.calendarDate;
      renderCalendar();
    }
  });
  $("#prevMonthButton").addEventListener("click", () => {
    visibleMonth = addMonths(visibleMonth, -1);
    renderCalendar();
  });
  $("#nextMonthButton").addEventListener("click", () => {
    visibleMonth = addMonths(visibleMonth, 1);
    renderCalendar();
  });
  $("#exportButton").addEventListener("click", exportSave);
  $("#importButton").addEventListener("click", importSave);
  $("#resetGameButton").addEventListener("click", resetGame);
}

ensureDailyRefresh();
bindEvents();
render();
saveGame(false);
