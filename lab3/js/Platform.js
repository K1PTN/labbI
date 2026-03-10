class Platform {
    constructor(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.moveRange = 0;
        this.moveSpeed = 0;
        this.moveDirection = 1;
        this.startX = x;
        this.color = this.getColorByType();
    }
    
    getColorByType() {
        const colors = {
            'normal': '#8B7355',
            'moving': '#9370DB',
            'breakable': '#CD5C5C'
        };
        return colors[this.type] || colors['normal'];
    }
    
    update(deltaTime) {
        if (this.type === 'moving') {
            this.x += this.moveSpeed * this.moveDirection * (deltaTime / 16);
            if (this.x > this.startX + this.moveRange || 
                this.x < this.startX - this.moveRange) {
                this.moveDirection *= -1;
            }
        }
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (this.type === 'normal') {
            ctx.fillStyle = '#7CFC00';
            ctx.fillRect(this.x, this.y, this.width, 8);
        }
    }
    
    static createLevel(level) {
        const platforms = [];
        platforms.push(new Platform(0, 550, 800, 50));
        
        switch(level) {
            case 1:
                platforms.push(
                    new Platform(200, 450, 150, 20),
                    new Platform(450, 380, 150, 20),
                    new Platform(100, 300, 120, 20),
                    new Platform(600, 250, 150, 20)
                );
                break;
            case 2:
                platforms.push(
                    new Platform(150, 470, 100, 20),
                    new Platform(350, 400, 80, 20, 'moving'),
                    new Platform(550, 330, 100, 20),
                    new Platform(300, 250, 120, 20, 'moving'),
                    new Platform(100, 180, 100, 20)
                );
                platforms[2].moveRange = 80;
                platforms[2].moveSpeed = 1.5;
                platforms[4].moveRange = 60;
                platforms[4].moveSpeed = 2;
                break;
            case 3:
                platforms.push(
                    new Platform(100, 480, 80, 20),
                    new Platform(280, 420, 60, 20, 'breakable'),
                    new Platform(450, 360, 80, 20),
                    new Platform(620, 300, 80, 20, 'moving'),
                    new Platform(400, 240, 100, 20),
                    new Platform(150, 180, 80, 20, 'breakable')
                );
                platforms[4].moveRange = 100;
                platforms[4].moveSpeed = 2.5;
                break;
        }
        return platforms;
    }
}