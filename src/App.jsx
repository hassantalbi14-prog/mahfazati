import React, { useState, useRef, useEffect } from "react";
import { supabase } from './db.js';
import { X, Home, CreditCard, Wallet, Target, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Menu, ChevronLeft, ChevronRight, Plus, Trash2, Cloud, Settings, Building2, Coins, Package, HandCoins, Download, Upload, Check, Camera } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PAL=["#10b981","#6366f1","#f59e0b","#ef4444","#14b8a6","#f97316","#8b5cf6","#ec4899","#06b6d4","#84cc16"];
const MONTH = new Date().toISOString().slice(0,7); // كيعطي "2026-05" تلقائياً حسب الشهر الحالي
const fmt=n=>(n||0).toLocaleString("ar-MA")+" د.م";
const uid=()=>Date.now()+Math.floor(Math.random()*9999);
const EE=["🍔","🚗","🏠","💊","🎓","👗","🎮","📱","💡","🛒","✈️","🎵","🍕","⚽","📚","💈","🧴","🐾","🎁","🏋️","🌿","🏥","💻","🎨","🔧"];
const IE=["💼","💻","🏠","🚕","📦","🎨","🎓","💹","🤝","🏭","📊","🎵","🛍️","🌐","✍️","💰","🏆","🎯","🔑","📝"];

const IC={expense:[
  {id:1,name:"أكل",icon:"🍔",color:"#ef4444",ci:null,subs:[{id:11,name:"مطعم"},{id:12,name:"تسوق"},{id:13,name:"قهوة"}]},
  {id:2,name:"نقل",icon:"🚗",color:"#f59e0b",ci:null,subs:[{id:21,name:"بنزين"},{id:22,name:"تاكسي"},{id:23,name:"صيانة"}]},
  {id:3,name:"سكن",icon:"🏠",color:"#14b8a6",ci:null,subs:[{id:31,name:"كراء"},{id:32,name:"فواتير"},{id:33,name:"أثاث"}]},
  {id:4,name:"صحة",icon:"💊",color:"#6366f1",ci:null,subs:[{id:41,name:"دواء"},{id:42,name:"طبيب"}]},
  {id:5,name:"ترفيه",icon:"🎮",color:"#8b5cf6",ci:null,subs:[{id:51,name:"سينما"},{id:52,name:"اشتراكات"}]},
],income:[
  {id:101,name:"راتب",icon:"💼",color:"#10b981",ci:null,subs:[{id:1011,name:"راتب أساسي"},{id:1012,name:"علاوة"},{id:1013,name:"مكافأة"}]},
  {id:102,name:"عمل حر",icon:"💻",color:"#6366f1",ci:null,subs:[{id:1021,name:"مشروع"},{id:1022,name:"استشارة"}]},
  {id:103,name:"استثمار",icon:"📈",color:"#f59e0b",ci:null,subs:[{id:1031,name:"أرباح"},{id:1032,name:"فوائد"}]},
  {id:104,name:"إيجار",icon:"🏠",color:"#14b8a6",ci:null,subs:[{id:1041,name:"إيجار شهري"}]},
]};

const IBK=[{id:1,name:"CIH Bank",address:"شارع محمد الخامس",accounts:[{id:11,type:"جاري",name:"الحساب الجاري",balance:12000,color:"#10b981"},{id:12,type:"توفير",name:"حساب التوفير",balance:3000,color:"#6366f1"}]}];
const ICS=[{id:1,type:"نقدية يومية",name:"المحفظة",balance:1500,color:"#f59e0b"}];
const IAS=[{id:1,type:"عقار",name:"الشقة",value:450000,color:"#14b8a6"},{id:2,type:"سيارة",name:"سيارة شخصية",value:80000,color:"#8b5cf6"}];
const ILN=[{id:1,kind:"أعطيت",person:"محمد",amount:2000,remaining:1500,date:"2026-03-01",note:"سلفة",wi:false,inst:false},{id:2,kind:"أخذت",person:"البنك",amount:50000,remaining:42000,date:"2025-01-01",note:"قرض سيارة",wi:true,interest:4.5,inst:true,minst:1200}];
const ITX=[
  {id:1,type:"income",amount:8000,catId:101,subId:1011,desc:"راتب ماي",date:"2026-05-01",pm:"نقدي",ref:{k:"bank",bid:1,aid:11}},
  {id:2,type:"expense",amount:1200,catId:3,subId:31,desc:"كراء",date:"2026-05-02",pm:"نقدي",ref:{k:"bank",bid:1,aid:11}},
  {id:3,type:"expense",amount:450,catId:1,subId:12,desc:"تسوق الأكل",date:"2026-05-05",pm:"نقدي",ref:{k:"cash",cid:1}},
  {id:4,type:"income",amount:1500,catId:102,subId:1021,desc:"مشروع freelance",date:"2026-05-10",pm:"نقدي",ref:{k:"bank",bid:1,aid:12}},
  {id:5,type:"expense",amount:350,catId:3,subId:32,desc:"كهرباء وماء",date:"2026-05-12",pm:"كريدي",ref:{k:"cash",cid:1}},
];
const IBG=[{id:1,catId:1,limit:800,month:MONTH},{id:2,catId:2,limit:400,month:MONTH},{id:3,catId:3,limit:1500,month:MONTH}];
const ISV=[{id:1,name:"سيارة جديدة",target:80000,saved:12000,color:"#6366f1",icon:"🚗"},{id:2,name:"عطلة صيف",target:15000,saved:6500,color:"#f97316",icon:"✈️"}];

const S={
  card:{background:"#1a1d27",borderRadius:16,padding:16,border:"1px solid #1e2548"},
  inp:{background:"#0c0f1e",border:"1px solid #1e2548",borderRadius:10,padding:"10px 14px",color:"#f1f5f9",fontFamily:"Cairo",fontSize:14,width:"100%",outline:"none"},
  sel:{background:"#0c0f1e",border:"1px solid #1e2548",borderRadius:10,padding:"10px 14px",color:"#f1f5f9",fontFamily:"Cairo",fontSize:14,width:"100%",outline:"none"},
  btn:(bg="#10b981",full=true)=>({background:bg,color:"white",border:"none",padding:"11px 18px",borderRadius:12,fontFamily:"Cairo",fontSize:14,fontWeight:700,cursor:"pointer",...(full?{width:"100%"}:{})}),
  row:{display:"flex",alignItems:"center",justifyContent:"space-between"},
  col:{display:"flex",flexDirection:"column",gap:12},
};

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#2a3060;border-radius:2px;}
.tx{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #1e2548;}.tx:last-child{border-bottom:none;}
.nb{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border-radius:10px;cursor:pointer;color:#4a5580;font-size:10px;flex:1;background:none;border:none;font-family:Cairo;transition:color .2s;}
.nb.on{color:#10b981;background:rgba(16,185,129,.12);}
.pbar{height:6px;background:#1e2548;border-radius:3px;overflow:hidden;}.pfill{height:100%;border-radius:3px;transition:width .8s;}
.drw{position:fixed;top:0;right:0;height:100%;width:300px;background:linear-gradient(180deg,#2e8fa8,#256e82);border-left:1px solid #1e6a80;z-index:200;transform:translateX(100%);transition:transform .3s;overflow-y:auto;}
.drw.op{transform:translateX(0);}
.ovl{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:199;opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(3px);}
.ovl.op{opacity:1;pointer-events:all;}
.mwp{position:fixed;inset:0;background:rgba(5,8,20,.8);z-index:300;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(5px);}
.mbx{background:linear-gradient(180deg,#171b32,#141828);border-radius:20px 20px 0 0;padding:24px;width:100%;max-width:480px;border-top:1px solid #252a50;max-height:90vh;overflow-y:auto;}
.mi{display:flex;align-items:center;gap:12px;padding:14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.08);color:white;font-size:15px;font-weight:600;}
.mi:hover{background:rgba(255,255,255,.1);}
.si{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.85);font-size:14px;}
.si:hover{background:rgba(255,255,255,.1);color:white;}
.cd{width:28px;height:28px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:border-color .2s;}.cd.sl{border-color:white;}
.eb{width:36px;height:36px;border-radius:10px;border:2px solid #1e2548;background:#0c0f1e;cursor:pointer;font-size:19px;display:flex;align-items:center;justify-content:center;}
.eb.sl{border-color:#10b981;background:#10b98120;}
.fch{display:flex;align-items:center;gap:12px;padding:16px 14px;background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.08);}
.fsi{display:flex;align-items:center;gap:12px;padding:15px 14px 15px 32px;border-bottom:1px solid rgba(255,255,255,.06);}
.stg{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:4px 10px;font-size:12px;color:white;margin:3px;}
.iu{border-radius:14px;border:2px dashed rgba(255,255,255,.3);background:rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;transition:border-color .2s;}
.iu:hover{border-color:white;}
.acc-row{display:flex;align-items:center;justify-content:space-between;padding:11px 12px;background:#171b32;border-radius:10px;margin-bottom:5px;border:1px solid #1e2548;}
`;

export default function App(){
  const[page,setPage]=useState("dashboard");
  const[drw,setDrw]=useState(false);
  const[dp,setDp]=useState(null);
  const[modal,setModal]=useState(null);
  const[form,setForm]=useState({});
  const[ei,setEi]=useState(null);
  const[cd,setCd]=useState(null);
  const[err,setErr]=useState(null);
  const[selSv,setSelSv]=useState(null);
  const[selBk,setSelBk]=useState(null);
  const[ovExp,setOvExp]=useState({});
  const[bkMsg,setBkMsg]=useState(null);
  const fRef=useRef();
  const iRef=useRef();
  const eiRef=useRef();

  const[banks,setBanks]=useState(IBK);
  const[cash,setCash]=useState(ICS);
  const[assets,setAssets]=useState(IAS);
  const[loans,setLoans]=useState(ILN);
  const[cats,setCats]=useState(IC);
  const[txs,setTxs]=useState(ITX);
  const[budgets,setBudgets]=useState(IBG);
  const [budgetSettings, setBudgetSettings] = useState({threshold:3000,allocations:[{id:1,name:"المصاريف",icon:"🛒",color:"#ef4444",pct:30},{id:2,name:"الطوارئ",icon:"🚨",color:"#f59e0b",pct:20},{id:3,name:"الاستثمار",icon:"📈",color:"#10b981",pct:30},{id:4,name:"التقاعد",icon:"🏦",color:"#6366f1",pct:20}]});
  const [editAlloc, setEditAlloc] = useState(null);

  // ── Supabase sync ─────────────────────────────────────────────────────────
  const saveToDb = async (key, data) => {
    try {
      await supabase.from('app_data').upsert({id:key, data: data});
    } catch(e) {}
  };
  const loadFromDb = async (key, fallback, setter) => {
    try {
      const {data} = await supabase.from('app_data').select('data').eq('id',key).single();
      if(data?.data) setter(data.data);
    } catch(e) {}
  };
    try {
      await supabase.from(table).upsert({id:'main', data: JSON.stringify(data)});
    } catch(e) {}
  };
  const loadFromDb = async (table, fallback, setter) => {
    try {
      const {data} = await supabase.from(table).select('data').eq('id','main').single();
      if(data?.data) setter(JSON.parse(data.data));
    } catch(e) {}
  };

  // Load from Supabase on startup
  useEffect(()=>{
    loadFromDb('banks', IBK, setBanks);
    loadFromDb('cash_accounts', ICS, setCash);
    loadFromDb('assets', IAS, setAssets);
    loadFromDb('loans', ILN, setLoans);
    loadFromDb('categories', IC, setCats);
    loadFromDb('transactions', ITX, setTxs);
    loadFromDb('settings', null, (d)=>{
      if(d?.budgetSettings) setBudgetSettings(d.budgetSettings);
    });
  },[]);

  // Save to Supabase on every change
  useEffect(()=>{saveToDb('banks', banks);},[banks]);
  useEffect(()=>{saveToDb('cash_accounts', cash);},[cash]);
  useEffect(()=>{saveToDb('assets', assets);},[assets]);
  useEffect(()=>{saveToDb('loans', loans);},[loans]);
  useEffect(()=>{saveToDb('categories', cats);},[cats]);
  useEffect(()=>{saveToDb('transactions', txs);},[txs]);
  useEffect(()=>{saveToDb('settings', {budgetSettings});},[budgetSettings]);

  const allAcc=[
    ...banks.flatMap(b=>b.accounts.map(a=>({...a,bn:b.name,bid:b.id,key:`b-${b.id}-${a.id}`,ref:{k:"bank",bid:b.id,aid:a.id}}))),
    ...cash.map(c=>({...c,bn:c.type,key:`c-${c.id}`,ref:{k:"cash",cid:c.id}})),
  ];
  const totBal=allAcc.reduce((s,a)=>s+(a.balance||0),0);
  const totAst=assets.reduce((s,a)=>s+(a.value||0),0);
  const totGiv=loans.filter(l=>l.kind==="أعطيت").reduce((s,l)=>s+l.remaining,0);
  const totOwd=loans.filter(l=>l.kind==="أخذت").reduce((s,l)=>s+l.remaining,0);
  const mInc=txs.filter(t=>t.type==="income"&&t.date.startsWith(MONTH)).reduce((s,t)=>s+t.amount,0);
  const mExp=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)).reduce((s,t)=>s+t.amount,0);

  const gc=(tp,id)=>cats[tp]?.find(c=>c.id===id);
  const gs=(tp,cid,sid)=>gc(tp,cid)?.subs?.find(s=>s.id===sid);
  const tl=t=>{const tp=t.type==="income"?"income":"expense";const c=gc(tp,t.catId);const s=gs(tp,t.catId,t.subId);return{cn:c?.name||"—",sn:s?.name||"",ic:c?.ci||c?.icon||"📌",hi:!!c?.ci,col:c?.color||"#475569"};};
  const al=ref=>{if(!ref)return"";if(ref.k==="bank"){const b=banks.find(x=>x.id===ref.bid);const a=b?.accounts.find(x=>x.id===ref.aid);return`${b?.name} - ${a?.name}`;}if(ref.k==="cash"){return cash.find(x=>x.id===ref.cid)?.name;}return"";};

  const expByCat=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)).reduce((acc,t)=>{const c=gc("expense",t.catId);const k=c?.name||"أخرى";acc[k]=(acc[k]||0)+t.amount;return acc;},{});
  const pie=Object.entries(expByCat).map(([name,value])=>({name,value}));
  const chart=Array.from({length:6},(_,i)=>{const d=new Date(2026,4-i,1);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;return{lbl:d.toLocaleString("ar-MA",{month:"short"}),inc:txs.filter(t=>t.type==="income"&&t.date.startsWith(k)).reduce((s,t)=>s+t.amount,0),exp:txs.filter(t=>t.type==="expense"&&t.date.startsWith(k)).reduce((s,t)=>s+t.amount,0)};}).reverse();

  const om=(t,x={})=>{setForm(x);setModal(t);};
  const cm=()=>{setModal(null);setForm({});};
  const F=(k,v)=>setForm(f=>({...f,[k]:v}));
  const showErr=m=>{setErr(m);setTimeout(()=>setErr(null),3500);};
  const ask=(t,id,lbl,ex=null)=>setCd({t,id,lbl,ex});
  const rImg=(file,cb)=>{const r=new FileReader();r.onload=e=>cb(e.target.result);r.readAsDataURL(file);};

  const updBal=(ref,amt,type,dir)=>{
    const sign=type==="income"?1:-1;
    const d=dir==="add"?sign*amt:-sign*amt;
    if(ref.k==="bank")setBanks(p=>p.map(b=>b.id===ref.bid?{...b,accounts:b.accounts.map(a=>a.id===ref.aid?{...a,balance:a.balance+d}:a)}:b));
    if(ref.k==="cash")setCash(p=>p.map(c=>c.id===ref.cid?{...c,balance:c.balance+d}:c));
  };

  const addTx=()=>{
    if(!form.amount||!form.catId||!form.akey)return;
    const acc=allAcc.find(a=>a.key===form.akey);if(!acc)return;
    const tx={id:uid(),type:form.txType||"expense",amount:parseFloat(form.amount),catId:parseInt(form.catId),subId:form.subId?parseInt(form.subId):null,desc:form.desc||"",date:form.date||new Date().toISOString().split("T")[0],pm:form.pm||"نقدي",ref:acc.ref};
    setTxs(p=>[tx,...p]);
    updBal(acc.ref,tx.amount,tx.type,"add");
    cm();
  };
  const delTx=(id)=>{
    const t=txs.find(x=>x.id===id);if(!t)return;
    updBal(t.ref,t.amount,t.type,"remove");
    setTxs(p=>p.filter(x=>x.id!==id));
  };
  const saveTxEdit=()=>{
    if(!ei||!ei.amount)return;
    const old=txs.find(x=>x.id===ei.id);if(!old)return;
    const diff=parseFloat(ei.amount)-old.amount;
    const sign=old.type==="income"?1:-1;
    if(old.ref.k==="bank")setBanks(p=>p.map(b=>b.id===old.ref.bid?{...b,accounts:b.accounts.map(a=>a.id===old.ref.aid?{...a,balance:a.balance+sign*diff}:a)}:b));
    if(old.ref.k==="cash")setCash(p=>p.map(c=>c.id===old.ref.cid?{...c,balance:c.balance+sign*diff}:c));
    setTxs(p=>p.map(x=>x.id===ei.id?{...x,amount:parseFloat(ei.amount),desc:ei.desc??x.desc,date:ei.date||x.date,pm:ei.pm||x.pm||"نقدي",catId:ei.catId?parseInt(ei.catId):x.catId,subId:ei.subId?parseInt(ei.subId):null}:x));
    cm();
  };

  const addBank=()=>{if(!form.name)return;setBanks(p=>[...p,{id:uid(),name:form.name,address:form.addr||"",accounts:[]}]);cm();};
  const addBAcc=()=>{if(!form.type||!form.name||!selBk)return;setBanks(p=>p.map(b=>b.id===selBk?{...b,accounts:[...b.accounts,{id:uid(),type:form.type,name:form.name,balance:parseFloat(form.bal||0),color:form.color||"#10b981"}]}:b));cm();};
  const edBAcc=(bid,aid,d)=>setBanks(p=>p.map(b=>b.id===bid?{...b,accounts:b.accounts.map(a=>a.id===aid?{...a,...d}:a)}:b));
  const addCash=()=>{if(!form.name)return;setCash(p=>[...p,{id:uid(),type:form.type||"نقدية",name:form.name,balance:parseFloat(form.bal||0),color:form.color||"#f59e0b"}]);cm();};
  const addAst=()=>{if(!form.name||!form.val)return;setAssets(p=>[...p,{id:uid(),type:form.type||"أخرى",name:form.name,value:parseFloat(form.val),color:form.color||"#14b8a6"}]);cm();};
  const addLoan=()=>{if(!form.person||!form.amount)return;setLoans(p=>[...p,{id:uid(),kind:form.kind||"أعطيت",person:form.person,amount:parseFloat(form.amount),remaining:parseFloat(form.amount),date:form.date||new Date().toISOString().split("T")[0],note:form.note||"",wi:!!form.wi,interest:parseFloat(form.irate||0),inst:!!form.inst,minst:parseFloat(form.minst||0)}]);cm();};
  const payLoan=(id,v)=>setLoans(p=>p.map(l=>l.id===id?{...l,remaining:Math.max(0,l.remaining-parseFloat(v||0))}:l));

  const addMCat=(ct)=>{if(!form.cn)return;if(cats[ct].some(c=>c.name===form.cn)){showErr("⛔ التصنيف موجود");return;}setCats(p=>({...p,[ct]:[...p[ct],{id:uid(),name:form.cn,icon:form.em||"📌",color:form.color||"#10b981",ci:form.ci||null,subs:[]}]}));cm();};
  const edMCat=(ct,id,d)=>setCats(p=>({...p,[ct]:p[ct].map(c=>c.id===id?{...c,...d}:c)}));
  const addSCat=(ct,cid)=>{if(!form.sn)return;const c=cats[ct].find(x=>x.id===cid);if(c?.subs.some(s=>s.name===form.sn)){showErr("⛔ الفرع موجود");return;}setCats(p=>({...p,[ct]:p[ct].map(c=>c.id===cid?{...c,subs:[...c.subs,{id:uid(),name:form.sn}]}:c)}));cm();};
  const edSCat=(ct,cid,sid,nm)=>setCats(p=>({...p,[ct]:p[ct].map(c=>c.id===cid?{...c,subs:c.subs.map(s=>s.id===sid?{...s,name:nm}:s)}:c)}));

  const addBudget=()=>{if(!form.catId||!form.limit)return;setBudgets(p=>[...p,{id:uid(),catId:parseInt(form.catId),limit:parseFloat(form.limit),month:MONTH}]);cm();};
  const addSaving=()=>{if(!form.name||!form.target)return;setSavings(p=>[...p,{id:uid(),name:form.name,target:parseFloat(form.target),saved:parseFloat(form.init||0),color:form.color||"#6366f1",icon:form.icon||"🎯"}]);cm();};
  const addDep=()=>{if(!form.amount||!selSv)return;setSavings(p=>p.map(s=>s.id===selSv.id?{...s,saved:Math.min(s.saved+parseFloat(form.amount),s.target)}:s));cm();setSelSv(null);};

  const doDel=()=>{
    if(!cd)return;const{t,id,ex}=cd;
    if(t==="bank"){const b=banks.find(x=>x.id===id);if(b?.accounts.some(a=>a.balance>0)){showErr("⛔ فيه حسابات برصيد");setCd(null);return;}setBanks(p=>p.filter(x=>x.id!==id));}
    if(t==="bacc"){const b=banks.find(x=>x.id===ex);const a=b?.accounts.find(x=>x.id===id);if((a?.balance||0)>0){showErr("⛔ الحساب فيه رصيد");setCd(null);return;}setBanks(p=>p.map(b=>b.id===ex?{...b,accounts:b.accounts.filter(a=>a.id!==id)}:b));}
    if(t==="cash"){const c=cash.find(x=>x.id===id);if((c?.balance||0)>0){showErr("⛔ الكاش فيه رصيد");setCd(null);return;}setCash(p=>p.filter(x=>x.id!==id));}
    if(t==="ast")setAssets(p=>p.filter(x=>x.id!==id));
    if(t==="loan"){const l=loans.find(x=>x.id===id);if((l?.remaining||0)>0){showErr("⛔ القرض لم يُسدد");setCd(null);return;}setLoans(p=>p.filter(x=>x.id!==id));}
    if(t==="tx"){delTx(id);setCd(null);return;}
    if(t==="mcat"){if(txs.some(tx=>tx.catId===id)){showErr("⛔ التصنيف مستخدم");setCd(null);return;}setCats(p=>({...p,[ex]:p[ex].filter(c=>c.id!==id)}));}
    if(t==="scat"){if(txs.some(tx=>tx.subId===id)){showErr("⛔ الفرع مستخدم");setCd(null);return;}setCats(p=>({...p,[ex.ct]:p[ex.ct].map(c=>c.id===ex.cid?{...c,subs:c.subs.filter(s=>s.id!==id)}:c)}));}
    setCd(null);
  };

  const expData=()=>{const d=JSON.stringify({banks,cash,assets,loans,cats,txs,budgets,savings},null,2);const b=new Blob([d],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="محفظتي.json";a.click();URL.revokeObjectURL(u);setBkMsg("تم التحميل ✅");setTimeout(()=>setBkMsg(null),3000);};
  const impData=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.banks)setBanks(d.banks);if(d.cash)setCash(d.cash);if(d.assets)setAssets(d.assets);if(d.loans)setLoans(d.loans);if(d.cats)setCats(d.cats);if(d.txs)setTxs(d.txs);if(d.budgets)setBudgets(d.budgets);if(d.savings)setSavings(d.savings);setBkMsg("تم الاستيراد ✅");}catch{setBkMsg("خطأ ❌");}setTimeout(()=>setBkMsg(null),3000);};r.readAsText(file);e.target.value="";};

  const NAV=[{id:"dashboard",icon:<Home size={18}/>,lbl:"الرئيسية"},{id:"transactions",icon:<Wallet size={18}/>,lbl:"المعاملات"},{id:"budget",icon:<Target size={18}/>,lbl:"الميزانية"},{id:"reports",icon:<BarChart3 size={18}/>,lbl:"التقارير"}];

  const Ico=({src,fb,sz=20})=>src?<img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:sz}}>{fb}</span>;
  const Dot=({color})=><div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>;
  const Btn=({label,onClick,bg="#1e2548",color="#94a3b8",style={}})=><button onClick={onClick} style={{background:bg,border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color,fontSize:11,fontFamily:"Cairo",...style}}>{label}</button>;

  const PmBtns=({val,onChange})=>(
    <div style={{display:"flex",gap:8}}>
      {["نقدي","كريدي"].map(m=><button key={m} onClick={()=>onChange(m)} style={{flex:1,padding:10,border:"2px solid",borderColor:val===m?(m==="نقدي"?"#10b981":"#f59e0b"):"#1e2548",borderRadius:10,background:val===m?(m==="نقدي"?"#10b98122":"#f59e0b22"):"transparent",color:val===m?(m==="نقدي"?"#10b981":"#f59e0b"):"#475569",fontFamily:"Cairo",fontWeight:700,cursor:"pointer",fontSize:13}}>{m==="نقدي"?"💵 نقدي":"💳 كريدي"}</button>)}
    </div>
  );

  const CatSection=({catType})=>{
    const isE=catType==="expense";const ac=isE?"#ef4444":"#10b981";
    return <>
      <div className="mi" onClick={()=>setDp("settings")}><ChevronRight size={16}/> رجوع</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
        <span style={{fontWeight:700,fontSize:15,color:"white"}}>{isE?"🔴 النفقات":"🟢 الدخل"}</span>
        <button style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:"white",fontFamily:"Cairo",fontSize:12,fontWeight:700}} onClick={()=>om("addMCat",{catType})}><Plus size={13}/> إضافة</button>
      </div>
      {cats[catType].map(cat=>(
        <div key={cat.id}>
          <div className="fch">
            <div style={{width:38,height:38,borderRadius:8,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
              <Ico src={cat.ci} fb={cat.icon}/>
            </div>
            <span style={{flex:1,fontWeight:700,fontSize:14,color:"white"}}>{cat.name}</span>
            <Btn label="تعديل" bg="rgba(255,255,255,.15)" color="white" onClick={e=>{e.stopPropagation();setEi({...cat,catType});om("edMCat");}}/>
            <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:6,padding:"3px 6px",cursor:"pointer",marginRight:4}} onClick={e=>{e.stopPropagation();ask("mcat",cat.id,cat.name,catType);}}><Trash2 size={11} color="#fca5a5"/></button>
          </div>
          {cat.subs.map(s=>{
            const used=txs.some(t=>t.subId===s.id);
            return <div key={s.id} className="fsi">
              <Dot color="rgba(255,255,255,.35)"/>
              <span style={{flex:1,fontSize:14,color:"rgba(255,255,255,.85)"}}>{s.name}</span>
              {used&&<span style={{fontSize:10,color:"#fcd34d"}}>●</span>}
              <Btn label="تعديل" bg="rgba(255,255,255,.12)" color="white" style={{marginLeft:4}} onClick={()=>{setEi({...s,catType,catId:cat.id});om("edSCat");}}/>
              <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:6,padding:"3px 6px",cursor:"pointer",marginRight:3}} onClick={()=>ask("scat",s.id,s.name,{ct:catType,cid:cat.id})}><Trash2 size={11} color="#fca5a5"/></button>
            </div>;
          })}
          <div style={{padding:"6px 14px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
            <button style={{background:"rgba(255,255,255,.06)",border:"1px dashed rgba(255,255,255,.2)",borderRadius:8,padding:"7px 14px",cursor:"pointer",color:"rgba(255,255,255,.55)",fontSize:12,fontFamily:"Cairo",width:"100%"}} onClick={()=>om("addSCat",{catType,catId:cat.id,catName:cat.name})}>+ إضافة فرع لـ {cat.name}</button>
          </div>
        </div>
      ))}
    </>;
  };

  const AccCard=({sec,icon,label,color,amount,count,children})=>(
    <div style={{...S.card,padding:0,overflow:"hidden",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[sec]:!p[sec]}))}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px"}}>
        <div style={{width:44,height:44,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{label}</div><div style={{fontSize:11,color:"#475569",marginTop:2}}>{count}</div></div>
        <div style={{fontSize:17,fontWeight:900,color,marginLeft:8}}>{fmt(amount)}</div>
        <div style={{color:"#475569",fontSize:22,transform:ovExp[sec]?"rotate(90deg)":"none",transition:"transform .2s"}}>›</div>
      </div>
      {ovExp[sec]&&<div style={{borderTop:"1px solid #1e2548",padding:"12px 16px",background:"#0c0f1e55"}}>{children}</div>}
    </div>
  );

  return (
    <div dir="rtl" style={{fontFamily:"'Cairo',sans-serif",background:"linear-gradient(160deg,#0c0f1e,#0e1428,#0b1015)",minHeight:"100vh",color:"#f1f5f9",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <input ref={fRef} type="file" accept=".json" style={{display:"none"}} onChange={impData}/>
      <input ref={iRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])rImg(e.target.files[0],b=>F("ci",b));e.target.value="";}}/>
      <input ref={eiRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])rImg(e.target.files[0],b=>setEi(p=>({...p,ci:b})));e.target.value="";}}/>
      <div className={`ovl${drw?" op":""}`} onClick={()=>setDrw(false)}/>

      {/* DRAWER */}
      <div className={`drw${drw?" op":""}`} dir="rtl">
        <div style={{padding:"20px 14px 80px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:0,padding:"0 0 14px",borderBottom:"1px solid rgba(255,255,255,.15)"}}>
            <span style={{fontWeight:900,fontSize:18,color:"white"}}>القائمة</span>
            <button onClick={()=>setDrw(false)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 8px",color:"white",cursor:"pointer"}}><X size={18}/></button>
          </div>
          {dp===null&&<>
            <div className="mi" onClick={()=>setDp("settings")}><Settings size={18}/> الإعدادات <ChevronLeft size={14} style={{marginRight:"auto"}}/></div>
            <div className="mi" onClick={()=>setDp("cloud")}><Cloud size={18}/> السحابة <ChevronLeft size={14} style={{marginRight:"auto"}}/></div>
          </>}
          {dp==="settings"&&<>
            <div className="mi" onClick={()=>setDp(null)}><ChevronRight size={16}/> رجوع</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",padding:"8px 14px",fontWeight:700}}>الأموال والممتلكات</div>
            {[{id:"banks",i:<Building2 size={15}/>,l:"البنوك"},{id:"cash",i:<Coins size={15}/>,l:"الكاش"},{id:"assets",i:<Package size={15}/>,l:"الممتلكات"},{id:"loans",i:<HandCoins size={15}/>,l:"السلف والقروض"}].map(m=>(
              <div key={m.id} className="si" onClick={()=>setDp(m.id)}>{m.i} {m.l}<ChevronLeft size={12} style={{marginRight:"auto"}}/></div>
            ))}
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",padding:"10px 14px 6px",fontWeight:700}}>التصنيفات</div>
            <div className="si" onClick={()=>setDp("expCat")}><span>🔴</span> تصنيفات النفقات<ChevronLeft size={12} style={{marginRight:"auto"}}/></div>
            <div className="si" onClick={()=>setDp("incCat")}><span>🟢</span> تصنيفات الدخل<ChevronLeft size={12} style={{marginRight:"auto"}}/></div>
          </>}
          {dp==="banks"&&<>
            <div className="mi" onClick={()=>setDp("settings")}><ChevronRight size={16}/> رجوع</div>
            <div style={{...S.row,margin:"8px 0 12px"}}><span style={{fontWeight:700,color:"white"}}>البنوك</span><button style={S.btn("#10b981",false)} onClick={()=>om("addBank")}><Plus size={14}/></button></div>
            {banks.map(b=>(
              <div key={b.id} style={{...S.card,marginBottom:10,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}>
                <div style={{...S.row,marginBottom:8}}>
                  <div><div style={{fontWeight:700,fontSize:14,color:"white"}}>🏦 {b.name}</div>{b.address&&<div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>{b.address}</div>}</div>
                  <div style={{display:"flex",gap:6}}>
                    <button style={S.btn("#6366f1",false)} onClick={()=>{setSelBk(b.id);om("addBAcc");}}><Plus size={12}/></button>
                    <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer"}} onClick={()=>ask("bank",b.id,b.name)}><Trash2 size={13} color="#fca5a5"/></button>
                  </div>
                </div>
                {b.accounts.map(a=>(
                  <div key={a.id} className="acc-row">
                    <div style={{display:"flex",alignItems:"center",gap:8}}><Dot color={a.color}/><div><div style={{fontSize:13,fontWeight:600}}>{a.name}</div><div style={{fontSize:11,color:"#475569"}}>{a.type}</div></div></div>
                    <div style={{display:"flex",gap:6}}>
                      <Btn label="تعديل" onClick={()=>{setSelBk(b.id);setEi({...a,_bid:b.id});om("edBAcc");}}/>
                      <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 7px",cursor:"pointer"}} onClick={()=>ask("bacc",a.id,a.name,b.id)}><Trash2 size={12} color="#fca5a5"/></button>
                    </div>
                  </div>
                ))}
                {b.accounts.length===0&&<div style={{textAlign:"center",color:"rgba(255,255,255,.4)",fontSize:12,padding:8}}>أضف حساباً</div>}
              </div>
            ))}
          </>}
          {dp==="cash"&&<>
            <div className="mi" onClick={()=>setDp("settings")}><ChevronRight size={16}/> رجوع</div>
            <div style={{...S.row,margin:"8px 0 12px"}}><span style={{fontWeight:700,color:"white"}}>الكاش</span><button style={S.btn("#f59e0b",false)} onClick={()=>om("addCash")}><Plus size={14}/></button></div>
            {cash.map(c=>(
              <div key={c.id} className="acc-row" style={{marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><Dot color={c.color}/><div><div style={{fontWeight:600,fontSize:14}}>{c.name}</div><div style={{fontSize:11,color:"#475569"}}>{c.type}</div></div></div>
                <div style={{display:"flex",gap:6}}>
                  <Btn label="تعديل" onClick={()=>{setEi(c);om("edCash");}}/>
                  <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 7px",cursor:"pointer"}} onClick={()=>ask("cash",c.id,c.name)}><Trash2 size={13} color="#fca5a5"/></button>
                </div>
              </div>
            ))}
          </>}
          {dp==="assets"&&<>
            <div className="mi" onClick={()=>setDp("settings")}><ChevronRight size={16}/> رجوع</div>
            <div style={{...S.row,margin:"8px 0 12px"}}><span style={{fontWeight:700,color:"white"}}>الممتلكات</span><button style={S.btn("#14b8a6",false)} onClick={()=>om("addAst")}><Plus size={14}/></button></div>
            {assets.map(a=>(
              <div key={a.id} className="acc-row" style={{marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><Dot color={a.color}/><div><div style={{fontWeight:600,fontSize:14}}>{a.name}</div><div style={{fontSize:11,color:"#475569"}}>{a.type}</div></div></div>
                <div style={{display:"flex",gap:6}}>
                  <Btn label="تعديل" onClick={()=>{setEi(a);om("edAst");}}/>
                  <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 7px",cursor:"pointer"}} onClick={()=>ask("ast",a.id,a.name)}><Trash2 size={13} color="#fca5a5"/></button>
                </div>
              </div>
            ))}
          </>}
          {dp==="loans"&&<>
            <div className="mi" onClick={()=>setDp("settings")}><ChevronRight size={16}/> رجوع</div>
            <div style={{...S.row,margin:"8px 0 8px"}}><span style={{fontWeight:700,color:"white"}}>السلف والقروض</span><button style={S.btn("#8b5cf6",false)} onClick={()=>om("addLoan")}><Plus size={14}/></button></div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <div style={{...S.card,flex:1,textAlign:"center",padding:"10px 6px",background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}><div style={{fontSize:10,color:"#10b981"}}>أعطيت</div><div style={{fontSize:13,fontWeight:700,color:"#10b981"}}>{fmt(totGiv)}</div></div>
              <div style={{...S.card,flex:1,textAlign:"center",padding:"10px 6px",background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}><div style={{fontSize:10,color:"#ef4444"}}>دَين</div><div style={{fontSize:13,fontWeight:700,color:"#ef4444"}}>{fmt(totOwd)}</div></div>
            </div>
            {loans.map(l=>(
              <div key={l.id} style={{...S.card,marginBottom:8,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}>
                <div style={{...S.row,marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{background:l.kind==="أعطيت"?"#10b98122":"#ef444422",color:l.kind==="أعطيت"?"#10b981":"#ef4444",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{l.kind}</span>
                    <span style={{fontWeight:700,fontSize:14,color:"white"}}>{l.person}</span>
                  </div>
                  <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 7px",cursor:"pointer"}} onClick={()=>ask("loan",l.id,l.person)}><Trash2 size={13} color="#fca5a5"/></button>
                </div>
                <div style={{...S.row}}>
                  <div><div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>الأصل: {fmt(l.amount)}</div><div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>المتبقي: <strong style={{color:"#f59e0b"}}>{fmt(l.remaining)}</strong></div></div>
                  <div>{l.wi&&<div style={{fontSize:11,color:"#f97316"}}>فائدة {l.interest}%</div>}{l.inst&&<div style={{fontSize:11,color:"#6366f1"}}>قسط: {fmt(l.minst)}/شهر</div>}</div>
                </div>
                {l.note&&<div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginTop:4}}>📝 {l.note}</div>}
                <div style={{marginTop:8,display:"flex",gap:6}}>
                  <input placeholder="سداد..." style={{...S.inp,flex:1,padding:"7px 10px",fontSize:12}} id={`lp${l.id}`} type="number"/>
                  <button style={S.btn("#10b981",false)} onClick={()=>{const el=document.getElementById(`lp${l.id}`);payLoan(l.id,el.value);el.value="";}}>سدد</button>
                </div>
              </div>
            ))}
          </>}
          {dp==="expCat"&&<CatSection catType="expense"/>}
          {dp==="incCat"&&<CatSection catType="income"/>}
          {dp==="cloud"&&<>
            <div className="mi" onClick={()=>setDp(null)}><ChevronRight size={16}/> رجوع</div>
            <div style={{fontWeight:700,color:"white",margin:"12px 0"}}>السحابة والنسخ</div>
            {bkMsg&&<div style={{background:"rgba(16,185,129,.2)",border:"1px solid #10b981",borderRadius:10,padding:"10px",marginBottom:12,fontSize:13,color:"#10b981"}}>{bkMsg}</div>}
            <div style={{...S.card,marginBottom:10,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}><div style={{fontWeight:600,color:"white",marginBottom:8}}>📤 تصدير</div><button style={S.btn("#10b981")} onClick={expData}>تحميل النسخة</button></div>
            <div style={{...S.card,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}><div style={{fontWeight:600,color:"white",marginBottom:8}}>📥 استيراد</div><button style={S.btn("#6366f1")} onClick={()=>fRef.current.click()}>اختر ملف JSON</button></div>
          </>}
        </div>
      </div>

      {/* HEADER */}
      <div style={{padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:12,color:"#475569"}}>{new Date().toLocaleString("ar-MA",{month:"long",year:"numeric"})}</div><div style={{fontSize:22,fontWeight:900}}>محفظتي 💰</div></div>
        <button onClick={()=>{setDrw(true);setDp(null);}} style={{background:"#2e8fa8",border:"none",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:6,cursor:"pointer",color:"white",fontFamily:"Cairo",fontSize:13,fontWeight:700}}>
          <Menu size={16}/> القائمة
        </button>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 90px",display:"flex",flexDirection:"column",gap:14}}>

        {page==="dashboard"&&<>
          <div style={{background:"linear-gradient(135deg,#10b981,#059669)",borderRadius:20,padding:24,position:"relative",overflow:"hidden",cursor:"pointer"}} onClick={()=>setPage("overview")}>
            <div style={{position:"absolute",top:-20,left:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
            <div style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,.2)",borderRadius:8,padding:"3px 10px",fontSize:11,color:"white",fontWeight:700}}>اضغط للتفاصيل ←</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.8)",marginBottom:6}}>إجمالي الرصيد</div>
            <div style={{fontSize:30,fontWeight:900,color:"white"}}>{fmt(totBal)}</div>
          </div>

          {/* Budget Widget */}
          {(()=>{
            const threshold = budgetSettings.threshold;
            const expAlloc = budgetSettings.allocations.find(a=>a.name==="المصاريف");
            const expPct = expAlloc?.pct||30;
            const budgetForExp = mInc<=threshold ? mInc : threshold + (mInc-threshold)*(expPct/100);
            const remaining = budgetForExp - mExp;
            const pct = budgetForExp>0 ? Math.min((mExp/budgetForExp)*100,100) : 0;
            const color = pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
            return(
              <div style={{...S.card,cursor:"pointer"}} onClick={()=>setPage("budget")}>
                <div style={{...S.row,marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:38,height:38,borderRadius:10,background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛒</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>ميزانية المصاريف</div>
                      <div style={{fontSize:11,color:"#475569"}}>الشهر الحالي</div>
                    </div>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,color:"#475569"}}>الباقي</div>
                    <div style={{fontSize:18,fontWeight:900,color:remaining>=0?color:"#ef4444"}}>{fmt(Math.abs(remaining))}</div>
                  </div>
                </div>
                <div className="pbar">
                  <div className="pfill" style={{width:pct+"%",background:color}}/>
                </div>
                <div style={{...S.row,marginTop:6}}>
                  <span style={{fontSize:11,color:"#475569"}}>مصروف: {fmt(mExp)}</span>
                  <span style={{fontSize:11,color:"#475569"}}>الميزانية: {fmt(budgetForExp)}</span>
                </div>
                {remaining<0&&<div style={{marginTop:8,padding:"6px 10px",background:"#ef444415",borderRadius:8,fontSize:12,color:"#ef4444",fontWeight:700,textAlign:"center"}}>⚠️ تجاوزت الميزانية بـ {fmt(Math.abs(remaining))}</div>}
              </div>
            );
          })()}
          <div style={{display:"flex",gap:8}}>
            <button style={{...S.btn("#ef4444"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>om("addTx",{txType:"expense"})}>+ مصروف</button>
            <button style={{...S.btn("#10b981"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>om("addTx",{txType:"income"})}>+ دخل</button>
          </div>
          <div style={S.card}>
            <div style={{...S.row,marginBottom:12}}><span style={{fontWeight:700}}>آخر المعاملات</span><button style={{background:"none",border:"none",color:"#10b981",fontSize:12,cursor:"pointer",fontFamily:"Cairo"}} onClick={()=>setPage("transactions")}>عرض الكل ←</button></div>
            {txs.slice(0,5).map(t=>{const{cn,sn,ic,hi}=tl(t);return(
              <div key={t.id} className="tx">
                <div style={{width:38,height:38,borderRadius:10,background:t.type==="income"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Ico src={hi?ic:null} fb={ic} sz={18}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13,fontWeight:600}}>{t.desc||cn}</span>{t.pm==="كريدي"&&<span style={{fontSize:9,background:"#f59e0b22",color:"#f59e0b",padding:"1px 6px",borderRadius:10,fontWeight:700}}>💳</span>}</div>
                  <div style={{fontSize:11,color:"#475569"}}>{t.date}{sn&&` • ${sn}`}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  <Btn label="✏️" onClick={()=>{setEi({...t,amount:t.amount.toString(),catId:t.catId?.toString(),subId:t.subId?.toString()});om("edTx");}}/>
                </div>
              </div>
            );})}
          </div>
        </>}

        {page==="overview"&&<>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button style={{...S.btn("#1e2548",false),padding:"8px 12px",fontSize:13}} onClick={()=>setPage("dashboard")}>← رجوع</button>
            <span style={{fontWeight:800,fontSize:17}}>الملخص المالي</span>
          </div>
          <div style={{background:"linear-gradient(135deg,#1e2548,#252d5e)",borderRadius:18,padding:20,border:"1px solid #2a3268",textAlign:"center"}}>
            <div style={{fontSize:11,color:"#8891b8",marginBottom:6}}>صافي الثروة الكلية</div>
            <div style={{fontSize:34,fontWeight:900,color:"#10b981"}}>{fmt(totBal+totAst-totOwd)}</div>
            <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:12}}>
              <div><div style={{fontSize:10,color:"#8891b8"}}>السيولة</div><div style={{fontSize:14,fontWeight:700}}>{fmt(totBal)}</div></div>
              <div style={{width:1,background:"#2a3268"}}/>
              <div><div style={{fontSize:10,color:"#8891b8"}}>الممتلكات</div><div style={{fontSize:14,fontWeight:700,color:"#14b8a6"}}>{fmt(totAst)}</div></div>
              <div style={{width:1,background:"#2a3268"}}/>
              <div><div style={{fontSize:10,color:"#8891b8"}}>الديون</div><div style={{fontSize:14,fontWeight:700,color:"#ef4444"}}>{fmt(totOwd)}</div></div>
            </div>
          </div>

          <AccCard sec="banks" icon="🏦" label="البنوك" color="#10b981" amount={banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0)} count={`${banks.length} بنك · ${banks.reduce((s,b)=>s+b.accounts.length,0)} حساب`}>
            {banks.map(b=>(
              <div key={b.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:"#171b32",borderRadius:8,marginBottom:6}}>
                  <span style={{fontSize:12,color:"#8891b8",fontWeight:700}}>🏦 {b.name}</span>
                  <span style={{fontSize:13,fontWeight:800,color:"#10b981"}}>{fmt(b.accounts.reduce((s,a)=>s+a.balance,0))}</span>
                </div>
                {b.accounts.map(a=>(
                  <div key={a.id} className="acc-row">
                    <div style={{display:"flex",alignItems:"center",gap:8}}><Dot color={a.color}/><div><div style={{fontSize:13,fontWeight:600}}>{a.name}</div><div style={{fontSize:11,color:"#475569"}}>{a.type}</div></div></div>
                    <span style={{fontSize:15,fontWeight:800,color:a.color}}>{fmt(a.balance)}</span>
                  </div>
                ))}
              </div>
            ))}
          </AccCard>

          <AccCard sec="cash" icon="💵" label="الكاش" color="#f59e0b" amount={cash.reduce((s,c)=>s+c.balance,0)} count={`${cash.length} محفظة`}>
            {cash.map(c=>(
              <div key={c.id} className="acc-row" style={{marginBottom:5}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><Dot color={c.color}/><div><div style={{fontSize:13,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:"#475569"}}>{c.type}</div></div></div>
                <span style={{fontSize:15,fontWeight:800,color:c.color}}>{fmt(c.balance)}</span>
              </div>
            ))}
          </AccCard>

          <AccCard sec="assets" icon="🏠" label="الممتلكات" color="#14b8a6" amount={totAst} count={`${assets.length} ممتلك`}>
            {assets.map(a=>(
              <div key={a.id} className="acc-row" style={{marginBottom:5}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><Dot color={a.color}/><div><div style={{fontSize:13,fontWeight:600}}>{a.name}</div><div style={{fontSize:11,color:"#475569"}}>{a.type}</div></div></div>
                <span style={{fontSize:15,fontWeight:800,color:a.color}}>{fmt(a.value)}</span>
              </div>
            ))}
          </AccCard>

          {txs.some(t=>t.pm==="كريدي")&&(()=>{const ct=txs.filter(t=>t.pm==="كريدي");const tot=ct.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);return(
            <AccCard sec="credit" icon="💳" label="معاملات الكريدي" color="#f59e0b" amount={tot} count={`${ct.length} معاملة`}>
              {ct.map(t=>{const{cn,ic,hi,sn}=tl(t);return(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px",background:"#171b32",borderRadius:10,marginBottom:5,border:"1px solid #f59e0b33"}}>
                  <div style={{width:34,height:34,borderRadius:8,background:t.type==="income"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,overflow:"hidden",flexShrink:0}}><Ico src={hi?ic:null} fb={ic} sz={16}/></div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.desc||cn}</div><div style={{fontSize:11,color:"#475569"}}>{t.date}{sn&&` • ${sn}`}</div></div>
                  <span style={{fontSize:14,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                </div>
              );})}
            </AccCard>
          );})()}

          {loans.length>0&&(
            <AccCard sec="loans" icon="🤝" label="السلف والقروض" color="#8b5cf6" amount={totGiv+totOwd} count={`${loans.length} سلفة/قرض`}>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <div style={{flex:1,background:"#10b98115",border:"1px solid #10b98133",borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{fontSize:11,color:"#10b981"}}>أعطيت</div><div style={{fontSize:16,fontWeight:800,color:"#10b981"}}>{fmt(totGiv)}</div></div>
                <div style={{flex:1,background:"#ef444415",border:"1px solid #ef444433",borderRadius:10,padding:"10px",textAlign:"center"}}><div style={{fontSize:11,color:"#ef4444"}}>دَين</div><div style={{fontSize:16,fontWeight:800,color:"#ef4444"}}>{fmt(totOwd)}</div></div>
              </div>
              {loans.map(l=>(
                <div key={l.id} className="acc-row" style={{marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{background:l.kind==="أعطيت"?"#10b98122":"#ef444422",color:l.kind==="أعطيت"?"#10b981":"#ef4444",padding:"2px 8px",borderRadius:12,fontSize:11,fontWeight:700}}>{l.kind}</span><span style={{fontSize:13,fontWeight:600}}>{l.person}</span></div>
                  <span style={{fontSize:14,fontWeight:800,color:"#f59e0b"}}>{fmt(l.remaining)}</span>
                </div>
              ))}
            </AccCard>
          )}
        </>}

        {page==="transactions"&&<>
          <div style={{...S.row}}><span style={{fontWeight:700,fontSize:16}}>المعاملات</span><button style={{...S.btn(),width:"auto",padding:"8px 14px",fontSize:13}} onClick={()=>om("addTx",{txType:"expense"})}>+ جديد</button></div>
          <div style={{display:"flex",gap:8}}>
            {[["الدخل",mInc,"#10b981"],["المصاريف",mExp,"#ef4444"],["الصافي",mInc-mExp,mInc-mExp>=0?"#10b981":"#ef4444"]].map(([l,v,c])=>(
              <div key={l} style={{...S.card,flex:1,textAlign:"center",padding:"10px 4px"}}><div style={{fontSize:10,color:c}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:c}}>{fmt(Math.abs(v))}</div></div>
            ))}
          </div>
          <div style={S.card}>
            {txs.map(t=>{const{cn,sn,ic,hi}=tl(t);const ac=al(t.ref);return(
              <div key={t.id} className="tx">
                <div style={{width:40,height:40,borderRadius:12,background:t.type==="income"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,overflow:"hidden",flexShrink:0}}><Ico src={hi?ic:null} fb={ic}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13,fontWeight:600}}>{t.desc||cn}</span>{t.pm==="كريدي"&&<span style={{fontSize:9,background:"#f59e0b22",color:"#f59e0b",padding:"1px 6px",borderRadius:10,fontWeight:700}}>💳</span>}</div>
                  <div style={{fontSize:10,color:"#475569"}}>{t.date}{sn&&` • ${sn}`}{ac&&` • ${ac}`}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  <Btn label="✏️" onClick={()=>{setEi({...t,amount:t.amount.toString(),catId:t.catId?.toString(),subId:t.subId?.toString()});om("edTx");}}/>
                  <button style={{background:"#ef444415",border:"none",borderRadius:7,padding:"4px 7px",cursor:"pointer"}} onClick={()=>ask("tx",t.id,t.desc||cn)}><Trash2 size={12} color="#ef4444"/></button>
                </div>
              </div>
            );})}
          </div>
        </>}

        {page==="budget"&&(()=>{
          const threshold = budgetSettings.threshold;

          // Get all unique months from transactions
          const allMonths = [...new Set(txs.map(t=>t.date.slice(0,7)))].sort().reverse();

          // Calculate per month
          const monthData = allMonths.map(m=>{
            const inc = txs.filter(t=>t.type==="income"&&t.date.startsWith(m)).reduce((s,t)=>s+t.amount,0);
            const exp = txs.filter(t=>t.type==="expense"&&t.date.startsWith(m)).reduce((s,t)=>s+t.amount,0);
            const surplus = inc > threshold ? inc - threshold : 0;
            const expBudget = inc <= threshold ? inc : threshold + surplus*(budgetSettings.allocations.find(a=>a.name==="المصاريف")?.pct||30)/100;
            const allocs = budgetSettings.allocations.map(a=>({
              ...a,
              amt: surplus*(a.pct/100),
              spent: a.name==="المصاريف"?exp:0,
            }));
            return {m, inc, exp, surplus, expBudget, allocs, label: new Date(m+"-01").toLocaleString("ar-MA",{month:"long",year:"numeric"})};
          });

          // Totals
          const totInc = monthData.reduce((s,m)=>s+m.inc,0);
          const totExp = monthData.reduce((s,m)=>s+m.exp,0);
          const totExpBudget = monthData.reduce((s,m)=>s+m.expBudget,0);

          return <>
            <div style={{...S.row,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:16}}>الميزانية الذكية</span>
              <button style={{...S.btn("#2e8fa8",false),padding:"8px 14px",fontSize:13}} onClick={()=>om("budgetSettings")}>⚙️ الإعدادات</button>
            </div>

            {/* Overall summary */}
            <div style={{...S.card,background:"linear-gradient(135deg,#1e2548,#252d5e)",border:"1px solid #2a3268"}}>
              <div style={{fontSize:12,color:"#8891b8",marginBottom:10}}>ملخص كلي — كل الأوقات</div>
              <div style={{display:"flex",gap:10}}>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#10b981"}}>إجمالي الدخل</div>
                  <div style={{fontSize:16,fontWeight:900,color:"#10b981"}}>{fmt(totInc)}</div>
                </div>
                <div style={{width:1,background:"#2a3268"}}/>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#ef4444"}}>إجمالي المصاريف</div>
                  <div style={{fontSize:16,fontWeight:900,color:"#ef4444"}}>{fmt(totExp)}</div>
                </div>
                <div style={{width:1,background:"#2a3268"}}/>
                <div style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:10,color:totExpBudget-totExp>=0?"#f59e0b":"#ef4444"}}>الباقي</div>
                  <div style={{fontSize:16,fontWeight:900,color:totExpBudget-totExp>=0?"#f59e0b":"#ef4444"}}>{fmt(Math.abs(totExpBudget-totExp))}</div>
                </div>
              </div>
            </div>

            {/* Per month breakdown */}
            {monthData.length===0&&<div style={{...S.card,textAlign:"center",padding:30}}>
              <div style={{fontSize:40,marginBottom:10}}>💰</div>
              <div style={{fontSize:14,color:"#475569"}}>ما كاين معاملات — زيد دخل أو مصروف</div>
            </div>}

            {monthData.map(md=>{
              const pctExp = md.expBudget>0?Math.min((md.exp/md.expBudget)*100,100):0;
              const barColor = pctExp>90?"#ef4444":pctExp>70?"#f59e0b":"#10b981";
              return(
                <div key={md.m} style={{...S.card,padding:0,overflow:"hidden"}}>
                  {/* Month header */}
                  <div style={{background:"#171b32",padding:"12px 16px",borderBottom:"1px solid #1e2548"}}>
                    <div style={{...S.row}}>
                      <span style={{fontWeight:700,fontSize:14}}>{md.label}</span>
                      <span style={{fontSize:12,color:"#475569"}}>دخل: <strong style={{color:"#10b981"}}>{fmt(md.inc)}</strong></span>
                    </div>
                  </div>

                  <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
                    {/* Expense budget bar */}
                    <div>
                      <div style={{...S.row,marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:16}}>🛒</span>
                          <span style={{fontSize:13,fontWeight:700}}>المصاريف</span>
                          {md.inc<=threshold&&<span style={{fontSize:10,background:"#f59e0b22",color:"#f59e0b",padding:"1px 8px",borderRadius:10,fontWeight:700}}>دخل أساسي</span>}
                        </div>
                        <div style={{textAlign:"left"}}>
                          <span style={{fontSize:13,fontWeight:700,color:barColor}}>{fmt(md.exp)}</span>
                          <span style={{fontSize:11,color:"#475569"}}> / {fmt(md.expBudget)}</span>
                        </div>
                      </div>
                      <div className="pbar"><div className="pfill" style={{width:pctExp+"%",background:barColor}}/></div>
                      <div style={{...S.row,marginTop:5}}>
                        <span style={{fontSize:11,color:md.expBudget-md.exp>=0?"#475569":"#ef4444"}}>
                          {md.expBudget-md.exp>=0?`باقي: ${fmt(md.expBudget-md.exp)}`:`⚠️ تجاوز بـ ${fmt(md.exp-md.expBudget)}`}
                        </span>
                        <span style={{fontSize:11,color:barColor}}>{pctExp.toFixed(0)}%</span>
                      </div>
                    </div>

                    {/* Other allocations — only if surplus */}
                    {md.surplus>0&&<div style={{borderTop:"1px solid #1e2548",paddingTop:10}}>
                      <div style={{fontSize:11,color:"#475569",marginBottom:8}}>توزيع الفائض ({fmt(md.surplus)}):</div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {md.allocs.filter(a=>a.name!=="المصاريف").map(a=>(
                          <div key={a.id} style={{...S.row}}>
                            <div style={{display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontSize:15}}>{a.icon}</span>
                              <span style={{fontSize:13}}>{a.name}</span>
                              <span style={{fontSize:10,color:"#475569"}}>({a.pct}%)</span>
                            </div>
                            <span style={{fontSize:14,fontWeight:700,color:a.color}}>{fmt(a.amt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>}
                  </div>
                </div>
              );
            })}
          </>;
        })()}

        {page==="savings"&&<>
          <div style={{...S.row}}><span style={{fontWeight:700,fontSize:16}}>أهداف الادخار</span><button style={{...S.btn(),width:"auto",padding:"8px 14px",fontSize:13}} onClick={()=>om("addSaving")}>+ هدف</button></div>
          {savings.map(s=>{const pct=Math.min((s.saved/s.target)*100,100);return(
            <div key={s.id} style={S.card}>
              <div style={{...S.row,marginBottom:12}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:12,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div><div><div style={{fontWeight:700,fontSize:15}}>{s.name}</div><div style={{fontSize:12,color:"#475569"}}>الهدف: {fmt(s.target)}</div></div></div>
                <div style={{fontSize:18,fontWeight:900,color:s.color}}>{pct.toFixed(0)}%</div>
              </div>
              <div className="pbar"><div className="pfill" style={{width:pct+"%",background:s.color}}/></div>
              <div style={{...S.row,marginTop:10}}><span style={{fontSize:12,color:"#94a3b8"}}>مدخر: <strong style={{color:s.color}}>{fmt(s.saved)}</strong></span><button style={{...S.btn(s.color,false),padding:"6px 14px",fontSize:12}} onClick={()=>{setSelSv(s);om("dep");}}>+ إضافة</button></div>
            </div>
          );})}
        </>}

        {page==="reports"&&<>
          <span style={{fontWeight:700,fontSize:16}}>التقارير</span>
          <div style={{display:"flex",gap:10}}>
            <div style={{...S.card,flex:1,textAlign:"center"}}><div style={{fontSize:11,color:"#475569",marginBottom:4}}>معدل الادخار</div><div style={{fontSize:22,fontWeight:900,color:"#10b981"}}>{mInc>0?(((mInc-mExp)/mInc)*100).toFixed(0):0}%</div></div>
            <div style={{...S.card,flex:1,textAlign:"center"}}><div style={{fontSize:11,color:"#475569",marginBottom:4}}>أكبر مصروف</div><div style={{fontSize:13,fontWeight:700,color:"#f59e0b"}}>{[...pie].sort((a,b)=>b.value-a.value)[0]?.name||"—"}</div></div>
          </div>
          <div style={S.card}>
            <div style={{fontWeight:700,marginBottom:12,fontSize:14}}>📊 الدخل مقابل المصاريف</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chart} barSize={12}><XAxis dataKey="lbl" tick={{fill:"#475569",fontSize:11,fontFamily:"Cairo"}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip contentStyle={{background:"#1a1d27",border:"1px solid #1e2548",borderRadius:8,fontFamily:"Cairo",fontSize:12}} formatter={v=>[v.toLocaleString("ar-MA")+" د.م"]}/><Bar dataKey="inc" fill="#10b981" radius={[4,4,0,0]} name="الدخل"/><Bar dataKey="exp" fill="#ef4444" radius={[4,4,0,0]} name="المصاريف"/></BarChart>
            </ResponsiveContainer>
          </div>
          <div style={S.card}>
            <div style={{fontWeight:700,marginBottom:12,fontSize:14}}>🍩 المصاريف حسب التصنيف</div>
            {pie.length>0?<><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">{pie.map((_,i)=><Cell key={i} fill={PAL[i%PAL.length]}/>)}</Pie><Tooltip contentStyle={{background:"#1a1d27",border:"1px solid #1e2548",borderRadius:8,fontFamily:"Cairo",fontSize:12}} formatter={v=>[v.toLocaleString("ar-MA")+" د.م"]}/></PieChart></ResponsiveContainer><div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>{pie.map((d,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#94a3b8"}}><span style={{width:8,height:8,borderRadius:"50%",background:PAL[i%PAL.length],display:"inline-block"}}/>{d.name}</span>)}</div></>:<div style={{textAlign:"center",color:"#475569",padding:20}}>لا توجد بيانات</div>}
          </div>
        </>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#171b32",borderTop:"1px solid #1e2548",display:"flex",padding:"8px 4px",zIndex:50}}>
        {NAV.map(n=><button key={n.id} className={`nb${page===n.id?" on":""}`} onClick={()=>setPage(n.id)}>{n.icon}<span>{n.lbl}</span></button>)}
      </div>

      {/* MODALS */}
      {modal&&(
        <div className="mwp" onClick={cm}>
          <div className="mbx" onClick={e=>e.stopPropagation()}>
            <div style={{...S.row,marginBottom:20}}>
              <h3 style={{fontWeight:800,fontSize:16}}>
                {modal==="addTx"&&(form.txType==="income"?"إضافة دخل":"إضافة مصروف")}
                {modal==="edTx"&&"تعديل المعاملة"}
                {modal==="addMCat"&&`إضافة تصنيف ${form.catType==="expense"?"نفقة":"دخل"}`}
                {modal==="edMCat"&&"تعديل التصنيف"}
                {modal==="addSCat"&&`إضافة فرع — ${form.catName}`}
                {modal==="edSCat"&&"تعديل اسم الفرع"}
                {modal==="addBank"&&"إضافة بنك"}
                {modal==="addBAcc"&&"إضافة حساب بنكي"}
                {modal==="edBAcc"&&"تعديل الحساب"}
                {modal==="addCash"&&"إضافة كاش"}
                {modal==="edCash"&&"تعديل الكاش"}
                {modal==="addAst"&&"إضافة ممتلك"}
                {modal==="edAst"&&"تعديل الممتلك"}
                {modal==="addLoan"&&"إضافة سلف/قرض"}
                {modal==="addBudget"&&"إضافة ميزانية"}
                {modal==="addSaving"&&"هدف ادخار جديد"}
                {modal==="dep"&&"إضافة للادخار"}
              </h3>
              <button onClick={cm} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer"}}><X size={20}/></button>
            </div>

            {(modal==="addTx"||modal==="edTx")&&<div style={S.col}>
              <div style={{padding:"8px 14px",background:form.txType==="income"?"#10b98122":"#ef444422",borderRadius:10,marginBottom:4,textAlign:"center",fontWeight:700,fontSize:14,color:form.txType==="income"?"#10b981":"#ef4444"}}>
                {modal==="addTx"?(form.txType==="income"?"🟢 إضافة دخل":"🔴 إضافة مصروف"):"✏️ تعديل المعاملة"}
              </div>
              <input style={S.inp} placeholder="المبلغ" type="number" value={modal==="addTx"?form.amount||"":ei?.amount||""} onChange={e=>modal==="addTx"?F("amount",e.target.value):setEi(p=>({...p,amount:e.target.value}))}/>
              <select style={S.sel} value={modal==="addTx"?form.catId||"":ei?.catId||""} onChange={e=>{if(modal==="addTx"){F("catId",e.target.value);F("subId","");}else setEi(p=>({...p,catId:e.target.value,subId:""}));}}>
                <option value="">اختر التصنيف</option>
                {cats[modal==="addTx"?(form.txType||"expense"):(ei?.type||"expense")].map(c=><option key={c.id} value={c.id}>{c.ci?"📷":c.icon} {c.name}</option>)}
              </select>
              {(()=>{const cid=parseInt(modal==="addTx"?form.catId:ei?.catId);const cat=gc(modal==="addTx"?(form.txType||"expense"):(ei?.type||"expense"),cid);return cat?.subs?.length>0?<select style={S.sel} value={modal==="addTx"?form.subId||"":ei?.subId||""} onChange={e=>{if(modal==="addTx")F("subId",e.target.value);else setEi(p=>({...p,subId:e.target.value}));}}><option value="">الفرع (اختياري)</option>{cat.subs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>:null;})()}
              {modal==="addTx"&&<select style={S.sel} value={form.akey||""} onChange={e=>F("akey",e.target.value)}><option value="">اختر الحساب</option>{allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name}</option>)}</select>}
              <input style={S.inp} placeholder="الوصف" value={modal==="addTx"?form.desc||"":ei?.desc||""} onChange={e=>modal==="addTx"?F("desc",e.target.value):setEi(p=>({...p,desc:e.target.value}))}/>
              <input style={S.inp} type="date" value={modal==="addTx"?form.date||new Date().toISOString().split("T")[0]:ei?.date||""} onChange={e=>modal==="addTx"?F("date",e.target.value):setEi(p=>({...p,date:e.target.value}))}/>
              <PmBtns val={modal==="addTx"?form.pm||"نقدي":ei?.pm||"نقدي"} onChange={v=>modal==="addTx"?F("pm",v):setEi(p=>({...p,pm:v}))}/>
              <button style={S.btn(modal==="addTx"?"#10b981":"#6366f1")} onClick={modal==="addTx"?addTx:saveTxEdit}>حفظ</button>
            </div>}

            {(modal==="addMCat"||modal==="edMCat")&&<div style={S.col}>
              <input style={S.inp} placeholder="اسم التصنيف" defaultValue={modal==="edMCat"?ei?.name:""} onChange={e=>modal==="addMCat"?F("cn",e.target.value):setEi(p=>({...p,name:e.target.value}))}/>
              <div style={{fontSize:12,color:"#475569",marginBottom:4}}>الأيقونة:</div>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div>
                  <div className="iu" style={{width:52,height:52}} onClick={()=>(modal==="addMCat"?iRef:eiRef).current.click()}>
                    {(modal==="addMCat"?form.ci:ei?.ci)?<img src={modal==="addMCat"?form.ci:ei.ci} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<><Camera size={16} color="#475569"/><div style={{fontSize:9,color:"#475569",marginTop:2}}>تحميل</div></>}
                  </div>
                  {(modal==="addMCat"?form.ci:ei?.ci)&&<button style={{background:"none",border:"none",color:"#ef4444",fontSize:10,cursor:"pointer",fontFamily:"Cairo",marginTop:2}} onClick={()=>modal==="addMCat"?F("ci",null):setEi(p=>({...p,ci:null}))}>إزالة</button>}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                    {(modal==="addMCat"?form.catType:ei?.catType)==="expense"?EE.map(e=><button key={e} className={`eb${!(modal==="addMCat"?form.ci:ei?.ci)&&(modal==="addMCat"?form.em:ei?.icon)===e?" sl":""}`} onClick={()=>modal==="addMCat"?(F("em",e),F("ci",null)):(setEi(p=>({...p,icon:e,ci:null})))} style={{width:33,height:33,fontSize:17,opacity:(modal==="addMCat"?form.ci:ei?.ci)?0.35:1}}>{e}</button>):IE.map(e=><button key={e} className={`eb${!(modal==="addMCat"?form.ci:ei?.ci)&&(modal==="addMCat"?form.em:ei?.icon)===e?" sl":""}`} onClick={()=>modal==="addMCat"?(F("em",e),F("ci",null)):(setEi(p=>({...p,icon:e,ci:null})))} style={{width:33,height:33,fontSize:17,opacity:(modal==="addMCat"?form.ci:ei?.ci)?0.35:1}}>{e}</button>)}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>{PAL.slice(0,8).map(c=><div key={c} className={`cd${(modal==="addMCat"?form.color:ei?.color)===c?" sl":""}`} style={{background:c}} onClick={()=>modal==="addMCat"?F("color",c):setEi(p=>({...p,color:c}))}/>)}</div>
              <button style={S.btn((modal==="addMCat"?form.catType:ei?.catType)==="expense"?"#ef4444":"#10b981")} onClick={()=>modal==="addMCat"?addMCat(form.catType):edMCat(ei.catType,ei.id,{name:ei.name,icon:ei.icon,color:ei.color,ci:ei.ci})&&cm()}>
                {modal==="addMCat"?"إضافة":"حفظ التعديلات"}
              </button>
            </div>}

            {modal==="addSCat"&&<div style={S.col}><input style={S.inp} placeholder="اسم الفرع" value={form.sn||""} onChange={e=>F("sn",e.target.value)}/><button style={S.btn()} onClick={()=>addSCat(form.catType,form.catId)}>إضافة</button></div>}
            {modal==="edSCat"&&ei&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#0c0f1e",borderRadius:10,fontSize:13,color:"#94a3b8"}}>الحالي: <strong style={{color:"#f1f5f9"}}>{ei.name}</strong></div>
              <input style={S.inp} placeholder="الاسم الجديد" defaultValue={ei.name} onChange={e=>setEi(p=>({...p,newName:e.target.value}))}/>
              <button style={S.btn()} onClick={()=>{edSCat(ei.catType,ei.catId,ei.id,ei.newName||ei.name);cm();}}>حفظ</button>
            </div>}

            {modal==="addBank"&&<div style={S.col}><input style={S.inp} placeholder="اسم البنك" value={form.name||""} onChange={e=>F("name",e.target.value)}/><input style={S.inp} placeholder="العنوان" value={form.addr||""} onChange={e=>F("addr",e.target.value)}/><button style={S.btn()} onClick={addBank}>حفظ</button></div>}
            {modal==="addBAcc"&&<div style={S.col}><input style={S.inp} placeholder="اسم الحساب" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">نوع الحساب</option>{["جاري","توفير","استثماري","راتب","أعمال"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="الرصيد" type="number" value={form.bal||""} onChange={e=>F("bal",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn()} onClick={addBAcc}>حفظ</button></div>}
            {modal==="edBAcc"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["جاري","توفير","استثماري","راتب","أعمال"].map(t=><option key={t} value={t}>{t}</option>)}</select><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn()} onClick={()=>{edBAcc(ei._bid,ei.id,{name:ei.name,type:ei.type,color:ei.color});cm();}}>حفظ</button></div>}
            {modal==="addCash"&&<div style={S.col}><input style={S.inp} placeholder="الاسم" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">النوع</option>{["نقدية يومية","خزنة","صندوق","مال الجيب"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="الرصيد" type="number" value={form.bal||""} onChange={e=>F("bal",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn("#f59e0b")} onClick={addCash}>حفظ</button></div>}
            {modal==="edCash"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["نقدية يومية","خزنة","صندوق","مال الجيب"].map(t=><option key={t} value={t}>{t}</option>)}</select><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn("#f59e0b")} onClick={()=>{setCash(p=>p.map(x=>x.id===ei.id?{...x,...ei}:x));cm();}}>حفظ</button></div>}
            {modal==="addAst"&&<div style={S.col}><input style={S.inp} placeholder="الاسم" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">النوع</option>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="القيمة التقديرية" type="number" value={form.val||""} onChange={e=>F("val",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn("#14b8a6")} onClick={addAst}>حفظ</button></div>}
            {modal==="edAst"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} type="number" defaultValue={ei.value} onChange={e=>setEi(p=>({...p,value:parseFloat(e.target.value)}))}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn("#14b8a6")} onClick={()=>{setAssets(p=>p.map(x=>x.id===ei.id?{...x,...ei}:x));cm();}}>حفظ</button></div>}
            {modal==="addLoan"&&<div style={S.col}>
              <div style={{display:"flex",gap:8}}>{["أعطيت","أخذت"].map(k=><button key={k} onClick={()=>F("kind",k)} style={{flex:1,padding:10,border:"2px solid",borderColor:form.kind===k?(k==="أعطيت"?"#10b981":"#ef4444"):"#1e2548",borderRadius:10,background:form.kind===k?(k==="أعطيت"?"#10b98122":"#ef444422"):"transparent",color:form.kind===k?(k==="أعطيت"?"#10b981":"#ef4444"):"#475569",fontFamily:"Cairo",fontWeight:700,cursor:"pointer",fontSize:13}}>{k}</button>)}</div>
              <input style={S.inp} placeholder="الشخص / الجهة" value={form.person||""} onChange={e=>F("person",e.target.value)}/>
              <input style={S.inp} placeholder="المبلغ" type="number" value={form.amount||""} onChange={e=>F("amount",e.target.value)}/>
              <input style={S.inp} placeholder="ملاحظة" value={form.note||""} onChange={e=>F("note",e.target.value)}/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <div style={{display:"flex",gap:16}}>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!form.wi} onChange={e=>F("wi",e.target.checked)}/> فائدة</label>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!form.inst} onChange={e=>F("inst",e.target.checked)}/> أقساط</label>
              </div>
              {form.wi&&<input style={S.inp} placeholder="نسبة الفائدة %" type="number" value={form.irate||""} onChange={e=>F("irate",e.target.value)}/>}
              {form.inst&&<input style={S.inp} placeholder="القسط الشهري" type="number" value={form.minst||""} onChange={e=>F("minst",e.target.value)}/>}
              <button style={S.btn("#8b5cf6")} onClick={addLoan}>حفظ</button>
            </div>}
            {modal==="addBudget"&&<div style={S.col}><select style={S.sel} value={form.catId||""} onChange={e=>F("catId",e.target.value)}><option value="">اختر تصنيف النفقات</option>{cats.expense.map(c=><option key={c.id} value={c.id}>{c.ci?"📷":c.icon} {c.name}</option>)}</select><input style={S.inp} placeholder="الحد الأقصى" type="number" value={form.limit||""} onChange={e=>F("limit",e.target.value)}/><button style={S.btn()} onClick={addBudget}>حفظ</button></div>}

            {modal==="budgetSettings"&&<div style={S.col}>
              <div style={{fontSize:13,color:"#475569",fontWeight:700}}>🎯 حد الشريحة الأولى</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input style={{...S.inp,flex:1}} type="number" value={budgetSettings.threshold} onChange={e=>setBudgetSettings(p=>({...p,threshold:parseFloat(e.target.value)||0}))}/>
                <span style={{color:"#94a3b8",fontSize:13,whiteSpace:"nowrap"}}>درهم</span>
              </div>
              <div style={{padding:"10px 14px",background:"#0c0f1e",borderRadius:10,fontSize:12,color:"#94a3b8"}}>
                من 0 إلى <strong style={{color:"#f1f5f9"}}>{fmt(budgetSettings.threshold)}</strong> → كلها للمصاريف الأساسية
              </div>

              <div style={{fontSize:13,color:"#475569",fontWeight:700,marginTop:4}}>📊 توزيع الفائض (فوق {fmt(budgetSettings.threshold)})</div>
              {budgetSettings.allocations.map((a,i)=>(
                <div key={a.id} style={{...S.card,padding:"12px 14px"}}>
                  <div style={{...S.row,marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:20}}>{a.icon}</span>
                      <span style={{fontWeight:600,fontSize:14}}>{a.name}</span>
                    </div>
                    <span style={{fontSize:15,fontWeight:800,color:a.color}}>{a.pct}%</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <input type="range" min="0" max="100" value={a.pct}
                      onChange={e=>setBudgetSettings(p=>({...p,allocations:p.allocations.map(x=>x.id===a.id?{...x,pct:parseInt(e.target.value)}:x)}))}
                      style={{flex:1,accentColor:a.color}}/>
                    <input style={{...S.inp,width:70,textAlign:"center",padding:"6px 8px"}} type="number" min="0" max="100" value={a.pct}
                      onChange={e=>setBudgetSettings(p=>({...p,allocations:p.allocations.map(x=>x.id===a.id?{...x,pct:parseInt(e.target.value)||0}:x)}))}/>
                    <span style={{color:"#94a3b8",fontSize:12}}>%</span>
                  </div>
                </div>
              ))}

              <div style={{...S.card,textAlign:"center",background:budgetSettings.allocations.reduce((s,a)=>s+a.pct,0)===100?"#10b98115":"#ef444415",border:`1px solid ${budgetSettings.allocations.reduce((s,a)=>s+a.pct,0)===100?"#10b98133":"#ef444433"}`}}>
                <div style={{fontSize:12,color:"#475569"}}>مجموع النسب</div>
                <div style={{fontSize:24,fontWeight:900,color:budgetSettings.allocations.reduce((s,a)=>s+a.pct,0)===100?"#10b981":"#ef4444"}}>
                  {budgetSettings.allocations.reduce((s,a)=>s+a.pct,0)}%
                </div>
                {budgetSettings.allocations.reduce((s,a)=>s+a.pct,0)!==100&&
                  <div style={{fontSize:11,color:"#ef4444",marginTop:4}}>⚠️ المجموع خاص يكون 100%</div>
                }
              </div>

              <button style={S.btn()} onClick={cm}>حفظ الإعدادات</button>
            </div>}
            {modal==="addSaving"&&<div style={S.col}>
              <input style={S.inp} placeholder="اسم الهدف" value={form.name||""} onChange={e=>F("name",e.target.value)}/>
              <input style={S.inp} placeholder="المبلغ المستهدف" type="number" value={form.target||""} onChange={e=>F("target",e.target.value)}/>
              <input style={S.inp} placeholder="المدخر حالياً" type="number" value={form.init||""} onChange={e=>F("init",e.target.value)}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{["🚗","🏠","✈️","💍","📱","🎓","🏖️","💻","🎮","🛒","⚽","🎸"].map(e=><button key={e} className={`eb${form.icon===e?" sl":""}`} onClick={()=>F("icon",e)}>{e}</button>)}</div>
              <div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div>
              <button style={S.btn()} onClick={addSaving}>حفظ</button>
            </div>}
            {modal==="dep"&&<div style={S.col}>
              {selSv&&<div style={{padding:12,background:"#0c0f1e",borderRadius:10,display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:24}}>{selSv.icon}</span><div><div style={{fontWeight:700}}>{selSv.name}</div><div style={{fontSize:12,color:"#475569"}}>متبقي: {fmt(selSv.target-selSv.saved)}</div></div></div>}
              <input style={S.inp} placeholder="المبلغ" type="number" value={form.amount||""} onChange={e=>F("amount",e.target.value)}/>
              <button style={S.btn(selSv?.color||"#10b981")} onClick={addDep}>إضافة</button>
            </div>}
          </div>
        </div>
      )}

      {cd&&(
        <div className="mwp" onClick={()=>setCd(null)}>
          <div className="mbx" style={{padding:28}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:40,marginBottom:12}}>🗑️</div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:8}}>تأكيد الحذف</div>
              <div style={{fontSize:14,color:"#94a3b8"}}>هل تبغي تحذف <strong style={{color:"#f1f5f9"}}>"{cd.lbl}"</strong>؟</div>
              <div style={{fontSize:12,color:"#ef4444",marginTop:6}}>هذا الإجراء لا يمكن التراجع عنه</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("#1e2548"),border:"1px solid #334155",color:"#94a3b8"}} onClick={()=>setCd(null)}>إلغاء</button>
              <button style={S.btn("#ef4444")} onClick={doDel}>حذف</button>
            </div>
          </div>
        </div>
      )}
      {err&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#1a1d27",border:"1px solid #ef4444",borderRadius:12,padding:"12px 20px",zIndex:400,color:"#ef4444",fontSize:13,fontWeight:700,maxWidth:340,textAlign:"center"}}>{err}</div>}
    </div>
  );
}