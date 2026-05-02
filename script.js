document.addEventListener('DOMContentLoaded', () => {
    // 1. 自定义光标逻辑
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, .placeholder-box');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // 稍微延迟的跟随外圈
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    // 交互元素 hover 放大光标特效
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            follower.style.width = '50px';
            follower.style.height = '50px';
            follower.style.borderColor = 'var(--accent-hover)';
        });
        link.addEventListener('mouseleave', () => {
            follower.style.width = '30px';
            follower.style.height = '30px';
            follower.style.borderColor = 'var(--accent)';
        });
    });

    // 2. 视觉引导线 (滚动进度)
    const progressBar = document.querySelector('.flow-progress');
    
    window.addEventListener('scroll', () => {
        let scrollDistance = document.documentElement.scrollTop;
        let totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let progress = (scrollDistance / totalHeight) * 100;
        progressBar.style.height = progress + '%';
    });

    // 3. 滚动显现动画 (Level 触发)
    const observerOptions = {
        threshold: 0.2 // 当元素20%进入视口时触发
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // 同步更新侧边栏激活状态
                updateNav(entry.target.parentElement.id);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // 4. 更新导航栏高亮
    function updateNav(id) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // 平滑滚动处理
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
