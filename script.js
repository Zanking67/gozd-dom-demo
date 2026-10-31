/* Shared interactions for the demonstration website */
document.documentElement.classList.add("js");
const menu=document.querySelector(".menu-toggle"),nav=document.querySelector("#main-nav");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Zapri meni":"Odpri meni")});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Odpri meni")}));document.addEventListener("keydown",e=>{if(e.key==="Escape"){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");}})}
const animated=document.querySelectorAll(".reveal");if("IntersectionObserver"in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:"0px 0px -25px 0px"});animated.forEach(el=>observer.observe(el));}else{animated.forEach(el=>el.classList.add("visible"));}
const quote=document.querySelector("#quote-form");if(quote){const qs=new URLSearchParams(location.search);const wood=qs.get("vrsta");if(wood&&["Bukova drva","Hrastova drva","Mešana drva"].includes(wood))document.querySelector("#wood-type").value=wood;const q=Number(qs.get("kolicina"));if(qs.has("kolicina")&&Number.isFinite(q)&&q>=0.5&&q<=40&&Math.abs(q*2-Math.round(q*2))<1e-8)document.querySelector("#contact-quantity").value=String(q);const delivery=qs.get("dostava");if(delivery&&delivery.length<=80){quote.querySelector('textarea[name="message"]').value="Demo kalkulator – izbrana možnost: "+delivery+" (ni dejanska ponudba).";}quote.addEventListener("submit",e=>{e.preventDefault();if(!quote.reportValidity())return;const d=new FormData(quote);const text=["DEMONSTRACIJSKO POVPRAŠEVANJE","Ime: "+d.get("name"),"E-pošta: "+d.get("email"),"Vrsta drv: "+d.get("wood"),"Količina: "+d.get("amount"),"Kraj dostave: "+d.get("place"),"Opombe: "+(d.get("message")||"Brez"),"","To sporočilo ni bilo poslano."].join("\n");document.querySelector("#result-text").textContent=text;const result=document.querySelector("#form-result");result.hidden=false;result.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"})});document.querySelector("#copy-result").addEventListener("click",async()=>{const feedback=document.querySelector("#copy-feedback"),content=document.querySelector("#result-text").textContent;try{if(!navigator.clipboard||!window.isSecureContext)throw new Error("Clipboard unavailable");await navigator.clipboard.writeText(content);feedback.textContent="Kopirano!";}catch{feedback.textContent="Označite in kopirajte pripravljeno besedilo ročno.";}})}

/* Wood guide: synchronized native disclosure panels and photo preview. */
const woodGuideItems=[...document.querySelectorAll(".wood-guide-item")];
if(woodGuideItems.length){
  const guidePreview=document.getElementById("wood-guide-preview");
  const guidePhotoLabel=document.getElementById("wood-guide-photo-label");
  woodGuideItems.forEach(item=>{
    item.addEventListener("toggle",()=>{
      if(!item.open)return;
      woodGuideItems.forEach(other=>{if(other!==item&&other.open)other.open=false;});
      if(guidePreview&&item.dataset.photo){
        guidePreview.src=item.dataset.photo;
        guidePreview.alt=item.dataset.alt||"Ilustrativna fotografija drv";
      }
      if(guidePhotoLabel)guidePhotoLabel.textContent=item.dataset.label||"VRSTA DRV";
    });
  });
}
