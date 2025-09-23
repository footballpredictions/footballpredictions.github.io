// Функция для скачивания приложения
function downloadApp() {
	// Показываем уведомление о скачивании
	showDownloadNotification('Идет подготовка загрузки...');

	// Если уже знаем актуальную ссылку на APK — качаем сразу
	if (window.__latestApkUrl) {
		triggerDirectDownload(window.__latestApkUrl);
		return;
	}

	// Иначе пытаемся получить последнюю ссылку из GitHub Releases
	fetchLatestApkUrl()
		.then((apkUrl) => {
			if (apkUrl) {
				triggerDirectDownload(apkUrl);
			} else {
				// Фолбэк на фиксированную версию
				triggerDirectDownload('https://github.com/footballpredictions/FootballAdminData/releases/download/v2.0.2/FootballPredictions-release.apk');
			}
		})
		.catch(() => {
			triggerDirectDownload('https://github.com/footballpredictions/FootballAdminData/releases/download/v2.0.2/FootballPredictions-release.apk');
		});
}

function triggerDirectDownload(url) {
	showDownloadNotification('Загрузка APK начнется сейчас...');
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn) {
		downloadBtn.style.transform = 'scale(0.95)';
		setTimeout(() => { downloadBtn.style.transform = ''; }, 150);
	}
	// Прямой переход на файл APK
	window.location.href = url;
}

// Получение последнего релиза и ссылки на APK
async function fetchLatestApkUrl() {
	try {
		const res = await fetch('https://api.github.com/repos/footballpredictions/FootballAdminData/releases/latest', {
			headers: { 'Accept': 'application/vnd.github+json' }
		});
		if (!res.ok) throw new Error('Failed to fetch latest release');
		const data = await res.json();
		// Ищем asset c расширением .apk
		const apkAsset = Array.isArray(data.assets) ? data.assets.find(a => typeof a.browser_download_url === 'string' && a.browser_download_url.toLowerCase().endsWith('.apk')) : null;
		if (apkAsset && apkAsset.browser_download_url) {
			window.__latestApkUrl = apkAsset.browser_download_url;
			window.__latestVersionTag = data.tag_name || '';
			updateVersionLabel(window.__latestVersionTag);
			return window.__latestApkUrl;
		}
		return null;
	} catch (e) {
		return null;
	}
}

function updateVersionLabel(tag) {
	if (!tag) return;
	const el = document.querySelector('.version-info');
	if (el) {
		el.textContent = `Версия ${tag}`;
	}
}

// Показ уведомления о скачивании
function showDownloadNotification(text) {
	// Создаем элемент уведомления
	const notification = document.createElement('div');
	notification.className = 'download-notification';
	notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">📱</span>
            <span class="notification-text">${text || 'Переход к странице загрузки...'}</span>
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
    // Добавляем эффект спортивных элементов в фоне
    createSportsEffect();
    
    // Добавляем звуковой эффект (опционально)
    addSoundEffects();
});

// Создание эффекта спортивных элементов
function createSportsEffect() {
    const container = document.querySelector('.container');
    
    // Массив спортивных элементов
    const sportsElements = [
        { emoji: '⚽', name: 'football' },
        { emoji: '🏆', name: 'trophy' },
        { emoji: '🥅', name: 'goal' },
        { emoji: '🏟️', name: 'stadium' },
        { emoji: '⚽', name: 'soccer-ball' },
        { emoji: '🏃', name: 'runner' },
        { emoji: '🏅', name: 'medal' },
        { emoji: '🥇', name: 'gold-medal' },
        { emoji: '🏃‍♂️', name: 'runner-man' },
        { emoji: '⚽', name: 'ball' },
        { emoji: '🏆', name: 'cup' },
        { emoji: '🥅', name: 'net' }
    ];
    
    for (let i = 0; i < 15; i++) {
        const sportElement = document.createElement('div');
        const randomSport = sportsElements[Math.floor(Math.random() * sportsElements.length)];
        
        sportElement.className = 'sport-element';
        sportElement.innerHTML = randomSport.emoji;
        sportElement.style.cssText = `
            position: absolute;
            font-size: ${20 + Math.random() * 15}px;
            color: rgba(255, 255, 255, 0.8);
            pointer-events: none;
            animation: sportFloat ${4 + Math.random() * 6}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
            z-index: 1;
        `;
        
        container.appendChild(sportElement);
    }
    
    // Добавляем CSS для анимации спортивных элементов
    const sportStyle = document.createElement('style');
    sportStyle.textContent = `
        @keyframes sportFloat {
            0% {
                transform: translateY(100vh) rotate(0deg) scale(0.5);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
                transform: scale(1);
            }
            50% {
                opacity: 1;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg) scale(0.5);
                opacity: 0;
            }
        }
        
        .sport-element {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }
    `;
    document.head.appendChild(sportStyle);
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
    const ballImage = document.querySelector('.ball-image');
    const ballFallback = document.querySelector('.ball-fallback');
    
    // Обработчик для изображения мяча
    if (ballImage) {
        ballImage.addEventListener('mouseenter', function() {
            this.style.boxShadow = `
                0 25px 50px rgba(0, 0, 0, 0.6),
                0 0 0 2px rgba(255, 255, 255, 0.5),
                0 0 80px rgba(255, 255, 255, 0.7)
            `;
            this.style.transform = 'scale(1.05)';
        });
        
        ballImage.addEventListener('mouseleave', function() {
            this.style.boxShadow = `
                0 20px 40px rgba(0, 0, 0, 0.5),
                0 0 0 2px rgba(255, 255, 255, 0.3)
            `;
            this.style.transform = 'scale(1)';
        });
    }
    
    // Обработчик для резервного варианта
    if (ballFallback) {
        ballFallback.addEventListener('mouseenter', function() {
            this.style.boxShadow = `
                0 25px 50px rgba(0, 0, 0, 0.6),
                0 0 0 2px rgba(255, 255, 255, 0.5),
                0 0 80px rgba(255, 255, 255, 0.7)
            `;
            this.style.transform = 'scale(1.05)';
        });
        
        ballFallback.addEventListener('mouseleave', function() {
            this.style.boxShadow = `
                0 20px 40px rgba(0, 0, 0, 0.5),
                0 0 0 2px rgba(255, 255, 255, 0.3)
            `;
            this.style.transform = 'scale(1)';
        });
    }
});
