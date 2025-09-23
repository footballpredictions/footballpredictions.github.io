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
				triggerDirectDownload('https://github.com/footballpredictions/footballpredictions.github.io/releases/download/v2.0.2/FootballPredictions-release.apk');
			}
		})
		.catch(() => {
			triggerDirectDownload('https://github.com/footballpredictions/footballpredictions.github.io/releases/download/v2.0.2/FootballPredictions-release.apk');
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

// Дополнительные эффекты при загрузке страницы
// (Удалены летающие элементы)
document.addEventListener('DOMContentLoaded', function() {
	// Опционально подгрузим актуальную версию, чтобы сразу показать ее пользователю
	fetchLatestApkUrl();
	// Звуковой эффект остаётся опциональным
	addSoundEffects();
});

// Звуковые эффекты (опционально)
function addSoundEffects() {
	// Создаем аудио контекст для звуковых эффектов
	let audioContext;
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
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn) downloadBtn.addEventListener('click', playClickSound);
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

// Поддержка клавиатуры
document.addEventListener('keydown', function(e) {
	if (e.key === 'Enter' || e.key === ' ') {
		const downloadBtn = document.querySelector('.download-btn');
		if (document.activeElement === downloadBtn) {
			downloadApp();
		}
	}
});

// Параллакс заголовка при скролле
window.addEventListener('scroll', function() {
	const scrolled = window.pageYOffset;
	const parallax = document.querySelector('.splash-screen');
	const speed = scrolled * 0.5;
	if (parallax) {
		parallax.style.transform = `translateY(${speed}px)`;
	}
});
