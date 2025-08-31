// app.js — Indian Geography GK Quiz
// Each question is { q: "question", opts: ["A","B","C","D"], ans: correctIndex }

const QUESTIONS = [
  { q: "Which is the largest state in India by area?", opts: ["Uttar Pradesh", "Rajasthan", "Maharashtra", "Madhya Pradesh"], ans: 1 },
  { q: "Which is the smallest state of India by area?", opts: ["Goa", "Sikkim", "Tripura", "Nagaland"], ans: 0 },
  { q: "Which is the most populous state in India?", opts: ["Bihar", "Maharashtra", "Uttar Pradesh", "West Bengal"], ans: 2 },
  { q: "Which is the least populous state in India?", opts: ["Sikkim", "Goa", "Nagaland", "Mizoram"], ans: 0 },
  { q: "What is the capital city of India?", opts: ["Mumbai", "Kolkata", "New Delhi", "Chennai"], ans: 2 },

  { q: "Which river is the longest in India?", opts: ["Yamuna", "Godavari", "Indus", "Ganga"], ans: 3 },
  { q: "Which river is known as Dakshin Ganga?", opts: ["Narmada", "Krishna", "Godavari", "Kaveri"], ans: 2 },
  { q: "Which river is called the ‘Sorrow of Bihar’?", opts: ["Kosi", "Gandak", "Damodar", "Ghaghara"], ans: 0 },
  { q: "Where does the Ganga originate?", opts: ["Gangotri Glacier", "Gaumukh Glacier", "Siachen Glacier", "Pindari Glacier"], ans: 1 },
  { q: "Which river flows through Srinagar in Kashmir?", opts: ["Chenab", "Jhelum", "Ravi", "Beas"], ans: 1 },

  { q: "Which mountain is the highest peak in India?", opts: ["Nanda Devi", "Kangchenjunga", "Kamet", "Everest"], ans: 1 },
  { q: "Which is the oldest mountain range in India?", opts: ["Aravalli", "Himalayas", "Vindhya", "Satpura"], ans: 0 },
  { q: "Which pass connects Sikkim with Tibet?", opts: ["Rohtang Pass", "Nathu La", "Banihal Pass", "Shipki La"], ans: 1 },
  { q: "Which pass connects Manali to Leh?", opts: ["Zoji La", "Rohtang Pass", "Nathu La", "Baralacha La"], ans: 1 },
  { q: "Which state is known as the ‘Gateway to the North-East’?", opts: ["Assam", "Sikkim", "Nagaland", "Tripura"], ans: 0 },

  { q: "Which plateau is rich in minerals in eastern India?", opts: ["Malwa Plateau", "Deccan Plateau", "Chota Nagpur Plateau", "Shillong Plateau"], ans: 2 },
  { q: "Which desert lies in western Rajasthan?", opts: ["Thar Desert", "Kalahari", "Gobi", "Sahara"], ans: 0 },
  { q: "Which island group lies in the Arabian Sea?", opts: ["Andaman", "Nicobar", "Lakshadweep", "Minicoy"], ans: 2 },
  { q: "Which island group lies in the Bay of Bengal?", opts: ["Andaman & Nicobar", "Lakshadweep", "Minicoy", "Sri Lanka"], ans: 0 },
  { q: "Which state has the longest coastline?", opts: ["Andhra Pradesh", "Maharashtra", "Gujarat", "Odisha"], ans: 2 },

  { q: "Which is the largest delta in India?", opts: ["Godavari Delta", "Krishna Delta", "Sundarbans", "Mahanadi Delta"], ans: 2 },
  { q: "Which is the largest saltwater lagoon in India?", opts: ["Wular Lake", "Chilika Lake", "Loktak Lake", "Pulicat Lake"], ans: 1 },
  { q: "Which is the largest freshwater lake in India?", opts: ["Wular Lake", "Loktak Lake", "Dal Lake", "Chilika Lake"], ans: 0 },
  { q: "Loktak Lake is famous for what unique feature?", opts: ["Floating Islands (Phumdis)", "Saltwater Crops", "Migratory Birds", "Coral Reefs"], ans: 0 },
  { q: "Dal Lake is located in which city?", opts: ["Leh", "Srinagar", "Shimla", "Manali"], ans: 1 },

  // … (Continue adding until you reach 100 — mix rivers, mountains, states, capitals, forests, coasts, climate)
];

// --- App logic (don’t edit) ---
const el = id => document.getElementById(id);
const startScreen = el('start-screen');
const quizScreen = el('quiz-screen');
const resultScreen = el('result-screen');
const startBtn = el('startBtn');
const numQuestionsSel = el('numQuestions');
const shuffleQCheck = el('shuffleQ');
const qIndexEl = el('qIndex');
const qTextEl = el('questionText');
const choicesEl = el('choices');
const prevBtn = el('prevBtn');
const nextBtn = el('nextBtn');
const submitBtn = el('submitBtn');
const progressFill = el('progressFill');
const resultText = el('resultText');
const breakdown = el('breakdown');
const retryBtn = el('retryBtn');
const shareLink = el('shareLink');

let pool = [];
let current = 0;
let answers = [];

function shuffleArray(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}}

function startQuiz(){
  const total = parseInt(numQuestionsSel.value,10);
  pool = QUESTIONS.slice();
  if (shuffleQCheck.checked) shuffleArray(pool);
  pool = pool.slice(0,total);
  answers = new Array(pool.length).fill(null);
  current=0;
  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  renderQuestion();
  updateProgress();
}

function renderQuestion(){
  const item = pool[current];
  qIndexEl.textContent=`Question ${current+1} / ${pool.length}`;
  qTextEl.textContent=item.q;
  choicesEl.innerHTML='';
  item.opts.forEach((opt,idx)=>{
    const btn=document.createElement('button');
    btn.className='choice';btn.innerText=opt;btn.dataset.idx=idx;
    if(answers[current]===idx) btn.classList.add('selected');
    btn.addEventListener('click',()=>{
      answers[current]=idx;
      Array.from(choicesEl.children).forEach(c=>c.classList.remove('selected'));
      btn.classList.add('selected');
    });
    choicesEl.appendChild(btn);
  });
  prevBtn.disabled=current===0;
  nextBtn.disabled=current===pool.length-1;
  updateProgress();
}

function updateProgress(){progressFill.style.width=`${Math.round((current)/pool.length*100)}%`; }
prevBtn.addEventListener('click',()=>{if(current>0){current--;renderQuestion();}});
nextBtn.addEventListener('click',()=>{if(current<pool.length-1){current++;renderQuestion();}});
submitBtn.addEventListener('click',()=>{if(confirm('Submit quiz?')) gradeQuiz();});

function gradeQuiz(){
  let score=0;const details=[];
  pool.forEach((item,i)=>{const chosen=answers[i];const correct=item.ans;const ok=chosen===correct;if(ok)score++;
    details.push({q:item.q,chosen,correct,opts:item.opts});});
  showResults(score,pool.length,details);
}

function showResults(score,total,details){
  quizScreen.classList.add('hidden');resultScreen.classList.remove('hidden');
  resultText.innerHTML=`<strong>${score}/${total}</strong> correct (${Math.round(score/total*100)}%)`;
  breakdown.innerHTML='';
  details.forEach((d,i)=>{const row=document.createElement('div');
    const chosenText=d.chosen===null?'Not answered':d.opts[d.chosen];
    const correctText=d.opts[d.correct];
    row.innerHTML=`<div><b>${i+1}. ${d.q}</b><br>Your answer: ${chosenText}<br>Correct: ${correctText}</div>`;
    breakdown.appendChild(row);});
  shareLink.href=`https://twitter.com/intent/tweet?text=I scored ${score}/${total} on Indian Geography Quiz! ${location.href}`;
}

retryBtn.addEventListener('click',()=>{resultScreen.classList.add('hidden');startScreen.classList.remove('hidden');});
startBtn.addEventListener('click',startQuiz);
