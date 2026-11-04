const K="stapvoorstap.v1";
let S={habit:"",adult:true,age:"",health:[],reason:"",moment:"",imp:5,conf:5,days:[],pros:"",cons:"",plan:""};
const HEALTH=["Hartproblemen","Leverproblemen","Diabetes","Epilepsie","Psychische klachten","Zwanger of borstvoeding","Ik neem medicijnen","Geen"];
let view="intro",timer=null;
try{const r=localStorage.getItem(K);if(r){S=Object.assign(S,JSON.parse(r));view="home"}}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const medical=()=>/alcohol|drink|bier|wijn|slaapmid|kalmeer|opi|heroïne|medicijn/i.test(S.habit);
const sexual=()=>/mastur|porno|seks/i.test(S.habit);
const $=id=>document.getElementById(id);
const go=v=>{clearInterval(timer);view=v;render()};

const plans={
 "Stress":"Als ik gestrest ben, dan ga ik eerst vijf minuten naar buiten voordat ik iets beslis.",
 "Avond":"Als het avond is en de drang komt, dan zet ik thee en bel of stuur ik iemand een bericht.",
 "Gezelschap":"Als ik met anderen ben, dan zeg ik van tevoren wat ik niet doe en kies ik zelf mijn plek.",
 "Verveling":"Als ik me verveel, dan doe ik tien minuten iets met mijn handen (wandelen, opruimen, tekenen).",
 "Na het eten":"Als ik klaar ben met eten, dan sta ik meteen op en doe ik de afwas of loop ik een rondje."
};
const moments=Object.keys(plans);

function render(){
 const a=$("app");
 if(view==="intro")return intro(a);
 if(view==="minor")return minor(a);
 a.innerHTML=({home,weger,hulp}[view])();
 a.insertAdjacentHTML("beforeend",nav());
 if(view==="weger")bindWeger();
 if(view==="home")bindHome();
 window.scrollTo(0,0);
}
const nav=()=>`<nav>${[["home","Vandaag"],["weger","Weger"],["hulp","Hulp"]].map(([v,t])=>`<button class="${view===v?"on":""}" onclick="go('${v}')">${t}</button>`).join("")}</nav>`;

function intro(a){
 a.innerHTML=`<h1>Stap voor stap</h1>
 <p class="mut">Jij kiest wat je wilt veranderen. Een gewoonte is niet goed of slecht, alleen iets wat jij anders wilt. Alles blijft op je eigen toestel.</p>
 <label for="h">Wat wil je veranderen?</label>
 <input id="h" type="text" placeholder="bijv. roken, wijn, gamen, suiker" value="${esc(S.habit)}">
 <label for="age">Hoe oud ben je?</label>
 <input id="age" type="number" inputmode="numeric" min="10" max="110" placeholder="bijv. 34" value="${esc(S.age)}">
 <label>Heb je gezondheidsproblemen? <span class="mut">(meerdere mag)</span></label>
 <div class="chips">${HEALTH.map(x=>`<button class="chip ${(S.health||[]).includes(x)?"on":""}" data-hl="${x}">${x}</button>`).join("")}</div>
 <p class="mut">Dit gebruik ik alleen om je advies veiliger te maken. Het blijft op je toestel.</p>
 <label for="r">Waarom wil je dit, vandaag?</label>
 <textarea id="r" placeholder="In je eigen woorden. Dit krijg je later terug te zien.">${esc(S.reason)}</textarea>
 <label>Wanneer is het het moeilijkst?</label>
 <div class="chips">${moments.map(m=>`<button class="chip ${S.moment===m?"on":""}" data-m="${m}">${m}</button>`).join("")}</div>
 <label for="i">Hoe belangrijk is het voor je? <b id="iv">${S.imp}</b>/10</label>
 <input id="i" type="range" min="0" max="10" value="${S.imp}">
 <label for="c">Hoe zeker ben je dat het kan lukken? <b id="cv">${S.conf}</b>/10</label>
 <input id="c" type="range" min="0" max="10" value="${S.conf}">
 <button class="p w" id="start">Beginnen</button>`;
 a.querySelectorAll("[data-hl]").forEach(b=>b.onclick=()=>{
  const v=b.dataset.hl;let h=S.health||[];
  h=v==="Geen"?(h.includes("Geen")?[]:["Geen"]):(h.includes(v)?h.filter(x=>x!==v):h.filter(x=>x!=="Geen").concat(v));
  S.health=h;a.querySelectorAll("[data-hl]").forEach(x=>x.classList.toggle("on",h.includes(x.dataset.hl)));
 });
 a.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{S.moment=b.dataset.m;a.querySelectorAll("[data-m]").forEach(x=>x.classList.toggle("on",x===b))});
 $("i").oninput=e=>{S.imp=+e.target.value;$("iv").textContent=S.imp};
 $("c").oninput=e=>{S.conf=+e.target.value;$("cv").textContent=S.conf};
 $("start").onclick=()=>{
  S.habit=$("h").value.trim();S.reason=$("r").value.trim();
  const ag=parseInt($("age").value,10);
  if(!S.habit){$("h").focus();return}
  if(!(ag>=10&&ag<=110)){$("age").focus();return}
  S.age=ag;S.adult=ag>=18;
  if(!S.adult&&sexual())return go("minor");
  if(!S.plan&&S.moment)S.plan=plans[S.moment];
  save();go("home");
 };
}

function minor(a){
 a.innerHTML=`<h1>Dit is heel normaal</h1>
 <p>Seksualiteit ontdekken hoort bij opgroeien en is niet schadelijk. Je hoeft je er niet voor te schamen, en een teller of stopdoel helpt hier meestal niet.</p>
 <div class="note">Als het je slaap, school of stemming in de weg zit, of als je je er slecht over voelt, praat er dan met iemand over. Dat mag anoniem.</div>
 <p><b>Awel</b>: bel gratis <b>102</b> of chat via <a href="https://www.awel.be" target="_blank" rel="noopener">awel.be</a>. Je kunt ook terecht bij je huisarts of een vertrouwenspersoon op school.</p>
 <button class="w" onclick="S.habit='';go('intro')">Terug</button>`;
}

function healthNotes(){
 const age=+S.age,h=(S.health||[]).filter(x=>x!=="Geen"),n=[];
 if(medical()){
  n.push("<b>Eerst dit:</b> gebruik je dit dagelijks en veel? Stop dan niet plots, maar overleg eerst met je huisarts. Bij sommige middelen kan abrupt stoppen gevaarlijk zijn.");
  if(age>=60||h.length)n.push("Praat met je huisarts <b>voordat</b> je begint. Met jouw leeftijd of gezondheid weegt een abrupte stop zwaarder.");
  if(h.includes("Epilepsie"))n.push("Bij epilepsie kan abrupt stoppen met alcohol of kalmeermiddelen aanvallen uitlokken.");
 }
 if(h.includes("Zwanger of borstvoeding"))n.push("Zwanger of borstvoeding: stoppen is goed, maar laat je begeleiden door je huisarts of vroedvrouw.");
 if(h.includes("Ik neem medicijnen"))n.push("Stoppen kan de werking van sommige medicijnen veranderen. Laat het je arts of apotheker weten.");
 if(age>0&&age<18)n.push("Praat hierover ook met een volwassene die je vertrouwt, of bel Awel op <b>102</b>.");
 return n.map(t=>`<div class="note">${t}</div>`).join("");
}
function stats(){
 const n=S.days.length,t=today();
 return {n,done:S.days.includes(t)};
}

function home(){
 const {n,done}=stats(),h=esc(S.habit);
 return `<h1>${h}: stap voor stap</h1>
 ${healthNotes()}
 <div class="card"><div class="big">${n}</div><p>goede ${n===1?"dag":"dagen"} in totaal. Een terugval haalt hier niets vanaf.</p>
 <button class="${done?"":"p"} w" id="ok" ${done?"disabled":""}>${done?"Vandaag staat erin ✓":"Vandaag is gelukt"}</button></div>
 ${S.reason?`<div class="card"><b>Jouw reden</b><p>${esc(S.reason)}</p></div>`:""}
 <div class="card"><b>Mijn als-dan-plan</b><p>${esc(S.plan||"Nog geen plan. Kies bij het begin wanneer het moeilijk is, of schrijf er zelf een in de Weger.")}</p></div>
 <button class="p w" id="zin">Ik heb nu zin</button>
 <button class="w" id="slip">Het is misgegaan</button>
 <div id="box"></div>`;
}
function bindHome(){
 const ok=$("ok");
 if(ok&&!ok.disabled)ok.onclick=()=>{S.days.push(today());save();render()};
 $("zin").onclick=()=>{
  clearInterval(timer);let t=60;
  $("box").innerHTML=`<div class="card"><div class="breath" id="b" aria-live="polite"></div><p class="mut" id="t"></p><p>De drang gaat meestal binnen tien minuten over. Je hoeft er alleen even doorheen.</p></div>`;
  const tick=()=>{const p=(60-t)%10;$("b").textContent=p<4?"Adem in…":"Adem langzaam uit…";$("t").textContent=t>0?`Nog ${t} seconden`:"Goed gedaan. Wil je nog een minuut, druk dan opnieuw.";if(t--<=0)clearInterval(timer)};
  tick();timer=setInterval(tick,1000);
 };
 $("slip").onclick=()=>{clearInterval(timer);
  $("box").innerHTML=`<div class="card"><b>Dat kan gebeuren, en het zegt niets over wie je bent.</b><p>Eén misstap is geen mislukking. Je goede dagen blijven staan.</p><label for="s">Wat gebeurde er, en wat probeer je de volgende keer?</label><textarea id="s"></textarea><button class="p w" onclick="document.getElementById('box').innerHTML='<div class=&quot;note&quot;>Genoteerd. Ga gewoon weer verder, stap voor stap.</div>'">Klaar</button></div>`;
 };
}

function weger(){
 return `<h1>De weger</h1><p class="mut">Schrijf eerlijk op wat het je geeft en wat het je kost. Allebei mag. Zo zie je zelf wat zwaarder weegt.</p>
 <label for="p">Wat ${esc(S.habit)} mij geeft</label><textarea id="p">${esc(S.pros)}</textarea>
 <label for="co">Wat het mij kost</label><textarea id="co">${esc(S.cons)}</textarea>
 <label for="pl">Mijn als-dan-plan</label><textarea id="pl" placeholder="Als …, dan …">${esc(S.plan)}</textarea>
 <div class="card"><b>Waar je stond</b><p>Belangrijk: ${S.imp}/10, zeker: ${S.conf}/10.</p>
 <p class="mut">${S.conf<S.imp?`Waarom niet lager dan ${S.conf}? Schrijf op wat je al helpt.`:"Je vertrouwen is minstens zo groot als het belang. Dat is een goede basis."}</p></div>`;
}
function bindWeger(){[["p","pros"],["co","cons"],["pl","plan"]].forEach(([id,k])=>$(id).oninput=e=>{S[k]=e.target.value;save()})}

function hulp(){
 return `<h1>Hulp</h1><p>Deze app is een kruk, geen gips. Voor het echte herstel helpt iemand erbij.</p>
 <div class="card"><b>Huisarts</b><p>Eerste stap voor bijna alles, zeker bij alcohol, pillen of als stoppen moeilijk of onveilig voelt.</p></div>
 <div class="card"><b>Druglijn (België)</b><p>078 15 10 20 voor alcohol, drugs, medicijnen en gokken. <a href="https://www.druglijn.be" target="_blank" rel="noopener">druglijn.be</a></p></div>
 <div class="card"><b>Tabakstop</b><p>0800 111 00 gratis voor wie wil stoppen met roken.</p></div>
 <div class="card"><b>Awel</b><p>102 gratis, voor kinderen en jongeren. <a href="https://www.awel.be" target="_blank" rel="noopener">awel.be</a></p></div>
 <button class="w" id="reset">Alles op dit toestel wissen</button>`;
}
document.addEventListener("click",e=>{
 if(e.target.id==="reset"&&confirm("Alle gegevens wissen?")){try{localStorage.removeItem(K)}catch(x){}location.reload()}
});
render();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}