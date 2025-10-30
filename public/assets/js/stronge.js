// assets/js/stronge.js
// ========= CONST =========
export const QS = new URLSearchParams(location.search);

// ========= Helpers genéricos reutilizables =========
export const clp  = n => Number(n||0).toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });
export const byId = id => document.getElementById(id);
export const $    = (sel, ctx=document) => ctx.querySelector(sel);
export const $$   = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
export const sleep = (ms=300) => new Promise(r => setTimeout(r, ms));
