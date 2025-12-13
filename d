<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Discover News</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Inter,system-ui,Arial}
body{background:#f6f7f4;color:#0f172a;overflow:hidden}

header{
  padding:14px 16px;
  display:flex;
  align-items:center;
  gap:12px;
}
header h1{font-size:18px;font-weight:600}

/* single card view */
.viewer{
  height:calc(100vh - 60px);
  display:flex;
  align-items:center;
  justify-content:center;
}

.card{
  width:92%;
  max-width:420px;
  background:#6b7280;
  border-radius:22px;
  overflow:hidden;
  color:#fff;
  position:relative;
}

.card img{
  width:100%;
  height:60vh;
  object-fit:cover;
}

.card-overlay{
  position:absolute;
  inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.15));
}

.card-content{
  position:absolute;
  bottom:0;
  padding:18px;
}

.card-content h2{
  font-size:20px;
  margin-bottom:10px;
}

.card-content p{
  font-size:14px;
  opacity:.9;
}

.card-footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:14px;
  font-size:13px;
  opacity:.85;
}

.nav{
  position:fixed;
  bottom:20px;
  left:0;right:0;
  display:flex;
  justify-content:space-between;
  padding:0 26px;
}

.nav button{
  border:none;
  background:#111827;
  color:#fff;
  padding:12px 18px;
  border-radius:999px;
  font-size:14px;
  cursor:pointer;
}

.loader{text-align:center;padding:30px;color:#64748b}
</style>
</head>
<body>

<header>
  ← <h1>Discover</h1>
</header>

<div id="loader" class="loader">Loading…</div>
<div id="viewer" class="viewer"></div>

<div class="nav">
  <button onclick="prevNews()">◀ Prev</button>
  <button onclick="nextNews()">Next ▶</button>
</div>

<script>
const API_KEY="pub_3a1697b172fc4fdfb028bd198ae950d4";
const viewer=document.getElementById('viewer');
const loader=document.getElementById('loader');

let news=[];
let index=0;

// read keyword from URL like 1.html?key=india
const params=new URLSearchParams(window.location.search);
const keyword=params.get('key')||'india';

window.onload=loadNews;

async function loadNews(){
  const res=await fetch(`https://newsdata.io/api/1/news?apikey=${API_KEY}&q=${keyword}&language=en`);
  const data=await res.json();
  news=data.results||[];
  loader.style.display='none';
  showNews();
}

function showNews(){
  if(!news.length) return;
  const n=news[index];
  viewer.innerHTML=`
    <div class="card" onclick="openFull('${n.link}')">
      <img src="${n.image_url||'https://via.placeholder.com/600x400'}" />
      <div class="card-overlay"></div>
      <div class="card-content">
        <h2>${n.title}</h2>
        <p>${n.description||''}</p>
        <div class="card-footer">
          <span>${n.source_id||'News'}</span>
          <span>🔖</span>
        </div>
      </div>
    </div>`;
}

function nextNews(){
  if(index<news.length-1){index++;showNews();}
}

function prevNews(){
  if(index>0){index--;showNews();}
}

function openFull(url){
  window.open(url,'_blank');
}
</script>
</body>
</html>
