class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -14;
        this.gravity = 0.6;
        this.friction = 0.85;
        this.isGrounded = false;
        this.facing = 1;
        this.color = '#4FC3F7';
        this.animFrame = 0;
        this.animTimer = 0;
        
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 0;
        this.blinkInterval = 100;
        this.lastBlink = 0;
    }
    
    startInvincibility(duration) {
        this.isInvincible = true;
        this.invincibleDuration = duration;
        this.invincibleTimer = 0;
    }
    
    update(input, platforms, deltaTime) {
        if (this.isInvincible) {
            this.invincibleTimer += deltaTime;
            if (this.invincibleTimer >= this.invincibleDuration) {
                this.isInvincible = false;
            }
        }
        
        if (input.left) {
            this.velocityX = -this.speed;
            this.facing = -1;
        } else if (input.right) {
            this.velocityX = this.speed;
            this.facing = 1;
        } else {
            this.velocityX *= this.friction;
            if (Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        }
        
        if (input.jump && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }
        
        this.velocityY += this.gravity;
        if (this.velocityY > 15) this.velocityY = 15;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 800) this.x = 800 - this.width;
        
        this.isGrounded = false;
        
        for (const platform of platforms) {
            const collision = Collision.resolvePlayerPlatform(this, platform);
            if (collision.collided && collision.side === 'top') {
                this.isGrounded = true;
            }
        }
        
        if (this.y > 600) {
            this.respawn();
        }
        
        this.updateAnimation(deltaTime);
    }
    
    updateAnimation(deltaTime) {
        this.animTimer += deltaTime;
        if (this.animTimer > 100) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animTimer = 0;
        }
    }
    
    render(ctx) {
        if (this.isInvincible) {
            this.lastBlink += 16;
            if (this.lastBlink >= this.blinkInterval) {
                this.lastBlink = 0;
                if (Math.floor(Date.now() / 100) % 2 === 0) {
                    return;
                }
            }
        }
        
        ctx.fillStyle = this.isInvincible ? '#FFD700' : this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        const eyeOffsetX = this.facing > 0 ? 18 : 6;
        ctx.beginPath();
        ctx.arc(this.x + eyeOffsetX, this.y + 15, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + eyeOffsetX + (this.facing > 0 ? 2 : -2), this.y + 15, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#1976D2';
        const legOffset = Math.sin(this.animFrame * Math.PI / 2) * 3;
        if (Math.abs(this.velocityX) > 0.5 && this.isGrounded) {
            ctx.fillRect(this.x + 6, this.y + this.height - 10, 8, 10 + legOffset);
            ctx.fillRect(this.x + 18, this.y + this.height - 10, 8, 10 - legOffset);
        } else {
            ctx.fillRect(this.x + 6, this.y + this.height - 10, 8, 10);
            ctx.fillRect(this.x + 18, this.y + this.height - 10, 8, 10);
        }
        
        if (this.isInvincible) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(Date.now() * 0.01) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, 35, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    respawn() {
        this.x = 50;
        this.y = 400;
        this.velocityX = 0;
        this.velocityY = 0;
    }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    }
}