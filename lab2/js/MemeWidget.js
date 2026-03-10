import { UIComponent } from './UIComponent.js';

export class MemeWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: '🎭 Случайный мем (API)' });
        this.memeData = null;
    }

    render() {
        super.render();
        const container = this.getContentContainer();
        
        container.innerHTML = `
            <div class="meme-content">
                <div class="meme-image-container">
                    <img src="" alt="Meme" class="meme-image" id="meme-img-${this.id}">
                </div>
                <p class="meme-title" id="meme-title-${this.id}">Загрузка...</p>
            </div>
            <button class="refresh-btn">🔄 Новый мем</button>
        `;

        const refreshBtn = container.querySelector('.refresh-btn');
        refreshBtn.addEventListener('click', () => this.fetchMeme(container));

        this.fetchMeme(container);
        
        return this.element;
    }

    async fetchMeme(container) {
        const imgEl = container.querySelector(`#meme-img-${this.id}`);
        const titleEl = container.querySelector(`#meme-title-${this.id}`);
        
        imgEl.style.opacity = '0.5';
        titleEl.textContent = 'Загрузка...';
        
        try {
            const response = await fetch('https://meme-api.com/gimme');
            if (!response.ok) throw new Error('API error');
            
            const data = await response.json();
            this.memeData = data;
            
            imgEl.src = data.url;
            imgEl.alt = data.title;
            titleEl.textContent = data.title;
            
            imgEl.onload = () => {
                imgEl.style.opacity = '1';
            };
            
            imgEl.onerror = () => {
                titleEl.textContent = '❌ Не удалось загрузить';
                imgEl.style.opacity = '1';
            };

        } catch (error) {
            console.error('Meme API error:', error);
            titleEl.textContent = '😅 Мем не загрузился';
            imgEl.src = 'https://via.placeholder.com/400x300/3498db/ffffff?text=😄+Попробуйте+ещё!';
            imgEl.alt = 'Placeholder';
            imgEl.style.opacity = '1';
        }
    }

    destroy() {
        const img = this.element?.querySelector('.meme-image');
        if (img) {
            img.onload = null;
            img.onerror = null;
        }
        super.destroy();
        this.memeData = null;
    }
}