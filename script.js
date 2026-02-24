// Картинки для модальных окон (опционально).
window.FEATURE_IMAGES = {
	predictions: ['images/прогнозы.jpg'],
	statistics: ['images/статистика.jpg'],
	h2h: ['images/топ10.jpg'],
	bankroll: ['images/банкролл.jpg']
};

// I18n
const I18N_DICTIONARY = {
	ru: {
		title: 'Футбольные прогнозы 2.0',
		download_app: 'Скачать приложение',
		version_prefix: 'Версия',
		features: { predictions: 'Прогнозы', statistics: 'Статистика', h2h: 'Топ10', bankroll: 'Банкролл' },
		feature_desc: {
			predictions: 'Главный экран приложения. Здесь отображаются актуальные прогнозы на футбольные матчи: дата, время, лига, команды и рекомендуемый исход. Можно обновить список свайпом вниз. Часть прогнозов доступна бесплатно, полный доступ — по подписке.',
			statistics: 'Две вкладки:\n\n• Статистика 3-x (бесплатная) — результаты прогнозов за последний месяц, 3 месяца и за всё время: выигрыши, проигрыши, возвраты, процент побед.\n\n• Статистика $ (платная, появится при подключенной подписке) — расширенная статистика для подписчиков по платным прогнозам.',
			h2h: 'Специальные списки, составленные нашим алгоритмом: Тотал больше 2.5, Обе забьют, Победы, Тотал Угловых, Тотал Жёлтых карточек, Тотал Фолов. Помогают найти матчи на сегодня под конкретные события.',
			bankroll: 'Банкролл создан для учёта событий и контроля дохода и расхода (находится в профиле).\n\nСначала установите банк — введите сумму вашего банкролла (например, 10 000 ₽) и нажмите «Сохранить». Затем добавляйте событие: матч (например, Арсенал — Челси), прогноз (например, П1), сумму из банкролла на матч (например, 500 ₽) и коэффициент (например, 1,6). По окончании матча нажмите «Установить результат», выберите исход (выигрыш, проигрыш или возврат) и сохраните — программа рассчитает и сохранит ваш доход или расход, процент выигрыша, общую прибыль и ROI.\n\nROI (Return on Investment) — это доходность в процентах: сколько вы заработали или потеряли относительно всех поставленных денег. Например, ROI +15% значит, что на каждые 100 ₽ вы в среднем получили 15 ₽ прибыли.'
		},
		telegram_channel: 'Наш канал в Telegram',
		toast_preparing: 'Идет подготовка загрузки...',
		toast_start: 'Загрузка APK начнется сейчас...',
		toast_android_hint: 'Если установка не началась — откройте папку «Загрузки» и нажмите на файл APK.',
		modal_close: 'Закрыть',
		footer_app_name: 'Футбольные прогнозы 2.0',
		footer_rights: 'Все права защищены.',
		footer_disclaimer: 'Приложение носит информационный характер и не является призывом к участию в азартных играх.'
	},
	en: {
		title: 'Football Predictions 2.0',
		download_app: 'Download App',
		version_prefix: 'Version',
		features: { predictions: 'Predictions', statistics: 'Statistics', h2h: 'Top 10', bankroll: 'Bankroll' },
		feature_desc: {
			predictions: 'Main app screen. Displays current football match predictions: date, time, league, teams and recommended outcome. Pull down to refresh. Some predictions are free, full access — by subscription.',
			statistics: 'Two tabs:\n\n• Stats 3-x (free) — prediction results for the last month, 3 months and all time: wins, losses, returns, win rate.\n\n• Stats $ (paid, appears with subscription) — extended statistics for subscribers on paid predictions.',
			h2h: 'Special lists compiled by our algorithm: Total over 2.5, Both to Score, Wins, Total Corners, Total Yellow Cards, Total Fouls. Helps find today\'s matches for specific events.',
			bankroll: 'Bankroll is created to track your events and control profit and loss (located in your profile).\n\nFirst set your bank — enter your bankroll amount (for example, 10,000 RUB) and tap \"Save\". Then add an event: match (for example, Arsenal vs Chelsea), prediction (for example, Home Win), amount taken from the bankroll for this match (for example, 500 RUB) and odds (for example, 1.6). When the match ends, tap \"Set result\", choose the outcome (win, loss or push) and save — the app will calculate and store your profit or loss, win rate, total profit and ROI.\n\nROI (Return on Investment) is your profitability in percent: how much you have earned or lost relative to all money staked. For example, ROI +15% means that for every 100 RUB staked you gained 15 RUB profit on average.'
		},
		telegram_channel: 'Our Telegram channel',
		toast_preparing: 'Preparing download...',
		toast_start: 'APK download will start now...',
		toast_android_hint: 'If installation didn\'t start — open Downloads and tap the APK file.',
		modal_close: 'Close',
		footer_app_name: 'Football Predictions 2.0',
		footer_rights: 'All rights reserved.',
		footer_disclaimer: 'The app is for informational purposes only and is not an invitation to participate in gambling.'
	}
};

function getSavedLang() {
	return localStorage.getItem('lang') || 'ru';
}

function setLang(langCode) {
	const next = langCode === 'ru' || langCode === 'en' ? langCode : 'ru';
	localStorage.setItem('lang', next);
	applyTranslations(next);
	updateLangToggle(next);
	const html = document.documentElement;
	if (html) html.setAttribute('lang', next);
}

function updateLangToggle(langCode) {
	const btn = document.querySelector('.lang-toggle');
	if (!btn) return;
	btn.textContent = langCode === 'ru' ? 'EN' : 'RU';
	btn.setAttribute('aria-label', langCode === 'ru' ? 'Switch language to English' : 'Сменить язык на русский');
}

function applyTranslations(langCode) {
	const dict = I18N_DICTIONARY[langCode] || I18N_DICTIONARY.ru;
	// Simple keys
	document.querySelectorAll('[data-i18n]').forEach((el) => {
		const key = el.getAttribute('data-i18n');
		if (!key) return;
		const parts = key.split('.');
		let value = dict;
		for (const part of parts) {
			value = value && value[part];
		}
		if (typeof value === 'string') {
			el.textContent = value;
		}
	});
	// Version label: keep number separate
	const prefixEl = document.querySelector('.version-prefix');
	if (prefixEl) prefixEl.textContent = dict.version_prefix;
}

function initLang() {
	const saved = getSavedLang();
	applyTranslations(saved);
	updateLangToggle(saved);
	const btn = document.querySelector('.lang-toggle');
	if (btn && !btn.__bound) {
		btn.addEventListener('click', () => {
			const current = getSavedLang();
			setLang(current === 'ru' ? 'en' : 'ru');
		});
		btn.__bound = true;
	}
	// Ensure html lang attribute
	const html = document.documentElement;
	if (html) html.setAttribute('lang', saved);
}

// Функция для скачивания приложения
function downloadApp() {
	// Показываем уведомление о скачивании
	const dict = I18N_DICTIONARY[getSavedLang()] || I18N_DICTIONARY.ru;
	showDownloadNotification(dict.toast_preparing);

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
				triggerDirectDownload(getFallbackApkUrl());
			}
		})
		.catch(() => {
			triggerDirectDownload(getFallbackApkUrl());
		});
}

function getFallbackApkUrl() {
	var v = (window.__latestVersionTag || '').replace(/^v/i, '').trim();
	if (!v) {
		var el = document.querySelector('.version-number');
		v = (el && el.textContent) ? el.textContent.trim() : '2.0.2';
	}
	if (!v) v = '2.0.2';
	return 'https://github.com/footballpredictions/footballpredictions.github.io/releases/download/v' + v + '/FootballPredictions-release.apk';
}

function isAndroid() {
	return /Android/i.test(navigator.userAgent);
}

function triggerDirectDownload(url) {
	const dict = I18N_DICTIONARY[getSavedLang()] || I18N_DICTIONARY.ru;
	showDownloadNotification(dict.toast_start);
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn) {
		downloadBtn.style.transform = 'scale(0.95)';
		setTimeout(() => { downloadBtn.style.transform = ''; }, 150);
	}
	// Прямой переход на файл APK (как раньше — стабильно на старых версиях)
	window.location.href = url;
	// Подсказка для Android 15–16: если установка не открылась — открыть «Загрузки» и нажать на APK
	if (isAndroid()) {
		setTimeout(() => {
			showDownloadNotification(dict.toast_android_hint || dict.toast_start);
		}, 5000);
	}
}

// Получение последнего релиза и ссылки на APK
async function fetchLatestApkUrl() {
	try {
		// Добавляем timestamp для обхода кеша
		const cacheBuster = '?_=' + Date.now();
		const apiUrl = 'https://api.github.com/repos/footballpredictions/footballpredictions.github.io/releases/latest' + cacheBuster;
		console.log('Fetching latest release from:', apiUrl);
		
		const res = await fetch(apiUrl, {
			headers: { 
				'Accept': 'application/vnd.github+json'
			},
			cache: 'no-store'
		});
		
		if (!res.ok) {
			throw new Error(`Failed to fetch latest release: ${res.status} ${res.statusText}`);
		}
		
		const data = await res.json();
		console.log('Release data received:', { tag_name: data.tag_name, name: data.name, assets_count: data.assets ? data.assets.length : 0 });
		
		// Используем tag_name или name (заголовок релиза) для версии
		const version = data.tag_name || data.name || '';
		if (version) {
			window.__latestVersionTag = version;
			updateVersionLabel(version);
		} else {
			console.warn('No version found in release data');
		}
		
		// Ищем asset c расширением .apk
		const apkAsset = Array.isArray(data.assets) ? data.assets.find(a => typeof a.browser_download_url === 'string' && a.browser_download_url.toLowerCase().endsWith('.apk')) : null;
		if (apkAsset && apkAsset.browser_download_url) {
			window.__latestApkUrl = apkAsset.browser_download_url;
			console.log('APK URL found:', window.__latestApkUrl);
			return window.__latestApkUrl;
		} else {
			console.warn('APK asset not found in release');
		}
		
		return null;
	} catch (e) {
		console.error('Failed to fetch latest release:', e);
		return null;
	}
}

// Версия с того же сайта (нет CORS) — работает на старых устройствах. При релизе обновить только version.json.
async function fetchVersionFromSameOrigin() {
	try {
		var res = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
		if (!res.ok) return null;
		var data = await res.json();
		var version = (data && data.version) ? String(data.version).trim() : '';
		if (!version) return null;
		window.__latestVersionTag = version.indexOf('v') === 0 ? version : 'v' + version;
		updateVersionLabel(window.__latestVersionTag);
		window.__latestApkUrl = getFallbackApkUrl();
		return window.__latestApkUrl;
	} catch (e) {
		return null;
	}
}

function updateVersionLabel(version) {
	if (!version) {
		console.warn('updateVersionLabel: version is empty');
		return;
	}
	// Убираем префикс "v" если он есть (например, "v2.0.1" -> "2.0.1")
	const cleanVersion = version.replace(/^v/i, '').trim();
	if (!cleanVersion) {
		console.warn('updateVersionLabel: cleanVersion is empty after processing:', version);
		return;
	}
	
	const el = document.querySelector('.version-info');
	if (!el) {
		console.warn('updateVersionLabel: .version-info element not found');
		return;
	}
	
	const prefixEl = el.querySelector('.version-prefix');
	const numberEl = el.querySelector('.version-number');
	if (prefixEl && numberEl) {
		numberEl.textContent = cleanVersion;
		console.log('Version updated to:', cleanVersion);
	} else {
		el.textContent = cleanVersion;
		console.log('Version updated to (fallback):', cleanVersion);
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

// Модальные окна с описанием функций
function initFeatureModals() {
	const modal = document.getElementById('featureModal');
	if (!modal) return;
	// Держим модалку напрямую в body, чтобы fixed-позиционирование
	// не ломалось из-за transform у родительских контейнеров.
	if (modal.parentNode !== document.body) {
		document.body.appendChild(modal);
	}
	const titleEl = modal.querySelector('.feature-modal-title');
	const bodyEl = modal.querySelector('.feature-modal-body');
	const imagesEl = modal.querySelector('.feature-modal-images');
	const closeBtn = modal.querySelector('.feature-modal-close');
	const backdrop = modal.querySelector('.feature-modal-backdrop');

	function openModal(featureKey) {
		const lang = getSavedLang();
		const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.ru;
		const title = (dict.features && dict.features[featureKey]) ? dict.features[featureKey] : featureKey;
		const desc = (dict.feature_desc && dict.feature_desc[featureKey]) ? dict.feature_desc[featureKey] : '';
		if (titleEl) titleEl.textContent = title;
		if (bodyEl) {
			bodyEl.innerHTML = desc.split('\n').map(p => {
				const trimmed = p.trim();
				if (!trimmed) return '';
				if (trimmed.startsWith('•')) return `<p class="feature-modal-bullet">${trimmed}</p>`;
				return `<p>${trimmed}</p>`;
			}).filter(Boolean).join('');
		}
		if (imagesEl) {
			imagesEl.innerHTML = '';
			// Добавьте картинки: FEATURE_IMAGES[featureKey] = ['url1.jpg', 'url2.jpg']
			const imgs = window.FEATURE_IMAGES && window.FEATURE_IMAGES[featureKey];
			if (Array.isArray(imgs) && imgs.length) {
				imgs.forEach(src => {
					const img = document.createElement('img');
					img.src = src;
					img.alt = '';
					img.className = 'feature-modal-img';
					imagesEl.appendChild(img);
				});
			}
		}
		modal.removeAttribute('hidden');
		document.body.style.overflow = 'hidden';
		if (closeBtn) closeBtn.setAttribute('aria-label', dict.modal_close || 'Close');
	}

	function closeModal() {
		modal.setAttribute('hidden', '');
		document.body.style.overflow = '';
	}

	document.querySelectorAll('.feature-btn').forEach((btn) => {
		if (btn.__modalBound) return;
		btn.__modalBound = true;
		btn.addEventListener('click', () => {
			const key = btn.getAttribute('data-feature');
			if (key) openModal(key);
		});
	});

	if (closeBtn) closeBtn.addEventListener('click', closeModal);
	if (backdrop) backdrop.addEventListener('click', closeModal);

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) closeModal();
	});
}

// Дополнительные эффекты при загрузке страницы
// (Удалены летающие элементы)
function initPage() {
	// Приоритетно загружаем актуальную версию, чтобы сразу показать ее пользователю
	// Небольшая задержка для гарантии готовности DOM
	setTimeout(() => {
		console.log('Initializing page, fetching latest version...');
		fetchLatestApkUrl()
			.then(() => {
				console.log('Version fetch completed');
			})
			.catch((err) => {
				console.error('Version fetch failed:', err);
				// На старых устройствах API часто недоступен — берём версию с того же сайта (version.json, без CORS)
				fetchVersionFromSameOrigin().then(function (url) {
					if (url) console.log('Version from version.json:', window.__latestVersionTag);
				});
				// Повторная попытка API через 2 секунды
				setTimeout(() => {
					console.log('Retrying version fetch...');
					fetchLatestApkUrl().catch((retryErr) => {
						console.error('Retry failed:', retryErr);
						fetchVersionFromSameOrigin();
					});
				}, 2000);
			});
	}, 100);
	// Звуковой эффект остаётся опциональным
	addSoundEffects();
	// Init language
	initLang();
	// Модальные окна с описанием функций
	initFeatureModals();
	// Безопасная обработка ошибок загрузки изображения мяча (под CSP без inline)
	const ballImg = document.querySelector('.ball-image');
	if (ballImg && !ballImg.__bound) {
		ballImg.addEventListener('error', () => {
			ballImg.style.display = 'none';
			const fallback = ballImg.nextElementSibling;
			if (fallback) fallback.style.display = 'block';
		});
		ballImg.__bound = true;
	}

	// Назначаем обработчик кнопке скачивания вместо inline-обработчика
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn && !downloadBtn.__bound) {
		downloadBtn.addEventListener('click', downloadApp);
		downloadBtn.__bound = true;
	}

	// Год в футере
	var yearEl = document.querySelector('.footer-year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();
	// Лёгкая защита буфера обмена: предупреждаем при копировании/вставке ссылок
	setupClipboardGuards();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initPage);
} else {
	initPage();
}

// Звуковые эффекты (опционально)
function addSoundEffects() {
	// Создаем аудио контекст для звуковых эффектов
	let audioContext;
	let whistleAudio;
	let whistleStopTimer;
	let whistleFadeTimer;
	let whistleFadeInterval;
	function playWhistleSound() {
		if (!audioContext) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}
		const ctx = audioContext;
		const now = ctx.currentTime;

		function scheduleTweet(startFreq, endFreq, startTime, duration) {
			// Два осциллятора с небольшой детюновкой создают характерный свист
			const osc1 = ctx.createOscillator();
			const osc2 = ctx.createOscillator();
			osc1.type = 'triangle';
			osc2.type = 'triangle';
			osc1.frequency.setValueAtTime(startFreq, startTime);
			osc2.frequency.setValueAtTime(startFreq * 1.02, startTime);
			osc1.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
			osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.02, startTime + duration);

			// Лёгкий вибрато
			const lfo = ctx.createOscillator();
			lfo.type = 'sine';
			lfo.frequency.setValueAtTime(8, startTime);
			const lfoDepth1 = ctx.createGain();
			const lfoDepth2 = ctx.createGain();
			lfoDepth1.gain.setValueAtTime(60, startTime);
			lfoDepth2.gain.setValueAtTime(60, startTime);
			lfo.connect(lfoDepth1);
			lfo.connect(lfoDepth2);
			lfoDepth1.connect(osc1.frequency);
			lfoDepth2.connect(osc2.frequency);

			// Узкополосный фильтр, чтобы придать «свистковый» тембр
			const bandpass = ctx.createBiquadFilter();
			bandpass.type = 'bandpass';
			bandpass.Q.setValueAtTime(18, startTime);
			bandpass.frequency.setValueAtTime((startFreq + endFreq) / 2, startTime);

			// Огибающая громкости — резкая атака, короткий спад
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(0.0001, startTime);
			gain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

			osc1.connect(bandpass);
			osc2.connect(bandpass);
			bandpass.connect(gain);
			gain.connect(ctx.destination);

			osc1.start(startTime);
			osc2.start(startTime);
			lfo.start(startTime);
			osc1.stop(startTime + duration + 0.02);
			osc2.stop(startTime + duration + 0.02);
			lfo.stop(startTime + duration + 0.02);
		}

		// Три свистка: длинный — короткий — длинный
		const long1 = 0.28;
		const short = 0.14;
		const long2 = 0.32;
		const gap = 0.10;
		// Первый (длинный): небольшой подъём частоты
		scheduleTweet(3000, 3600, now, long1);
		// Второй (короткий): быстрый спад
		scheduleTweet(3400, 3000, now + long1 + gap, short);
		// Третий (длинный): подъём с чуть более высокой базой
		scheduleTweet(3200, 3800, now + long1 + gap + short + gap, long2);
	}
	// Попробуем загрузить внешний звук (локальный файл аплодисментов)
	try {
		whistleAudio = new Audio('sounds/applause_match.mp3');
		whistleAudio.preload = 'auto';
		whistleAudio.loop = false;
		whistleAudio.volume = 0.9;
		// В некоторых браузерах проигрывание разрешено только по юзер-жесту
		whistleAudio.addEventListener('error', () => {
			whistleAudio = null; // откат к синтезу
		});
	} catch (_) {
		whistleAudio = null;
	}

	function playWhistle() {
		if (whistleAudio) {
			try {
				// Проигрываем фрагмент аплодисментов 12 сек с плавным затуханием в конце
				const PLAY_MS = 9000;
				const FADE_MS = 2700; // длительность затухания
				const TARGET_VOLUME = 0.9;

				if (whistleStopTimer) clearTimeout(whistleStopTimer);
				if (whistleFadeTimer) clearTimeout(whistleFadeTimer);
				if (whistleFadeInterval) clearInterval(whistleFadeInterval);

				try { whistleAudio.pause(); } catch (_) {}
				try { whistleAudio.currentTime = 0; } catch (_) {}
				whistleAudio.volume = TARGET_VOLUME;
				const playPromise = whistleAudio.play();

				// Старт затухания за FADE_MS до конца
				whistleFadeTimer = setTimeout(() => {
					const start = Date.now();
					const startVolume = whistleAudio.volume;
					whistleFadeInterval = setInterval(() => {
						const elapsed = Date.now() - start;
						const t = Math.min(1, elapsed / FADE_MS);
						const nextVol = startVolume * (1 - t);
						whistleAudio.volume = Math.max(0, nextVol);
						if (t >= 1) {
							clearInterval(whistleFadeInterval);
							whistleFadeInterval = null;
						}
					}, 60);
				}, Math.max(0, PLAY_MS - FADE_MS));

				// Остановка и сброс после 12 сек
				whistleStopTimer = setTimeout(() => {
					try { whistleAudio.pause(); } catch (_) {}
					try { whistleAudio.currentTime = 0; } catch (_) {}
					whistleAudio.volume = TARGET_VOLUME;
					if (whistleFadeTimer) { clearTimeout(whistleFadeTimer); whistleFadeTimer = null; }
					if (whistleFadeInterval) { clearInterval(whistleFadeInterval); whistleFadeInterval = null; }
				}, PLAY_MS);
				if (playPromise && typeof playPromise.catch === 'function') {
					playPromise.catch(() => playWhistleSound());
				}
			} catch (_) {
				playWhistleSound();
			}
		} else {
			playWhistleSound();
		}
	}

	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn) downloadBtn.addEventListener('click', playWhistle);
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
	if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
		return;
	}
	const modal = document.getElementById('featureModal');
	if (modal && !modal.hasAttribute('hidden')) {
		return;
	}
	const scrolled = window.pageYOffset;
	const parallax = document.querySelector('.splash-screen');
	const speed = scrolled * 0.5;
	if (parallax) {
		parallax.style.transform = `translateY(${speed}px)`;
	}
});

// Минимальная защита от копирования/вставки ссылок и простого хотлинкинга
function setupClipboardGuards() {
	// Блокируем drag-n-drop внешних ресурсов внутрь страницы
	document.addEventListener('dragover', (e) => e.preventDefault());
	document.addEventListener('drop', (e) => e.preventDefault());

	// Предупреждение при копировании текста
	document.addEventListener('copy', (e) => {
		const selection = document.getSelection();
		if (selection && selection.toString().length > 0) {
			showTransientNotice('Копирование включено. Пожалуйста, указывайте источник.');
		}
	});

	// Предупреждение при вставке URL
	document.addEventListener('paste', (e) => {
		const text = (e.clipboardData || window.clipboardData).getData('text');
		if (/https?:\/\//i.test(text)) {
			showTransientNotice('Вставка ссылок ограничена политикой сайта.');
		}
	});
}

function showTransientNotice(message) {
	const notice = document.createElement('div');
	notice.textContent = message;
	notice.style.cssText = 'position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,.7); color: #fff; padding: 8px 12px; border-radius: 8px; z-index: 1100; font-size: 14px;';
	document.body.appendChild(notice);
	setTimeout(() => { notice.remove(); }, 2200);
}
