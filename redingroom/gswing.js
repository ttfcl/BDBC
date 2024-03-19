<<<<<<< HEAD
let id = document.querySelector("#id")
let pw = document.querySelector("#pw")
let loginButton = document.querySelector("#loginButton")
let soundButton = document.querySelector("#soundButton")
let a = document.querySelector("#programBox")

let loginControll = 0
let questionList = []
let count = 0
let timeNow = ''
let remember = []
let newEvent = 0




var firebaseConfig = {
  apiKey: "AIzaSyBBL17DI2L2Jlq7oUqzTbpywI6aBQbUWMM",
  authDomain: "bdbc-g2.firebaseapp.com",
  projectId: "bdbc-g2",
  storageBucket: "bdbc-g2.appspot.com",
  messagingSenderId: "1049038233635",
  appId: "1:1049038233635:web:9810c2dc7896b1f1909196"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  firebase.auth().signOut()
  localStorage.removeItem("master")

loginButton.onclick = () => {
  if(loginControll === 0) {
    if(id.value !== '') {
      if(pw.value !== '') {
        firebase.auth().signInWithEmailAndPassword(id.value, pw.value).then((result)=> {
          loginControll++
          loginButton.textContent = '프로그램이 정상적으로 준비중입니다.'
          alert("로그인 성공했습니다. 성투를 진심으로 기원합니다.")
          run()
        }).catch((result) => {
          alert("아이디 또는 패스워드가 일치하지 않습니다.")
        })
      }else {
        alert("비밀번호칸이 비어있습니다.")
      }
    } else {
      alert("아이디칸이 비어있습니다.")
    }
  }
}


let time = () => {
  let year = String(new Date().getFullYear())
  let month = String(new Date().getMonth() + 1)
  let data = String(new Date().getDate())
  let hours = String(new Date().getHours())
  let minutes = String(new Date().getMinutes())
  let seconds = String(new Date().getSeconds())
  timeNow = year + '-' + month + '-' + data + ' ' + hours + ':' + minutes + ':' + seconds
  loginButton.textContent = '최근 갱신 시간 ' + timeNow
}
let tiem2 = () => {
  let timeKey = new Date().getHours()
  
}


let run = () => {
  if((7 < new Date().getHours()) && (new Date().getHours() < 24) && (new Date().getDay() !== 0) && (new Date().getDate() !== 8)) {
    if(localStorage.getItem('master') === '7475') {
      localStorage.removeItem("master")
      let contentBox = document.createElement('div')
      contentBox.className = "contentBox"
      for(let i = 0 ; i < questionList.length ; i++) {
        //div로 만들기
        let box1 = questionList[i].key.split('&A&')
        let content = document.createElement('div')
        content.className = "content"
        let test0 = document.createElement('div')
        let test1 = document.createElement('div')
        let test2 = document.createElement('div')
        let test3 = document.createElement('div')
        let test4 = document.createElement('div')
        let test5 = document.createElement('div')
        let test6 = document.createElement('div')
        test0.textContent = '종목명 : ' + box1[0]
        test1.textContent = '종목코드 : ' + box1[1]
        test2.textContent = '매수추천가 : ' + box1[2]
        test3.textContent = '매수근거 : ' + box1[3]
        test4.textContent = '목표가 : ' + box1[4]
        test5.textContent = '손절가 : ' + box1[5]
        test6.textContent = '추천가 : ' + box1[6]
        content.append(test0, test1, test2, test3, test4, test5, test6)
        contentBox.append(content)
        console.log('1')
      }
      a.append(contentBox)
      localStorage.setItem('master', '7475')
  
      if(count === 1) {
        db.collection('product').get().then((결과)=>{
          결과.forEach((doc)=>{
            questionList.unshift(doc.data())
          })
          console.log("최초로딩")
          count = 0
          time()
          document.querySelector(".contentBox").remove()
          run()
          questionList = []
        })
      } else {
        setTimeout(function() {
          db.collection('product').get().then((결과)=>{
            결과.forEach((doc)=>{
              questionList.unshift(doc.data())
           })
          }).then(() => {
              console.log(questionList)
              console.log(remember)
              console.log(questionList !== remember)
              console.log(questionList === remember)
              if(questionList.length !== remember.length) {
                newEvent = 1
                console.log('객체 길이가 다름')
                remember = []
                remember = questionList
                var audio = new Audio("coin.mp3");
                audio.load();
                audio.volume = 1;
                audio.play();
              }else {
                for(let i = 0 ; i < remember.length ; i++) {
                  if(remember[i].key !== questionList[i].key) {
                    newEvent = 1
                    console.log('배열값이 다름')
                    remember = []
                    remember = questionList
                    var audio = new Audio("coin.mp3");
                    audio.load();
                    audio.volume = 1;
                    audio.play();
                  } 
                }
              }          
              time()
              document.querySelector(".contentBox").remove()
              setTimeout(function() {
                run()
                questionList = []
              }, 1000)
            })
        }, 6000)
      }
  
    } else {
      setTimeout(function() {
        localStorage.setItem('master', '7475')
        count = 1
        document.querySelector(".contentBox").remove()
        run()
      }, 6000)
    }
  }else {
    let day = ''
    if(new Date().getDay() === 0) {
      day = '일'
    }
    if(new Date().getDay() === 1) {
      day = '월'
    }
    if(new Date().getDay() === 2) {
      day = '화'
    }
    if(new Date().getDay() === 3) {
      day = '수'
    }
    if(new Date().getDay() === 4) {
      day = '목'
    }
    if(new Date().getDay() === 5) {
      day = '금'
    }
    if(new Date().getDay() === 6) {
      day = '토'
    }
    day = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ` + day + ` ${new Date().getHours()}:${new Date().getMinutes()}`  
    alert(`프로그램은 월~금 8시~16시에 작동합니다. 현재시각 ${day}`)
    loginButton.textContent = '프로그램은 08시~16시에 작동합니다.'
  }
}

soundButton.onclick = () => {
  var audio = new Audio("coin.mp3");
  audio.load();
  audio.volume = 1;
  audio.play();
}
=======
let id = document.querySelector("#id")
let pw = document.querySelector("#pw")
let loginButton = document.querySelector("#loginButton")
let soundButton = document.querySelector("#soundButton")
let a = document.querySelector("#programBox")

let loginControll = 0
let questionList = []
let count = 0
let timeNow = ''
let remember = []
let newEvent = 0




var firebaseConfig = {
  apiKey: "AIzaSyBBL17DI2L2Jlq7oUqzTbpywI6aBQbUWMM",
  authDomain: "bdbc-g2.firebaseapp.com",
  projectId: "bdbc-g2",
  storageBucket: "bdbc-g2.appspot.com",
  messagingSenderId: "1049038233635",
  appId: "1:1049038233635:web:9810c2dc7896b1f1909196"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  firebase.auth().signOut()
  localStorage.removeItem("master")

loginButton.onclick = () => {
  if(loginControll === 0) {
    if(id.value !== '') {
      if(pw.value !== '') {
        firebase.auth().signInWithEmailAndPassword(id.value, pw.value).then((result)=> {
          loginControll++
          loginButton.textContent = '프로그램이 정상적으로 준비중입니다.'
          alert("로그인 성공했습니다. 성투를 진심으로 기원합니다.")
          run()
        }).catch((result) => {
          alert("아이디 또는 패스워드가 일치하지 않습니다.")
        })
      }else {
        alert("비밀번호칸이 비어있습니다.")
      }
    } else {
      alert("아이디칸이 비어있습니다.")
    }
  }
}


let time = () => {
  let year = String(new Date().getFullYear())
  let month = String(new Date().getMonth() + 1)
  let data = String(new Date().getDate())
  let hours = String(new Date().getHours())
  let minutes = String(new Date().getMinutes())
  let seconds = String(new Date().getSeconds())
  timeNow = year + '-' + month + '-' + data + ' ' + hours + ':' + minutes + ':' + seconds
  loginButton.textContent = '최근 갱신 시간 ' + timeNow
}
let tiem2 = () => {
  let timeKey = new Date().getHours()
  
}


let run = () => {
  if((7 < new Date().getHours()) && (new Date().getHours() < 24) && (new Date().getDay() !== 0) && (new Date().getDate() !== 8)) {
    if(localStorage.getItem('master') === '7475') {
      localStorage.removeItem("master")
      let contentBox = document.createElement('div')
      contentBox.className = "contentBox"
      for(let i = 0 ; i < questionList.length ; i++) {
        //div로 만들기
        let box1 = questionList[i].key.split('&A&')
        let content = document.createElement('div')
        content.className = "content"
        let test0 = document.createElement('div')
        let test1 = document.createElement('div')
        let test2 = document.createElement('div')
        let test3 = document.createElement('div')
        let test4 = document.createElement('div')
        let test5 = document.createElement('div')
        let test6 = document.createElement('div')
        test0.textContent = '종목명 : ' + box1[0]
        test1.textContent = '종목코드 : ' + box1[1]
        test2.textContent = '매수추천가 : ' + box1[2]
        test3.textContent = '매수근거 : ' + box1[3]
        test4.textContent = '목표가 : ' + box1[4]
        test5.textContent = '손절가 : ' + box1[5]
        test6.textContent = '추천가 : ' + box1[6]
        content.append(test0, test1, test2, test3, test4, test5, test6)
        contentBox.append(content)
        console.log('1')
      }
      a.append(contentBox)
      localStorage.setItem('master', '7475')
  
      if(count === 1) {
        db.collection('product').get().then((결과)=>{
          결과.forEach((doc)=>{
            questionList.unshift(doc.data())
          })
          console.log("최초로딩")
          count = 0
          time()
          document.querySelector(".contentBox").remove()
          run()
          questionList = []
        })
      } else {
        setTimeout(function() {
          db.collection('product').get().then((결과)=>{
            결과.forEach((doc)=>{
              questionList.unshift(doc.data())
           })
          }).then(() => {
              console.log(questionList)
              console.log(remember)
              console.log(questionList !== remember)
              console.log(questionList === remember)
              if(questionList.length !== remember.length) {
                newEvent = 1
                console.log('객체 길이가 다름')
                remember = []
                remember = questionList
                var audio = new Audio("coin.mp3");
                audio.load();
                audio.volume = 1;
                audio.play();
              }else {
                for(let i = 0 ; i < remember.length ; i++) {
                  if(remember[i].key !== questionList[i].key) {
                    newEvent = 1
                    console.log('배열값이 다름')
                    remember = []
                    remember = questionList
                    var audio = new Audio("coin.mp3");
                    audio.load();
                    audio.volume = 1;
                    audio.play();
                  } 
                }
              }          
              time()
              document.querySelector(".contentBox").remove()
              setTimeout(function() {
                run()
                questionList = []
              }, 1000)
            })
        }, 6000)
      }
  
    } else {
      setTimeout(function() {
        localStorage.setItem('master', '7475')
        count = 1
        document.querySelector(".contentBox").remove()
        run()
      }, 6000)
    }
  }else {
    let day = ''
    if(new Date().getDay() === 0) {
      day = '일'
    }
    if(new Date().getDay() === 1) {
      day = '월'
    }
    if(new Date().getDay() === 2) {
      day = '화'
    }
    if(new Date().getDay() === 3) {
      day = '수'
    }
    if(new Date().getDay() === 4) {
      day = '목'
    }
    if(new Date().getDay() === 5) {
      day = '금'
    }
    if(new Date().getDay() === 6) {
      day = '토'
    }
    day = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ` + day + ` ${new Date().getHours()}:${new Date().getMinutes()}`  
    alert(`프로그램은 월~금 8시~16시에 작동합니다. 현재시각 ${day}`)
    loginButton.textContent = '프로그램은 08시~16시에 작동합니다.'
  }
}

soundButton.onclick = () => {
  var audio = new Audio("coin.mp3");
  audio.load();
  audio.volume = 1;
  audio.play();
}
>>>>>>> 132d28ac032717172b745c0cb373d27647133783
