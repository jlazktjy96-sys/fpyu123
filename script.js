// 可修改：联系客户领取的链接（抽中后弹窗按钮地址）
const CUSTOMER_SERVICE_URL = 'https://example.com/';

// 一次机会限制的存储键
const STORAGE_KEY = 'lucky_wheel_played';

// 奖品配置（默认占位图，建议替换为百度图片的实际图片链接）
const PRIZES = [
  { name: '一等奖 苹果笔记本电脑', image: 'https://via.placeholder.com/120?text=%E8%8B%B9%E6%9E%9C%E7%AC%94%E8%AE%B0%E6%9C%AC' },
  { name: '二等奖 苹果17手机', image: 'https://via.placeholder.com/120?text=iPhone17' },
  { name: '三等奖 平衡车', image: 'https://via.placeholder.com/120?text=%E5%B9%B3%E8%A1%A1%E8%BD%A6' },
  { name: '四等奖 扫地机器人', image: 'https://via.placeholder.com/120?text=%E6%8B%8D%E5%9C%B0%E6%9C%BA%E5%99%A8%E4%BA%BA' },
  { name: '五等奖 炫酷耳机', image: 'https://via.placeholder.com/120?text=%E8%80%B3%E6%9C%BA' },
  { name: '六等奖 精致水杯', image: 'https://via.placeholder.com/120?text=%E6%B0%B4%E6%9D%AF' },
];

const spinner = document.getElementById('spinner');
const iconsUl = document.getElementById('wheelIcons');
const spinBtn = document.getElementById('spinBtn');
const winModal = document.getElementById('winModal');
const winImg = document.getElementById('winImg');
const winName = document.getElementById('winName');
const contactBtn = document.getElementById('contactBtn');
const modalClose = document.getElementById('modalClose');

// 初始旋转基角：让0度指向上方（与CSS保持一致）
const BASE_ROTATE = -90;
let spinning = false;

function initWheel() {
  const count = PRIZES.length;
  const step = 360 / count;
  iconsUl.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const prize = PRIZES[i];
    const angle = -90 + i * step; // 让第一个奖品位于12点方向起始

    const li = document.createElement('li');
    li.style.setProperty('--angle', angle + 'deg');

    // 图片存在就用图片，不存在显示文字标签
    const img = document.createElement('img');
    img.src = prize.image;
    img.alt = prize.name;
    img.onerror = () => {
      // 图片缺失时改用文字块
      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = prize.name.replace(/^[^\s]+\s/, '');
      li.replaceChildren(label);
    };
    li.appendChild(img);
    iconsUl.appendChild(li);
  }

  contactBtn.href = CUSTOMER_SERVICE_URL;
}

function spin() {
  if (spinning) return;
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    alert('您已使用过抽奖机会');
    return;
  }
  // 点击立即记录为已抽奖，确保只有一次机会
  localStorage.setItem(STORAGE_KEY, 'true');
  spinning = true;
  spinBtn.disabled = true;

  const count = PRIZES.length;
  const step = 360 / count;
  const winnerIndex = Math.floor(Math.random() * count);
  const extraTurns = 5; // 全转5圈
  const target = BASE_ROTATE + extraTurns * 360 + winnerIndex * step + step / 2;

  spinner.style.transition = 'transform 5s cubic-bezier(.23,1,.32,1)';
  spinner.style.transform = `rotate(${target}deg)`;

  const onDone = () => {
    spinner.removeEventListener('transitionend', onDone);
    showWin(winnerIndex);
    // 抽奖完成后保持按钮禁用（一次机会）
    spinning = false;
    spinBtn.disabled = true;
    spinBtn.textContent = '已抽奖';
  };
  spinner.addEventListener('transitionend', onDone);
}

function showWin(index) {
  const prize = PRIZES[index];
  winName.textContent = prize.name;
  winImg.src = prize.image;
  winImg.alt = prize.name;

  // 若图片加载失败，保持弹窗展示文字
  winImg.onerror = () => {
    winImg.style.display = 'none';
  };

  winModal.hidden = false;
}

function closeModal() {
  winModal.hidden = true;
}

document.addEventListener('DOMContentLoaded', () => {
  initWheel();
  // 如果已抽过奖，禁用按钮
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    spinBtn.disabled = true;
    spinBtn.textContent = '已抽奖';
  }
  spinBtn.addEventListener('click', spin);
  modalClose.addEventListener('click', closeModal);
  winModal.addEventListener('click', (e) => {
    if (e.target === winModal) closeModal();
  });
});
