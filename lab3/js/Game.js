class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = 'menu';
        this.level = 1;
        this.maxLevel = 3;
        this.player = null;
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.door = null;
        this.input = new InputHandler();
        this.renderer = new Renderer(this.ctx);
        this.score = 0;
        this.health = 3;
        this.collectedCoins = 0;
        this.totalCoins = 0;
        this.lastTime = 0;
        this.accumulator = 0;
        this.frameTime = 1000 / 60;
        
        this.ui = {
            scoreEl: document.getElementById('score'),
            healthEl: document.getElementById('health'),
            levelEl: document.getElementById('level'),
            menu: document.getElementById('menu-overlay'),
            message: document.getElementById('game-message'),
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            restartBtn: document.getElementById('restart-btn')
        };
        
        this.gameLoop = this.gameLoop.bind(this);
        this.start = this.start.bind(this);
        this.togglePause = this.togglePause.bind(this);
        this.restart = this.restart.bind(this);
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        if (this.ui.startBtn) {
            this.ui.startBtn.addEventListener('click', this.start);
        }
        if (this.ui.pauseBtn) {
            this.ui.pauseBtn.addEventListener('click', this.togglePause);
        }
        if (this.ui.restartBtn) {
            this.ui.restartBtn.addEventListener('click', this.restart);
        }
        
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'KeyP' || e.code === 'Escape') && 
                (this.state === 'playing' || this.state === 'paused')) {
                e.preventDefault();
                this.togglePause();
            }
        });
    }
    
    initLevel(levelNum) {
        this.level = levelNum;
        this.player = new Player(50, 400);
        this.collectedCoins = 0;
        
        this.platforms = this.generatePlatforms(levelNum);
        
        const levelConfig = this.getLevelConfig(levelNum);
        this.totalCoins = levelConfig.coins;
        this.coins = this.generateCoinsOnPlatforms(levelConfig.coins);
        this.enemies = levelConfig.enemies > 0 ? this.generateEnemies(levelConfig.enemies) : [];
        
        this.door = this.generateDoor();
        
        this.updateUI();
    }
    
    getLevelConfig(level) {
        const configs = {
            1: { coins: 4, enemies: 0 },
            2: { coins: 7, enemies: 3 },
            3: { coins: 10, enemies: 6 }
        };
        return configs[level] || { coins: 4, enemies: 0 };
    }
    
    generatePlatforms(level) {
        const platforms = [];
        const groundY = 550;
        
        platforms.push(new Platform(0, groundY, 800, 50));
        
        const platformCount = 4 + level;
        const minDistanceY = 60;
        const minDistanceX = 40;
        
        for (let i = 0; i < platformCount; i++) {
            let validPosition = false;
            let attempts = 0;
            let platform;
            
            while (!validPosition && attempts < 100) {
                const width = 80 + Math.random() * 100;
                const x = 50 + Math.random() * (700 - width);
                const y = 150 + i * ((groundY - 150 - minDistanceY) / platformCount) + Math.random() * 30;
                
                validPosition = true;
                for (const existingPlatform of platforms) {
                    const overlapX = !(x + width < existingPlatform.x - minDistanceX || 
                                      x > existingPlatform.x + existingPlatform.width + minDistanceX);
                    const overlapY = !(y + 20 < existingPlatform.y - minDistanceY || 
                                      y > existingPlatform.y + existingPlatform.height + minDistanceY);
                    
                    if (overlapX && overlapY) {
                        validPosition = false;
                        break;
                    }
                }
                
                if (validPosition) {
                    const type = (level > 1 && Math.random() < 0.3) ? 'moving' : 'normal';
                    platform = new Platform(x, y, width, 20, type);
                    
                    if (type === 'moving') {
                        platform.moveRange = 50 + Math.random() * 80;
                        platform.moveSpeed = 1 + Math.random() * 1.5;
                    }
                }
                
                attempts++;
            }
            
            if (validPosition && platform) {
                platforms.push(platform);
            }
        }
        
        return platforms;
    }
    
    generateCoinsOnPlatforms(count) {
        const coins = [];
        const availablePlatforms = this.platforms.filter(p => p.y < 550);
        
        if (availablePlatforms.length === 0) return coins;
        
        for (let i = 0; i < count; i++) {
            const platform = availablePlatforms[Math.floor(Math.random() * availablePlatforms.length)];
            
            const coinX = platform.x + 20 + Math.random() * (platform.width - 40);
            const coinY = platform.y - 30;
            
            coins.push({
                x: coinX,
                y: coinY,
                width: 20,
                height: 20,
                collected: false,
                rotation: i * 0.5
            });
        }
        
        return coins;
    }
    
    generateEnemies(count) {
        const enemies = [];
        const minDistance = 120;
        
        for (let i = 0; i < count; i++) {
            let validPosition = false;
            let attempts = 0;
            let enemy;
            
            while (!validPosition && attempts < 100) {
                const y = 520 - Math.floor(i / 2) * 130;
                const startX = 150 + (i % 3) * 220 + Math.random() * 50;
                
                validPosition = true;
                for (const existingEnemy of enemies) {
                    const dist = Math.sqrt((startX - existingEnemy.startX) ** 2 + (y - existingEnemy.y) ** 2);
                    if (dist < minDistance) {
                        validPosition = false;
                        break;
                    }
                }
                
                if (validPosition) {
                    enemy = {
                        x: startX,
                        y: y,
                        width: 30,
                        height: 30,
                        speed: 1.5 + Math.random() * 1.5,
                        direction: Math.random() > 0.5 ? 1 : -1,
                        range: 80 + Math.random() * 70,
                        startX: startX
                    };
                }
                
                attempts++;
            }
            
            if (validPosition && enemy) {
                enemies.push(enemy);
            }
        }
        
        return enemies;
    }
    
    generateDoor() {
        return {
            x: 720,
            y: 470,
            width: 50,
            height: 80,
            isOpen: false,
            requiredPercent: 80
        };
    }
    
    checkDoor() {
        if (!this.door) return;
        
        const collectedPercent = (this.collectedCoins / this.totalCoins) * 100;
        this.door.isOpen = collectedPercent >= this.door.requiredPercent;
        
        if (this.door.isOpen && Collision.checkAABB(this.player, this.door)) {
            this.nextLevel();
        }
    }
    
    start() {
        this.state = 'playing';
        this.score = 0;
        this.health = 3;
        this.input.reset();
        this.initLevel(1);
        
        if (this.ui.menu) {
            this.ui.menu.classList.add('hidden');
        }
        if (this.ui.startBtn) this.ui.startBtn.style.display = 'none';
        if (this.ui.pauseBtn) this.ui.pauseBtn.style.display = 'block';
        if (this.ui.restartBtn) this.ui.restartBtn.style.display = 'none';
        if (this.ui.message) this.ui.message.style.display = 'none';
        
        this.lastTime = performance.now();
        this.accumulator = 0;
        requestAnimationFrame(this.gameLoop);
    }
    
    // 🔥 ИСПРАВЛЕННАЯ ПАУЗА - ТЕПЕРЬ НЕ СБРАСЫВАЕТ УРОВЕНЬ
    togglePause() {
        if (this.state === 'playing') {
            // Ставим на паузу
            this.state = 'paused';
            if (this.ui.menu) this.ui.menu.classList.remove('hidden');
            if (this.ui.startBtn) this.ui.startBtn.style.display = 'none';
            if (this.ui.pauseBtn) this.ui.pauseBtn.style.display = 'none';
            if (this.ui.restartBtn) this.ui.restartBtn.style.display = 'block';
        } else if (this.state === 'paused') {
            // Продолжаем игру - БЕЗ сброса!
            this.state = 'playing';
            if (this.ui.menu) this.ui.menu.classList.add('hidden');
            if (this.ui.startBtn) this.ui.startBtn.style.display = 'none';
            if (this.ui.pauseBtn) this.ui.pauseBtn.style.display = 'block';
            if (this.ui.restartBtn) this.ui.restartBtn.style.display = 'none';
            
            this.lastTime = performance.now();
            requestAnimationFrame(this.gameLoop);
        }
    }
    
    restart() {
        this.input.reset();
        this.initLevel(1);
        this.start();
    }
    
    gameLoop(currentTime) {
        if (this.state !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulator += deltaTime;
        
        while (this.accumulator >= this.frameTime) {
            this.update(this.frameTime);
            this.accumulator -= this.frameTime;
        }
        
        this.render();
        requestAnimationFrame(this.gameLoop);
    }
    
    update(deltaTime) {
        const input = this.input.getState();
        
        // 🔥 Сохраняем предыдущую позицию игрока
        const prevPlayerX = this.player.x;
        const prevPlayerY = this.player.y;
        
        this.player.update(input, this.platforms, deltaTime);
        
        // 🔥 Обновляем платформы и двигаем игрока вместе с движущейся платформой
        let onMovingPlatform = false;
        this.platforms.forEach(p => {
            const prevX = p.x;
            p.update(deltaTime);
            
            // Если игрок на движущейся платформе - двигаем его вместе с ней
            if (p.type === 'moving' && this.player.isGrounded && 
                this.player.y + this.player.height === p.y) {
                const platformDelta = p.x - prevX;
                this.player.x += platformDelta;
                onMovingPlatform = true;
            }
        });
        
        this.coins.forEach(coin => {
            if (Collision.checkCoinCollection(this.player, coin)) {
                this.score += 100;
                this.collectedCoins++;
                this.updateUI();
            }
            coin.rotation += 0.05;
        });
        
        if (!this.player.isInvincible) {
            this.enemies.forEach(enemy => {
                enemy.x += enemy.speed * enemy.direction;
                if (enemy.x > enemy.startX + enemy.range || 
                    enemy.x < enemy.startX - enemy.range) {
                    enemy.direction *= -1;
                }
                
                const result = Collision.checkEnemyCollision(this.player, enemy);
                if (result === 'stomp') {
                    enemy.y = 1000;
                    this.score += 200;
                    this.player.velocityY = -8;
                    this.updateUI();
                } else if (result === 'hit') {
                    this.takeDamage();
                }
            });
        }
        
        this.checkDoor();
        
        if (this.input.isJumpJustPressed()) {
            this.input.consumeJump();
        }
    }
    
    takeDamage() {
        this.health--;
        this.updateUI();
        this.player.velocityY = -6;
        this.player.velocityX = this.player.facing * -4;
        
        this.player.startInvincibility(1500);
        
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    nextLevel() {
        if (this.level < this.maxLevel) {
            this.initLevel(this.level + 1);
        } else {
            this.win();
        }
    }
    
    gameOver() {
        this.state = 'gameover';
        this.showMessage('💔 Игра окончена!', 'lose');
        this.saveProgress();
    }
    
    win() {
        this.state = 'win';
        const bonus = this.health * 100;
        this.score += bonus;
        this.updateUI();
        this.showMessage(`🏆 Победа! Очки: ${this.score}`, 'win');
        this.saveProgress();
    }
    
    showMessage(text, type) {
        if (this.ui.message) {
            this.ui.message.textContent = text;
            this.ui.message.className = type;
            this.ui.message.style.display = 'block';
        }
        if (this.ui.menu) this.ui.menu.classList.remove('hidden');
        if (this.ui.startBtn) this.ui.startBtn.style.display = 'none';
        if (this.ui.pauseBtn) this.ui.pauseBtn.style.display = 'none';
        if (this.ui.restartBtn) this.ui.restartBtn.style.display = 'block';
    }
    
    updateUI() {
        if (this.ui.scoreEl) this.ui.scoreEl.textContent = this.score;
        if (this.ui.healthEl) this.ui.healthEl.textContent = this.health;
        if (this.ui.levelEl) this.ui.levelEl.textContent = this.level;
    }
    
    saveProgress() {
        try {
            const highScore = Math.max(this.score, localStorage.getItem('platformer_highscore') || 0);
            const maxLevel = Math.max(this.level, localStorage.getItem('platformer_maxlevel') || 1);
            localStorage.setItem('platformer_highscore', highScore);
            localStorage.setItem('platformer_maxlevel', maxLevel);
        } catch (e) {
            console.warn('localStorage недоступен:', e);
        }
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderer.renderBackground(this.level);
        
        this.platforms.forEach(platform => platform.render(this.ctx));
        
        if (this.door) {
            this.renderer.renderDoor(this.ctx, this.door, this.collectedCoins, this.totalCoins);
        }
        
        this.coins.forEach(coin => {
            if (!coin.collected) {
                this.renderer.renderCoin(this.ctx, coin);
            }
        });
        
        this.enemies.forEach(enemy => {
            if (enemy.y < 600) {
                this.renderer.renderEnemy(this.ctx, enemy);
            }
        });
        
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        if (this.door) {
            const percent = Math.floor((this.collectedCoins / this.totalCoins) * 100);
            this.renderer.renderProgress(this.ctx, this.collectedCoins, this.totalCoins, percent);
        }
    }
}