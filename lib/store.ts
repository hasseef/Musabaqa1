'use client';import { create } from 'zustand';import { persist } from 'zustand/middleware';import type { Competition } from './data';
type Invoice={id:string;title:string;amount:number;status:'unpaid'|'paid';createdAt:number};type Pledge={id:string;compId:string;sponsorEmail:string;amount:number;visibilityTier:'bronze'|'silver'|'gold';note?:string;status:'pending'|'approved';createdAt:number};
type Store={comps:Competition[];invoices:Invoice[];pledges:Pledge[];balance:number;addInvoice:(title:string,amount:number)=>void;markPaid:(id:string)=>void;createPledge:(p:Omit<Pledge,'id'|'status'|'createdAt'>)=>void;};
const uid=()=>Math.random().toString(36).slice(2);
export const useStore=create<Store>()(persist((set,get)=>({
  comps:[],invoices:[],pledges:[],balance:0,
  addInvoice:(title,amount)=>set(s=>({invoices:[...s.invoices,{id:uid(),title,amount,status:'unpaid',createdAt:Date.now()}]})),
  markPaid:(id)=>set(s=>{const invoices=s.invoices.map(i=>i.id===id?{...i,status:'paid'}:i);const paid=s.invoices.find(i=>i.id===id)?.amount||0;return{invoices,balance:s.balance+paid}}),
  createPledge:(p)=>set(s=>({pledges:[...s.pledges,{...p,id:uid(),status:'pending',createdAt:Date.now()}]}))
}),{name:'mus-store'}));