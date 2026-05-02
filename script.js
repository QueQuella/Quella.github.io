gsap.registerPlugin(ScrollTrigger);

// 1. 背景手绘线条动画 (Canvas)
const canvas = document.getElementById('sketch-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;
function animateBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;

    // 绘制随时间摆动的“流向线”
    for (let i = 0; i < canvas.width; i += 100) {
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(
            i + Math.sin(time) * 50, canvas.height / 2,
            i - Math.cos(time) * 50, canvas.height / 2,
            i, canvas.height
        );
    }
    ctx.stroke();
    time += 0.01;
    requestAnimationFrame(animateBg);
}
animateBg();

// 2. Ergodic Flow：板块渐显与位移引导
const panels = document.querySelectorAll('.panel');
panels.forEach((panel) => {
    gsap.from(panel.querySelector('.inner'), {
        y: 50,
        opacity: 0,
        duration: 1.2,
        scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
        }
    });
});

// 3. 进度点随滚动移动
gsap.to(".flow-indicator .dot", {
    y: 92,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});

// 4. 3D滑动区域拖拽交互
const slider = document.querySelector('.slider-container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
});
