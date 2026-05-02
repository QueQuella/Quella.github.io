gsap.registerPlugin(ScrollTrigger);

// 1. Canvas 手绘线条特效
const canvas = document.getElementById('sketch-bg');
const ctx = canvas.getContext('2d');
let points = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 简单的动态线条逻辑：随鼠标和滚动产生“笔触”
function drawSketch() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    // 这里可以根据 scroll 进度绘制出类似地图路径的曲线
    ctx.moveTo(0, canvas.height/2);
    ctx.bezierCurveTo(canvas.width/3, 0, canvas.width/1.5, canvas.height, canvas.width, canvas.height/2);
    ctx.stroke();
    
    requestAnimationFrame(drawSketch);
}
drawSketch();

// 2. Ergodic Flow：内容的视觉引导进入
const panels = gsap.utils.toArray('.panel');
panels.forEach((panel, i) => {
    gsap.to(panel, {
        scrollTrigger: {
            trigger: panel,
            start: "top center",
            end: "bottom center",
            toggleActions: "play reverse play reverse",
        },
        opacity: 1,
        y: -30,
        duration: 1,
        ease: "power2.out"
    });
});

// 3. 引导点动画
gsap.to(".flow-indicator .dot", {
    y: "60vh",
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});
