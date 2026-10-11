const $=(s)=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS=['Handicraft','Pottery','Textile','Jewellery','Wood Craft','Painting'];
const ICON={Handicraft:'🧶',Pottery:'🏺',Textile:'🧵',Jewellery:'📿','Wood Craft':'🪵',Painting:'🎨'};
const page=document.body.dataset.page, qs=new URLSearchParams(location.search);
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){toast('Storage full. Use a smaller photo.')}};
let products=get('ks_products',null)||[
 {id:1,name:'Handmade Pottery',category:'Pottery',price:960,qty:5,desc:'Hand-thrown clay pot made by village artisans.',img:'',published:true,keywords:'pottery, clay, handmade'},
 {id:2,name:'Traditional Painting',category:'Painting',price:1200,qty:3,desc:'Folk art painting with natural colours.',img:'',published:false,keywords:''},
 {id:3,name:'Handmade Jewellery',category:'Jewellery',price:750,qty:8,desc:'Beaded necklace set.',img:'',published:true,keywords:''}];
const saveAll=()=>put('ks_products',products);
const find=id=>products.find(p=>p.id==id);
const go=u=>location.href=u;
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('show');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('show'),2500)}
const pic=(p,c='pic')=>p.img?`<img class="${c}" src="${p.img}" alt="${esc(p.name)}">`:`<div class="${c} ph">${ICON[p.category]||'🧵'}</div>`;
const card=(p,btn)=>`<div class="card">${pic(p)}<h3>${esc(p.name)}</h3><span class="tag ${p.published?'on':''}">${p.published?'Published':esc(p.category)}</span><div class="price">₹${esc(p.price)}</div><small>Qty: ${esc(p.qty)}</small>${btn}</div>`;
function readImg(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.7))};im.src=r.result};r.readAsDataURL(file)}
function voice(id){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return toast('Voice input is not supported on this browser');const r=new R();r.lang=localStorage.ks_lang||'hi-IN';r.onresult=e=>{const el=$('#'+id);el.value=(el.value+' '+e.results[0][0].transcript).trim()};r.onerror=()=>toast('Could not hear you. Try again.');r.start();toast('Listening…')}
const mic=id=>`<button type="button" class="btn alt mic" onclick="voice('${id}')">🎤 Speak</button>`;
const wa=p=>'https://wa.me/?text='+encodeURIComponent(`${p.name} - ₹${p.price}\n${p.desc}\nKarigar Setu`);

// auth
const PUBLIC=['index','login','market'];
if(!PUBLIC.includes(page)&&!localStorage.ks_user)go('login.html');
function login(){const e=$('#email').value.trim(),p=$('#password').value;if(!e||!p)return toast('Enter your email and password');if(p.length<4)return toast('Password needs at least 4 characters');localStorage.ks_user=e;go('dashboard.html')}
function logout(){localStorage.removeItem('ks_user');go('login.html')}

// shell
function shell(inner){
 const N=[['dashboard','🏠','Home'],['products','📦','Products'],['add-product','➕','Add'],['ai-catalog','✨','AI Catalog'],['price-assistant','₹','Price'],['market','🛒','Market']];
 const cur=page==='product-details'?'products':page;
 const L=localStorage.ks_lang||'hi-IN';
 const top=`<header class="top"><a class="logo" href="${localStorage.ks_user?'dashboard':'index'}.html">Karigar Setu</a><div><select id="lang" aria-label="Voice language"><option value="hi-IN">हिन्दी</option><option value="mr-IN">मराठी</option><option value="en-IN">English</option></select> ${localStorage.ks_user?'<button onclick="logout()">Logout</button>':'<button onclick="go(\'login.html\')">Login</button>'}</div></header>`;
 const nav=localStorage.ks_user?`<nav class="bnav">${N.map(n=>`<a href="${n[0]}.html" class="${n[0]===cur?'on':''}"><span>${n[1]}</span>${n[2]}</a>`).join('')}</nav>`:'';
 $('#app').innerHTML=top+`<main class="wrap">${inner}</main>`+nav;
 $('#lang').value=L;$('#lang').onchange=e=>localStorage.ks_lang=e.target.value;
}
const opts=(sel)=>CATS.map(c=>`<option ${c===sel?'selected':''}>${c}</option>`).join('');

const PAGES={
index(){
 $('#app').innerHTML=`<header class="top"><span class="logo">Karigar Setu</span><button onclick="go('login.html')">Login</button></header><section class="hero"><h1>Sell your craft to the whole country</h1><p>Take a photo. Get a ready product listing, a fair price, and buyers who can reach you.</p><div class="row"><a class="btn" href="login.html">Start selling</a><a class="btn alt" href="market.html">Explore crafts</a></div></section><main class="wrap"><div class="grid"><div class="card"><h3>✨ AI Catalog</h3><p>Titles and descriptions written for you.</p></div><div class="card"><h3>₹ Smart Price</h3><p>A fair price from your costs.</p></div><div class="card"><h3>🛒 Market Linkage</h3><p>Publish and let buyers send inquiries.</p></div><div class="card"><h3>🎤 Voice input</h3><p>Speak in Hindi or Marathi instead of typing.</p></div></div></main>`},
login(){
 $('#app').innerHTML=`<main class="wrap" style="padding-top:48px"><div class="card"><h1>Karigar Setu</h1><p class="sub">Welcome, Artisan! Log in or register with your email.</p><label for="email">Email</label><input id="email" type="email" autocomplete="email"><label for="password">Password</label><input id="password" type="password" autocomplete="current-password"><button class="btn full" onclick="login()">Login / Register</button></div></main>`},
dashboard(){
 const pub=products.filter(p=>p.published),cat=products.filter(p=>p.keywords).length,sales=pub.reduce((s,p)=>s+p.price*p.qty,0);
 shell(`<h1>Welcome, Artisan 👋</h1><p class="sub">Manage your products and grow your market.</p><div class="stats"><div class="stat"><b>${products.length}</b>Total products</div><div class="stat"><b>${pub.length}</b>Published</div><div class="stat"><b>${cat}</b>AI catalogs</div><div class="stat"><b>₹${sales.toLocaleString('en-IN')}</b>Stock value (published)</div></div><div class="card"><h3>Add a product</h3><p>Photo, price, quantity.</p><a class="btn full" href="add-product.html">Add product</a></div><div class="card"><h3>Create AI catalog</h3><p>Get a title and description.</p><a class="btn full" href="ai-catalog.html">Generate catalog</a></div><div class="card"><h3>Find a fair price</h3><p>Enter your costs.</p><a class="btn full" href="price-assistant.html">Check price</a></div>`)},
products(){
 shell(`<h1>My Products</h1><p class="sub">Manage your handmade products.</p><input id="q" placeholder="Search products" aria-label="Search"><div class="grid" id="list" style="margin-top:14px"></div>`);
 const draw=()=>{const q=$('#q').value.toLowerCase(),l=products.filter(p=>p.name.toLowerCase().includes(q));$('#list').innerHTML=l.length?l.map(p=>card(p,`<a class="btn full" href="product-details.html?id=${p.id}">View</a>`)).join(''):'<div class="empty">No products yet. <a href="add-product.html">Add your first product</a>.</div>'};
 $('#q').oninput=draw;draw()},
'add-product'(){
 const p=find(qs.get('id'))||{};window._img=p.img||'';
 shell(`<h1>${p.id?'Edit':'Add New'} Product</h1><p class="sub">Add your handmade product.</p><div class="card"><label for="img">Photo</label><input id="img" type="file" accept="image/*" capture="environment"><div id="prev">${p.id?pic(p,'pic big'):''}</div><label for="name">Name</label><input id="name" value="${esc(p.name)}"><label for="cat">Category</label><select id="cat"><option value="">Select category</option>${opts(p.category)}</select><label for="desc">Description</label><textarea id="desc">${esc(p.desc)}</textarea>${mic('desc')}<label for="price">Price (₹)</label><input id="price" type="number" min="1" value="${esc(p.price)}"><label for="qty">Quantity</label><input id="qty" type="number" min="1" value="${esc(p.qty)}"><button class="btn full" onclick="saveProduct(${p.id||0})">Save product</button></div>`);
 $('#img').onchange=e=>{const f=e.target.files[0];if(f)readImg(f,d=>{window._img=d;$('#prev').innerHTML=`<img class="pic big" src="${d}" alt="Preview">`})}},
'product-details'(){
 const p=find(qs.get('id'));if(!p)return go('products.html');
 shell(`<h1>Product Details</h1><div class="card">${pic(p,'pic big')}<h2>${esc(p.name)}</h2><span class="tag">${esc(p.category)}</span><p class="price">₹${esc(p.price)}</p><p>Quantity: ${esc(p.qty)}</p><h3>Description</h3><p>${esc(p.desc)}</p>${p.keywords?`<p><small>Keywords: ${esc(p.keywords)}</small></p>`:''}<div class="row"><button class="btn green" onclick="togglePub(${p.id})">${p.published?'Unpublish':'Publish to market'}</button><a class="btn" href="${wa(p)}" target="_blank" rel="noopener">Share on WhatsApp</a></div><div class="row"><a class="btn alt" href="add-product.html?id=${p.id}">Edit</a><button class="btn red" onclick="del(${p.id})">Delete</button></div></div>`)},
'ai-catalog'(){
 shell(`<h1>AI Product Catalog</h1><p class="sub">Choose a product or type a name. We write the listing.</p><div class="card"><label for="pick">Your product</label><select id="pick" onchange="pickProduct()"><option value="">Select a product</option>${products.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><label for="cn">Product name</label><input id="cn"><label for="ccat">Category</label><select id="ccat">${opts('')}</select><button class="btn full" onclick="generateCatalog()">Generate AI catalog</button><label for="aiTitle">Title</label><input id="aiTitle"><label for="aiDesc">Description</label><textarea id="aiDesc"></textarea><label for="kw">Keywords</label><input id="kw"><button class="btn green full" onclick="saveCatalog()">Save catalog</button></div>`)},
'price-assistant'(){
 shell(`<h1>Smart Price Assistant</h1><p class="sub">Enter your cost for one piece.</p><div class="card"><label for="pcat">Category</label><select id="pcat">${opts('')}</select><label for="mat">Material cost (₹)</label><input id="mat" type="number" min="0"><label for="lab">Labour cost (₹)</label><input id="lab" type="number" min="0"><button class="btn full" onclick="suggestPrice()">Suggest price</button><div class="result" id="res" hidden></div></div>`)},
market(){
 const pub=products.filter(p=>p.published);
 const body=`<h1>Craft Market</h1><p class="sub">Handmade products from artisans.</p><div class="row"><input id="q" placeholder="Search crafts" aria-label="Search"><select id="f"><option value="">All categories</option>${opts('')}</select></div><div class="grid" id="list" style="margin-top:14px"></div>`;
 localStorage.ks_user?shell(body):($('#app').innerHTML=`<header class="top"><a class="logo" href="index.html">Karigar Setu</a><button onclick="go('login.html')">Login</button></header><main class="wrap">${body}</main>`);
 const draw=()=>{const q=$('#q').value.toLowerCase(),c=$('#f').value,l=pub.filter(p=>p.name.toLowerCase().includes(q)&&(!c||p.category===c));$('#list').innerHTML=l.length?l.map(p=>card(p,`<button class="btn full" onclick="inquire(${p.id})">Send inquiry</button>`)).join(''):'<div class="empty">No crafts found.</div>'};
 $('#q').oninput=draw;$('#f').onchange=draw;draw()}
};

function saveProduct(id){
 const v=i=>$('#'+i).value.trim(),d={name:v('name'),category:v('cat'),desc:v('desc'),price:+v('price'),qty:+v('qty')};
 if(!d.name||!d.category||!d.desc||d.price<=0||d.qty<=0)return toast('Fill in all details');
 d.img=window._img||'';
 if(id){Object.assign(find(id),d)}else products.push({id:Date.now(),published:false,keywords:'',...d});
 saveAll();toast('Product saved');setTimeout(()=>go('products.html'),700)}
function togglePub(id){const p=find(id);p.published=!p.published;saveAll();toast(p.published?'Published':'Unpublished');PAGES[page]()}
function del(id){if(confirm('Delete this product?')){products=products.filter(p=>p.id!=id);saveAll();go('products.html')}}
function inquire(id){const l=get('ks_inquiries',[]);l.push({id,at:Date.now(),by:localStorage.ks_user||'guest'});put('ks_inquiries',l);toast('Inquiry sent to the artisan')}
function pickProduct(){const p=find($('#pick').value);if(!p)return;$('#cn').value=p.name;$('#ccat').value=p.category;$('#aiTitle').value=p.name;$('#aiDesc').value=p.desc;$('#kw').value=p.keywords||''}
// Replace the body of this function with a fetch() to your backend (which calls Claude/Gemini). Never put API keys here.
function generateCatalog(){
 const n=$('#cn').value.trim(),c=$('#ccat').value;if(!n)return toast('Enter a product name');
 const T={Pottery:'hand-thrown from natural clay',Textile:'woven with traditional looms',Jewellery:'crafted with care by hand','Wood Craft':'carved from sustainably sourced wood',Painting:'painted in the folk art tradition',Handicraft:'made by hand with local materials'};
 $('#aiTitle').value=`${n} - Handmade ${c} from India`;
 $('#aiDesc').value=`This ${n.toLowerCase()} is ${T[c]}. Each piece is unique and made by a skilled Indian artisan, so small variations are a mark of authenticity. A thoughtful gift that supports traditional craft.`;
 $('#kw').value=`handmade, ${c.toLowerCase()}, ${n.toLowerCase()}, Indian craft, artisan, gift`;toast('Catalog generated')}
function saveCatalog(){
 const t=$('#aiTitle').value,d=$('#aiDesc').value,k=$('#kw').value,p=find($('#pick').value);
 if(!t||!d)return toast('Generate the catalog first');
 if(!p)return toast('Select a product to save this catalog to');
 p.name=t;p.desc=d;p.keywords=k;saveAll();toast('Catalog saved')}
function suggestPrice(){
 const m=+$('#mat').value,l=+$('#lab').value,c=$('#pcat').value;
 if(!c||m<=0||l<=0)return toast('Select a category and enter both costs');
 const M={Handicraft:.3,Pottery:.35,Textile:.4,Jewellery:.5,'Wood Craft':.4,Painting:.6},cost=m+l,price=Math.round(cost*(1+M[c]));
 $('#res').hidden=false;$('#res').innerHTML=`<p>Suggested price</p><b>₹${price}</b><p>Fair range: ₹${Math.round(price*.9)} to ₹${Math.round(price*1.15)}</p><small>Material ₹${m} + labour ₹${l} + ${Math.round(M[c]*100)}% profit</small>`}

PAGES[page]();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
