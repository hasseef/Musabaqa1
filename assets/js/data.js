import { storage } from './state.js'; import { uid } from './utils.js';
const COMP_KEY='msbq_comps', SUBM_KEY='msbq_subm', SCORE_KEY='msbq_scores', PRIZE_KEY='msbq_prizes', WALLET_KEY='msbq_wallet', PLEDGE_KEY='msbq_pledges';
const FEE_RATE=0.05;
const seed=[
 {id:'c1',title:'المسابقة الوطنية للابتكار',org:'المنصة',category:'وطني',status:'open',deadline:'2025-12-31',brief:'مسابقة وطنية شاملة مع رعاة وشركاء.',rubric:[{k:'الأثر',w:0.4},{k:'الجدوى',w:0.3},{k:'الابتكار',w:0.3}],videoUrl:'',stickers:['🇸🇦','🌟'],requiresCode:false,code:'',budget:200000,feeRate:0.05,needsSponsorship:true,funding:{required:150000,collected:30000,pledges:[]}, form:[{id:'q1',type:'radio',title:'هل الفكرة جديدة؟',options:['نعم','لا'],correct:'نعم'}]},
 {id:'c2',title:'جائزة التصميم الحضري',org:'أمانة المدينة',category:'تصميم',status:'soon',deadline:'2025-12-05',brief:'أفكار لإحياء الساحات العامة.',rubric:[{k:'الجمالية',w:0.35},{k:'الفائدة',w:0.35},{k:'الاستدامة',w:0.3}],videoUrl:'',stickers:['🌿','✨'],requiresCode:true,code:'HAIL2025',budget:50000,feeRate:0.03,needsSponsorship:false,funding:{required:0,collected:0,pledges:[]}, form:[{id:'q1',type:'select',title:'المرحلة الحالية',options:['مفهوم','نمذجة ثلاثية','جاهز للتنفيذ'],correct:'نمذجة ثلاثية'}]}
];
export const comps=()=>{let c=storage.read(COMP_KEY); if(!c){storage.write(COMP_KEY,seed); c=seed;} return c}; export const saveComps=a=>storage.write(COMP_KEY,a);
export const submissions=()=>storage.read(SUBM_KEY,[]); export const saveSubmissions=a=>storage.write(SUBM_KEY,a);
export const scoresStore=()=>storage.read(SCORE_KEY,[]); export const saveScores=a=>storage.write(SCORE_KEY,a);
export const prizeClaims=()=>storage.read(PRIZE_KEY,[]); export const savePrizeClaims=a=>storage.write(PRIZE_KEY,a);
export const wallet=()=>storage.read(WALLET_KEY,{balance:0,invoices:[]}); export const saveWallet=w=>storage.write(WALLET_KEY,w);
export const pledges=()=>storage.read(PLEDGE_KEY,[]); export const savePledges=p=>storage.write(PLEDGE_KEY,p);
export const computeFee=(budget,feeRate)=>Math.round((Number(budget||0))*Math.min(feeRate||FEE_RATE,FEE_RATE));
export const INVOICE_TYPES={ SPONSOR_PLEDGE:'SPONSOR_PLEDGE', SPONSOR_PACKAGE:'SPONSOR_PACKAGE', SELF_FUND:'SELF_FUND' };
export function createInvoice(payload){ const w=wallet(); const id=uid(); const inv={ id, status: payload.status||'unpaid', createdAt: Date.now(), paymentMethod: payload.paymentMethod||null, paymentUrl: payload.paymentUrl||null, ...payload }; w.invoices.push(inv); saveWallet(w); return inv; }
export function markInvoicePaid(id){ const w=wallet(); const i=w.invoices.findIndex(x=>x.id===id); if(i>-1){ w.invoices[i].status='paid'; w.invoices[i].paidAt=Date.now(); w.balance+=Number(w.invoices[i].amount||0); saveWallet(w);} }
export function createPledge({compId, sponsorEmail, amount, visibilityTier='bronze', note=''}){ const p=pledges(); const id=uid(); p.push({id, compId, sponsorEmail, amount:Number(amount||0), visibilityTier, note, status:'pending', invoiceId:null, createdAt:Date.now(), updatedAt:Date.now()}); savePledges(p); const inv=createInvoice({ title:'تعهد رعاية', amount:Number(amount||0), type:INVOICE_TYPES.SPONSOR_PLEDGE, compId, sponsorEmail, status:'unpaid' }); return {pledgeId:id, invoiceId:inv.id}; }
export const canExposeSponsorship=(type)=>(type==='government'||type==='nonprofit');
export const createPrizeClaim=p=>{const arr=prizeClaims(); arr.push({id:uid(),status:'pending',createdAt:Date.now(),...p}); savePrizeClaims(arr)};