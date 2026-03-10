class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    renderBackground(level) {
        const ctx = this.ctx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        const colors = [
            { r: 135, g: 206, b: 235 },
            { r: 72, g: 61, b: 139 },
            { r: 25, g: 25, b: 112 }
        ];
        const color = colors[Math.min(level - 1, colors.length - 1)];
        
        skyGradient.addColorStop(0, `rgb(${color.r}, ${color.g}, ${color.b})`);
        skyGradient.addColorStop(1, `rgb(${color.r + 30}, ${color.g + 30}, ${color.b + 30})`);
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 5; i++) {
            const x = (i * 200 + Date.now() * 0.02) % (width + 100) - 50;
            const y = 50 + i * 30;
            this.drawCloud(ctx, x, y, 0.5 + i * 0.1);
        }
    }
    
    drawCloud(ctx, x, y, scale) {
        ctx.beginPath();
        ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
        ctx.arc(x + 15 * scale, y - 10 * scale, 15 * scale, 0, Math.PI * 2);
        ctx.arc(x + 30 * scale, y, 20 * scale, 0, Math.PI * 2);
        ctx.arc(x + 15 * scale, y + 5 * scale, 12 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderDoor(ctx, door, collected, total) {
        const percent = (collected / total) * 100;
        const isOpen = percent >= door.requiredPercent;
        
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(door.x, door.y, door.width, door.height);
        
        if (isOpen) {
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(door.x + 5, door.y + 5, door.width - 10, door.height - 5);
            
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(door.x + door.width/2, door.y + door.height);
            ctx.lineTo(door.x - 30, door.y + door.height + 100);
            ctx.lineTo(door.x + door.width + 30, door.y + door.height + 100);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.fillStyle = '#795548';
            ctx.fillRect(door.x + 5, door.y + 5, door.width - 10, door.height - 5);
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(door.x + door.width - 15, door.y + door.height/2, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#D32F2F';
            ctx.beginPath();
            ctx.arc(door.x + door.width/2, door.y + door.height/2, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = isOpen ? '#81C784' : '#FFA726';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(percent)}%`, door.x + door.width/2, door.y - 10);
    }
    
    renderProgress(ctx, collected, total, percent) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, 10, 200, 30);
        
        const barWidth = 180;
        const filledWidth = (percent / 100) * barWidth;
        
        ctx.fillStyle = percent >= 80 ? '#81C784' : '#FFA726';
        ctx.fillRect(20, 20, filledWidth, 10);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, barWidth, 10);
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Монеты: ${collected}/${total}`, 20, 45);
        
        if (percent >= 80) {
            ctx.fillStyle = '#81C784';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('🚪 Дверь открыта!', 20, 60);
        } else {
            ctx.fillStyle = '#FFA726';
            ctx.font = '12px Arial';
            ctx.fillText(`Нужно: 80%`, 20, 60);
        }
    }
    
    renderCoin(ctx, coin) {
        const centerX = coin.x + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        const scaleX = Math.abs(Math.cos(coin.rotation));
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scaleX, 1);
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
    
    renderEnemy(ctx, enemy) {
        ctx.fillStyle = '#E57373';
        ctx.beginPath();
        ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, 5);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(enemy.x + 8, enemy.y + 12, 4, 0, Math.PI * 2);
        ctx.arc(enemy.x + 22, enemy.y + 12, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        const pupilOffset = enemy.direction * 1.5;
        ctx.beginPath();
        ctx.arc(enemy.x + 8 + pupilOffset, enemy.y + 12, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + 22 + pupilOffset, enemy.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}