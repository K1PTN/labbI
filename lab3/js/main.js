document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('❌ Canvas not found!');
        return;
    }
    
    if (!canvas.getContext) {
        alert('Ваш браузер не поддерживает HTML5 Canvas');
        return;
    }
    
    const game = new Game(canvas);
    window.game = game;
});