import { storage } from './state.js'; import { uid } from './utils.js';
const COMP_KEY='msbq_comps', PRIZE_KEY='msbq_prizes', WALLET_KEY='msbq_wallet', PLEDGE_KEY='msbq_pledges';
const seed=[
 {id:'c1',title:'المسابقة الوطنية للابتكار',org:'المنصة',category:'وطني',status:'open',deadline:'2025-12-31',brief:'مسابقة وطنية شاملة مع رعاة وشركاء.',rubric:[{k:'الأثر',w:0.4},{k:'الجدوى',w:0.3},{k:'الابتكار',w:0.3}],requiresCode:false,code:'',budget:200000,feeRate:0.05,needsSponsorship:true,funding:{required:150000,collected:30000}},
 {id:'c2',title:'جائزة التصميم الحضري',org:'أمانة المدينة',category:'تصميم',status:'soon',deadline:'2025-12-05',brief:'أفكار لإحياء الساحات العامة.',rubric:[{k:'الجمالية',w:0.35},{k:'الفائدة',w:0.35},{k:'الاستدامة',w:0.3}],requiresCode:true,code:'HAIL2025',budget:50000,feeRate:0.03,needsSponsorship:false,funding:{required:0,collected:0}}
];
export const comps=()=>{let c=storage.read(COMP_KEY); if(!c){storage.write(COMP_KEY,seed); c=seed;} return c};
export const prizeClaims=()=>storage.read(PRIZE_KEY,[]); export const savePrizeClaims=a=>storage.write(PRIZE_KEY,a);
export const wallet=()=>storage.read(WALLET_KEY,{balance:0,invoices:[]}); export const saveWallet=w=>storage.write(WALLET_KEY,w);
export const pledges=()=>storage.read(PLEDGE_KEY,[]); export const savePledges=p=>storage.write(PLEDGE_KEY,p);
export function createPrizeClaim(p){ const arr=prizeClaims(); arr.push({id:uid(),status:'pending',createdAt:Date.now(),...p}); savePrizeClaims(arr); }
export function createInvoice(payload){ const w=wallet(); w.invoices.push({id:uid(),createdAt:Date.now(),status:'unpaid',...payload}); saveWallet(w); }
export function markInvoicePaid(id){ const w=wallet(); const i=w.invoices.findIndex(x=>x.id===id); if(i>-1){ w.invoices[i].status='paid'; saveWallet(w);} }
export function createPledge({compId, sponsorEmail, amount, visibilityTier='bronze', note=''}){ const p=pledges(); p.push({id:uid(),compId,sponsorEmail,amount:Number(amount||0),visibilityTier,note,status:'pending',createdAt:Date.now()}); savePledges(p); }