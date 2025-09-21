// Функция для скачивания приложения
function downloadApp() {
    // Показываем уведомление о скачивании
    showDownloadNotification();
    
    // Открываем страницу релиза в новой вкладке
    const releaseUrl = 'https://github.com/footballpredictions/FootballAdminData/releases/tag/v2.0.2';
    window.open(releaseUrl, '_blank');
    
    // Добавляем эффект нажатия на кнопку
    const downloadBtn = document.querySelector('.download-btn');
    downloadBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        downloadBtn.style.transform = '';
    }, 150);
}

// Показ уведомления о скачивании
function showDownloadNotification() {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">📱</span>
            <span class="notification-text">Переход к странице загрузки...</span>
        </div>
    `;
    
    // Добавляем стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        font-family: 'Roboto', sans-serif;
    `;
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-text {
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Дополнительные эффекты при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем эффект частиц в фоне
    createParticleEffect();
    
    // Добавляем звуковой эффект (опционально)
    addSoundEffects();
});

// Создание эффекта частиц
function createParticleEffect() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        container.appendChild(particle);
    }
    
    // Добавляем CSS для анимации частиц
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Звуковые эффекты (опционально)
function addSoundEffects() {
    // Создаем аудио контекст для звуковых эффектов
    let audioContext;
    
    // Функция для воспроизведения звука при нажатии на кнопку
    function playClickSound() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // Добавляем звуковой эффект к кнопке скачивания
    const downloadBtn = document.querySelector('.download-btn');
    downloadBtn.addEventListener('click', playClickSound);
}

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.log('Произошла ошибка:', e.message);
});

// Предотвращение контекстного меню на мяче для лучшего UX
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.football-ball')) {
        e.preventDefault();
    }
});

// Добавляем поддержку клавиатуры
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const downloadBtn = document.querySelector('.download-btn');
        if (document.activeElement === downloadBtn) {
            downloadApp();
        }
    }
});

// Анимация при скролле (если пользователь прокрутит страницу)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.splash-screen');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Добавляем эффект свечения для мяча при наведении
document.addEventListener('DOMContentLoaded', function() {
    const ball = document.querySelector('.ball');
    
    ball.addEventListener('mouseenter', function() {
        this.style.boxShadow = `
            0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 5px 15px rgba(255, 255, 255, 0.8),
            0 0 50px rgba(255, 255, 255, 0.5)
        `;
    });
    
    ball.addEventListener('mouseleave', function() {
        this.style.boxShadow = `
            0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 5px 15px rgba(255, 255, 255, 0.8)
        `;
    });
});
