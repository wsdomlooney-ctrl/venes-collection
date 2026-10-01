const products=[
{name:"jeans 1032",price:180,cat:"men",img:img:"IMG_0075.jpeg"},
{name:"heel 4545",price:320,cat:"men",img:"IMG_0077.jpeg"},
{name:"Everyday Tailored Set",price:420,cat:"women",img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85"},
{name:"Classic Mini Bag",price:260,cat:"accessories",img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85"},
{name:"Relaxed Street Shirt",price:280,cat:"men",img:"https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85"},
{name:"Minimal Black Dress",price:390,cat:"women",img:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85"},
{name:"Venes Signature Cap",price:140,cat:"accessories",img:"https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=85"},
{name:"Premium Knit Polo",price:350,cat:"men",img:"https://images.unsplash.com/photo-1625910513413-5fc45a7b3c0a?auto=format&fit=crop&w=800&q=85"}
];
let cart=[];
const money=n=>`GH₵${n.toLocaleString()}`;
function card(p){return `<article class="product-card"><div class="product-image"><img src="${p.img}" alt="${p.name}"><button class="quick-add" onclick="addToCart('${p.name.replace(/'/g,"\\'")}')">Add to bag</button></div><div class="product-info"><div class="product-name">${p.name}</div><div class="product-meta"><span>${p.cat}</span><strong>${money(p.price)}</strong></div></div></article>`}
function renderProducts(list,el){el.innerHTML=list.map(card).join("")}
renderProducts(products.slice(0,4),document.getElementById("newGrid"));
renderProducts(products,document.getElementById("shopGrid"));
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;renderProducts(f==="all"?products:products.filter(p=>p.cat===f),document.getElementById("shopGrid"));}));
function addToCart(name){const p=products.find(x=>x.name===name);cart.push(p);updateCart();openCart()}
function updateCart(){document.getElementById("cartCount").textContent=cart.length;document.getElementById("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><p>${money(p.price)}</p><button class="remove" onclick="removeItem(${i})">Remove</button></div></div>`).join(""):"<p>Your bag is empty.</p>";document.getElementById("cartTotal").textContent=money(cart.reduce((s,p)=>s+p.price,0))}
function removeItem(i){cart.splice(i,1);updateCart()}
const panel=document.getElementById("cartPanel"),overlay=document.getElementById("overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("show");panel.setAttribute("aria-hidden","false")}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("show");panel.setAttribute("aria-hidden","true")}
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length)return alert("Your bag is empty.");const msg=encodeURIComponent("Hello Venes Collection, I would like to order:\n"+cart.map(p=>`• ${p.name} — ${money(p.price)}`).join("\n")+`\nTotal: ${money(cart.reduce((s,p)=>s+p.price,0))}`);window.open(`https://wa.me/233000000000?text=${msg}`,"_blank")};
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();alert("Thanks for joining Venes Collection.");e.target.reset()});
document.getElementById("year").textContent=new Date().getFullYear();
