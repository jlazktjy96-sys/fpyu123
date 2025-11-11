// 可修改：客服链接（抽中后弹窗按钮地址）
const CUSTOMER_SERVICE_URL = '#'; // 将此替换为你的客服链接

// 奖品配置（图片路径在 assets/ 下，缺图也能正常显示文字）
const PRIZES = [
  { name: '一等奖 苹果手机', image: 'assets/iphone.png' },
  { name: '二等奖 平衡车', image: 'assets/scooter.png' },
  { name: '三等奖 耳机', image: 'assets/headset.png' },
  { name: '四等奖 水杯', image: 'assets/cup.png' },
  { name: '五等奖 待定奖励', image: 'assets/other1.png' },
  { name: '六等奖 待定奖励', image: 'assets/other2.png' },
  { name: '七等奖 待定奖励', image: 'assets/other3.png' },
  { name: '八等奖 待定奖励', image: 'assets/other4.png' },
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
  spinning = true;
  spinBtn.disabled = true;

  const count = PRIZES.length;
  const step = 360 / count;
  const winnerIndex = Math.floor(Math.random() * count);
  const extraTurns = 5; // 全转5圈，动画更有仪式感
  const target = BASE_ROTATE + extraTurns * 360 + winnerIndex * step + step / 2;

  spinner.style.transition = 'transform 4s cubic-bezier(.25,.8,.25,1)';
  spinner.style.transform = `rotate(${target}deg)`;

  const onDone = () => {
    spinner.removeEventListener('transitionend', onDone);
    showWin(winnerIndex);
    // 允许再次抽奖
    spinning = false;
    spinBtn.disabled = false;
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
  spinBtn.addEventListener('click', spin);
  modalClose.addEventListener('click', closeModal);
  winModal.addEventListener('click', (e) => {
    if (e.target === winModal) closeModal();
  });
});

