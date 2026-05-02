gsap.registerPlugin(ScrollTrigger);

// 1. 初始化场景
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. 创建一个“手绘感”粒子群
const particlesGeometry = new THREE.BufferGeometry();
const count = 3000;
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#ffffff',
    transparent: true,
    opacity: 0.6
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

camera.position.z = 3;

// 3. GSAP 滚动联动动效
// 每一节滚动时，粒子旋转的角度和相机位置都会变化
const sections = document.querySelectorAll('.section');

gsap.to(particles.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 2
    }
});

// 让背景随着进入不同板块产生位移
sections.forEach((section, index) => {
    gsap.to(camera.position, {
        x: index % 2 === 0 ? -1 : 1,
        z: 3 + index * 0.5,
        scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            scrub: true
        }
    });
});

// 4. 动画循环
const animate = () => {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.001;
    renderer.render(scene, camera);
};

animate();

// 适配窗口大小
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 移除加载遮罩
window.onload = () => {
    document.getElementById('loader').style.display = 'none';
};
