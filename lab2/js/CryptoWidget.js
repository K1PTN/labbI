import { UIComponent } from './UIComponent.js';

export class CryptoWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: '₿ Курс Биткоина (API)' });
        this.price = null;
    }

    render() {
        super.render();
        const container = this.getContentContainer();
        container.innerHTML = `
            <div class="crypto-content">
                <div class="crypto-icon">₿</div>
                <div class="crypto-price">Загрузка...</div>
                <div class="crypto-change"></div>
            </div>
            <button class="refresh-btn">🔄 Обновить курс</button>
        `;

        const refreshBtn = container.querySelector('.refresh-btn');
        refreshBtn.addEventListener('click', () => this.fetchPrice(container));

        this.fetchPrice(container);
        
        return this.element;
    }

    async fetchPrice(container) {
        const priceEl = container.querySelector('.crypto-price');
        const changeEl = container.querySelector('.crypto-change');
        
        priceEl.textContent = '...';
        
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
            if (!response.ok) throw new Error('API error');
            
            const data = await response.json();
            const usdPrice = data.bitcoin.usd;
            const change = data.bitcoin.usd_24h_change.toFixed(2);
            
            this.price = usdPrice;
            priceEl.textContent = `$${usdPrice.toLocaleString()}`;
            changeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
            changeEl.style.color = change >= 0 ? '#2ecc71' : '#e74c3c';

        } catch (error) {
            console.error('Crypto API error:', error);
            priceEl.textContent = '❌ Ошибка API';
            changeEl.textContent = '';
        }
    }

    destroy() {
        super.destroy();
        this.price = null;
    }
}