// Hero fade out on scroll
document.addEventListener('DOMContentLoaded', function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let lastScrollTop = 0;
    let isHidden = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = hero.offsetHeight;
        
        // Determinar dirección del scroll
        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo
            if (scrollTop > heroHeight/2 && !isHidden) {
                hero.style.transform = 'translateY(-100%)';
                hero.style.opacity = '0';
                setTimeout(() => {
                    hero.style.display = 'none';
                    isHidden = true;
                }, 300);
            }
        } else {
            // Scroll hacia arriba
            if (scrollTop < heroHeight && isHidden) {
                hero.style.display = 'block';
                // Pequeño timeout para asegurar que el display: block se aplique antes de la animación
                setTimeout(() => {
                    hero.style.transform = 'translateY(0)';
                    hero.style.opacity = '1';
                    isHidden = false;
                }, 10);
            }
        }
        
        lastScrollTop = scrollTop;
    });
});