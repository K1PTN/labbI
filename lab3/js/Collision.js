class Collision {
    static checkAABB(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    static resolvePlayerPlatform(player, platform) {
        if (!this.checkAABB(player, platform)) {
            return { collided: false };
        }
        
        const overlapX = Math.min(player.x + player.width, platform.x + platform.width) - 
                         Math.max(player.x, platform.x);
        const overlapY = Math.min(player.y + player.height, platform.y + platform.height) - 
                         Math.max(player.y, platform.y);
        
        if (overlapX < overlapY) {
            if (player.x < platform.x) {
                player.x = platform.x - player.width;
            } else {
                player.x = platform.x + platform.width;
            }
            player.velocityX = 0;
            return { collided: true, side: 'horizontal' };
        } else {
            if (player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isGrounded = true;
                return { collided: true, side: 'top' };
            } else {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
                return { collided: true, side: 'bottom' };
            }
        }
    }
    
    static checkCoinCollection(player, coin) {
        if (coin.collected) return false;
        if (this.checkAABB(player, coin)) {
            coin.collected = true;
            return true;
        }
        return false;
    }
    
    static checkEnemyCollision(player, enemy) {
        if (!this.checkAABB(player, enemy)) {
            return 'none';
        }
        
        if (player.velocityY > 0 && 
            player.y + player.height - player.velocityY <= enemy.y + enemy.height * 0.5) {
            return 'stomp';
        }
        
        return 'hit';
    }
}