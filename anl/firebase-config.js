// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGyy1Rk9c6SHztXgneTQeTC-mNT_pVvPA",
  authDomain: "stock-analyzer-pro-c7567.firebaseapp.com",
  projectId: "stock-analyzer-pro-c7567",
  storageBucket: "stock-analyzer-pro-c7567.firebasestorage.app",
  messagingSenderId: "741230425678",
  appId: "1:741230425678:web:903aca40539652150d751f",
  measurementId: "G-NLYN0Y10JR"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. 전역 변수 설정
// var를 사용해야 sidepanel.js에서 이 변수를 인식할 수 있습니다.
var functions = firebase.functions();

// [참고] 만약 서버 배포를 서울(asia-northeast3)로 하셨다면 아래 줄 주석을 푸세요.
// var functions = firebase.app().functions('asia-northeast3');

console.log("Firebase 초기화 완료 및 functions 객체 생성 성공");