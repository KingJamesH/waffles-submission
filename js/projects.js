const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    body.classList.remove('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    let currentPage = 1;
    const projectsPerPage = 6;
    let filteredProjects = Array.from(projectCards);

    function filterProjects(category) {
        filteredProjects = [];
        
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                filteredProjects.push(card);
            } else {
                card.style.display = 'none';
            }
        });
        
        currentPage = 1;
        updatePagination();
        showPage(currentPage);
    }

    function showPage(page) {
        const startIndex = (page - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        const visibleProjects = filteredProjects.slice(0, endIndex);
        
        projectCards.forEach(card => {
            card.style.display = 'none';
        });
        
        visibleProjects.forEach(card => {
            card.style.display = 'block';
        });
        
        document.getElementById('currentPage').textContent = page;
        
        document.getElementById('prevPage').disabled = page === 1;
        document.getElementById('nextPage').disabled = endIndex >= filteredProjects.length;
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage >= totalPages;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            filterProjects(button.dataset.filter);
        });
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    projectCards.forEach(card => {
        const image = card.querySelector('img');
        const originalSrc = image.src;
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            image.style.filter = 'brightness(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            image.style.filter = '';
        });
        
        const viewDetailsBtn = card.querySelector('.view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectTitle = card.querySelector('h3').textContent;
                alert(`I lied. (sorry)`);
            });
        }
    });

    filterProjects('all');
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-card');
        elements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };

    window.addEventListener('load', () => {
        setTimeout(animateOnScroll, 500);
    });
    
    window.addEventListener('scroll', animateOnScroll);
});
