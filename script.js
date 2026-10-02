const CITIES=[
{n:'Bengaluru',g:'linear-gradient(160deg,#f6a54a,#8a3b2a)'},
{n:'Hyderabad',g:'linear-gradient(160deg,#ff8a4c,#7a2f4a)'},
{n:'Pune',g:'linear-gradient(160deg,#f2b35e,#5a4a7a)'},
{n:'Mumbai',g:'linear-gradient(160deg,#4b8bd6,#1d2a5a)'},
{n:'Delhi',g:'linear-gradient(160deg,#e9a35b,#7a3d3d)'}];
const BG=['linear-gradient(135deg,#d9c3a5,#8a6a4f)','linear-gradient(135deg,#b9cbe0,#5f7894)','linear-gradient(135deg,#e6cfc0,#a8785f)','linear-gradient(135deg,#c9d8c4,#6f8f6a)'];
const ROOMS=[
{id:1,t:'Modern PG with Food',a:'HSR Layout',c:'Bengaluru',p:12000,type:'PG',tags:['PG','Food','WiFi'],r:4.5,n:120},
{id:2,t:'Single Room',a:'Kondapur',c:'Hyderabad',p:16000,type:'Single',tags:['Single','AC','WiFi'],r:4.3,n:89},
{id:3,t:'Shared Room near Metro',a:'Koregaon Park',c:'Pune',p:7500,type:'Shared',tags:['Shared','WiFi','Meals'],r:4.1,n:64},
{id:4,t:'Studio Flat',a:'Andheri East',c:'Mumbai',p:22000,type:'Flat',tags:['Flat','AC','Parking'],r:4.6,n:41},
{id:5,t:'Girls PG',a:'Whitefield',c:'Bengaluru',p:9500,type:'PG',tags:['PG','Food','Security'],r:4.4,n:98}];

const S={tab:'home',city:'Bengaluru',budget:'',type:'',saved:new Set(),bookings:[]};
const $=s=>document.querySelector(s), view=$('#view');
const ic={
pin:'<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
inr:'<path d="M7 5h10M7 9h10M7 5c6 0 6 8 0 8l7 6"/>',
home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
find:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
heart:'<path d="M12 21s-8-5.4-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.600-8 11-8 11z"/>',
bell:'<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
chev:'<path d="M6 9l6 6 6-6"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'};
const svg=(k,c='')=>`<svg class="${c}" viewBox="0 0 24 24">${ic[k]}</svg>`;
const inr=n=>'₹'+n.toLocaleString('en-IN');

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),1800)}

function matches(r){
 if(S.city&&r.c!==S.city)return false;
 if(S.budget&&r.p>+S.budget)return false;
 if(S.type&&r.type!==S.type)return false;
 return true}

function roomCard(r,i){return `<article class="room">
 <div class="pic" style="background:${BG[i%BG.length]}"><button class="heart ${S.saved.has(r.id)?'on':''}" data-save="${r.id}" aria-label="Save">${svg('heart')}</button></div>
 <div class="info"><div><h3>${r.t}</h3><div class="loc">${r.a}, ${r.c}</div></div>
 <div class="price">${inr(r.p)}/month</div>
 <div class="tags">${r.tags.map(x=>`<span>${x}</span>`).join('')}</div>
 <div class="row"><span class="rate">${r.r} <s>(${r.n})</s></span><button class="book" data-book="${r.id}">Book</button></div></div></article>`}

const opts=(arr,sel)=>arr.map(([v,l])=>`<option value="${v}" ${v==sel?'selected':''}>${l}</option>`).join('');
function searchBox(){return `<section class="search">
 <label class="field">${svg('pin')}<select id="city">${opts(CITIES.map(c=>[c.n,c.n]),S.city)}</select>${svg('chev','chev')}</label>
 <label class="field">${svg('inr')}<select id="budget">${opts([['','Budget'],['8000','Up to ₹8,000'],['12000','Up to ₹12,000'],['16000','Up to ₹16,000'],['25000','Up to ₹25,000']],S.budget)}</select>${svg('chev','chev')}</label>
 <label class="field">${svg('home')}<select id="type">${opts([['','Room Type'],['PG','PG'],['Single','Single Room'],['Shared','Shared Room'],['Flat','Flat']],S.type)}</select>${svg('chev','chev')}</label>
 <button class="go" id="go">${svg('find')} Search Rooms</button></section>`}

function listHTML(arr,msg){return arr.length?`<div class="list">${arr.map(roomCard).join('')}</div>`:`<div class="empty">${msg}</div>`}

function home(){
 const pf=[['shield','Verified','#ece8ff','#5b3df5'],['inr','No Brokerage','#dff5ea','#17a05d'],['lock','Safe & Secure','#ffe3f1','#e0247f'],['bolt','Easy Booking','#fff1d6','#f5a000']];
 return `<header class="hero"><div class="bar">${svg('menu')}<div class="logo"><i>${svg('home')}</i>Alfrzo</div>${svg('heart')}${svg('bell')}</div>
 <h1>Find a place<br>that feels like <em>Home</em></h1><p>Verified rooms • Safe living • Across India</p></header>
 ${searchBox()}
 <div class="perks">${pf.map(([i,l,bg,c])=>`<div><b style="background:${bg};color:${c}">${svg(i)}</b>${l}</div>`).join('')}</div>
 <div class="sec"><h2>Popular Cities</h2><a data-go="search">View All →</a></div>
 <div class="cities">${CITIES.map(c=>`<button class="city ${c.n==S.city?'on':''}" data-city="${c.n}" style="background:${c.g}">${c.n}</button>`).join('')}</div>
 <div class="sec"><h2>Featured Rooms</h2><a data-go="search">View All →</a></div>
 ${listHTML(ROOMS.filter(matches).slice(0,3),'No rooms match. Change city or budget.')}`}

function search(){return `<div class="page"><h2>Search rooms</h2></div>${searchBox()}<div style="height:14px"></div>${listHTML(ROOMS.filter(matches),'No rooms match. Try a higher budget.')}`}
function saved(){return `<div class="page"><h2>Saved</h2></div>${listHTML(ROOMS.filter(r=>S.saved.has(r.id)),'Tap the heart on a room to save it here.')}`}
function bookings(){return `<div class="page"><h2>Bookings</h2></div>${listHTML(ROOMS.filter(r=>S.bookings.includes(r.id)),'No bookings yet. Pick a room and tap Book.')}`}
function profile(){return `<div class="page"><h2>Profile</h2><div class="prof"><div>Saved rooms: ${S.saved.size}</div><div>Bookings: ${S.bookings.length}</div><div>City: ${S.city}</div></div></div>`}

const PAGES={home,search,saved,bookings,profile};
function render(){
 view.innerHTML=PAGES[S.tab]();
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===S.tab));
}
function go(t){S.tab=t;render();window.scrollTo(0,0)}

document.addEventListener('click',e=>{
 const q=s=>e.target.closest(s);
 let el;
 if(el=q('[data-tab]'))return go(el.dataset.tab);
 if(el=q('[data-go]'))return go(el.dataset.go);
 if(el=q('[data-city]')){S.city=el.dataset.city;render();return toast('Showing rooms in '+S.city)}
 if(el=q('[data-save]')){const id=+el.dataset.save;S.saved.has(id)?S.saved.delete(id):S.saved.add(id);toast(S.saved.has(id)?'Saved':'Removed from saved');return render()}
 if(el=q('[data-book]')){const id=+el.dataset.book;if(S.bookings.includes(id))return toast('Already booked');S.bookings.push(id);return toast('Booking requested')}
 if(q('#go')){S.city=$('#city').value;S.budget=$('#budget').value;S.type=$('#type').value;const n=ROOMS.filter(matches).length;S.tab='search';render();toast(n+' rooms found')}
});
render();
