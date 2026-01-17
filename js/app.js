// 图片懒加载功能
document.addEventListener('DOMContentLoaded', function() {
  // 处理图片懒加载
  const lazyImages = document.querySelectorAll('.lazy-load');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.classList.add('loaded');
          imageObserver.unobserve(image);
        }
      });
    });

    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // 降级处理，直接加载所有图片
    lazyImages.forEach(image => {
      image.classList.add('loaded');
    });
  }

  // 移动端菜单功能
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  mobileMenuBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  });

  overlay.addEventListener('click', function() {
    mobileMenuBtn.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    });
  });

  // 回到顶部按钮功能
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }

    // 滚动动画
    const scrollElements = document.querySelectorAll('.scroll-animate');

    scrollElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight * 0.85) {
        element.classList.add('visible');
      }
    });
  });

  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 文章分类筛选功能
  const filterButtons = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按钮的active类
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // 给当前点击的按钮添加active类
      this.classList.add('active');

      const category = this.getAttribute('data-category');

      // 筛选文章
      articleCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
        }
      });
    });
  });

  // 文章链接管理功能
  const articleLinks = document.querySelectorAll('.article-card .read-more');
  const articleManagement = {
    enabled: true,
    toggle: function() {
      this.enabled = !this.enabled;
      articleLinks.forEach(link => {
        if (this.enabled) {
          link.href = link.getAttribute('data-original-href');
          link.textContent = '阅读全文 →';
          link.style.opacity = '1';
          link.style.pointerEvents = 'auto';
        } else {
          link.setAttribute('data-original-href', link.href);
          link.href = 'javascript:void(0)';
          link.textContent = '链接已禁用';
          link.style.opacity = '0.5';
          link.style.pointerEvents = 'none';
        }
      });
      console.log('文章链接状态:', this.enabled ? '已启用' : '已禁用');
    }
  };

  // 为每个文章链接添加点击跟踪
  articleLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const articleCard = this.closest('.article-card');
      const articleTitle = articleCard.querySelector('.article-title').textContent;
      const articleCategory = articleCard.getAttribute('data-category');

      console.log('文章点击:', {
        title: articleTitle,
        category: articleCategory,
        url: this.href,
        timestamp: new Date().toISOString()
      });

      // 链接有效性检查
      if (!articleManagement.enabled) {
        e.preventDefault();
        alert('文章链接已被禁用');
        return false;
      }
    });

    // 保存原始链接
    link.setAttribute('data-original-href', link.href);
  });

  // 添加链接管理快捷键 (Ctrl+Shift+L)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      articleManagement.toggle();
    }
  });

  // 在控制台暴露管理接口
  window.articleManagement = articleManagement;
  console.log('文章链接管理已加载。使用 Ctrl+Shift+L 切换链接状态，或在控制台使用 articleManagement.toggle()');

  // 导航栏激活状态
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', function() {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= (sectionTop - 100)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});