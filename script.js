// JavaScript for Portfolio Website
        // Theme Management
        const themeToggle = document.getElementById('theme-toggle');
        const footerThemeToggle = document.getElementById('footer-theme-toggle');
        const body = document.body;

        // Check for saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            body.classList.add('dark');
            updateThemeIcons(true);
        }

        function toggleTheme() {
            body.classList.toggle('dark');
            const isDark = body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcons(isDark);
        }

        function updateThemeIcons(isDark) {
            const icon = isDark ? 'fas fa-sun' : 'fas fa-moon';
            themeToggle.innerHTML = `<i class="${icon}"></i>`;
            footerThemeToggle.innerHTML = `<i class="${icon}"></i>`;
        }

        themeToggle.addEventListener('click', toggleTheme);
        footerThemeToggle.addEventListener('click', toggleTheme);

        // Mobile Menu Toggle
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');

        mobileMenu.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });

        // Back to Top Button
        const backToTop = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // GitHub API Integration
        async function fetchGitHubData() {
            try {
                // Fetch user stats
                const userResponse = await fetch('https://api.github.com/users/priyankapinky2004');
                const userData = await userResponse.json();

                // Fetch repositories
                const reposResponse = await fetch('https://api.github.com/users/priyankapinky2004/repos?sort=updated&per_page=20');
                const reposData = await reposResponse.json();

                // Update GitHub stats
                updateGitHubStats(userData, reposData);
                
                // Update repositories
                updateRepositories(reposData);

            } catch (error) {
                console.error('Error fetching GitHub data:', error);
                document.getElementById('github-stats').innerHTML = `
                    <div class="stat-box">
                        <span class="stat-number">Error</span>
                        <span class="stat-label">Unable to load GitHub data</span>
                    </div>
                `;
                document.getElementById('github-repos').innerHTML = `
                    <p style="text-align: center; color: var(--text-secondary);">Unable to load repositories. Please check the GitHub links in the projects above.</p>
                `;
            }
        }

        function updateGitHubStats(userData, reposData) {
            const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);

            document.getElementById('github-stats').innerHTML = `
                <div class="stat-box">
                    <span class="stat-number">${userData.public_repos}</span>
                    <span class="stat-label">Public Repos</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">${totalStars}</span>
                    <span class="stat-label">Total Stars</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">${totalForks}</span>
                    <span class="stat-label">Total Forks</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">${userData.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>
            `;
        }

function updateRepositories(repos) {
    const repoContainer = document.getElementById('github-repos');
    
    // Filter out forked repos and the username repo
    const filteredRepos = repos
        .filter(repo => !repo.fork && repo.name !== 'priyankapinky2004')
        .slice(0, 6);
    
    if (filteredRepos.length === 0) {
        repoContainer.innerHTML = `
            <p style="text-align: center; color: var(--text-secondary);">No additional repositories found.</p>
        `;
        return;
    }
    
    // Function to generate demo URL based on repo name and common patterns
    function generateDemoUrl(repo) {
        // If homepage exists, use it
        if (repo.homepage) {
            return repo.homepage;
        }
        
        // Generate common demo URLs based on repository name
        const repoName = repo.name.toLowerCase();
        const username = repo.owner.login.toLowerCase();
        
        // Common GitHub Pages patterns
        const githubPagesUrl = `https://${username}.github.io/${repo.name}`;
        
        // You can also add custom demo URLs for specific projects
        const customDemoUrls = {
            'smarthire': 'https://smart-hire-demo.netlify.app',
            'factnet': 'https://factnet-demo.vercel.app',
            'prepverse': 'https://prepverse-demo.netlify.app',
            'mentalhealthai': 'https://mental-health-ai-demo.vercel.app',
            'cloudtodolist': 'https://cloud-todo-demo.netlify.app'
        };
        
        // Check if there's a custom demo URL for this repo
        if (customDemoUrls[repoName]) {
            return customDemoUrls[repoName];
        }
        
        // Default to GitHub Pages URL
        return githubPagesUrl;
    }
    
    repoContainer.innerHTML = filteredRepos.map(repo => `
        <div class="project-card" data-category="web">
            <div class="project-image">
                <i class="fab fa-github"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-description">
                    ${repo.description || 'No description available'}
                </p>
                <div class="project-tech">
                    ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
                    <span class="tech-tag">⭐ ${repo.stargazers_count}</span>
                    <span class="tech-tag">🔀 ${repo.forks_count}</span>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> View Code
                    </a>
                    <a href="${generateDemoUrl(repo)}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

        // Skills Filter Functionality
        const skillFilterButtons = document.querySelectorAll('.skill-filter-btn');
        const skillCards = document.querySelectorAll('.skill-card[data-skill-category]');

        skillFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                skillFilterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.getAttribute('data-skill-filter');

                skillCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-skill-category') === filter) {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.classList.add('hidden');
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Project Filter Functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card[data-category]');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        // Initialize EmailJS with your User ID
// // Initialize EmailJS with your Public Key
// import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
// emailjs.init('KHYUKWuIOzs8rGb2I');

// const contactForm = document.getElementById('contact-form');
// const formAlert = document.getElementById('form-alert');
// const submitBtn = document.getElementById('submit-btn');

// contactForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
//     submitBtn.disabled = true;

//     const formData = new FormData(contactForm);
//     const data = {
//         title: "New Message",   // optional
//         name: formData.get('name'),
//         email: formData.get('email'),
//         subject: formData.get('subject'),
//         message: formData.get('message')
//     };

//     try {
//         // Send the email via EmailJS
//         await emailjs.send('service_d8sfxs9', 'template_3ernr8k', data);

//         showAlert("Thank you for your message! I'll get back to you soon.", 'success');
//         contactForm.reset();

//     } catch (error) {
//         console.error('EmailJS Error:', error);
//         showAlert('Sorry, there was an error sending your message. Please try again.', 'error');
//     } finally {
//         submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
//         submitBtn.disabled = false;
//     }
// });

// function showAlert(message, type) {
//     formAlert.textContent = message;
//     formAlert.className = `alert alert-${type} show`;

//     setTimeout(() => {
//         formAlert.classList.remove('show');
//     }, 5000);
// }


// function showAlert(message, type) {
//     formAlert.textContent = message;
//     formAlert.className = `alert alert-${type} show`;
    
//     setTimeout(() => {
//         formAlert.classList.remove('show');
//     }, 5000);
// }



        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });

        // Animate progress bars when in view
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    });
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.about-stats').forEach(el => {
            progressObserver.observe(el);
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            fetchGitHubData();
            
            // Add some delay for better UX
            setTimeout(() => {
                document.querySelectorAll('.fade-in').forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }, 500);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });

        // Add smooth hover effects to cards
        const cards = document.querySelectorAll('.project-card, .skill-card, .achievement-card, .experience-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Performance optimization: Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Add typing effect to hero subtitle
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.innerHTML = '';
            
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }

        // Initialize typing effect after page load
        window.addEventListener('load', () => {
            const subtitle = document.querySelector('.hero-content .subtitle');
            if (subtitle) {
                const originalText = subtitle.textContent;
                setTimeout(() => {
                    typeWriter(subtitle, originalText, 30);
                }, 1000);
            }
        });

        // Add particle effect to hero section (optional)
        function createParticles() {
            const hero = document.querySelector('.hero');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                `;
                hero.appendChild(particle);
            }
        }

        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
            
            .hero {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);

        // Initialize particles (uncomment if you want the particle effect)
        // createParticles();