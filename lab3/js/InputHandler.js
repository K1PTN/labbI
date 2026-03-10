class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            jump: false
        };
        this.jumpPressed = false;
        this.initListeners();
    }
    
    initListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        window.addEventListener('keydown', (e) => {
            if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    onKeyDown(e) {
        const key = e.code;
        
        if (key === 'ArrowLeft' || key === 'KeyA') {
            this.keys.left = true;
        }
        if (key === 'ArrowRight' || key === 'KeyD') {
            this.keys.right = true;
        }
        if (key === 'Space' || key === 'ArrowUp' || key === 'KeyW') {
            if (!this.keys.jump) {
                this.jumpPressed = true;
            }
            this.keys.jump = true;
        }
    }
    
    onKeyUp(e) {
        const key = e.code;
        
        if (key === 'ArrowLeft' || key === 'KeyA') {
            this.keys.left = false;
        }
        if (key === 'ArrowRight' || key === 'KeyD') {
            this.keys.right = false;
        }
        if (key === 'Space' || key === 'ArrowUp' || key === 'KeyW') {
            this.keys.jump = false;
        }
    }
    
    consumeJump() {
        this.jumpPressed = false;
    }
    
    isJumpJustPressed() {
        return this.jumpPressed;
    }
    
    getState() {
        return { ...this.keys };
    }
    
    reset() {
        this.keys = { left: false, right: false, jump: false };
        this.jumpPressed = false;
    }
}