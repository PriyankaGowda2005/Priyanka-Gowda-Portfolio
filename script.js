// JavaScript for Portfolio Website
// Theme Management
document.addEventListener('DOMContentLoaded', function() {
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
        // Add transition class for smooth theme switching
        body.classList.add('theme-transitioning');
        
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            body.classList.remove('theme-transitioning');
        }, 500);
    }

    function updateThemeIcons(isDark) {
        const icon = isDark ? 'fas fa-sun' : 'fas fa-moon';
        
        // Only update if elements exist
        if (themeToggle) {
            themeToggle.innerHTML = `<i class="${icon}"></i>`;
        }
        if (footerThemeToggle) {
            footerThemeToggle.innerHTML = `<i class="${icon}"></i>`;
        }
    }

    // Add event listeners only if elements exist
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (footerThemeToggle) {
        footerThemeToggle.addEventListener('click', toggleTheme);
    }

    // Enhanced Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Enhanced Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Enhanced Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    let ticking = false;

    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
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
    }

        // Enhanced Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger effect for multiple elements
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.15}s`;
                    
                    // Add random animation classes for variety
                    const animationClasses = ['fade-in', 'slide-in-left', 'slide-in-right', 'scale-in'];
                    const randomClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
                    entry.target.classList.add(randomClass);
                }
            });
        }, observerOptions);

    // Observe all fade-in elements
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Enhanced Progress Bar Animation
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach((bar, index) => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    bar.style.opacity = '1';
                    bar.style.visibility = 'visible';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.about-stats').forEach(el => {
        progressObserver.observe(el);
    });

    // GitHub API Integration
    async function fetchGitHubData() {
        try {
            // Show loading state
            const githubStats = document.getElementById('github-stats');
            const githubRepos = document.getElementById('github-repos');
            
            if (githubStats) {
                githubStats.innerHTML = `
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                `;
            }
            
            if (githubRepos) {
                githubRepos.innerHTML = `
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                `;
            }

            // Fetch user stats and repositories in parallel
            const [userResponse, reposResponse] = await Promise.all([
                fetch('https://api.github.com/users/PriyankaGowda2005'),
                fetch('https://api.github.com/users/PriyankaGowda2005/repos?sort=updated&per_page=30&type=owner')
            ]);

            if (!userResponse.ok || !reposResponse.ok) {
                throw new Error(`GitHub API error: ${userResponse.status} ${reposResponse.status}`);
            }

            const userData = await userResponse.json();
            const reposData = await reposResponse.json();

            // Update GitHub stats
            updateGitHubStats(userData, reposData);
            
            // Update repositories
            updateRepositories(reposData);

        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            const githubStats = document.getElementById('github-stats');
            const githubRepos = document.getElementById('github-repos');
            
            if (githubStats) {
                githubStats.innerHTML = `
                    <div class="stat-box">
                        <span class="stat-number">⚠️</span>
                        <span class="stat-label">Unable to load GitHub data</span>
                    </div>
                `;
            }
            
            if (githubRepos) {
                githubRepos.innerHTML = `
                    <div class="no-repos">
                        <p>Unable to load repositories. Please check your internet connection or try again later.</p>
                        <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
                            You can still view my projects by clicking the GitHub links in the featured projects above.
                        </p>
                        <button onclick="retryGitHubData()" class="btn btn-primary" style="margin-top: 1rem;">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                `;
            }
        }
    }

    function updateGitHubStats(userData, reposData) {
        const githubStats = document.getElementById('github-stats');
        if (!githubStats) return;

        const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const languages = [...new Set(reposData.map(repo => repo.language).filter(lang => lang))];

        githubStats.innerHTML = `
            <div class="stat-box">
                <span class="stat-number">${userData.public_repos}</span>
                <span class="stat-label">Repositories</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">${totalStars}</span>
                <span class="stat-label">Stars</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">${userData.followers}</span>
                <span class="stat-label">Followers</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">${languages.length}</span>
                <span class="stat-label">Languages</span>
            </div>
        `;
    }

    function updateRepositories(reposData) {
        const githubRepos = document.getElementById('github-repos');
        if (!githubRepos) return;

        // Filter out forked repos and the username repo, then take the first 6
        const filteredRepos = reposData
            .filter(repo => !repo.fork && repo.name !== 'PriyankaGowda2005')
            .slice(0, 6);

        if (filteredRepos.length === 0) {
            githubRepos.innerHTML = `
                <div class="no-repos">
                    <p>No additional repositories found.</p>
                </div>
            `;
            return;
        }

        githubRepos.innerHTML = filteredRepos.map(repo => `
            <div class="repo-card fade-in">
                <div class="repo-header">
                    <h4>${repo.name}</h4>
                    <div class="repo-stats">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                </div>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-footer">
                    <span class="repo-language">${repo.language || 'Unknown'}</span>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `).join('');

        // Re-initialize intersection observer for new elements
        const newCards = githubRepos.querySelectorAll('.repo-card');
        newCards.forEach(card => {
            observer.observe(card);
        });
    }


    // Retry function for failed GitHub API calls
    window.retryGitHubData = function() {
        console.log('Retrying GitHub data fetch...');
        fetchGitHubData();
    };


    // Initialize GitHub data if elements exist
    if (document.getElementById('github-stats') || document.getElementById('github-repos')) {
        fetchGitHubData();
    }

    // Initialize progress bars immediately
    function initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            // Force visibility
            bar.style.opacity = '1';
            bar.style.visibility = 'visible';
            bar.style.display = 'block';
            
            // Get the target width from the style attribute
            const targetWidth = bar.getAttribute('style').match(/width:\s*([^;]+)/);
            const width = targetWidth ? targetWidth[1] : '0%';
            
            // Reset to 0 and animate to target
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, index * 150);
        });
    }

    // Initialize progress bars when DOM is ready
    setTimeout(initializeProgressBars, 300);
    
    // Also initialize on window load as backup
    window.addEventListener('load', () => {
        setTimeout(initializeProgressBars, 100);
    });
});

// Contact Form functionality (separate from DOMContentLoaded to avoid conflicts)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formAlert = document.getElementById('form-alert');

    if (!contactForm) return; // Exit if contact form doesn't exist

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Hide previous alerts
        formAlert.classList.remove('show');

        // Get form data
        const templateParams = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        console.log('Template params:', templateParams);

        // Validate data
        if (!templateParams.name || !templateParams.email || !templateParams.subject || !templateParams.message) {
            formAlert.textContent = "Please fill in all fields.";
            formAlert.className = "alert alert-error show";
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            return;
        }

        try {
            console.log('Sending email via EmailJS...');
            const response = await emailjs.send('service_d8sfxs9', 'template_3ernr8k', templateParams);
            console.log('EmailJS response:', response);
            
            // Show success message
            formAlert.textContent = "Message sent successfully! I'll get back to you soon.";
            formAlert.className = "alert alert-success show";
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Show error message
            formAlert.textContent = "Failed to send message. Please try again or contact me directly at priyanka.636192@gmail.com";
            formAlert.className = "alert alert-error show";
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
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

        if (backToTop) {
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
        }

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
                const userResponse = await fetch('https://api.github.com/users/PriyankaGowda2005');
                const userData = await userResponse.json();

                // Fetch repositories
                const reposResponse = await fetch('https://api.github.com/users/PriyankaGowda2005/repos?sort=updated&per_page=20');
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
                .filter(repo => !repo.fork && repo.name !== 'PriyankaGowda2005')
                .slice(0, 6);

            if (filteredRepos.length === 0) {
                repoContainer.innerHTML = `
                    <p style="text-align: center; color: var(--text-secondary);">No additional repositories found.</p>
                `;
                return;
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
                            ${repo.homepage ? `
                                <a href="${repo.homepage}" target="_blank" class="project-link">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>
                            ` : ''}
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
        function initializeProjectFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            console.log('Initializing filters, found buttons:', filterButtons.length);

            if (filterButtons.length === 0) {
                console.error('No filter buttons found!');
                return;
            }

            filterButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', function() {
                        console.log('Filter button clicked:', this.textContent);
                        
                        // Remove active class from all buttons
                        filterButtons.forEach(btn => {
                            if (btn && btn.classList) {
                                btn.classList.remove('active');
                            }
                        });
                        
                        // Add active class to clicked button
                        if (this.classList) {
                            this.classList.add('active');
                        }

                        const filter = this.getAttribute('data-filter');
                        console.log('Filter value:', filter);
                        
                        // Get only the static project cards (not GitHub repos)
                        const projectCards = document.querySelectorAll('.project-card[data-category]');
                        console.log('Found project cards:', projectCards.length);

                        projectCards.forEach(card => {
                            if (card) {
                                const cardCategory = card.getAttribute('data-category');
                                console.log('Card category:', cardCategory, 'Filter:', filter);
                                
                                // Show card if:
                                // 1. Filter is 'all' - show everything
                                // 2. Filter is 'featured' - show only featured projects
                                // 3. Filter matches any category in the card's data-category
                                let shouldShow = false;
                                
                                if (filter === 'all') {
                                    shouldShow = true;
                                } else if (filter === 'featured') {
                                    shouldShow = cardCategory && cardCategory.includes('featured');
                                } else {
                                    shouldShow = cardCategory && cardCategory.includes(filter);
                                }
                                
                                console.log('Should show card:', shouldShow);
                                
                                if (shouldShow) {
                                    card.style.display = 'block';
                                    card.style.opacity = '1';
                                    card.style.animation = 'fadeIn 0.5s ease forwards';
                                } else {
                                    card.style.display = 'none';
                                    card.style.opacity = '0';
                                }
                            }
                        });

                        // GitHub repos always stay visible regardless of filter
                        const repoCards = document.querySelectorAll('.repo-card');
                        repoCards.forEach(card => {
                            if (card) {
                                card.style.display = 'block';
                            }
                        });
                    });
                }
            });
        }

        // Initialize filters when DOM is ready with a small delay
        setTimeout(() => {
            initializeProjectFilters();
        }, 100);

        // Test function to verify filters work
        window.testFilters = function() {
            console.log('Testing filters...');
            const buttons = document.querySelectorAll('.filter-btn');
            const cards = document.querySelectorAll('.project-card[data-category]');
            
            console.log('Filter buttons found:', buttons.length);
            console.log('Project cards found:', cards.length);
            
            cards.forEach((card, index) => {
                console.log(`Card ${index + 1}:`, card.getAttribute('data-category'));
            });
            
            // Test AI filter
            const aiButton = document.querySelector('[data-filter="ai"]');
            if (aiButton) {
                console.log('Testing AI filter...');
                aiButton.click();
            }
        };

        // Manual filter function for testing
        window.filterProjects = function(filterType) {
            console.log('Manual filter:', filterType);
            const cards = document.querySelectorAll('.project-card[data-category]');
            
            cards.forEach(card => {
                if (card) {
                    const category = card.getAttribute('data-category');
                    let show = false;
                    
                    if (filterType === 'all') {
                        show = true;
                    } else if (filterType === 'featured') {
                        show = category && category.includes('featured');
                    } else {
                        show = category && category.includes(filterType);
                    }
                    
                    card.style.display = show ? 'block' : 'none';
                    console.log(`Card "${category}": ${show ? 'SHOW' : 'HIDE'}`);
                }
            });
        };
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

        // Enhanced Typing Effect
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

        // Initialize enhanced features
        document.addEventListener('DOMContentLoaded', () => {
            fetchGitHubData();
            
            // Initialize typing effect for hero subtitle
            const subtitle = document.querySelector('.hero-content .subtitle');
            if (subtitle) {
                const originalText = subtitle.textContent;
                setTimeout(() => {
                    typeWriter(subtitle, originalText, 30);
                }, 1000);
            }
            
            // Add stagger animation to cards
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

        // Enhanced hover effects with advanced animations
        const cards = document.querySelectorAll('.project-card, .skill-card, .achievement-card, .experience-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = 'var(--shadow-2xl)';
                
                // Add subtle glow effect
                this.style.filter = 'brightness(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'var(--shadow-md)';
                this.style.filter = 'brightness(1)';
            });
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
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

        // Accessibility improvements
        document.addEventListener('keydown', (e) => {
            // Skip to main content with Tab key
            if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
                const mainContent = document.querySelector('main') || document.querySelector('.hero');
                if (mainContent) {
                    mainContent.focus();
                    e.preventDefault();
                }
            }
        });

        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Preload critical resources
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = 'img/profile.jpeg';
        preloadLink.as = 'image';
        document.head.appendChild(preloadLink);

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