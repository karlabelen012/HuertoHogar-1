// assets/js/ui.js
// ========== CONST ==========
export const IDS = { year:'#year', searchForm:'#formBuscar', searchInput:'#q' };

// ========== Helpers UI ==========
export const $  = s => document.querySelector(s);
export const $$ = s => document.querySelectorAll(s);

export function setCurrentYear(sel=IDS.year){
  const el = $(sel); if (el) el.textContent = new Date().getFullYear();
}
export function bindSearchForm(formSel=IDS.searchForm, inputSel=IDS.searchInput){
  const f=$(formSel), i=$(inputSel); if(!f || !i) return;
  f.addEventListener('submit', (e)=>{ e.preventDefault(); window.location.href = `./productos.html?q=${encodeURIComponent(i.value||'')}`; });
}
export function toast(msg='Hecho', type='success'){
  const div=document.createElement('div');
  div.className=`alert alert-${type}`;
  Object.assign(div.style,{position:'fixed',right:'12px',bottom:'12px',zIndex:'2000'});
  div.textContent=msg; document.body.appendChild(div); setTimeout(()=>div.remove(),2000);
}
