let cart=JSON.parse(localStorage.getItem("brenbaruCart")||"[]");
let shipping=8,discount=0;
function money(v){return `RM ${Number(v).toFixed(2)}`}
function subtotal(){return cart.reduce((s,i)=>s+i.price*i.qty,0)}
function render(){
  const items=document.getElementById("items");
  if(!cart.length){items.innerHTML='<div class="empty">Your bag is empty.<br><a href="index.html">Go pick something cute.</a></div>'}
  else items.innerHTML=cart.map(i=>`<div class="item"><img src="${i.image}" alt=""><div><b>${i.title}</b><small>${i.variant}${i.engrave?` · Engrave: ${i.engrave}`:""} · Qty ${i.qty}</small></div><span class="money">${money(i.price*i.qty)}</span></div>`).join("");
  document.getElementById("subtotal").textContent=money(subtotal());
  document.getElementById("shipping").textContent=money(shipping);
  document.getElementById("discount").textContent=`-${money(discount)}`;
  document.getElementById("total").textContent=money(Math.max(0,subtotal()+shipping-discount));
}
document.querySelectorAll('input[name="shipping"]').forEach(r=>r.addEventListener("change",()=>{shipping=Number(r.dataset.cost);render()}));
function applyVoucher(){const code=document.getElementById("voucher").value.trim().toUpperCase();const msg=document.getElementById("voucherMsg");if(code==="BREN10"){discount=subtotal()*.10;msg.textContent="BREN10 preview discount applied, 10% off."; }else{discount=0;msg.textContent=code?"Preview code not recognised.":"Enter a code first.";}render()}
function submitCheckout(e){
  e.preventDefault();
  if(!cart.length){alert("Your bag is empty.");return false}
  const form=e.currentTarget;if(!form.reportValidity())return false;
  const handoff=document.getElementById("handoff");handoff.classList.add("show");
  handoff.scrollIntoView({behavior:"smooth",block:"nearest"});
  return false;
}
render();