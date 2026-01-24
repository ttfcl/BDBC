// main.js - 웹사이트용 전체 통합 코드
let functionsInstance;
let auth;
let googleProvider;
let loadingTimerDone = false;
let analysisResultReady = false;
let tickerSet = new Set();
let tickerArray = [];

// [필독] 본인의 Firebase Config 정보를 여기에 입력하세요


// Firebase 초기화
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    functionsInstance = firebase.app().functions('us-central1'); 
    auth = firebase.auth();
    googleProvider = new firebase.auth.GoogleAuthProvider();
} catch (error) {
    console.error("Firebase 초기화 실패:", error);
}

document.addEventListener('DOMContentLoaded', () => {
    // UI 요소 매핑
    const themeToggle = document.getElementById('themeToggle');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const tickerInput = document.getElementById('tickerInput');
    const htmlElement = document.documentElement;
    const autocompleteArea = document.getElementById('autocompleteArea');
    const autocompleteList = document.getElementById('autocompleteList');
    const recentList = document.getElementById('recentList');
    const loginBtn = document.getElementById('googleLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    // 1. [변경] 테마 설정 (localStorage 활용)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.className = savedTheme + '-mode';
    if (themeToggle) themeToggle.innerText = savedTheme === 'dark' ? "🌙 Dark" : "☀️ Light";

    if (themeToggle) {
        themeToggle.onclick = () => {
            const isDark = htmlElement.classList.contains('dark-mode');
            const newTheme = isDark ? 'light' : 'dark';
            htmlElement.className = newTheme + '-mode';
            localStorage.setItem('theme', newTheme);
            themeToggle.innerText = newTheme === 'dark' ? "🌙 Dark" : "☀️ Light";
        };
    }

    // 2. [변경] 티커 데이터 로드 (Web fetch 방식)
    async function loadTickerData() {
        try {
            const response = await fetch('./nasdaq_list.json');
            tickerArray = await response.json();
            tickerSet = new Set(tickerArray.map(item => item.symbol));
            console.log("티커 데이터 로드 완료:", tickerSet.size);
        } catch (err) {
            console.error("티커 리스트 로드 실패:", err);
        }
    }
    loadTickerData();

    // 3. [변경] 최근 검색어 관리 (localStorage 활용)
    function getRecentTickers() {
        const saved = localStorage.getItem('recentTickers');
        return saved ? JSON.parse(saved) : [];
    }

    function saveRecentTicker(ticker) {
        let history = getRecentTickers();
        history = [ticker, ...history.filter(t => t !== ticker)].slice(0, 10);
        localStorage.setItem('recentTickers', JSON.stringify(history));
        updateRecentUI(history);
    }

    function updateRecentUI(tickers) {
        if (!recentList) return;
        recentList.innerHTML = '';
        tickers.forEach(item => {
            const badge = document.createElement('span');
            badge.className = 'suggest-badge';
            badge.innerText = item;
            badge.onclick = () => {
                tickerInput.value = item;
                analyzeBtn.click();
            };
            recentList.appendChild(badge);
        });
    }
    // 초기 로드 시 UI 업데이트
    updateRecentUI(getRecentTickers());

    // 4. 인증 로직 (Web Popup 방식)
    if (loginBtn) {
        loginBtn.onclick = () => {
            auth.signInWithPopup(googleProvider).catch(console.error);
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            auth.signOut().then(() => {
                localStorage.removeItem('userUsage'); // 세션 데이터 삭제
                location.reload();
            });
        };
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            loginBtn?.classList.add('hidden');
            userProfile?.classList.remove('hidden');
            if (userAvatar) userAvatar.src = user.photoURL;
            if (userName) userName.innerText = user.displayName;
            fetchUserUsage(user.uid);
        } else {
            loginBtn?.classList.remove('hidden');
            userProfile?.classList.add('hidden');
        }
    });

    // 5. 분석 실행 및 UI 제어
    async function startAnalysis() {
        const ticker = tickerInput.value.toUpperCase().trim();
        if (!ticker || !tickerSet.has(ticker)) {
            alert("유효한 티커를 입력해주세요.");
            return;
        }

        saveRecentTicker(ticker);
        setLoadingState(true);
        startLoadingUI(20000); // 20초 타이머

        try {
            const callAnalyzeStock = functionsInstance.httpsCallable('analyzeStock');
            const result = await callAnalyzeStock({ ticker });
            renderResult(result.data.analysis);
            analysisResultReady = true;
            checkAnalysisDone();
        } catch (error) {
            console.error("분석 에러:", error);
            alert("분석 중 오류가 발생했습니다.");
            setLoadingState(false);
        }
    }

    if (analyzeBtn) analyzeBtn.onclick = startAnalysis;

    function setLoadingState(loading) {
        analyzeBtn.disabled = loading;
        analyzeBtn.innerText = loading ? "..." : "Run Analysis";
        document.getElementById('loadingArea')?.classList.toggle('hidden', !loading);
        document.querySelector('.search-container')?.classList.toggle('hidden', loading);
    }

    function startLoadingUI(ms) {
        loadingTimerDone = false;
        analysisResultReady = false;
        setTimeout(() => {
            loadingTimerDone = true;
            checkAnalysisDone();
        }, ms);
    }

    function checkAnalysisDone() {
        if (loadingTimerDone && analysisResultReady) {
            document.getElementById('loadingArea')?.classList.add('hidden');
            document.getElementById('resultArea')?.classList.remove('hidden');
        }
    }

    function renderResult(content) {
        const resultDiv = document.getElementById('analysisContent');
        if (resultDiv) resultDiv.innerHTML = content; // 필요 시 마크다운 파싱 라이브러리 추가
    }

    // 6. 자동완성 로직 (기존 로직 유지)
    tickerInput.oninput = () => {
        const val = tickerInput.value.toUpperCase();
        autocompleteList.innerHTML = '';
        if (!val) {
            autocompleteArea.classList.add('hidden');
            return;
        }
        const matches = tickerArray
            .filter(item => item.symbol.startsWith(val))
            .slice(0, 5);
        
        if (matches.length > 0) {
            autocompleteArea.classList.remove('hidden');
            matches.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.symbol}</strong> - ${item.name}`;
                li.onclick = () => {
                    tickerInput.value = item.symbol;
                    autocompleteArea.classList.add('hidden');
                    analyzeBtn.click();
                };
                autocompleteList.appendChild(li);
            });
        } else {
            autocompleteArea.classList.add('hidden');
        }
    };
});

// 사용량 정보 가져오기 (Firebase Functions 호출)
async function fetchUserUsage(uid) {
    try {
        const getUserUsage = functionsInstance.httpsCallable('getUserUsage');
        const result = await getUserUsage();
        updatePremiumBanner(result.data);
    } catch (err) {
        console.error("사용량 로드 실패:", err);
    }
}

function updatePremiumBanner(usage) {
    const banner = document.getElementById('premiumBanner');
    const userTier = document.getElementById('userTier');
    if (!banner) return;

    if (usage.isPremium) {
        banner.classList.add('hidden');
        if (userTier) userTier.innerText = "Premium Member";
    } else {
        banner.classList.remove('hidden');
        if (userTier) userTier.innerText = `Free Member (${usage.count}/3)`;
    }
}