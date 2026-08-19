const products = [
  {
    id:"macaron", title:"Macaron MagSafe Stand Brenbaru X MXD", price:79, old:89,
    image:"assets/macaron-magsafe.webp", badge:"SOLD OUT", badgeClass:"",
    variants:["Lavender Honey","Bubble Gum","Rose Raspberry"], sold:true, engrave:true,
    installment:"RM 26.33 with 3 installments via Atome",
    features:[["Dimensions","10.0 × 6.5 × 1.0 cm"],["Storage","Recommended storage: 2 cards"],["Compatibility","Works with MagSafe"],["Status","Sold out on the supplied MXD product screenshot"]],
    engraveText:"The current MXD product page includes a name engraving field. Enter the requested name here so it stays attached to the item in this preview.",
    shipping:"MXD product pages advertise worldwide shipping. Ready-stock domestic delivery is typically stated as 3 to 4 business days, with international delivery around 14 business days."
  },
  {
    id:"dots", title:"(PRE ORDER) Dots Card Holder Brenbaru X MXD", price:69, old:89,
    image:"assets/dots-card-holder.webp", badge:"PRE ORDER", badgeClass:"pre",
    variants:["Berry Brownie","Cookies & Cream","Caramel Pudding"], sold:false, engrave:true,
    installment:"RM 23.00 with 3 installments via Atome",
    features:[["Collection","Brenbaru X MXD"],["Compatibility","MagSafe card holder"],["Variants","Berry Brownie, Cookies & Cream, Caramel Pudding"],["Status","Pre-order"]],
    engraveText:"Add an engraving name if required. Final engraving availability and character limits are confirmed by the merchant.",
    shipping:"Pre-order fulfilment timing can differ from ready stock. Final dispatch timing is confirmed by the merchant at checkout."
  },
  {
    id:"toonbag", title:"Kids ToonBagpack for school in 2D design", price:29, old:null,
    image:"assets/kids-toon-bag.webp", badge:"KIDS", badgeClass:"sale",
    variants:["Blue ToonBagpack","Red ToonBagpack","Green ToonBagpack"], sold:false, engrave:false,
    installment:"RM 9.67 with 3 installments via Atome",
    features:[["Design","2D ToonBagpack"],["Use","Kids school bag"],["Variants","Blue, Red, Green"],["Price","RM 29.00"]],
    engraveText:"No engraving field is shown for this product in this preview.",
    shipping:"Worldwide shipping is advertised by the current merchant store. Final shipping cost and delivery estimate are calculated by the merchant."
  },
  {
    id:"magsie", title:"Magsie Card Holder Brenbaru X MXD", price:69, old:79,
    image:"assets/magsie-card-holder.webp", badge:"SALE", badgeClass:"sale",
    variants:["Red Velvet","Strawberry","Matcha","Blueberry","Chocolate","No Engrave"], sold:false, engrave:true,
    installment:"From RM 23.00 with 3 installments via Atome",
    features:[["Collection","Brenbaru X MXD"],["Compatibility","MagSafe card holder"],["Price range","RM 69.00 to RM 79.00"],["Variants","Red Velvet, Strawberry, Matcha, Blueberry, Chocolate"]],
    engraveText:"Choose No Engrave if you do not want personalisation, or enter the requested name. Final engraving rules are confirmed by the merchant.",
    shipping:"MXD product pages advertise worldwide shipping. Final delivery timing and international tax or courier charges are confirmed by the merchant."
  }
];

let cart = JSON.parse(localStorage.getItem("brenbaruCart") || "[]");
let currentProduct = null;
let modalVariant = "";

function money(v){return `RM ${Number(v).toFixed(2)}`}
function productById(id){return products.find(p=>p.id===id)}
function saveCart(){localStorage.setItem("brenbaruCart",JSON.stringify(cart));renderCart()}
function flash(text="Added to bag ✓"){const t=document.getElementById("toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function renderProducts(){
  document.getElementById("productGrid").innerHTML=products.map(p=>`
    <article class="card">
      <div class="visual"><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="badge ${p.badgeClass}">${p.badge}</span></div>
      <div class="cardBody">
        <h3>${p.title}</h3>
        <div><span class="price">${money(p.price)}${p.id==="magsie"?" +":""}</span>${p.old?`<span class="old">${money(p.old)}</span>`:""}</div>
        <div class="installment">${p.installment}</div>
        <div class="variants">${p.variants.slice(0,3).map((v,i)=>`<button class="variant ${i===0?"active":""}" onclick="pickCardVariant(this)">${v}</button>`).join("")}${p.variants.length>3?`<button class="variant" onclick="openProduct('${p.id}')">+${p.variants.length-3}</button>`:""}</div>
        <div class="cardButtons">
          <button class="smallBtn" onclick="openProduct('${p.id}')">Details</button>
          <button class="smallBtn ${p.sold?"sold":"add"}" ${p.sold?"disabled":""} onclick="quickAdd('${p.id}',this)">${p.sold?"Sold out":"Add to bag"}</button>
        </div>
      </div>
    </article>
  `).join("");
}
function pickCardVariant(btn){const box=btn.parentElement;box.querySelectorAll(".variant").forEach(b=>b.classList.remove("active"));btn.classList.add("active")}
function quickAdd(id,btn){const p=productById(id);const card=btn.closest(".card");const active=card.querySelector(".variant.active");addItem(p,active?active.textContent:p.variants[0],"")}
function addItem(p,variant,engrave){
  const key=`${p.id}|${variant}|${engrave||""}`;
  const found=cart.find(i=>i.key===key);
  if(found) found.qty+=1; else cart.push({key,id:p.id,title:p.title,price:p.price,image:p.image,variant,engrave:engrave||"",qty:1});
  saveCart();flash();
}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartCount").textContent=count;
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div class="empty">your bag is waiting for something cute ✿</div>'}
  else box.innerHTML=cart.map((i,n)=>`
    <div class="cartRow">
      <img src="${i.image}" alt="">
      <div><b>${i.title}</b><small>${i.variant}${i.engrave?` · Engrave: ${i.engrave}`:""}</small>
      <div class="rowMeta"><span>${i.qty} × ${money(i.price)}</span><button class="remove" onclick="removeItem(${n})">remove</button></div></div>
    </div>`).join("");
  document.getElementById("subtotal").textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
function removeItem(n){cart.splice(n,1);saveCart()}
function openCart(){document.getElementById("drawer").classList.add("open");document.body.classList.add("lock")}
function closeCart(){document.getElementById("drawer").classList.remove("open");document.body.classList.remove("lock")}
function openProduct(id){
  const p=productById(id); currentProduct=p; modalVariant=p.variants[0];
  document.getElementById("modalImg").src=p.image; document.getElementById("modalImg").alt=p.title;
  document.getElementById("modalTitle").textContent=p.title;
  document.getElementById("modalPrice").textContent=money(p.price)+(p.id==="magsie"?" +":"");
  document.getElementById("modalOld").textContent=p.old?money(p.old):"";
  document.getElementById("modalInstallment").textContent=p.installment;
  document.getElementById("modalVariants").innerHTML=p.variants.map((v,i)=>`<button class="variant ${i===0?"active":""}" onclick="selectModalVariant(this,'${v.replace(/'/g,"&#39;")}')">${v}</button>`).join("");
  document.getElementById("engraveInput").style.display=p.engrave?"block":"none";
  document.getElementById("engraveLabel").style.display=p.engrave?"block":"none";
  document.getElementById("engraveInput").value="";
  document.getElementById("modalAdd").disabled=p.sold; document.getElementById("modalAdd").textContent=p.sold?"Sold out":"Add to bag";
  document.getElementById("modalAdd").className=`smallBtn ${p.sold?"sold":"add"}`;
  document.getElementById("tab-features").innerHTML=`<table class="spec">${p.features.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table>`;
  document.getElementById("tab-engrave").innerHTML=`<p>${p.engraveText}</p>`;
  document.getElementById("tab-shipping").innerHTML=`<p>${p.shipping}</p>`;
  document.querySelectorAll(".tabBtn").forEach((b,i)=>b.classList.toggle("active",i===0));
  document.querySelectorAll(".tab").forEach((t,i)=>t.classList.toggle("active",i===0));
  document.getElementById("productModal").classList.add("open");document.body.classList.add("lock");
}
function selectModalVariant(btn,v){document.querySelectorAll("#modalVariants .variant").forEach(b=>b.classList.remove("active"));btn.classList.add("active");modalVariant=v}
function closeProduct(){document.getElementById("productModal").classList.remove("open");document.body.classList.remove("lock")}
function addFromModal(){if(!currentProduct||currentProduct.sold)return;addItem(currentProduct,modalVariant,document.getElementById("engraveInput").value.trim())}
function goCheckoutFromModal(){if(currentProduct&&!currentProduct.sold){addFromModal();setTimeout(()=>location.href="checkout.html",180)}else location.href="checkout.html"}
function goCheckout(){location.href="checkout.html"}
document.querySelectorAll(".tabBtn").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.tab;document.querySelectorAll(".tabBtn").forEach(b=>b.classList.toggle("active",b===btn));
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.id===`tab-${name}`));
}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProduct();closeCart()}});
renderProducts();renderCart();
