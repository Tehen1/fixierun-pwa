// FixieRun Cyberpunk PWA - Neural Interface JavaScript

console.log('🚀 INITIALIZING NEURAL MATRIX...');

class CyberFixieApp {
    constructor() {
        this.currentPage = 'home';
        this.isInitialized = false;
        this.deferredPrompt = null;
        this.charts = {};
        this.loadingProgress = 0;
        this.neuralData = this.loadNeuralData();
        
        // Initialize the cyberpunk experience
        this.initializeNeuralInterface();
    }

    loadNeuralData() {
        return {
            user: {
                name: "CYBER.RUNNER",
                callsign: "NEURAL_NODE_7847",
                email: "cyber@fixie.run",
                avatar: "CR",
                level: 12,
                neuralSync: "ACTIVE",
                totalMiles: 312.4,
                quantumTokens: 1247,
                streakDays: 7,
                joinDate: "2024-03-15",
                status: "ONLINE"
            },
            workouts: [
                {
                    id: 1,
                    protocol: "NEURAL SPRINT",
                    distance: 5.2,
                    duration: 28,
                    velocity: "18.7 km/h",
                    energy: 420,
                    tokens: 15,
                    date: "2025-08-20",
                    sync_status: "VERIFIED"
                },
                {
                    id: 2,
                    protocol: "QUANTUM CRUISE",
                    distance: 3.1,
                    duration: 42,
                    velocity: "4.4 km/h",
                    energy: 180,
                    tokens: 8,
                    date: "2025-08-19",
                    sync_status: "VERIFIED"
                },
                {
                    id: 3,
                    protocol: "MATRIX OVERRIDE",
                    distance: 15.8,
                    duration: 45,
                    velocity: "21.1 km/h",
                    energy: 520,
                    tokens: 25,
                    date: "2025-08-18",
                    sync_status: "VERIFIED"
                }
            ],
            blockchain: {
                portfolioValue: 2847.32,
                fixBalance: 1247,
                stakedNodes: 500,
                pendingSync: 23.4,
                yieldRate: 12.5,
                network: "POLYGON ZKEVM"
            },
            analytics: {
                neuralEfficiency: 87.4,
                quantumSync: 94.2,
                cryptoMining: 76.8,
                weeklyGoal: { current: 24.1, target: 30, unit: "km" },
                protocolGoal: { current: 3, target: 4, unit: "protocols" }
            }
        };
    }

    async initializeNeuralInterface() {
        console.log('⚡ NEURAL INTERFACE INITIALIZATION SEQUENCE');
        
        try {
            // Start loading sequence
            await this.executeLoadingSequence();
            
            // Initialize PWA features
            this.setupQuantumPWA();
            
            // Activate neural matrix
            this.activateNeuralMatrix();
            
            console.log('✅ NEURAL INTERFACE ONLINE');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ NEURAL INTERFACE MALFUNCTION:', error);
            this.emergencyFallback();
        }
    }

    async executeLoadingSequence() {
        return new Promise((resolve) => {
            const loadingSteps = [
                { step: 10, text: "CONNECTING TO NEURAL NETWORK..." },
                { step: 25, text: "SYNCHRONIZING QUANTUM STATE..." },
                { step: 40, text: "LOADING BLOCKCHAIN MATRIX..." },
                { step: 60, text: "INITIALIZING CYBERPUNK PROTOCOLS..." },
                { step: 80, text: "ACTIVATING NEURAL INTERFACE..." },
                { step: 100, text: "NEURAL LINK ESTABLISHED" }
            ];

            let currentStep = 0;
            const progressBar = document.getElementById('loading-progress');
            const loadingText = document.querySelector('.loading-text');

            const executeStep = () => {
                if (currentStep < loadingSteps.length) {
                    const { step, text } = loadingSteps[currentStep];
                    
                    if (progressBar) {
                        progressBar.style.width = `${step}%`;
                    }
                    
                    if (loadingText) {
                        loadingText.textContent = text;
                        loadingText.style.animation = 'none';
                        setTimeout(() => {
                            loadingText.style.animation = 'loadingPulse 0.5s ease-in-out';
                        }, 50);
                    }

                    currentStep++;
                    setTimeout(executeStep, 500);
                } else {
                    setTimeout(() => {
                        this.activateMainInterface();
                        resolve();
                    }, 500);
                }
            };

            executeStep();
        });
    }

    activateMainInterface() {
        console.log('🌟 ACTIVATING MAIN INTERFACE');
        
        const loadingScreen = document.getElementById('loading-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loadingScreen && mainApp) {
            // Cyberpunk transition effect
            loadingScreen.style.transition = 'all 1s ease-out';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.filter = 'blur(10px)';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                
                // Activate main interface with glow effect
                mainApp.style.opacity = '0';
                mainApp.style.transform = 'scale(0.95)';
                mainApp.style.transition = 'all 0.8s ease-out';
                
                setTimeout(() => {
                    mainApp.style.opacity = '1';
                    mainApp.style.transform = 'scale(1)';
                    
                    // Setup neural event listeners
                    setTimeout(() => {
                        this.setupNeuralEventListeners();
                        this.initializeQuantumCharts();
                        this.startNeuralAnimations();
                    }, 200);
                }, 100);
            }, 800);
        }
    }

    setupNeuralEventListeners() {
        console.log('🔗 CONNECTING NEURAL EVENT LISTENERS');

        // Navigation Matrix
        this.setupNavigationMatrix();
        
        // Cyberpunk Interactions
        this.setupCyberpunkInteractions();
        
        // Training Protocols
        this.setupTrainingProtocols();
        
        // Blockchain Matrix
        this.setupBlockchainMatrix();
        
        // Neural Settings
        this.setupNeuralSettings();
        
        console.log('✅ NEURAL EVENT LISTENERS CONNECTED');
    }

    setupNavigationMatrix() {
        // Bottom navigation nodes
        const navNodes = document.querySelectorAll('.nav-node');
        navNodes.forEach(node => {
            const page = node.getAttribute('data-page');
            
            node.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(page);
                this.triggerNeuralFeedback();
            });
        });

        // Quick navigation matrix cards
        const matrixCards = document.querySelectorAll('.matrix-card');
        matrixCards.forEach(card => {
            const page = card.getAttribute('data-page');
            
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(page);
                this.showNeuralToast(`ACCESSING ${page.toUpperCase()} MODULE...`, 'info');
                this.triggerNeuralFeedback();
            });
        });
    }

    setupCyberpunkInteractions() {
        // Main CTA Button
        const ctaButton = document.getElementById('initiate-protocol');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.initiateRideProtocol();
            });
        }

        // Protocol cards
        const protocolCards = document.querySelectorAll('.protocol-card');
        protocolCards.forEach(card => {
            const protocol = card.getAttribute('data-protocol');
            
            card.addEventListener('click', () => {
                this.activateProtocol(protocol);
            });
        });

        // Neural upgrades
        const upgradeButtons = document.querySelectorAll('.upgrade-btn');
        upgradeButtons.forEach(btn => {
            if (!btn.classList.contains('disabled')) {
                btn.addEventListener('click', () => {
                    this.acquireNeuralUpgrade(btn);
                });
            }
        });

        // Claim rewards
        const claimButtons = document.querySelectorAll('.claim-btn');
        claimButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.claimQuantumRewards();
            });
        });

        // Neural wallet connection
        const walletBtn = document.querySelector('.neural-wallet-btn');
        if (walletBtn) {
            walletBtn.addEventListener('click', () => {
                this.connectNeuralWallet();
            });
        }

        // Neural logout
        const logoutBtn = document.getElementById('neural-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.disconnectNeuralLink();
            });
        }
    }

    setupTrainingProtocols() {
        const activateBtn = document.getElementById('activate-training');
        if (activateBtn) {
            activateBtn.addEventListener('click', () => {
                this.activateTrainingSequence();
            });
        }
    }

    setupBlockchainMatrix() {
        // Transaction interactions would be here
        // For now, just visual feedback
        const transactionRows = document.querySelectorAll('.transaction-row');
        transactionRows.forEach(row => {
            row.addEventListener('click', () => {
                const hash = row.querySelector('.tx-hash').textContent;
                this.showNeuralToast(`ACCESSING TRANSACTION ${hash}...`, 'info');
            });
        });
    }

    setupNeuralSettings() {
        const toggles = document.querySelectorAll('.cyber-toggle input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingRow = e.target.closest('.setting-row');
                const settingName = settingRow.querySelector('span').textContent;
                
                this.showNeuralToast(
                    `${settingName} ${e.target.checked ? 'ACTIVATED' : 'DEACTIVATED'}`,
                    e.target.checked ? 'success' : 'warning'
                );
                this.triggerNeuralFeedback();
            });
        });
    }

    navigateToPage(pageId) {
        console.log(`🔄 NAVIGATING TO ${pageId.toUpperCase()} MODULE`);
        
        if (this.currentPage === pageId) return;
        
        // Update current page
        this.currentPage = pageId;
        
        // Neural transition effect
        const allPages = document.querySelectorAll('.page');
        const targetPage = document.getElementById(`${pageId}-page`);
        
        // Hide all pages
        allPages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page with cyberpunk effect
        if (targetPage) {
            setTimeout(() => {
                targetPage.classList.add('active');
                
                // Update page title
                const pageTitles = {
                    home: 'QUANTUM DASHBOARD',
                    defi: 'BLOCKCHAIN MATRIX',
                    analytics: 'DATA NEXUS',
                    workouts: 'TRAINING PROTOCOLS',
                    rewards: 'CYBER MARKETPLACE',
                    profile: 'NEURAL INTERFACE'
                };
                
                const pageTitle = document.getElementById('page-title');
                if (pageTitle) {
                    pageTitle.textContent = pageTitles[pageId] || 'NEURAL MATRIX';
                }
                
                // Update navigation state
                document.querySelectorAll('.nav-node').forEach(node => {
                    node.classList.remove('active');
                });
                
                const activeNode = document.querySelector(`[data-page="${pageId}"]`);
                if (activeNode) {
                    activeNode.classList.add('active');
                }
                
                // Trigger page-specific animations
                this.triggerPageAnimations(pageId);
                
            }, 100);
        }
        
        console.log(`✅ ${pageId.toUpperCase()} MODULE ACTIVATED`);
    }

    triggerPageAnimations(pageId) {
        // Page-specific neural animations
        switch (pageId) {
            case 'analytics':
                this.animateNeuralMetrics();
                break;
            case 'defi':
                this.animateBlockchainNodes();
                break;
            case 'workouts':
                this.animateProtocolCards();
                break;
            case 'rewards':
                this.animateLeaderboard();
                break;
            case 'profile':
                this.animateNeuralProfile();
                break;
        }
    }

    animateNeuralMetrics() {
        const metricFills = document.querySelectorAll('.metric-fill');
        metricFills.forEach((fill, index) => {
            setTimeout(() => {
                fill.style.transform = 'scaleX(0)';
                fill.style.transformOrigin = 'left';
                fill.style.transition = 'transform 1s ease-out';
                
                setTimeout(() => {
                    fill.style.transform = 'scaleX(1)';
                }, 100);
            }, index * 200);
        });
    }

    animateBlockchainNodes() {
        const nodeModules = document.querySelectorAll('.node-module');
        nodeModules.forEach((module, index) => {
            setTimeout(() => {
                module.style.transform = 'translateY(20px)';
                module.style.opacity = '0';
                module.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    module.style.transform = 'translateY(0)';
                    module.style.opacity = '1';
                }, 50);
            }, index * 150);
        });
    }

    animateProtocolCards() {
        const protocolCards = document.querySelectorAll('.protocol-card');
        protocolCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(0.8) rotateY(20deg)';
                card.style.opacity = '0';
                card.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    card.style.transform = 'scale(1) rotateY(0deg)';
                    card.style.opacity = '1';
                }, 50);
            }, index * 200);
        });
    }

    animateLeaderboard() {
        const rankEntries = document.querySelectorAll('.rank-entry');
        rankEntries.forEach((entry, index) => {
            setTimeout(() => {
                entry.style.transform = 'translateX(-50px)';
                entry.style.opacity = '0';
                entry.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    entry.style.transform = 'translateX(0)';
                    entry.style.opacity = '1';
                }, 50);
            }, index * 100);
        });
    }

    animateNeuralProfile() {
        const avatarRing = document.querySelector('.profile-avatar-large .avatar-ring');
        if (avatarRing) {
            avatarRing.style.animation = 'none';
            setTimeout(() => {
                avatarRing.style.animation = 'rotate360 2s ease-out infinite';
            }, 100);
        }
    }

    initiateRideProtocol() {
        this.showNeuralToast('RIDE PROTOCOL INITIATED...', 'info');
        this.navigateToPage('workouts');
        this.triggerNeuralFeedback();
    }

    activateProtocol(protocol) {
        const protocolNames = {
            'neural-sprint': 'NEURAL SPRINT',
            'quantum-cruise': 'QUANTUM CRUISE',  
            'matrix-override': 'MATRIX OVERRIDE'
        };
        
        const protocolName = protocolNames[protocol] || protocol.toUpperCase();
        
        this.showNeuralToast(`${protocolName} PROTOCOL ACTIVATED!`, 'success');
        
        // Simulate protocol execution
        setTimeout(() => {
            this.showNeuralToast(`${protocolName} COMPLETE! +15 FIXIE EARNED`, 'success');
        }, 3000);
        
        this.triggerNeuralFeedback();
    }

    activateTrainingSequence() {
        this.showNeuralToast('TRAINING SEQUENCE ACTIVATED...', 'info');
        
        // Activate all protocol cards
        const protocolCards = document.querySelectorAll('.protocol-card');
        protocolCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.borderColor = 'var(--neon-green)';
                card.style.boxShadow = '0 0 20px var(--neon-green)';
                
                setTimeout(() => {
                    card.style.borderColor = 'var(--cyber-border)';
                    card.style.boxShadow = 'none';
                }, 1000);
            }, index * 200);
        });
        
        this.triggerNeuralFeedback();
    }

    acquireNeuralUpgrade(button) {
        const upgradeCard = button.closest('.upgrade-card');
        const upgradeName = upgradeCard.querySelector('h4').textContent;
        
        this.showNeuralToast(`${upgradeName} ACQUIRED!`, 'success');
        
        button.textContent = 'ACQUIRED';
        button.style.background = 'var(--cyber-gray)';
        button.disabled = true;
        
        // Neural upgrade effect
        upgradeCard.style.borderColor = 'var(--neon-green)';
        upgradeCard.style.boxShadow = '0 0 30px var(--neon-green)';
        
        setTimeout(() => {
            upgradeCard.style.borderColor = 'var(--cyber-border)';
            upgradeCard.style.boxShadow = 'none';
        }, 2000);
        
        this.triggerNeuralFeedback();
    }

    claimQuantumRewards() {
        this.showNeuralToast('23.4 FIXIE CLAIMED FROM QUANTUM POOL!', 'success');
        
        // Update displayed balance
        const pendingAmount = document.querySelector('.node-module .node-value');
        if (pendingAmount && pendingAmount.textContent.includes('23.4')) {
            pendingAmount.textContent = '0.0 FIXIE';
        }
        
        this.triggerNeuralFeedback();
    }

    connectNeuralWallet() {
        this.showNeuralToast('CONNECTING TO NEURAL WALLET...', 'info');
        
        setTimeout(() => {
            this.showNeuralToast('NEURAL WALLET CONNECTED!', 'success');
            
            const walletBtn = document.querySelector('.neural-wallet-btn');
            if (walletBtn) {
                walletBtn.textContent = 'WALLET CONNECTED';
                walletBtn.style.background = 'var(--neon-green)';
            }
        }, 2000);
        
        this.triggerNeuralFeedback();
    }

    disconnectNeuralLink() {
        if (confirm('CONFIRM NEURAL LINK DISCONNECTION?')) {
            this.showNeuralToast('DISCONNECTING NEURAL LINK...', 'warning');
            
            setTimeout(() => {
                this.showNeuralToast('NEURAL LINK TERMINATED', 'error');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }, 1500);
        }
    }

    initializeQuantumCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('⚠️ Chart.js not loaded');
            return;
        }

        try {
            const ctx = document.getElementById('performanceChart');
            if (ctx) {
                this.charts.performance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                        datasets: [{
                            label: 'NEURAL EFFICIENCY',
                            data: [85, 89, 87, 91, 88, 94, 92],
                            borderColor: '#00f3ff',
                            backgroundColor: 'rgba(0, 243, 255, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#00f3ff',
                            pointBorderColor: '#00f3ff',
                            pointHoverBackgroundColor: '#39ff14',
                            pointHoverBorderColor: '#39ff14',
                            pointBorderWidth: 2,
                            pointHoverBorderWidth: 3
                        }, {
                            label: 'QUANTUM SYNC',
                            data: [78, 82, 85, 88, 91, 94, 96],
                            borderColor: '#39ff14',
                            backgroundColor: 'rgba(57, 255, 20, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#39ff14',
                            pointBorderColor: '#39ff14',
                            pointHoverBackgroundColor: '#bf00ff',
                            pointHoverBorderColor: '#bf00ff',
                            pointBorderWidth: 2,
                            pointHoverBorderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#00f3ff',
                                    font: {
                                        family: 'Courier New, monospace',
                                        size: 10
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 70,
                                max: 100,
                                grid: {
                                    color: '#333333'
                                },
                                ticks: {
                                    color: '#39ff14',
                                    font: {
                                        family: 'Courier New, monospace',
                                        size: 9
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    color: '#333333'
                                },
                                ticks: {
                                    color: '#00f3ff',
                                    font: {
                                        family: 'Courier New, monospace',
                                        size: 9
                                    }
                                }
                            }
                        },
                        elements: {
                            point: {
                                radius: 4,
                                hoverRadius: 6
                            }
                        }
                    }
                });
                
                console.log('📊 QUANTUM CHARTS INITIALIZED');
            }
        } catch (error) {
            console.error('❌ CHART INITIALIZATION ERROR:', error);
        }
    }

    startNeuralAnimations() {
        // Start continuous neural animations
        this.startStatusIndicators();
        this.startMatrixEffects();
        this.startAvatarRotations();
    }

    startStatusIndicators() {
        const indicators = document.querySelectorAll('.status-indicator, .status-dot');
        indicators.forEach(indicator => {
            if (!indicator.classList.contains('pulsing') && !indicator.classList.contains('active')) {
                indicator.classList.add('pulsing');
            }
        });
    }

    startMatrixEffects() {
        // Add matrix-style scanning effects
        const modules = document.querySelectorAll('.stat-module, .node-module');
        modules.forEach(module => {
            if (!module.querySelector('.scan-line')) {
                const scanLine = document.createElement('div');
                scanLine.className = 'scan-line';
                scanLine.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
                    animation: scanLine 4s ease-in-out infinite;
                `;
                module.appendChild(scanLine);
            }
        });
    }

    startAvatarRotations() {
        const avatarRings = document.querySelectorAll('.avatar-ring');
        avatarRings.forEach(ring => {
            if (!ring.classList.contains('rotating')) {
                ring.classList.add('rotating');
            }
        });
    }

    triggerNeuralFeedback() {
        // Haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
        
        // Visual feedback
        document.body.style.filter = 'brightness(1.1)';
        setTimeout(() => {
            document.body.style.filter = 'brightness(1)';
        }, 100);
    }

    showNeuralToast(message, type = 'info') {
        console.log(`🔔 NEURAL TOAST: ${message}`);
        
        // Remove existing toasts
        document.querySelectorAll('.neural-toast').forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `neural-toast neural-toast--${type}`;
        
        const toastColors = {
            info: 'var(--neon-blue)',
            success: 'var(--neon-green)',
            warning: 'var(--electric-cyan)',
            error: '#ff5555'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-glow"></div>
                <span class="toast-message">${message}</span>
            </div>
        `;

        // Add toast styles
        if (!document.querySelector('#neural-toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'neural-toast-styles';
            styles.textContent = `
                .neural-toast {
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(145deg, var(--cyber-dark), var(--cyber-gray));
                    border: 1px solid ${toastColors[type]};
                    border-radius: 8px;
                    padding: 12px 20px;
                    z-index: 10001;
                    max-width: 320px;
                    animation: neuralToastSlide 0.5s ease-out;
                    box-shadow: 0 0 20px ${toastColors[type]};
                    overflow: hidden;
                }
                
                .neural-toast--info { border-color: var(--neon-blue); }
                .neural-toast--success { border-color: var(--neon-green); }
                .neural-toast--warning { border-color: var(--electric-cyan); }
                .neural-toast--error { border-color: #ff5555; }
                
                .toast-content {
                    position: relative;
                    z-index: 1;
                }
                
                .toast-glow {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.2), transparent);
                    animation: toastScan 2s ease-in-out infinite;
                }
                
                .toast-message {
                    color: ${toastColors[type]};
                    font-size: 11px;
                    font-weight: bold;
                    letter-spacing: 1px;
                    text-shadow: 0 0 10px ${toastColors[type]};
                    font-family: 'Courier New', monospace;
                }
                
                @keyframes neuralToastSlide {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-30px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                }
                
                @keyframes toastScan {
                    0%, 100% { left: -100%; }
                    50% { left: 100%; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        // Auto remove toast
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px) scale(0.8)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    setupQuantumPWA() {
        console.log('🔄 SETTING UP QUANTUM PWA');
        
        // Register service worker
        if ('serviceWorker' in navigator) {
            // Create and register service worker inline
            const swCode = `
                const CACHE_NAME = 'fixierun-neural-v1.0.0';
                const urlsToCache = [
                    './',
                    './index.html',
                    './style.css',
                    './app.js',
                    'https://cdn.jsdelivr.net/npm/chart.js'
                ];

                self.addEventListener('install', (event) => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.addAll(urlsToCache))
                    );
                });

                self.addEventListener('fetch', (event) => {
                    event.respondWith(
                        caches.match(event.request)
                            .then((response) => {
                                if (response) {
                                    return response;
                                }
                                return fetch(event.request);
                            }
                        )
                    );
                });
            `;
            
            const blob = new Blob([swCode], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(blob);
            
            navigator.serviceWorker.register(swUrl)
                .then(registration => {
                    console.log('✅ SERVICE WORKER REGISTERED:', registration);
                })
                .catch(error => {
                    console.log('❌ SERVICE WORKER REGISTRATION FAILED:', error);
                });
        }

        // PWA install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            setTimeout(() => this.showInstallPrompt(), 5000);
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.showNeuralToast('NEURAL INTERFACE INSTALLED SUCCESSFULLY!', 'success');
        });

        // Install prompt handlers
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('install-dismiss');
        
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installPWA());
        }
        
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => this.dismissInstallPrompt());
        }
    }

    showInstallPrompt() {
        if (this.deferredPrompt) {
            const installPrompt = document.getElementById('install-prompt');
            if (installPrompt) {
                installPrompt.classList.remove('hidden');
                this.showNeuralToast('PWA INSTALLATION AVAILABLE', 'info');
            }
        }
    }

    dismissInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.classList.add('hidden');
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.showNeuralToast('INITIATING PWA INSTALLATION...', 'info');
            
            this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                this.showNeuralToast('PWA INSTALLATION ACCEPTED', 'success');
            } else {
                this.showNeuralToast('PWA INSTALLATION CANCELLED', 'warning');
            }
            
            this.deferredPrompt = null;
            this.dismissInstallPrompt();
        }
    }

    emergencyFallback() {
        console.log('🚨 EMERGENCY FALLBACK ACTIVATED');
        
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const mainApp = document.getElementById('main-app');
            
            if (loadingScreen && mainApp) {
                loadingScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                this.showNeuralToast('NEURAL INTERFACE RESTORED', 'warning');
            }
        }, 1000);
    }
}

// Multiple initialization strategies for maximum compatibility
function initializeNeuralMatrix() {
    if (window.cyberFixieApp) return;
    
    console.log('🔌 NEURAL MATRIX INITIALIZATION');
    
    try {
        window.cyberFixieApp = new CyberFixieApp();
        console.log('✅ NEURAL MATRIX ONLINE');
    } catch (error) {
        console.error('❌ NEURAL MATRIX INITIALIZATION FAILED:', error);
        
        // Emergency fallback
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const mainApp = document.getElementById('main-app');
            
            if (loadingScreen && mainApp) {
                loadingScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
            }
        }, 2000);
    }
}

// Primary initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNeuralMatrix);
} else {
    initializeNeuralMatrix();
}

// Backup initializations
window.addEventListener('load', () => {
    if (!window.cyberFixieApp) {
        console.log('🔄 BACKUP INITIALIZATION TRIGGERED');
        initializeNeuralMatrix();
    }
});

// Third backup
setTimeout(() => {
    if (!window.cyberFixieApp) {
        console.log('⚡ EMERGENCY INITIALIZATION TRIGGERED');
        initializeNeuralMatrix();
    }
}, 3000);

// Network status handlers
window.addEventListener('online', () => {
    if (window.cyberFixieApp) {
        window.cyberFixieApp.showNeuralToast('NEURAL NETWORK RESTORED', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.cyberFixieApp) {
        window.cyberFixieApp.showNeuralToast('OFFLINE MODE ACTIVATED', 'warning');
    }
});

// PWA display mode detection
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    console.log('🚀 RUNNING IN PWA MODE');
    document.body.classList.add('pwa-mode');
}

console.log('🌟 NEURAL MATRIX SCRIPT LOADED - READY FOR ACTIVATION');