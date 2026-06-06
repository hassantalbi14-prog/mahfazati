import React, { useState, useRef, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
const _sb = createClient('https://fgcxhsqflbgpmjqoipol.supabase.co','sb_publishable_OiS-RS4qaOtmkuWop1f5AA_Nk8mOGXP');
const _save = async(k,v)=>{ try{ const r=await _sb.from('app_data').upsert({id:k,data:JSON.stringify(v)}); console.log('saved',k,r.error||'ok'); }catch(e){console.log('save err',k,e);} };
const _load = async(k)=>{ try{ const{data,error}=await _sb.from('app_data').select('data').eq('id',k).single(); console.log('load',k,error||'ok'); return data?.data?JSON.parse(data.data):null; }catch(e){console.log('load err',k,e);return null;} };
import { X, Home, CreditCard, Wallet, Target, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Menu, ChevronLeft, ChevronRight, Plus, Trash2, Cloud, Settings, Building2, Coins, Package, HandCoins, Download, Upload, Check, Camera } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PAL=["#10b981","#6366f1","#f59e0b","#ef4444","#14b8a6","#f97316","#8b5cf6","#ec4899","#06b6d4","#84cc16"];
const MONTH = new Date().toISOString().slice(0,7);
const fmt=n=>(n||0).toLocaleString("ar-MA")+" د.م";
const uid=()=>Date.now()+Math.floor(Math.random()*9999);
const EE=["🍔","🚗","🏠","💊","🎓","👗","🎮","📱","💡","🛒","✈️","🎵","🍕","⚽","📚","💈","🧴","🐾","🎁","🏋️","🌿","🏥","💻","🎨","🔧"];
const IE=["💼","💻","🏠","🚕","📦","🎨","🎓","💹","🤝","🏭","📊","🎵","🛍️","🌐","✍️","💰","🏆","🎯","🔑","📝"];

const IC={expense:[],income:[]};
const IBK=[];
const ICS=[];
const IAS=[];
const ILN=[];
const ITX=[];
const IBG=[];
const ISV=[];

const S={
  card:{background:"#ffffff",borderRadius:16,padding:16,border:"1px solid #e2e8f0"},
  inp:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",color:"#1e293b",fontFamily:"Tajawal",fontSize:14,width:"100%",outline:"none"},
  num:{background:"#f8fafc",border:"2px solid #e2e8f0",borderRadius:12,padding:"14px 16px",color:"#1e293b",fontFamily:"Tajawal",fontSize:22,fontWeight:900,width:"100%",outline:"none",textAlign:"center",letterSpacing:1},
  sel:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",color:"#1e293b",fontFamily:"Tajawal",fontSize:14,width:"100%",outline:"none"},
  btn:(bg="#10b981",full=true)=>({background:bg,color:"white",border:"none",padding:"11px 18px",borderRadius:12,fontFamily:"Tajawal",fontSize:14,fontWeight:700,cursor:"pointer",...(full?{width:"100%"}:{})}),
  row:{display:"flex",alignItems:"center",justifyContent:"space-between"},
  col:{display:"flex",flexDirection:"column",gap:12},
};

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px;}
.tx{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #e2e8f0;}.tx:last-child{border-bottom:none;}
.nb{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border-radius:10px;cursor:pointer;color:#94a3b8;font-size:10px;flex:1;background:none;border:none;font-family:Tajawal;transition:color .2s;}
.nb.on{color:#10b981;background:rgba(16,185,129,.12);}
.pbar{height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;}.pfill{height:100%;border-radius:3px;transition:width .8s;}
.drw{position:fixed;top:0;right:0;height:100%;width:280px;background:linear-gradient(180deg,#2e8fa8,#1e7a94);border-left:1px solid #1e6a80;z-index:200;transform:translateX(100%);transition:transform .3s;overflow-y:auto;}
.drw.op{transform:translateX(0);}
.ovl{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:199;opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(3px);}
.ovl.op{opacity:1;pointer-events:all;}
.mwp{position:fixed;inset:0;background:rgba(5,8,20,.8);z-index:300;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(5px);}
.mbx{background:linear-gradient(180deg,#1e293b,#141828);border-radius:20px 20px 0 0;padding:24px;width:100%;border-top:1px solid #e2e8f0;max-height:90vh;overflow-y:auto;}
.mi{display:flex;align-items:center;gap:12px;padding:14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.08);color:white;font-size:15px;font-weight:600;}
.mi:hover{background:rgba(255,255,255,.1);}
.si{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.85);font-size:14px;}
.si:hover{background:rgba(255,255,255,.1);color:white;}
.cd{width:28px;height:28px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:border-color .2s;}.cd.sl{border-color:white;}
.eb{width:36px;height:36px;border-radius:10px;border:2px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-size:19px;display:flex;align-items:center;justify-content:center;}
.eb.sl{border-color:#10b981;background:#10b98120;}
.fch{display:flex;align-items:center;gap:12px;padding:16px 14px;background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.08);}
.fsi{display:flex;align-items:center;gap:12px;padding:15px 14px 15px 32px;border-bottom:1px solid rgba(255,255,255,.06);}
.stg{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:4px 10px;font-size:12px;color:white;margin:3px;}
.iu{border-radius:14px;border:2px dashed rgba(255,255,255,.3);background:rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;transition:border-color .2s;}
.iu:hover{border-color:white;}
.acc-row{display:flex;align-items:center;justify-content:space-between;padding:11px 12px;background:#1e293b;border-radius:10px;margin-bottom:5px;border:1px solid #e2e8f0;}
`;

// v2.1
export default function App(){
  const[page,setPage]=useState("dashboard");
  const[drw,setDrw]=useState(false);
  const[period,setPeriod]=useState({type:"month",month:new Date().toISOString().slice(0,7),year:new Date().getFullYear().toString()});
  const[recoveryContact,setRecoveryContact]=useState("");
  const filterByPeriod=(txList)=>{if(period.type==="month")return txList.filter(t=>t.date.startsWith(period.month));if(period.type==="year")return txList.filter(t=>t.date.startsWith(period.year));return txList;};
  const[hideBalance,setHideBalance]=useState(false);
  const[showActions,setShowActions]=useState(false);
  const[distModal,setDistModal]=useState(null); // {income, step:1-5}
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
  const[resetCode,setResetCode]=useState("");
  const[resetErr,setResetErr]=useState(false);
  const[isAuth,setIsAuth]=useState(()=>sessionStorage.getItem("mhf_auth")==="1");
  const[pwInput,setPwInput]=useState("");
  const[pwErr,setPwErr]=useState(false);
  const[appPassword,setAppPassword]=useState(()=>localStorage.getItem("mhf_pw")||"1234");
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
  const[savings,setSavings]=useState(ISV);
  const[budgetSettings,setBudgetSettings]=useState({
    goals:{incomeGoal:15000,incomeAuto:false,expenseGoal:5000,expenseAuto:false},
    allocations:[
      {id:1,name:"المصاريف",icon:"🛒",color:"#ef4444",pct:40,accountKeys:[],minAlert:300,emergencyTransfer:0,type:"expenses"},
      {id:2,name:"الطوارئ",icon:"🚨",color:"#f59e0b",pct:20,accountKeys:[],type:"emergency"},
      {id:3,name:"الممتلكات",icon:"🏠",color:"#14b8a6",pct:10,accountKeys:[],type:"assets"},
      {id:4,name:"الاستثمار",icon:"📈",color:"#10b981",pct:20,accountKeys:[],type:"investment"},
      {id:5,name:"التقاعد",icon:"🏦",color:"#6366f1",pct:10,accountKeys:[],type:"retirement",loanable:true}
    ],
    tranches:[
      {id:1,min:0,max:3000,fix:3000,pcts:{1:100,2:0,3:0,4:0,5:0}},
      {id:2,min:3001,max:5000,fix:3000,pcts:{1:40,2:25,3:10,4:15,5:10}},
      {id:3,min:5001,max:10000,fix:4000,pcts:{1:35,2:25,3:10,4:20,5:10}},
      {id:4,min:10001,max:15000,fix:5000,pcts:{1:30,2:20,3:15,4:25,5:10}},
      {id:5,min:15001,max:999999,fix:6000,pcts:{1:25,2:20,3:15,4:30,5:10}}
    ]
  });
  const[loaded,setLoaded]=useState(false);

  useEffect(()=>{
    const loadAll=async()=>{
      const b=await _load('banks'); if(b)setBanks(b);
      const c=await _load('cash'); if(c)setCash(c);
      const a=await _load('assets'); if(a)setAssets(a);
      const l=await _load('loans'); if(l)setLoans(l);
      const ct=await _load('cats'); if(ct)setCats(ct);
      const tx=await _load('txs'); if(tx)setTxs(tx);
      const bs=await _load('budgetSettings'); if(bs)setBudgetSettings(bs);
      setLoaded(true);
    };
    loadAll();
  },[]);

  useEffect(()=>{if(loaded)_save('banks',banks);},[banks,loaded]);
  useEffect(()=>{if(loaded)_save('cash',cash);},[cash,loaded]);
  useEffect(()=>{if(loaded)_save('assets',assets);},[assets,loaded]);
  useEffect(()=>{if(loaded)_save('loans',loans);},[loans,loaded]);
  useEffect(()=>{if(loaded)_save('cats',cats);},[cats,loaded]);
  useEffect(()=>{if(loaded)_save('txs',txs);},[txs,loaded]);
  useEffect(()=>{if(loaded)_save('budgetSettings',budgetSettings);},[budgetSettings,loaded]);

  const allAcc=[
    ...banks.flatMap(b=>b.accounts.map(a=>({...a,bn:b.name,bid:b.id,key:`b-${b.id}-${a.id}`,ref:{k:"bank",bid:b.id,aid:a.id}}))),
    ...cash.map(c=>({...c,bn:c.type,key:`c-${c.id}`,ref:{k:"cash",cid:c.id}})),
  ];
  const totBal=allAcc.reduce((s,a)=>s+(a.balance||0),0);
  const totAst=assets.reduce((s,a)=>s+(a.value||0),0);
  const totGiv=loans.filter(l=>l.kind==="أعطيت").reduce((s,l)=>s+l.remaining,0);
  const totOwd=loans.filter(l=>l.kind==="أخذت").reduce((s,l)=>s+l.remaining,0);
  const mInc=txs.filter(t=>t.type==="income"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل").reduce((s,t)=>s+t.amount,0);
  const mExp=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isAsset).reduce((s,t)=>s+t.amount,0);

  const gc=(tp,id)=>cats[tp]?.find(c=>c.id===id);
  const gs=(tp,cid,sid)=>gc(tp,cid)?.subs?.find(s=>s.id===sid);
  const tl=t=>{const tp=t.type==="income"?"income":"expense";const c=gc(tp,t.catId);const s=gs(tp,t.catId,t.subId);return{cn:c?.name||"—",sn:s?.name||"",ic:c?.ci||c?.icon||"📌",hi:!!c?.ci,col:c?.color||"#94a3b8"};};
  const al=ref=>{if(!ref)return"";if(ref.k==="bank"){const b=banks.find(x=>x.id===ref.bid);const a=b?.accounts.find(x=>x.id===ref.aid);return`${b?.name} - ${a?.name}`;}if(ref.k==="cash"){return cash.find(x=>x.id===ref.cid)?.name;}return"";};

  const expByCat=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)).reduce((acc,t)=>{const c=gc("expense",t.catId);const k=c?.name||"أخرى";acc[k]=(acc[k]||0)+t.amount;return acc;},{});
  const pie=Object.entries(expByCat).map(([name,value])=>({name,value}));
  const chart=Array.from({length:6},(_,i)=>{const d=new Date(2026,4-i,1);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;return{lbl:d.toLocaleString("ar-MA",{month:"short"}),inc:txs.filter(t=>t.type==="income"&&t.date.startsWith(k)&&t.pm!=="تحويل"&&!t.isTransfer).reduce((s,t)=>s+t.amount,0),exp:txs.filter(t=>t.type==="expense"&&t.date.startsWith(k)&&t.pm!=="تحويل"&&!t.isTransfer&&!t.isAsset).reduce((s,t)=>s+t.amount,0)};}).reverse();

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

  const doTransfer=()=>{
    if(!form.amount||!form.fromKey||!form.toKey||form.fromKey===form.toKey)return;
    const amt=parseFloat(form.amount);
    const from=allAcc.find(a=>a.key===form.fromKey);
    const to=allAcc.find(a=>a.key===form.toKey);
    if(!from||!to)return;
    if(from.ref.k==="bank")setBanks(p=>p.map(b=>b.id===from.ref.bid?{...b,accounts:b.accounts.map(a=>a.id===from.ref.aid?{...a,balance:a.balance-amt}:a)}:b));
    if(from.ref.k==="cash")setCash(p=>p.map(c=>c.id===from.ref.cid?{...c,balance:c.balance-amt}:c));
    if(to.ref.k==="bank")setBanks(p=>p.map(b=>b.id===to.ref.bid?{...b,accounts:b.accounts.map(a=>a.id===to.ref.aid?{...a,balance:a.balance+amt}:a)}:b));
    if(to.ref.k==="cash")setCash(p=>p.map(c=>c.id===to.ref.cid?{...c,balance:c.balance+amt}:c));
    const now=form.transferDate||new Date().toISOString().split("T")[0];
    setTxs(p=>[
      {id:uid(),type:"expense",amount:amt,catId:null,subId:null,desc:`تحويل إلى ${to.name}`,date:now,pm:"تحويل",ref:from.ref,isTransfer:true},
      {id:uid(),type:"income",amount:amt,catId:null,subId:null,desc:`تحويل من ${from.name}`,date:now,pm:"تحويل",ref:to.ref,isTransfer:true},
      ...p
    ]);
    cm();
  };

  const addTx=()=>{
    if(!form.amount){showErr("⛔ أدخل المبلغ");return;}
    if(!form.catId){showErr("⛔ اختر التصنيف");return;}
    if(form.pm!=="كريدي"&&!form.akey){showErr("⛔ اختر الحساب");return;}
    const acc=form.akey?allAcc.find(a=>a.key===form.akey):null;
    if(form.pm!=="كريدي"&&!acc)return;
    const amt=parseFloat(form.amount);
    if(isNaN(amt)||amt<=0){showErr("⛔ المبلغ غير صحيح");return;}
    if((form.txType||"expense")==="expense"&&form.pm!=="كريدي"&&acc&&amt>(acc.balance||0)){
      showErr("⛔ الرصيد غير كافي — الرصيد المتاح: "+fmt(acc.balance||0));return;
    }
    if((form.txType||"expense")==="expense"){
      const threshold=budgetSettings.threshold;
      const expAlloc=budgetSettings.allocations.find(a=>a.name==="المصاريف");
      const expPct=expAlloc?.pct||30;
      const curMonthInc=txs.filter(t=>t.type==="income"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل").reduce((s,t)=>s+t.amount,0);
      const curMonthExp=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
      const budget=curMonthInc<=threshold?curMonthInc:threshold+(curMonthInc-threshold)*(expPct/100);
      if(budget>0&&(curMonthExp+amt)>budget){
        showErr(`⚠️ تجاوزت ميزانية الشهر — الباقي: ${fmt(Math.max(0,budget-curMonthExp))}`);
      }
    }
    const tx={id:uid(),type:form.txType||"expense",amount:amt,catId:parseInt(form.catId),subId:form.subId?parseInt(form.subId):null,desc:form.desc||"",date:form.date||new Date().toISOString().split("T")[0],pm:form.pm||"نقدي",ref:acc?.ref||null};
    setTxs(p=>[tx,...p]);
    if(tx.pm!=="كريدي"&&acc)updBal(acc.ref,tx.amount,tx.type,"add");
    cm();
    // توزيع الدخل تلقائياً
    if(tx.type==="income"&&!tx.isTransfer){
      const tr=budgetSettings.tranches?.find(t=>tx.amount>=t.min&&tx.amount<=t.max)||budgetSettings.tranches?.[budgetSettings.tranches.length-1];
      const initPcts={2:tr?.pcts[2]||20,3:tr?.pcts[3]||15,4:tr?.pcts[4]||15,5:tr?.pcts[5]||10};
      setDistModal({income:tx.amount,step:1,customPcts:initPcts});
    }
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

  const resetData=()=>{
    setBanks([]);setCash([]);setAssets([]);setLoans([]);
    setCats({expense:[],income:[]});setTxs([]);
    setBudgetSettings({allocations:[
      {id:1,name:"المصاريف",icon:"🛒",color:"#ef4444",bg:"#fee2e2",accountKeys:[],fixed:true},
      {id:2,name:"الطوارئ",icon:"🚨",color:"#f59e0b",bg:"#fef3c7",accountKeys:[],fixed:false,minMonths:3},
      {id:3,name:"الاستثمار",icon:"📈",color:"#10b981",bg:"#d1fae5",accountKeys:[],fixed:false},
      {id:4,name:"الممتلكات",icon:"🏠",color:"#6366f1",bg:"#e0e7ff",accountKeys:[],fixed:false},
      {id:5,name:"التقاعد",icon:"🏦",color:"#8b5cf6",bg:"#ede9fe",accountKeys:[],fixed:false}
    ],threshold:5000,tranches:[
      {id:1,min:0,max:5000,pcts:{1:0,2:0,3:0,4:0,5:0}},
      {id:2,min:5001,max:10000,pcts:{1:25,2:20,3:15,4:15,5:25}},
      {id:3,min:10001,max:15000,pcts:{1:25,2:20,3:20,4:15,5:20}},
      {id:4,min:15001,max:20000,pcts:{1:25,2:20,3:25,4:15,5:15}},
      {id:5,min:20001,max:999999,pcts:{1:20,2:20,3:25,4:20,5:15}}
    ]});
    setBkMsg("✅ تم إعادة الضبط الكامل");
    setTimeout(()=>setBkMsg(null),3000);
  };

  const addBank=()=>{if(!form.name)return;setBanks(p=>[...p,{id:uid(),name:form.name,address:form.addr||"",accounts:[]}]);cm();};
  const addBAcc=()=>{if(!form.type||!form.name||!selBk)return;setBanks(p=>p.map(b=>b.id===selBk?{...b,accounts:[...b.accounts,{id:uid(),type:form.type,name:form.name,balance:parseFloat(form.bal||0),color:form.color||"#10b981"}]}:b));cm();};
  const edBAcc=(bid,aid,d)=>setBanks(p=>p.map(b=>b.id===bid?{...b,accounts:b.accounts.map(a=>a.id===aid?{...a,...d}:a)}:b));
  const addCash=()=>{if(!form.name)return;setCash(p=>[...p,{id:uid(),type:form.type||"نقدية",name:form.name,balance:parseFloat(form.bal||0),color:form.color||"#f59e0b"}]);cm();};
  const addAst=()=>{if(!form.name)return;setAssets(p=>[...p,{id:uid(),type:form.type||"أخرى",name:form.name,value:0,note:form.val||"",color:form.color||"#14b8a6"}]);cm();};
  const addLoan=()=>{
    if(!form.person||!form.amount)return;
    if(!form.akey){showErr("⛔ خاصك تختار الحساب");return;}
    const amt=parseFloat(form.amount);
    const acc=allAcc.find(a=>a.key===form.akey);
    if(acc)updBal(acc.ref,amt,form.kind==="أعطيت"?"expense":"income","add");
    setLoans(p=>[...p,{id:uid(),kind:form.kind||"أعطيت",person:form.person,amount:amt,remaining:amt,date:form.date||new Date().toISOString().split("T")[0],note:form.note||"",wi:!!form.wi,interest:parseFloat(form.irate||0),inst:!!form.inst,minst:parseFloat(form.minst||0),akey:form.akey}]);
    cm();
  };
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

  const expData=()=>{
    const d=JSON.stringify({banks,cash,assets,loans,cats,txs,budgetSettings},null,2);
    const b=new Blob([d],{type:"application/json"});
    const u=URL.createObjectURL(b);
    const a=document.createElement("a");
    a.href=u;a.download="محفظتي-"+new Date().toISOString().split("T")[0]+".json";a.click();
    URL.revokeObjectURL(u);
    setBkMsg("تم التحميل ✅");setTimeout(()=>setBkMsg(null),3000);
  };
  const impData=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const d=JSON.parse(ev.target.result);
        if(d.banks&&d.banks.length>0)setBanks(d.banks);
        if(d.cash&&d.cash.length>0)setCash(d.cash);
        if(d.assets&&d.assets.length>0)setAssets(d.assets);
        if(d.loans&&d.loans.length>0)setLoans(d.loans);
        if(d.budgetSettings)setBudgetSettings(d.budgetSettings);
        if(d.cats){
          setCats(p=>({
            expense:[...p.expense,...(d.cats.expense||[]).filter(nc=>!p.expense.some(ec=>ec.name===nc.name))],
            income:[...p.income,...(d.cats.income||[]).filter(nc=>!p.income.some(ec=>ec.name===nc.name))]
          }));
        }
        if(d.txs&&d.txs.length>0){
          setTxs(p=>{
            const existingIds=new Set(p.map(t=>t.id));
            const newTxs=d.txs.filter(t=>!existingIds.has(t.id));
            return [...p,...newTxs].sort((a,b)=>b.date.localeCompare(a.date));
          });
        }
        setBkMsg(`تم الاستيراد ✅ — ${d.txs?.length||0} معاملة`);
      }catch(err){setBkMsg("خطأ في الملف ❌");}
      setTimeout(()=>setBkMsg(null),4000);
    };
    r.readAsText(file);e.target.value="";
  };

  if(!isAuth) return (
    <div dir="rtl" style={{fontFamily:"'Tajawal',sans-serif",background:"linear-gradient(135deg,#0c0f1e,#1a2040)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{background:"#1a1d27",borderRadius:24,padding:36,width:"100%",maxWidth:340,border:"1px solid #1e2548",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:16}}>💰</div>
        <div style={{fontSize:22,fontWeight:900,color:"#0f172a",marginBottom:6}}>محفظتي</div>
        <div style={{fontSize:13,color:"#475569",marginBottom:28}}>أدخل كلمة السر للدخول</div>
        <input type="password" placeholder="كلمة السر" value={pwInput}
          onChange={e=>{setPwInput(e.target.value);setPwErr(false);}}
          onKeyDown={e=>{if(e.key==="Enter"){if(pwInput===appPassword){sessionStorage.setItem("mhf_auth","1");setIsAuth(true);}else setPwErr(true);}}}
          style={{background:"#0c0f1e",border:`2px solid ${pwErr?"#ef4444":"#1e2548"}`,borderRadius:12,padding:"12px 16px",color:"#0f172a",fontFamily:"Tajawal",fontSize:16,width:"100%",outline:"none",textAlign:"center",marginBottom:8}}
          autoFocus/>
        {pwErr&&<div style={{color:"#ef4444",fontSize:13,marginBottom:8}}>❌ كلمة السر غلط</div>}
        <button onClick={()=>{if(pwInput===appPassword){sessionStorage.setItem("mhf_auth","1");setIsAuth(true);}else setPwErr(true);}}
          style={{background:"#10b981",color:"white",border:"none",padding:"13px",borderRadius:12,fontFamily:"Tajawal",fontSize:15,fontWeight:700,cursor:"pointer",width:"100%",marginTop:4}}>
          دخول 🔓
        </button>
      </div>
    </div>
  );

  const NAV=[{id:"dashboard",icon:<Home size={18}/>,lbl:"الرئيسية"},{id:"transactions",icon:<Wallet size={18}/>,lbl:"المعاملات"},{id:"budget",icon:<Target size={18}/>,lbl:"الميزانية"},{id:"reports",icon:<BarChart3 size={18}/>,lbl:"التقارير"},{id:"settings",icon:<Settings size={18}/>,lbl:"الإعدادات"}];
  const Ico=({src,fb,sz=20})=>src?<img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:sz}}>{fb}</span>;
  const PeriodSelector=()=>{
    const years=[...new Set(txs.map(t=>t.date.slice(0,4)))].sort().reverse();
    const months=[...new Set(txs.map(t=>t.date.slice(0,7)))].sort().reverse();
    return(
      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
        <button onClick={()=>setPeriod(p=>({...p,type:"all"}))} style={{...S.btn(period.type==="all"?"#10b981":"#e2e8f0",false),padding:"6px 12px",fontSize:12,color:period.type==="all"?"white":"#64748b"}}>الكل</button>
        <button onClick={()=>setPeriod(p=>({...p,type:"year"}))} style={{...S.btn(period.type==="year"?"#6366f1":"#e2e8f0",false),padding:"6px 12px",fontSize:12,color:period.type==="year"?"white":"#64748b"}}>سنوي</button>
        <button onClick={()=>setPeriod(p=>({...p,type:"month"}))} style={{...S.btn(period.type==="month"?"#f59e0b":"#e2e8f0",false),padding:"6px 12px",fontSize:12,color:period.type==="month"?"white":"#64748b"}}>شهري</button>
        {period.type==="year"&&<select style={{...S.sel,flex:1,fontSize:12}} value={period.year} onChange={e=>setPeriod(p=>({...p,year:e.target.value}))}>{years.map(y=><option key={y} value={y}>{y}</option>)}</select>}
        {period.type==="month"&&<select style={{...S.sel,flex:1,fontSize:12}} value={period.month} onChange={e=>setPeriod(p=>({...p,month:e.target.value}))}>{months.map(m=><option key={m} value={m}>{m}</option>)}</select>}
      </div>
    );
  };
  const Dot=({color})=><div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>;
  const Btn=({label,onClick,bg="#e2e8f0",color="#64748b",style={}})=><button onClick={onClick} style={{background:bg,border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color,fontSize:11,fontFamily:"Tajawal",...style}}>{label}</button>;

  const PmBtns=({val,onChange})=>(
    <div style={{display:"flex",gap:8}}>
      {["نقدي","كريدي"].map(m=><button key={m} onClick={()=>onChange(m)} style={{flex:1,padding:10,border:"2px solid",borderColor:val===m?(m==="نقدي"?"#10b981":"#f59e0b"):"#e2e8f0",borderRadius:10,background:val===m?(m==="نقدي"?"#10b98122":"#f59e0b22"):"transparent",color:val===m?(m==="نقدي"?"#10b981":"#f59e0b"):"#94a3b8",fontFamily:"Tajawal",fontWeight:700,cursor:"pointer",fontSize:13}}>{m==="نقدي"?"💵 نقدي":"💳 كريدي"}</button>)}
    </div>
  );

  const CatSection=({catType})=>{
    const isE=catType==="expense";
    return <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
        <span style={{fontWeight:800,fontSize:17,color:"white"}}>{isE?"تصنيفات النفقات":"تصنيفات الدخل"}</span>
        <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
      </div>
      <div style={{padding:"10px 14px"}}>
        <button style={{...S.btn(isE?"#ef4444":"#10b981"),padding:"11px"}} onClick={()=>om("addMCat",{catType})}>+ إضافة تصنيف جديد</button>
      </div>
      {cats[catType].map(cat=>(
        <div key={cat.id} style={{borderBottom:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{display:"flex",alignItems:"center",padding:"16px 14px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`cat_${cat.id}`]:!p[`cat_${cat.id}`]}))}>
            <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontSize:22,marginLeft:14,flexShrink:0}}>
              <Ico src={cat.ci} fb={cat.icon}/>
            </div>
            <span style={{flex:1,fontWeight:800,fontSize:16,color:"white"}}>{cat.name}</span>
            <div style={{display:"flex",gap:8,opacity:ovExp[`del_cat_${cat.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
              <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"white",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setEi({...cat,catType});om("edMCat");}}>تعديل</button>
              <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("mcat",cat.id,cat.name,catType)}>حذف</button>
            </div>
            <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setOvExp(p=>({...p,[`del_cat_${cat.id}`]:!p[`del_cat_${cat.id}`]}));}}>
              <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
            </div>
            <span style={{color:"rgba(255,255,255,.35)",fontSize:15}}>{ovExp[`cat_${cat.id}`]?"▲":"▼"}</span>
          </div>
          {ovExp[`cat_${cat.id}`]&&<>
            {cat.subs.map(s=>{
              const used=txs.some(t=>t.subId===s.id);
              return <div key={s.id} style={{display:"flex",alignItems:"center",padding:"13px 14px 13px 28px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.3)",marginLeft:12,flexShrink:0}}/>
                <span style={{flex:1,fontSize:15,color:"rgba(255,255,255,.85)"}}>{s.name}</span>
                {used&&<span style={{fontSize:10,color:"#fcd34d",marginLeft:6}}>●</span>}
                <div style={{display:"flex",gap:8,opacity:ovExp[`del_sub_${s.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
                  <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:7,padding:"3px 8px",cursor:"pointer",color:"white",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setEi({...s,catType,catId:cat.id});om("edSCat");}}>تعديل</button>
                  <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"3px 8px",cursor:"pointer",color:"#fca5a5",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>ask("scat",s.id,s.name,{ct:catType,cid:cat.id})}>حذف</button>
                </div>
                <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_sub_${s.id}`]:!p[`del_sub_${s.id}`]}))}>
                  <span style={{fontSize:16,color:"rgba(255,255,255,.25)"}}>⋯</span>
                </div>
              </div>;
            })}
            <div style={{padding:"8px 14px 10px 28px"}}>
              <button style={{background:"rgba(255,255,255,.06)",border:"1px dashed rgba(255,255,255,.2)",borderRadius:8,padding:"8px 14px",cursor:"pointer",color:"rgba(255,255,255,.5)",fontSize:13,fontFamily:"Tajawal",width:"100%"}} onClick={()=>om("addSCat",{catType,catId:cat.id,catName:cat.name})}>+ إضافة فرع</button>
            </div>
          </>}
        </div>
      ))}
      {cats[catType].length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد تصنيفات — أضف تصنيفاً</div>}
    </>;
  };

  const AccCard=({sec,icon,label,color,amount,count,children})=>(
    <div style={{...S.card,padding:0,overflow:"hidden",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[sec]:!p[sec]}))}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px"}}>
        <div style={{width:44,height:44,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{label}</div><div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{count}</div></div>
        <div style={{fontSize:17,fontWeight:900,color,marginLeft:8}}>{fmt(amount)}</div>
        <div style={{color:"#94a3b8",fontSize:22,transform:ovExp[sec]?"rotate(90deg)":"none",transition:"transform .2s"}}>›</div>
      </div>
      {ovExp[sec]&&<div style={{borderTop:"1px solid #e2e8f0",padding:"12px 16px",background:"#f8fafc55"}}>{children}</div>}
    </div>
  );

  return (
    <div dir="rtl" style={{fontFamily:"'Tajawal',sans-serif",background:"#f1f5f9",minHeight:"100vh",color:"#1e293b",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
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
            <div className="mi" onClick={()=>{setDrw(false);setPage("settings");}}><Settings size={18}/> الإعدادات <ChevronLeft size={14} style={{marginRight:"auto"}}/></div>
            <div className="mi" onClick={()=>setDp("cloud")}><Cloud size={18}/> السحابة <ChevronLeft size={14} style={{marginRight:"auto"}}/></div>
            <div className="mi" onClick={()=>om("changePw")}><span style={{fontSize:18}}>🔑</span> تغيير كلمة السر <ChevronLeft size={14} style={{marginRight:"auto"}}/></div>
            <div className="mi" onClick={()=>{sessionStorage.removeItem("mhf_auth");setIsAuth(false);setDrw(false);}} style={{color:"#ef4444"}}><span style={{fontSize:18}}>🚪</span> تسجيل خروج</div>
          </>}
          {dp==="settings"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"white"}}>الإعدادات</span>
              <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px 4px",fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700}}>الأموال والممتلكات</div>
            {[{id:"banks",icon:"🏦",label:"البنوك"},{id:"cash",icon:"💵",label:"الكاش"},{id:"assets",icon:"🏠",label:"الممتلكات"}].map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"14px",borderBottom:"1px solid rgba(255,255,255,.07)",cursor:"pointer"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <span style={{flex:1,fontSize:15,fontWeight:700,color:"white"}}>{item.label}</span>
                <ChevronLeft size={18} color="rgba(255,255,255,.4)"/>
              </div>
            ))}
            <div style={{padding:"12px 14px 4px",fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700}}>التصنيفات</div>
            {[{id:"expCat",icon:"🔴",label:"تصنيفات النفقات"},{id:"incCat",icon:"🟢",label:"تصنيفات الدخل"}].map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"14px",borderBottom:"1px solid rgba(255,255,255,.07)",cursor:"pointer"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <span style={{flex:1,fontSize:15,fontWeight:700,color:"white"}}>{item.label}</span>
                <ChevronLeft size={18} color="rgba(255,255,255,.4)"/>
              </div>
            ))}
          </>}

          {dp==="banks"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"white"}}>البنوك</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#10b981"),padding:"11px"}} onClick={()=>om("addBank")}>+ إضافة بنك جديد</button>
            </div>
            {banks.map(b=>(
              <div key={b.id} style={{borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{display:"flex",alignItems:"center",padding:"16px 14px",cursor:"pointer"}} onClick={()=>setDp(`bank_${b.id}`)}>
                  <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🏦</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:800,color:"white"}}>{b.name}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{b.accounts.length} حساب</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",opacity:ovExp[`del_bank_${b.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
                    <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("bank",b.id,b.name)}>حذف</button>
                  </div>
                  <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setOvExp(p=>({...p,[`del_bank_${b.id}`]:!p[`del_bank_${b.id}`]}));}}>
                    <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                  </div>
                  <ChevronLeft size={18} color="rgba(255,255,255,.35)"/>
                </div>
              </div>
            ))}
            {banks.length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد بنوك — أضف بنكاً</div>}
          </>}

          {dp&&dp.startsWith("bank_")&&(()=>{
            const bid=parseInt(dp.replace("bank_",""));
            const bank=banks.find(b=>b.id===bid);
            if(!bank)return null;
            return <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
                <span style={{fontWeight:800,fontSize:17,color:"white"}}>🏦 {bank.name}</span>
                <button onClick={()=>setDp("banks")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
              </div>
              <div style={{padding:"10px 14px"}}>
                <button style={{...S.btn("#6366f1"),padding:"11px"}} onClick={()=>{setSelBk(bid);om("addBAcc");}}>+ إضافة حساب جديد</button>
              </div>
              {bank.accounts.map(a=>(
                <div key={a.id} style={{display:"flex",alignItems:"center",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:a.color,marginLeft:14,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:700,color:"white"}}>{a.name}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{a.type}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",opacity:ovExp[`del_acc_${a.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
                    <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"white",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setSelBk(bid);setEi({...a,_bid:bid});om("edBAcc");}}>تعديل</button>
                    <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("bacc",a.id,a.name,bid)}>حذف</button>
                  </div>
                  <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_acc_${a.id}`]:!p[`del_acc_${a.id}`]}))}>
                    <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                  </div>
                </div>
              ))}
              {bank.accounts.length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد حسابات — أضف حساباً</div>}
            </>;
          })()}

          {dp==="cash"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"white"}}>الكاش</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#f59e0b"),padding:"11px"}} onClick={()=>om("addCash")}>+ إضافة محفظة جديدة</button>
            </div>
            {cash.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>💵</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800,color:"white"}}>{c.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{c.type}</div>
                </div>
                <div style={{display:"flex",gap:8,opacity:ovExp[`del_c_${c.id}`]?1:0,transition:"opacity .2s"}}>
                  <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"white",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setEi(c);om("edCash");}}>تعديل</button>
                  <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("cash",c.id,c.name)}>حذف</button>
                </div>
                <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_c_${c.id}`]:!p[`del_c_${c.id}`]}))}>
                  <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                </div>
              </div>
            ))}
            {cash.length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد محافظ — أضف محفظة</div>}
          </>}

          {dp==="assets"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"white"}}>الممتلكات</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#14b8a6"),padding:"11px"}} onClick={()=>om("addAst")}>+ إضافة ممتلك جديد</button>
            </div>
            {assets.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🏠</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800,color:"white"}}>{a.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{a.type}</div>
                </div>
                <div style={{display:"flex",gap:8,opacity:ovExp[`del_a_${a.id}`]?1:0,transition:"opacity .2s"}}>
                  <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"white",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setEi(a);om("edAst");}}>تعديل</button>
                  <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("ast",a.id,a.name)}>حذف</button>
                </div>
                <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_a_${a.id}`]:!p[`del_a_${a.id}`]}))}>
                  <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                </div>
              </div>
            ))}
            {assets.length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد ممتلكات — أضف ممتلكاً</div>}
          </>}

          {dp==="loans"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"white"}}>السلف والقروض</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#8b5cf6"),padding:"11px"}} onClick={()=>om("addLoan")}>+ إضافة سلفة/قرض جديد</button>
            </div>
            {loans.map(l=>(
              <div key={l.id} style={{padding:"14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{background:l.kind==="أعطيت"?"#10b98130":"#ef444430",color:l.kind==="أعطيت"?"#10b981":"#ef4444",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:700}}>{l.kind}</span>
                    <span style={{fontSize:15,fontWeight:700,color:"white"}}>{l.person}</span>
                  </div>
                  <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer"}} onClick={()=>ask("loan",l.id,l.person)}><Trash2 size={13} color="#fca5a5"/></button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>المتبقي: <strong style={{color:"#f59e0b"}}>{fmt(l.remaining)}</strong></span>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>الأصل: {fmt(l.amount)}</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <input placeholder="مبلغ السداد..." style={{...S.inp,flex:1,padding:"7px 10px",fontSize:12}} id={`lp${l.id}`} type="number"/>
                  <button style={S.btn("#10b981",false)} onClick={()=>{const el=document.getElementById(`lp${l.id}`);if(el?.value){setLoans(p=>p.map(x=>x.id===l.id?{...x,remaining:Math.max(0,x.remaining-parseFloat(el.value))}:x));el.value="";}}}> سدد</button>
                </div>
              </div>
            ))}
            {loans.length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد سلف — أضف سلفة</div>}
          </>}

          {dp==="expCat"&&<CatSection catType="expense"/>}
          {dp==="incCat"&&<CatSection catType="income"/>}
          {dp==="cloud"&&<>
            <div className="mi" onClick={()=>setDp(null)}><ChevronRight size={16}/> رجوع</div>
            <div style={{fontWeight:700,color:"white",margin:"12px 0"}}>السحابة والنسخ</div>
            {bkMsg&&<div style={{background:"rgba(16,185,129,.2)",border:"1px solid #10b981",borderRadius:10,padding:"10px",marginBottom:12,fontSize:13,color:"#10b981"}}>{bkMsg}</div>}
            <div style={{...S.card,marginBottom:10,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}><div style={{fontWeight:600,color:"white",marginBottom:8}}>📤 تصدير</div><button style={S.btn("#10b981")} onClick={expData}>تحميل النسخة</button></div>
            <div style={{...S.card,marginBottom:10,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}><div style={{fontWeight:600,color:"white",marginBottom:8}}>📥 استيراد</div><button style={S.btn("#6366f1")} onClick={()=>fRef.current.click()}>اختر ملف JSON</button></div>
            <div style={{...S.card,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.1)"}}>
              <div style={{fontWeight:600,color:"#ef4444",marginBottom:8}}>🗑️ إعادة ضبط كامل</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:8}}>كتمسح كل البيانات وترجع للبيانات الافتراضية</div>
              <input style={{...S.inp,marginBottom:8}} type="password" placeholder="كلمة السر للتأكيد" value={resetCode} onChange={e=>{setResetCode(e.target.value);setResetErr(false);}}/>
              {resetErr&&<div style={{color:"#ef4444",fontSize:12,marginBottom:6}}>❌ كلمة السر غلط</div>}
              <button style={S.btn("#ef4444")} onClick={()=>{if(resetCode!==appPassword){setResetErr(true);return;}resetData();setResetCode("");}}>تأكيد إعادة الضبط</button>
              <button style={{...S.btn("#f59e0b"),marginTop:8}} onClick={()=>{
                setBudgetSettings(p=>({...p,
                  allocations:[
                    {id:1,name:"المصاريف",icon:"🛒",color:"#ef4444",pct:40,accountKeys:[],minAlert:300,emergencyTransfer:0,type:"expenses"},
                    {id:2,name:"الطوارئ",icon:"🚨",color:"#f59e0b",pct:20,accountKeys:[],type:"emergency"},
                    {id:3,name:"الممتلكات",icon:"🏠",color:"#14b8a6",pct:10,accountKeys:[],type:"assets"},
                    {id:4,name:"الاستثمار",icon:"📈",color:"#10b981",pct:20,accountKeys:[],type:"investment"},
                    {id:5,name:"التقاعد",icon:"🏦",color:"#6366f1",pct:10,accountKeys:[],type:"retirement",loanable:true}
                  ],
                  tranches:[
                    {id:1,min:0,max:5000,pcts:{1:100,2:0,3:0,4:0,5:0}},
                    {id:2,min:5001,max:10000,pcts:{1:60,2:15,3:10,4:10,5:5}},
                    {id:3,min:10001,max:15000,pcts:{1:50,2:15,3:10,4:17,5:8}},
                    {id:4,min:15001,max:20000,pcts:{1:45,2:15,3:10,4:20,5:10}},
                    {id:5,min:20001,max:999999,pcts:{1:40,2:15,3:10,4:25,5:10}}
                  ]
                }));
                setErr("✅ تم إعادة ضبط الميزانية");setTimeout(()=>setErr(null),3000);
              }}>🔄 إعادة ضبط الميزانية فقط</button>
            </div>
          </>}
        </div>
      </div>

      {/* HEADER */}
      <div style={{padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:12,color:"#94a3b8"}}>{new Date().toLocaleString("ar-MA",{month:"long",year:"numeric"})}</div><div style={{fontSize:22,fontWeight:900}}>محفظتي 💰</div></div>
        <button onClick={()=>{setDrw(true);setDp(null);}} style={{background:"#2e8fa8",border:"none",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:6,cursor:"pointer",color:"white",fontFamily:"Tajawal",fontSize:13,fontWeight:700}}>
          <Menu size={16}/> القائمة
        </button>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 90px",display:"flex",flexDirection:"column",gap:14}}>

        {page==="dashboard"&&<>
          <div style={{background:"linear-gradient(135deg,#10b981,#059669)",borderRadius:20,padding:24,position:"relative",overflow:"hidden",cursor:"pointer"}} onClick={()=>setPage("overview")}>
            <div style={{position:"absolute",top:-20,left:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
            <div style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,.2)",borderRadius:8,padding:"3px 10px",fontSize:11,color:"white",fontWeight:700}}>اضغط للتفاصيل ←</div>
            <button onClick={e=>{e.stopPropagation();setHideBalance(p=>!p);}} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",color:"white",fontSize:16}}>{hideBalance?"👁️":"🙈"}</button>
            <div style={{fontSize:12,color:"rgba(255,255,255,.8)",marginBottom:6}}>صافي الثروة الكلية</div>
            <div style={{fontSize:30,fontWeight:900,color:"white"}}>{hideBalance?"••••••":fmt(totBal+totAst+totGiv-totOwd)}</div>
            <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>البنوك والكاش</div><div style={{fontSize:13,fontWeight:700,color:"white"}}>{hideBalance?"•••":fmt(totBal)}</div></div>
              <div style={{width:1,background:"rgba(255,255,255,.3)"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>الممتلكات</div><div style={{fontSize:13,fontWeight:700,color:"white"}}>{hideBalance?"•••":fmt(totAst)}</div></div>
              <div style={{width:1,background:"rgba(255,255,255,.3)"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>السلف</div><div style={{fontSize:13,fontWeight:700,color:"white"}}>{hideBalance?"•••":fmt(totGiv-totOwd)}</div></div>
            </div>
          </div>

          <PeriodSelector/>

                    {/* أهداف شهرية */}
          {(()=>{
            const goals=budgetSettings.goals||{incomeGoal:15000,incomeAuto:false,expenseGoal:5000,expenseAuto:false};
            const allMonths=[...new Set(txs.map(t=>t.date.slice(0,7)))];
            const avgInc=allMonths.length>0?txs.filter(t=>t.type==="income"&&!t.isTransfer).reduce((s,t)=>s+t.amount,0)/allMonths.length:0;
            const avgExp=allMonths.length>0?txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isAsset).reduce((s,t)=>s+t.amount,0)/allMonths.length:0;
            const incGoal=goals.incomeAuto?Math.round(avgInc):goals.incomeGoal;
            const expGoal=goals.expenseAuto?Math.round(avgExp):goals.expenseGoal;
            const filtP=filterByPeriod(txs.filter(t=>!t.isTransfer&&t.pm!=="تحويل"));
            const goalMult=period.type==="year"?12:period.type==="all"?Math.max(allMonths.length,1):1;
            const pInc=filtP.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
            const pExp=filtP.filter(t=>t.type==="expense"&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const incGoalAdj=incGoal*goalMult;
            const expGoalAdj=expGoal*goalMult;
            const incPct=incGoalAdj>0?Math.min((pInc/incGoalAdj)*100,100):0;
            const expPct=expGoalAdj>0?Math.min((pExp/expGoalAdj)*100,100):0;
            const r=40;const circ=2*Math.PI*r;
            return(
              <div style={S.card}>
                <div style={{fontSize:13,fontWeight:800,color:"#1e293b",marginBottom:14}}>🎯 الأهداف</div>
                <div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"center"}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{position:"relative",width:90,height:90,margin:"0 auto 8px"}}>
                      <svg width="90" height="90" viewBox="0 0 90 90" style={{transform:"rotate(-90deg)"}}>
                        <circle cx="45" cy="45" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                        <circle cx="45" cy="45" r={r} fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={circ-(circ*incPct/100)}/>
                      </svg>
                      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                        <div style={{fontSize:16,fontWeight:900,color:"#10b981"}}>{Math.round(incPct)}%</div>
                        <div style={{fontSize:8,color:"#94a3b8"}}>وصلت</div>
                      </div>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>💰 هدف الدخل</div>
                    <div style={{fontSize:10,color:"#64748b"}}>{fmt(pInc)} / {fmt(incGoalAdj)}</div>
                  </div>
                  <div style={{width:1,height:70,background:"#e2e8f0"}}/>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{position:"relative",width:90,height:90,margin:"0 auto 8px"}}>
                      <svg width="90" height="90" viewBox="0 0 90 90" style={{transform:"rotate(-90deg)"}}>
                        <circle cx="45" cy="45" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                        <circle cx="45" cy="45" r={r} fill="none" stroke={expPct>90?"#ef4444":"#f59e0b"} strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={circ-(circ*expPct/100)}/>
                      </svg>
                      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                        <div style={{fontSize:16,fontWeight:900,color:expPct>90?"#ef4444":"#f59e0b"}}>{Math.round(expPct)}%</div>
                        <div style={{fontSize:8,color:"#94a3b8"}}>صرفت</div>
                      </div>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>💸 هدف المصاريف</div>
                    <div style={{fontSize:10,color:"#64748b"}}>{fmt(pExp)} / {fmt(expGoalAdj)}</div>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Budget Widget */}
          {(()=>{
            const allMonths=[...new Set(txs.filter(t=>!t.isTransfer&&t.pm!=="تحويل").map(t=>t.date.slice(0,7)))];
            const threshold=budgetSettings.threshold;
            const expAlloc=budgetSettings.allocations.find(a=>a.name==="المصاريف");
            const expPct=expAlloc?.pct||30;
            const totBudget=allMonths.reduce((s,m)=>{
              const mI=txs.filter(t=>t.type==="income"&&t.date.startsWith(m)&&!t.isTransfer&&t.pm!=="تحويل").reduce((ss,t)=>ss+t.amount,0);
              return s+(mI<=threshold?mI:threshold+(mI-threshold)*(expPct/100));
            },0);
            const totExpReal=txs.filter(t=>t.type==="expense"&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const remaining=totBudget-totExpReal;
            const pct=totBudget>0?Math.min((totExpReal/totBudget)*100,100):0;
            const color=pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
            if(totBudget===0)return null;
            return(
              <div style={{...S.card,cursor:"pointer"}} onClick={()=>setPage("budget")}>
                <div style={{...S.row,marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:38,height:38,borderRadius:10,background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛒</div>
                    <div><div style={{fontWeight:700,fontSize:14}}>ميزانية المصاريف</div><div style={{fontSize:11,color:"#94a3b8"}}>إجمالي كلي</div></div>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,color:"#94a3b8"}}>الباقي</div>
                    <div style={{fontSize:18,fontWeight:900,color:remaining>=0?color:"#ef4444"}}>{fmt(Math.abs(remaining))}</div>
                  </div>
                </div>
                <div className="pbar"><div className="pfill" style={{width:pct+"%",background:color}}/></div>
                <div style={{...S.row,marginTop:6}}>
                  <span style={{fontSize:11,color:"#94a3b8"}}>مصروف: {fmt(totExpReal)}</span>
                  <span style={{fontSize:11,color:"#94a3b8"}}>الميزانية: {fmt(totBudget)}</span>
                </div>
              </div>
            );
          })()}

          <div style={{position:"relative",height:64,marginBottom:8}}>
            {showActions&&<div style={{position:"absolute",bottom:70,left:0,right:0,display:"flex",gap:8,flexWrap:"wrap",zIndex:10,background:"white",borderRadius:16,padding:12,boxShadow:"0 4px 20px rgba(0,0,0,.12)"}}>
              <button style={{...S.btn("#ef4444"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("addTx",{txType:"expense"});}}>+ مصروف</button>
              <button style={{...S.btn("#10b981"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("addTx",{txType:"income"});}}>+ دخل</button>
              <button style={{...S.btn("#6366f1"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("transfer");}}>⇄ تحويل</button>
              <button style={{...S.btn("#14b8a6"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("buyAsset");}}>🏠 ممتلك</button>
              <button style={{...S.btn("#8b5cf6"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);setPage("debts");}}>💰 ديون</button>
              <button style={{...S.btn("#f97316"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("addLoan",{kind:"أعطيت"});}}>🤝 سلفة</button>
            </div>}
            <button onClick={()=>setShowActions(p=>!p)} style={{position:"absolute",bottom:0,left:"50%",transform:showActions?"translateX(-50%) rotate(45deg)":"translateX(-50%)",width:56,height:56,borderRadius:"50%",background:showActions?"#ef4444":"linear-gradient(135deg,#10b981,#059669)",border:"none",color:"white",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(16,185,129,.4)",transition:"all .2s"}}>+</button>
          </div>

          <div style={S.card}>
            
            <div style={{...S.row,marginBottom:12,marginTop:8}}><span style={{fontWeight:700}}>آخر المعاملات</span><button style={{background:"none",border:"none",color:"#10b981",fontSize:12,cursor:"pointer",fontFamily:"Tajawal"}} onClick={()=>setPage("transactions")}>عرض الكل ←</button></div>
            {txs.slice(0,5).map(t=>{const{cn,sn,ic,hi}=tl(t);return(
              <div key={t.id} className="tx">
                <div style={{width:38,height:38,borderRadius:10,background:t.type==="income"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Ico src={hi?ic:null} fb={ic} sz={18}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13,fontWeight:600}}>{t.desc||cn}</span>{t.pm==="كريدي"&&<span style={{fontSize:9,background:"#f59e0b22",color:"#f59e0b",padding:"1px 6px",borderRadius:10,fontWeight:700}}>💳</span>}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{t.date}{sn&&` • ${sn}`}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  <Btn label="✏️" onClick={()=>{setEi({...t,amount:t.amount.toString(),catId:t.catId?.toString(),subId:t.subId?.toString()});om("edTx");}}/>
                </div>
              </div>
            );})}
          </div>
        </>}

        {page==="overview"&&(()=>{
          const ovPage=ovExp.ovPage||"main";
          const ovBank=ovExp.ovBank||null;

          if(ovPage==="banks") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setOvExp(p=>({...p,ovPage:"main",ovBank:null}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🏦 البنوك</span>
            </div>
            <div style={{...S.card,textAlign:"center",background:"#10b98110",border:"1px solid #10b98133",padding:12}}>
              <div style={{fontSize:11,color:"#10b981"}}>إجمالي البنوك</div>
              <div style={{fontSize:22,fontWeight:900,color:"#10b981"}}>{fmt(banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0))}</div>
            </div>
            {banks.map(b=>(
              <div key={b.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"bank",ovBank:b.id}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏦</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{b.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{b.accounts.length} حساب</div></div>
                  <span style={{fontSize:16,fontWeight:900,color:"#10b981"}}>{fmt(b.accounts.reduce((s,a)=>s+a.balance,0))}</span>
                  <span style={{color:"#94a3b8",fontSize:20}}>›</span>
                </div>
              </div>
            ))}
            {banks.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#94a3b8"}}>لا توجد بنوك</div>}
          </>;

          if(ovPage==="bank"&&ovBank){
            const bank=banks.find(b=>b.id===ovBank);
            if(!bank)return null;
            return <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setOvExp(p=>({...p,ovPage:"banks",ovBank:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>🏦 {bank.name}</span>
              </div>
              {bank.accounts.map(a=>(
                <div key={a.id} style={{...S.card,padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Dot color={a.color}/>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{a.name}</div><div style={{fontSize:12,color:"#94a3b8"}}>{a.type}</div></div>
                    <span style={{fontSize:18,fontWeight:900,color:a.color}}>{fmt(a.balance)}</span>
                  </div>
                </div>
              ))}
            </>;
          }

          if(ovPage==="cash") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setOvExp(p=>({...p,ovPage:"main"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>💵 الكاش</span>
            </div>
            {cash.map(c=>(
              <div key={c.id} style={{...S.card,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"#f59e0b22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>💵</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{c.name}</div><div style={{fontSize:12,color:"#94a3b8"}}>{c.type}</div></div>
                  <span style={{fontSize:18,fontWeight:900,color:c.color}}>{fmt(c.balance)}</span>
                </div>
              </div>
            ))}
            {cash.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#94a3b8"}}>لا توجد محافظ</div>}
          </>;

          if(ovPage==="assets") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setOvExp(p=>({...p,ovPage:"main"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🏠 الممتلكات</span>
            </div>
            {assets.map(a=>(
              <div key={a.id} style={{...S.card,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"#14b8a622",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏠</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{a.name}</div><div style={{fontSize:12,color:"#94a3b8"}}>{a.type}</div></div>
                  <span style={{fontSize:18,fontWeight:900,color:"#14b8a6"}}>{fmt(a.value)}</span>
                </div>
              </div>
            ))}
            {assets.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#94a3b8"}}>لا توجد ممتلكات</div>}
          </>;

          if(ovPage==="loans") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setOvExp(p=>({...p,ovPage:"main"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🤝 السلف والقروض</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{...S.card,flex:1,textAlign:"center",background:"#10b98110",padding:12}}><div style={{fontSize:11,color:"#10b981"}}>سلفت</div><div style={{fontSize:18,fontWeight:900,color:"#10b981"}}>{fmt(totGiv)}</div></div>
              <div style={{...S.card,flex:1,textAlign:"center",background:"#ef444410",padding:12}}><div style={{fontSize:11,color:"#ef4444"}}>عليّ</div><div style={{fontSize:18,fontWeight:900,color:"#ef4444"}}>{fmt(totOwd)}</div></div>
            </div>
            {loans.map(l=>(
              <div key={l.id} style={{...S.card,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:l.kind==="أعطيت"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{l.kind==="أعطيت"?"↑":"↓"}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{l.person}</div><div style={{fontSize:12,color:"#94a3b8"}}>{l.date}</div></div>
                  <div style={{textAlign:"left"}}><div style={{fontSize:16,fontWeight:900,color:l.kind==="أعطيت"?"#10b981":"#ef4444"}}>{fmt(l.remaining)}</div><div style={{fontSize:10,color:"#94a3b8"}}>من {fmt(l.amount)}</div></div>
                </div>
              </div>
            ))}
            {loans.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#94a3b8"}}>لا توجد سلف</div>}
          </>;

          return <>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setPage("dashboard")}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>الملخص المالي</span>
            </div>
            <div style={{borderRadius:18,padding:20,border:"1px solid #cbd5e1",textAlign:"center",background:"#f8fafc"}}>
              <div style={{fontSize:11,color:"#64748b",marginBottom:6}}>صافي الثروة</div>
              <div style={{fontSize:34,fontWeight:900,color:"#10b981"}}>{fmt(totBal+totAst+totGiv-totOwd)}</div>
            </div>
            {[
              {key:"banks",icon:"🏦",label:"البنوك",color:"#10b981",amount:banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0),sub:`${banks.length} بنك`},
              {key:"cash",icon:"💵",label:"الكاش",color:"#f59e0b",amount:cash.reduce((s,c)=>s+c.balance,0),sub:`${cash.length} محفظة`},
              {key:"assets",icon:"🏠",label:"الممتلكات",color:"#14b8a6",amount:totAst,sub:`${assets.length} ممتلك`},
              {key:"invest",icon:"📈",label:"الاستثمار",color:"#10b981",amount:(()=>{const inv=(budgetSettings.allocations||[]).find(a=>a.type==="investment");if(!inv)return 0;let b=0;(inv.accountKeys||[]).forEach(k=>{const p=k.split("_");if(p[0]==="b"){const bk=banks.find(x=>x.id===parseInt(p[1]));const ac=bk?.accounts.find(x=>x.id===parseInt(p[2]));if(ac)b+=ac.balance;}else if(p[0]==="c"){const c=cash.find(x=>x.id===parseInt(p[1]));if(c)b+=c.balance;}});return b;})(),sub:"الاستثمار"},
              {key:"loans",icon:"🤝",label:"السلف والقروض",color:"#8b5cf6",amount:totGiv+totOwd,sub:`${loans.length} سلفة`},
            ].map(item=>(
              <div key={item.key} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:item.key,ovBank:null}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:48,height:48,borderRadius:14,background:item.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{item.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>{item.label}</div><div style={{fontSize:11,color:"#94a3b8"}}>{item.sub}</div></div>
                  <span style={{fontSize:17,fontWeight:900,color:item.color}}>{fmt(item.amount)}</span>
                  <span style={{color:"#94a3b8",fontSize:20}}>›</span>
                </div>
              </div>
            ))}
          </>;
        })()}
        {page==="settings"&&<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontWeight:800,fontSize:18}}>الإعدادات</span>
            <button onClick={()=>setPage("dashboard")} style={{background:"#1e2548",border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",color:"#0f172a",fontFamily:"Tajawal",fontSize:13}}>← رجوع</button>
          </div>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#94a3b8",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>الأموال والممتلكات</div>
            {[{id:"banks",icon:"🏦",label:"البنوك"},{id:"cash",icon:"💵",label:"الكاش"},{id:"assets",icon:"🏠",label:"الممتلكات"}].map((item,i,arr)=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid #e2e8f0":"none"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <span style={{flex:1,fontSize:16,fontWeight:700,color:"#1e293b"}}>{item.label}</span>
                <ChevronLeft size={18} color="#94a3b8"/>
              </div>
            ))}
          </div>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#94a3b8",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>التصنيفات</div>
            {[{id:"expCat",icon:"🔴",label:"تصنيفات النفقات",count:`${cats.expense.length} تصنيف`},{id:"incCat",icon:"🟢",label:"تصنيفات الدخل",count:`${cats.income.length} تصنيف`}].map((item,i,arr)=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid #e2e8f0":"none"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#1e293b"}}>{item.label}</div><div style={{fontSize:12,color:"#94a3b8"}}>{item.count}</div></div>
                <ChevronLeft size={18} color="#94a3b8"/>
              </div>
            ))}
          </div>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#94a3b8",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>الحساب</div>
            <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:"1px solid #e2e8f0"}} onClick={()=>om("changePw")}>
              <div style={{width:42,height:42,borderRadius:12,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🔑</div>
              <span style={{flex:1,fontSize:16,fontWeight:700,color:"#1e293b"}}>تغيير كلمة السر</span>
              <ChevronLeft size={18} color="#94a3b8"/>
            </div>
            <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:"1px solid #e2e8f0"}} onClick={()=>setDp("cloud")}>
              <div style={{width:42,height:42,borderRadius:12,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>☁️</div>
              <span style={{flex:1,fontSize:16,fontWeight:700,color:"#1e293b"}}>النسخ الاحتياطي</span>
              <ChevronLeft size={18} color="#94a3b8"/>
            </div>
            <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer"}} onClick={()=>{sessionStorage.removeItem("mhf_auth");setIsAuth(false);}}>
              <div style={{width:42,height:42,borderRadius:12,background:"#fff0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🚪</div>
              <span style={{flex:1,fontSize:16,fontWeight:700,color:"#ef4444"}}>تسجيل خروج</span>
              <ChevronLeft size={18} color="#94a3b8"/>
            </div>
          </div>
          {dp&&["banks","cash","assets","expCat","incCat","cloud"].includes(dp)&&(
            <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,#0c0f1e,#0e1428)",zIndex:100,overflowY:"auto",padding:"20px 20px 90px"}}>
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');`}</style>
              <div dir="rtl" style={{fontFamily:"Tajawal",color:"#0f172a",display:"flex",flexDirection:"column",gap:14}}>
                {dp==="banks"&&<>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontWeight:800,fontSize:18,color:"white"}}>البنوك</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  <button style={{...S.btn("#10b981"),padding:"13px"}} onClick={()=>om("addBank")}>+ إضافة بنك جديد</button>
                  {banks.map(b=>(
                    <div key={b.id} style={{background:"#1a1d27",borderRadius:14,overflow:"hidden",border:"1px solid #1e2548"}}>
                      <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:ovExp[`bk_${b.id}`]?"1px solid #1e2548":"none"}} onClick={()=>setOvExp(p=>({...p,[`bk_${b.id}`]:!p[`bk_${b.id}`]}))}>
                        <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14}}>🏦</div>
                        <span style={{flex:1,fontSize:16,fontWeight:800,color:"white"}}>{b.name}</span>
                        <div style={{display:"flex",gap:8,opacity:ovExp[`del_bank_${b.id}`]?1:0,transition:"opacity .2s",marginLeft:8}} onClick={e=>e.stopPropagation()}>
                          <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("bank",b.id,b.name)}>حذف</button>
                        </div>
                        <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setOvExp(p=>({...p,[`del_bank_${b.id}`]:!p[`del_bank_${b.id}`]}));}}>
                          <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                        </div>
                      </div>
                      {ovExp[`bk_${b.id}`]&&<>
                        {b.accounts.map(a=>(
                          <div key={a.id} style={{display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid #1e2548"}}>
                            <div style={{width:8,height:8,borderRadius:"50%",background:a.color,marginLeft:14}}/>
                            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"white"}}>{a.name}</div><div style={{fontSize:12,color:"#475569"}}>{a.type}</div></div>
                            <div style={{display:"flex",gap:8,opacity:ovExp[`del_acc_${a.id}`]?1:0,transition:"opacity .2s"}}>
                              <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"white",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setSelBk(b.id);setEi({...a,_bid:b.id});om("edBAcc");}}>تعديل</button>
                              <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"#fca5a5",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>ask("bacc",a.id,a.name,b.id)}>حذف</button>
                            </div>
                            <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_acc_${a.id}`]:!p[`del_acc_${a.id}`]}))}>
                              <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                            </div>
                          </div>
                        ))}
                        <div style={{padding:"10px 16px"}}>
                          <button style={{...S.btn("#6366f1"),padding:"10px"}} onClick={()=>{setSelBk(b.id);om("addBAcc");}}>+ إضافة حساب</button>
                        </div>
                      </>}
                    </div>
                  ))}
                  {banks.length===0&&<div style={{textAlign:"center",padding:40,color:"#475569"}}>لا توجد بنوك</div>}
                </>}
                {dp==="cash"&&<>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontWeight:800,fontSize:18,color:"white"}}>الكاش</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  <button style={{...S.btn("#f59e0b"),padding:"13px"}} onClick={()=>om("addCash")}>+ إضافة محفظة جديدة</button>
                  {cash.map(c=>(
                    <div key={c.id} style={{display:"flex",alignItems:"center",padding:"16px",background:"#1a1d27",borderRadius:14,border:"1px solid #1e2548"}}>
                      <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14}}>💵</div>
                      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,color:"white"}}>{c.name}</div><div style={{fontSize:12,color:"#475569"}}>{c.type}</div></div>
                      <div style={{display:"flex",gap:8,opacity:ovExp[`del_c_${c.id}`]?1:0,transition:"opacity .2s"}}>
                        <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"white",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setEi(c);om("edCash");}}>تعديل</button>
                        <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"#fca5a5",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>ask("cash",c.id,c.name)}>حذف</button>
                      </div>
                      <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_c_${c.id}`]:!p[`del_c_${c.id}`]}))}>
                        <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                      </div>
                    </div>
                  ))}
                  {cash.length===0&&<div style={{textAlign:"center",padding:40,color:"#475569"}}>لا توجد محافظ</div>}
                </>}
                {dp==="assets"&&<>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontWeight:800,fontSize:18,color:"white"}}>الممتلكات</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  <button style={{...S.btn("#14b8a6"),padding:"13px"}} onClick={()=>om("addAst")}>+ إضافة ممتلك جديد</button>
                  {assets.map(a=>(
                    <div key={a.id} style={{display:"flex",alignItems:"center",padding:"16px",background:"#1a1d27",borderRadius:14,border:"1px solid #1e2548"}}>
                      <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14}}>🏠</div>
                      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,color:"white"}}>{a.name}</div><div style={{fontSize:12,color:"#475569"}}>{a.type}{a.note?` · ${a.note}`:""}</div></div>
                      <div style={{display:"flex",gap:8,opacity:ovExp[`del_a_${a.id}`]?1:0,transition:"opacity .2s"}}>
                        <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"white",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setEi(a);om("edAst");}}>تعديل</button>
                        <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"#fca5a5",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>ask("ast",a.id,a.name)}>حذف</button>
                      </div>
                      <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_a_${a.id}`]:!p[`del_a_${a.id}`]}))}>
                        <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                      </div>
                    </div>
                  ))}
                  {assets.length===0&&<div style={{textAlign:"center",padding:40,color:"#475569"}}>لا توجد ممتلكات</div>}
                </>}
                {dp==="expCat"&&<CatSection catType="expense"/>}
                {dp==="incCat"&&<CatSection catType="income"/>}
                {dp==="cloud"&&<>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontWeight:800,fontSize:18,color:"white"}}>النسخ الاحتياطي</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"white",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  {bkMsg&&<div style={{background:"rgba(16,185,129,.2)",border:"1px solid #10b981",borderRadius:10,padding:"10px",fontSize:13,color:"#10b981"}}>{bkMsg}</div>}
                  <button style={{...S.btn("#10b981"),padding:"13px"}} onClick={expData}>📤 تحميل نسخة احتياطية</button>
                  <button style={{...S.btn("#6366f1"),padding:"13px"}} onClick={()=>fRef.current.click()}>📥 استيراد من ملف</button>
                  <div style={{background:"#1a1d27",borderRadius:14,padding:16,border:"1px solid #ef444433"}}>
                    <div style={{fontWeight:700,color:"#ef4444",marginBottom:8,fontSize:15}}>🗑️ إعادة ضبط كامل</div>
                    <div style={{fontSize:12,color:"#475569",marginBottom:12}}>كتمسح كل البيانات بما فيها البنوك والتصنيفات</div>
                    <input style={{...S.inp,marginBottom:8}} type="password" placeholder="كلمة السر للتأكيد" value={resetCode} onChange={e=>{setResetCode(e.target.value);setResetErr(false);}}/>
                    {resetErr&&<div style={{color:"#ef4444",fontSize:12,marginBottom:6}}>❌ كلمة السر غلط</div>}
                    <button style={S.btn("#ef4444")} onClick={()=>{if(resetCode!==appPassword){setResetErr(true);return;}resetData();setResetCode("");}}>تأكيد إعادة الضبط</button>
                  </div>
                </>}
              </div>
            </div>
          )}
        </>}

        {page==="debts"&&(()=>{
          const creditTxs=txs.filter(t=>t.pm==="كريدي"&&t.type==="expense"&&!t.creditPaid);
          const creditTotal=creditTxs.reduce((s,t)=>s+t.amount,0);
          const salafGiven=loans.filter(l=>!l.wi&&l.kind==="أعطيت");
          const salafTaken=loans.filter(l=>!l.wi&&l.kind==="أخذت");
          const qorudh=loans.filter(l=>l.wi);
          const totSalaf=salafGiven.reduce((s,l)=>s+l.remaining,0);
          const totDain=salafTaken.reduce((s,l)=>s+l.remaining,0)+qorudh.reduce((s,l)=>s+l.remaining,0);

          if(ovExp.debtPage)return <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontWeight:800,fontSize:17}}>
                {ovExp.debtPage==="salaf"&&"🤝 السلف"}
                {ovExp.debtPage==="qorudh"&&"🏦 الكريدي الكبير"}
                {ovExp.debtPage==="credit"&&"💳 الكريدي الصغير"}
              </span>
              <button style={{...S.btn("#1e2548",false),padding:"7px 12px",fontSize:12}} onClick={()=>setOvExp(p=>({...p,debtPage:null}))}>← رجوع</button>
            </div>
            {ovExp.debtPage==="salaf"&&<>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1,textAlign:"center",background:"#10b98110",borderRadius:12,padding:"12px 6px",border:"1px solid #10b98133"}}>
                  <div style={{fontSize:11,color:"#10b981",fontWeight:700}}>سلفت</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#10b981"}}>{fmt(totSalaf)}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{salafGiven.length} شخص</div>
                </div>
                <div style={{flex:1,textAlign:"center",background:"#ef444410",borderRadius:12,padding:"12px 6px",border:"1px solid #ef444433"}}>
                  <div style={{fontSize:11,color:"#ef4444",fontWeight:700}}>عندي دَين</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#ef4444"}}>{fmt(totDain-qorudh.reduce((s,l)=>s+l.remaining,0))}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{salafTaken.length} شخص</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.btn("#10b981"),flex:1,padding:"11px"}} onClick={()=>om("addLoan",{kind:"أعطيت"})}>+ سلفت لحد</button>
                <button style={{...S.btn("#ef4444"),flex:1,padding:"11px"}} onClick={()=>om("addLoan",{kind:"أخذت"})}>+ أخذت سلفة</button>
              </div>
              {[...salafGiven,...salafTaken].map(l=>(
                <div key={l.id} style={S.card}>
                  <div style={{...S.row,marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:38,height:38,borderRadius:10,background:l.kind==="أعطيت"?"#10b98115":"#ef444415",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{l.kind==="أعطيت"?"↑":"↓"}</div>
                      <div><div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{l.person}</div><div style={{fontSize:11,color:"#94a3b8"}}>{l.date}{l.note?` · ${l.note}`:""}</div></div>
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:16,fontWeight:900,color:l.kind==="أعطيت"?"#10b981":"#ef4444"}}>{fmt(l.remaining)}</div>
                      {l.remaining<l.amount&&<div style={{fontSize:10,color:"#94a3b8"}}>من {fmt(l.amount)}</div>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{...S.btn("#10b981"),flex:1,padding:"9px",fontSize:12}} onClick={()=>{setEi(l);om("returnLoan");}}>
                      {l.kind==="أعطيت"?"✓ خلصني":"✓ خلصته"}
                    </button>
                    <button style={{background:"#ef444415",border:"1px solid #ef444433",borderRadius:10,padding:"9px 12px",cursor:"pointer"}} onClick={()=>ask("loan",l.id,l.person)}><Trash2 size={14} color="#ef4444"/></button>
                  </div>
                </div>
              ))}
              {salafGiven.length===0&&salafTaken.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#94a3b8"}}>لا توجد سلف</div>}
            </>}
            {ovExp.debtPage==="qorudh"&&<>
              <button style={{...S.btn("#6366f1"),padding:"12px"}} onClick={()=>om("addLoan",{kind:"أخذت",wi:true})}>+ إضافة قرض جديد</button>
              {qorudh.map(l=>{
                const pct=Math.min(((l.amount-l.remaining)/l.amount)*100,100);
                return(
                  <div key={l.id} style={S.card}>
                    <div style={{...S.row,marginBottom:10}}>
                      <div><div style={{fontSize:15,fontWeight:700,color:"#1e293b"}}>{l.person}</div><div style={{fontSize:12,color:"#94a3b8"}}>فائدة {l.interest}%{l.inst?` · قسط ${fmt(l.minst)}/شهر`:""}</div></div>
                      <div style={{textAlign:"left"}}><div style={{fontSize:17,fontWeight:900,color:"#ef4444"}}>{fmt(l.remaining)}</div><div style={{fontSize:11,color:"#94a3b8"}}>من {fmt(l.amount)}</div></div>
                    </div>
                    <div className="pbar" style={{marginBottom:6}}><div className="pfill" style={{width:pct+"%",background:"#10b981"}}/></div>
                    <div style={{...S.row,marginBottom:10}}>
                      <span style={{fontSize:11,color:"#94a3b8"}}>مسدد {pct.toFixed(0)}%</span>
                      <span style={{fontSize:11,color:"#94a3b8"}}>متبقي {fmt(l.remaining)}</span>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <input id={`lp${l.id}`} type="number" placeholder="مبلغ السداد..." style={{...S.inp,flex:1,padding:"9px 12px"}}/>
                      <button style={{...S.btn("#10b981",false),padding:"9px 14px"}} onClick={()=>{const el=document.getElementById(`lp${l.id}`);if(el?.value){setLoans(p=>p.map(x=>x.id===l.id?{...x,remaining:Math.max(0,x.remaining-parseFloat(el.value))}:x));el.value="";}}}> سدد</button>
                      <button style={{background:"#ef444415",border:"1px solid #ef444433",borderRadius:10,padding:"9px 12px",cursor:"pointer"}} onClick={()=>ask("loan",l.id,l.person)}><Trash2 size={14} color="#ef4444"/></button>
                    </div>
                  </div>
                );
              })}
              {qorudh.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#94a3b8"}}>لا توجد قروض</div>}
            </>}
            {ovExp.debtPage==="credit"&&<>
              <div style={{...S.card,textAlign:"center",background:"#f59e0b10",border:"1px solid #f59e0b33"}}>
                <div style={{fontSize:12,color:"#f59e0b",marginBottom:4,fontWeight:700}}>إجمالي الكريدي غير المخلص</div>
                <div style={{fontSize:28,fontWeight:900,color:"#f59e0b"}}>{fmt(creditTotal)}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{creditTxs.length} معاملة</div>
              </div>
              {creditTxs.length===0?
                <div style={{...S.card,textAlign:"center",padding:30}}><div style={{fontSize:30,marginBottom:8}}>✅</div><div style={{color:"#94a3b8"}}>ما كاين ديون كريدي</div></div>:
                creditTxs.map(t=>(
                  <div key={t.id} style={S.card}>
                    <div style={{...S.row,marginBottom:10}}>
                      <div><div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{t.desc}</div><div style={{fontSize:11,color:"#94a3b8"}}>{t.date}</div></div>
                      <div style={{fontSize:17,fontWeight:900,color:"#f59e0b"}}>{fmt(t.amount)}</div>
                    </div>
                    {ovExp[`pay_${t.id}`]?
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <select style={{...S.sel,border:`2px solid ${ovExp[`payErr_${t.id}`]?"#ef4444":"#e2e8f0"}`}} value={ovExp[`pacc_${t.id}`]||""} onChange={e=>setOvExp(p=>({...p,[`pacc_${t.id}`]:e.target.value,[`payErr_${t.id}`]:false}))}>
                          <option value="">⚠️ اختر الحساب</option>
                          {allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}
                        </select>
                        {ovExp[`payErr_${t.id}`]&&<div style={{color:"#ef4444",fontSize:12}}>⛔ خاصك تختار الحساب</div>}
                        <button style={{...S.btn("#10b981"),padding:"10px",fontSize:13}} onClick={()=>{
                          if(!ovExp[`pacc_${t.id}`]){setOvExp(p=>({...p,[`payErr_${t.id}`]:true}));return;}
                          const acc=allAcc.find(a=>a.key===ovExp[`pacc_${t.id}`]);
                          if(!acc)return;
                          if(t.amount>(acc.balance||0)){showErr("⛔ الرصيد غير كافي");return;}
                          updBal(acc.ref,t.amount,"expense","add");
                          setTxs(p=>p.map(x=>x.id===t.id?{...x,creditPaid:true,ref:acc.ref}:x));
                          setOvExp(p=>({...p,[`pay_${t.id}`]:false,[`pacc_${t.id}`]:""}));
                        }}>✓ تأكيد الخلاص</button>
                        <button style={{background:"none",border:"none",color:"#94a3b8",fontFamily:"Tajawal",fontSize:12,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`pay_${t.id}`]:false}))}>إلغاء</button>
                      </div>:
                      <button style={{...S.btn("#f59e0b"),padding:"10px",fontSize:13}} onClick={()=>setOvExp(p=>({...p,[`pay_${t.id}`]:true}))}>💳 خلصت — اختر الحساب</button>
                    }
                  </div>
                ))
              }
            </>}
          </>;

          return <>
            <span style={{fontWeight:800,fontSize:18}}>💰 الديون والسلف</span>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,textAlign:"center",...S.card,background:"#ef444410",border:"1px solid #ef444433",padding:"14px 8px"}}>
                <div style={{fontSize:11,color:"#ef4444",fontWeight:700}}>عندي دَين</div>
                <div style={{fontSize:20,fontWeight:900,color:"#ef4444"}}>{fmt(totDain)}</div>
              </div>
              <div style={{flex:1,textAlign:"center",...S.card,background:"#10b98110",border:"1px solid #10b98133",padding:"14px 8px"}}>
                <div style={{fontSize:11,color:"#10b981",fontWeight:700}}>سلفت</div>
                <div style={{fontSize:20,fontWeight:900,color:"#10b981"}}>{fmt(totSalaf)}</div>
              </div>
              <div style={{flex:1,textAlign:"center",...S.card,background:"#f59e0b10",border:"1px solid #f59e0b33",padding:"14px 8px"}}>
                <div style={{fontSize:11,color:"#f59e0b",fontWeight:700}}>كريدي</div>
                <div style={{fontSize:20,fontWeight:900,color:"#f59e0b"}}>{fmt(creditTotal)}</div>
              </div>
            </div>
            {[
              {key:"salaf",icon:"🤝",title:"السلف",sub:"اللي سلفت واللي عندك دَين عند حد",color:"#10b981",count:`${salafGiven.length+salafTaken.length} سلفة`},
              {key:"qorudh",icon:"🏦",title:"الكريدي الكبير",sub:"قروض بنكية أو عند أشخاص",color:"#6366f1",count:`${qorudh.length} قرض`},
              {key:"credit",icon:"💳",title:"الكريدي الصغير",sub:"مشتريات بالكريدي لم تُخلص",color:"#f59e0b",count:`${creditTxs.length} معاملة · ${fmt(creditTotal)}`},
            ].map(item=>(
              <div key={item.key} style={{...S.card,cursor:"pointer",padding:0,overflow:"hidden"}} onClick={()=>setOvExp(p=>({...p,debtPage:item.key}))}>
                <div style={{display:"flex",alignItems:"center",padding:"16px"}}>
                  <div style={{width:50,height:50,borderRadius:14,background:item.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:800,color:"#1e293b"}}>{item.title}</div>
                    <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{item.sub}</div>
                    <div style={{fontSize:12,fontWeight:700,color:item.color,marginTop:4}}>{item.count}</div>
                  </div>
                  <ChevronLeft size={20} color="#94a3b8"/>
                </div>
              </div>
            ))}
          </>;
        })()}

        {page==="transactions"&&<>
          <div style={{...S.row}}><span style={{fontWeight:700,fontSize:16}}>المعاملات</span></div>
          <div style={{display:"flex",gap:8}}>
            {[["الدخل",mInc,"#10b981"],["المصاريف",mExp,"#ef4444"],["الصافي",mInc-mExp,mInc-mExp>=0?"#10b981":"#ef4444"]].map(([l,v,c])=>(
              <div key={l} style={{...S.card,flex:1,textAlign:"center",padding:"10px 4px"}}><div style={{fontSize:10,color:c}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:c}}>{fmt(Math.abs(v))}</div></div>
            ))}
          </div>
          <div style={S.card}>
            {txs.map(t=>{const{cn,sn,ic,hi}=tl(t);const ac=al(t.ref);const isOpen=ovExp[`tx_${t.id}`];return(
              <div key={t.id}>
                {/* سطر مضغوط */}
                <div className="tx" style={{cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`tx_${t.id}`]:!p[`tx_${t.id}`]}))}>
                  <div style={{width:36,height:36,borderRadius:10,background:t.type==="income"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}><Ico src={hi?ic:null} fb={ic}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc||cn}</div>
                    <div style={{fontSize:10,color:"#94a3b8"}}>{t.date}</div>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444",whiteSpace:"nowrap"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                </div>
                {/* تفاصيل عند الكليك */}
                {isOpen&&<div style={{background:"#f8fafc",borderRadius:10,padding:12,margin:"4px 0 8px",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>
                    <div>{cn}{sn&&` ← ${sn}`}</div>
                    {ac&&<div style={{marginTop:2}}>📍 {ac}</div>}
                    {t.pm&&<div style={{marginTop:2}}>💳 {t.pm}</div>}
                    {t.note&&<div style={{marginTop:2}}>📝 {t.note}</div>}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{...S.btn("#6366f1"),flex:1,padding:"8px",fontSize:12}} onClick={e=>{e.stopPropagation();setEi({...t,amount:t.amount.toString(),catId:t.catId?.toString(),subId:t.subId?.toString()});om("edTx");}}>✏️ تعديل</button>
                    <button style={{...S.btn("#ef4444"),flex:1,padding:"8px",fontSize:12}} onClick={e=>{e.stopPropagation();ask("tx",t.id,t.desc||cn);}}>🗑️ حذف</button>
                  </div>
                </div>}
              </div>
            );})}
          </div>
        </>}

        {page==="budget"&&(()=>{
          const threshold=budgetSettings.threshold;
          const allMonths=[...new Set(txs.map(t=>t.date.slice(0,7)))].sort().reverse();
          const monthData=allMonths.map(m=>{
            const inc=txs.filter(t=>t.type==="income"&&t.date.startsWith(m)&&t.pm!=="تحويل"&&!t.isTransfer).reduce((s,t)=>s+t.amount,0);
            const exp=txs.filter(t=>t.type==="expense"&&t.date.startsWith(m)&&t.pm!=="تحميل"&&!t.isTransfer&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const surplus=inc>threshold?inc-threshold:0;
            const expBudget=inc<=threshold?inc:threshold+surplus*(budgetSettings.allocations.find(a=>a.name==="المصاريف")?.pct||30)/100;
            return{m,inc,exp,surplus,expBudget,
              allocs:budgetSettings.allocations.map(a=>({...a,amt:surplus*(a.pct/100)})),
              label:new Date(m+"-01").toLocaleString("ar-MA",{month:"long",year:"numeric"})
            };
          });
          const totInc=monthData.reduce((s,m)=>s+m.inc,0);
          const totExp=monthData.reduce((s,m)=>s+m.exp,0);
          const totExpBudget=monthData.reduce((s,m)=>s+m.expBudget,0);
          const allocTotals=budgetSettings.allocations.map(a=>({...a,total:monthData.reduce((s,m)=>s+(m.surplus*(a.pct/100)),0)}));

          // التوزيع المقترح للشهر الحالي
          const curMonthData=monthData.find(m=>m.m===MONTH);
          const curSurplus=curMonthData?.surplus||0;

          const getBucketBalance=(a)=>{
            if(!a||!a.accountKeys||a.accountKeys.length===0)return 0;
            let bal=0;
            (a.accountKeys||[]).forEach(key=>{
              const parts=key.split("_");
              if(parts[0]==="b"){const bk=banks.find(x=>x.id===parseInt(parts[1]));const ac=bk?.accounts.find(x=>x.id===parseInt(parts[2]));if(ac)bal+=ac.balance;}
              else if(parts[0]==="c"){const c=cash.find(x=>x.id===parseInt(parts[1]));if(c)bal+=c.balance;}
            });
            return bal;
          };
          return <>
            <PeriodSelector/>
            <div style={{...S.row,marginBottom:4}}>
              <span style={{fontWeight:700,fontSize:16}}>الميزانية الذكية</span>
              <button style={{...S.btn("#2e8fa8",false),padding:"8px 14px",fontSize:13}} onClick={()=>om("budgetSettings")}>⚙️ الإعدادات</button>
            </div>

            {/* التوزيع المقترح لهذا الشهر */}
            {curSurplus>0&&(()=>{
              const completedKeys=ovExp.completedAllocs||[];
              return(
                <div style={{...S.card,background:"linear-gradient(135deg,#6366f115,#6366f105)",border:"1px solid #6366f133"}}>
                  <div style={{...S.row,marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:15,color:"#1e293b"}}>💡 التوزيع المقترح</div>
                      <div style={{fontSize:12,color:"#64748b"}}>{new Date(MONTH+"-01").toLocaleString("ar-MA",{month:"long",year:"numeric"})}</div>
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:11,color:"#94a3b8"}}>الفائض</div>
                      <div style={{fontSize:16,fontWeight:900,color:"#6366f1"}}>{fmt(curSurplus)}</div>
                    </div>
                  </div>
                  {budgetSettings.allocations.filter(a=>a.name!=="المصاريف").map(a=>{
                    const amt=curSurplus*(a.pct/100);
                    const acc=allAcc.find(x=>x.key===a.accountKey);
                    const done=completedKeys.includes(a.id);
                    return(
                      <div key={a.id} style={{display:"flex",alignItems:"center",padding:"12px",background:done?"#10b98108":"white",borderRadius:12,marginBottom:8,border:`1px solid ${done?"#10b98133":"#e2e8f0"}`,opacity:done?0.7:1}}>
                        <div style={{width:40,height:40,borderRadius:11,background:a.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginLeft:12,flexShrink:0}}>{a.icon}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{a.name}</div>
                          <div style={{fontSize:11,color:"#94a3b8"}}>
                            {acc?`→ ${acc.name}`:"⚠️ ما كاين حساب"}
                          </div>
                        </div>
                        <div style={{textAlign:"left",marginLeft:8}}>
                          <div style={{fontSize:16,fontWeight:900,color:a.color}}>{fmt(amt)}</div>
                          <div style={{fontSize:10,color:"#94a3b8"}}>{a.pct}%</div>
                        </div>
                        {done?
                          <div style={{width:32,height:32,borderRadius:"50%",background:"#10b981",display:"flex",alignItems:"center",justifyContent:"center",marginRight:8,flexShrink:0}}>
                            <Check size={16} color="white"/>
                          </div>:
                          <button style={{...S.btn(a.color,false),padding:"6px 10px",fontSize:11,marginRight:8,flexShrink:0,borderRadius:8}} onClick={()=>setOvExp(p=>({...p,completedAllocs:[...(p.completedAllocs||[]),a.id]}))}>
                            ✓ تم
                          </button>
                        }
                      </div>
                    );
                  })}
                  {completedKeys.length>0&&<button style={{background:"none",border:"none",color:"#94a3b8",fontFamily:"Tajawal",fontSize:12,cursor:"pointer",marginTop:4}} onClick={()=>setOvExp(p=>({...p,completedAllocs:[]}))}>إعادة تعيين ✕</button>}
                </div>
              );
            })()}

            <div style={{...S.card,background:"linear-gradient(135deg,#10b98115,#10b98105)",border:"1px solid #10b98133"}}>
              <div style={{fontSize:12,color:"#64748b",marginBottom:10,fontWeight:700}}>📊 الملخص الكلي</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <div style={{flex:1,textAlign:"center",background:"#10b98110",borderRadius:10,padding:"10px 4px"}}>
                  <div style={{fontSize:10,color:"#10b981"}}>إجمالي الدخل</div>
                  <div style={{fontSize:15,fontWeight:900,color:"#10b981"}}>{fmt(totInc)}</div>
                </div>
                <div style={{flex:1,textAlign:"center",background:"#ef444410",borderRadius:10,padding:"10px 4px"}}>
                  <div style={{fontSize:10,color:"#ef4444"}}>إجمالي المصاريف</div>
                  <div style={{fontSize:15,fontWeight:900,color:"#ef4444"}}>{fmt(totExp)}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:8,fontWeight:700}}>توزيع الفائض الكلي:</div>
              {allocTotals.filter(a=>a.name!=="المصاريف").map(a=>{
                const acc=allAcc.find(x=>x.key===a.accountKey);
                return(
                  <div key={a.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:"white",borderRadius:10,marginBottom:6,border:"1px solid #e2e8f0"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:36,height:36,borderRadius:10,background:a.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{a.icon}</div>
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:"#1e293b"}}>{a.name}</div>
                        <div style={{fontSize:11,color:"#94a3b8"}}>{acc?acc.name:"ما كاين حساب"} · {a.pct}%</div>
                      </div>
                    </div>
                    <div style={{fontSize:16,fontWeight:900,color:a.color}}>{fmt(a.total)}</div>
                  </div>
                );
              })}
              <div style={{padding:"10px 12px",background:"white",borderRadius:10,border:"1px solid #e2e8f0"}}>
                <div style={{...S.row,marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:18}}>🛒</span><span style={{fontWeight:700,fontSize:13,color:"#1e293b"}}>ميزانية المصاريف</span></div>
                  <span style={{fontSize:13,fontWeight:700,color:totExpBudget-totExp>=0?"#10b981":"#ef4444"}}>{fmt(totExpBudget-totExp)}</span>
                </div>
                <div className="pbar"><div className="pfill" style={{width:Math.min((totExp/totExpBudget)*100,100)+"%",background:totExpBudget-totExp>=0?"#10b981":"#ef4444"}}/></div>
                <div style={{...S.row,marginTop:6}}>
                  <span style={{fontSize:11,color:"#94a3b8"}}>مصروف: {fmt(totExp)}</span>
                  <span style={{fontSize:11,color:"#94a3b8"}}>الميزانية: {fmt(totExpBudget)}</span>
                </div>
              </div>
            </div>

            {monthData.length>0&&<>
              <button style={{...S.btn("#6366f1"),padding:"11px"}} onClick={()=>setOvExp(p=>({...p,budgetDetails:!p.budgetDetails}))}>
                {ovExp.budgetDetails?"▲ إخفاء تفاصيل الأشهر":"▼ عرض تفاصيل الأشهر"}
              </button>
              {ovExp.budgetDetails&&monthData.map(md=>{
                const pctExp=md.expBudget>0?Math.min((md.exp/md.expBudget)*100,100):0;
                const barColor=pctExp>90?"#ef4444":pctExp>70?"#f59e0b":"#10b981";
                return(
                  <div key={md.m} style={{...S.card,padding:0,overflow:"hidden"}}>
                    <div style={{background:"#f1f5f9",padding:"12px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontWeight:700,fontSize:14,color:"#1e293b"}}>{md.label}</span>
                      <span style={{fontSize:12,color:"#64748b"}}>دخل: <strong style={{color:"#10b981"}}>{fmt(md.inc)}</strong></span>
                    </div>
                    <div style={{padding:"12px 16px"}}>
                      <div style={{...S.row,marginBottom:6}}>
                        <span style={{fontSize:13,color:"#1e293b"}}>🛒 المصاريف</span>
                        <span style={{fontSize:13,fontWeight:700,color:barColor}}>{fmt(md.exp)} / {fmt(md.expBudget)}</span>
                      </div>
                      <div className="pbar"><div className="pfill" style={{width:pctExp+"%",background:barColor}}/></div>
                      {md.surplus>0&&<div style={{marginTop:10}}>
                        {md.allocs.filter(a=>a.name!=="المصاريف").map(a=>(
                          <div key={a.id} style={{...S.row,marginBottom:4}}>
                            <span style={{fontSize:12,color:"#64748b"}}>{a.icon} {a.name}</span>
                            <span style={{fontSize:13,fontWeight:700,color:a.color}}>{fmt(a.amt)}</span>
                          </div>
                        ))}
                      </div>}
                    </div>
                  </div>
                );
              })}
            </>}
            {monthData.length===0&&<div style={{...S.card,textAlign:"center",padding:30}}>
              <div style={{fontSize:40,marginBottom:10}}>💰</div>
              <div style={{fontSize:14,color:"#94a3b8"}}>ما كاين معاملات — زيد دخل أو مصروف</div>
            </div>}
          </>;
        })()}

        {page==="savings"&&<>
          <div style={{...S.row}}><span style={{fontWeight:700,fontSize:16}}>أهداف الادخار</span><button style={{...S.btn(),width:"auto",padding:"8px 14px",fontSize:13}} onClick={()=>om("addSaving")}>+ هدف</button></div>
          {savings.map(s=>{const pct=Math.min((s.saved/s.target)*100,100);return(
            <div key={s.id} style={S.card}>
              <div style={{...S.row,marginBottom:12}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:12,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.icon}</div><div><div style={{fontWeight:700,fontSize:15}}>{s.name}</div><div style={{fontSize:12,color:"#94a3b8"}}>الهدف: {fmt(s.target)}</div></div></div>
                <div style={{fontSize:18,fontWeight:900,color:s.color}}>{pct.toFixed(0)}%</div>
              </div>
              <div className="pbar"><div className="pfill" style={{width:pct+"%",background:s.color}}/></div>
              <div style={{...S.row,marginTop:10}}><span style={{fontSize:12,color:"#64748b"}}>مدخر: <strong style={{color:s.color}}>{fmt(s.saved)}</strong></span><button style={{...S.btn(s.color,false),padding:"6px 14px",fontSize:12}} onClick={()=>{setSelSv(s);om("dep");}}>+ إضافة</button></div>
            </div>
          );})}
        </>}

        {page==="reports"&&(()=>{
          const repTab=ovExp.repTab||"yearly";
          const years=[...new Set(txs.map(t=>t.date.slice(0,4)))].sort().reverse();

          if(repTab==="yearly"){
            const selYear=ovExp.repYear||(years[0]||"2026");
            const selMonth=ovExp.repMonth||null;
            const yTxs=txs.filter(t=>t.date.startsWith(selYear)&&!t.isTransfer&&t.pm!=="تحويل");
            const yInc=yTxs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
            const yExp=yTxs.filter(t=>t.type==="expense"&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const monthsData=Array.from({length:12},(_,i)=>{
              const m=`${selYear}-${String(i+1).padStart(2,"0")}`;
              const mTxs=yTxs.filter(t=>t.date.startsWith(m));
              const inc=mTxs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
              const exp=mTxs.filter(t=>t.type==="expense"&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
              return{m,lbl:new Date(m+"-01").toLocaleString("ar-MA",{month:"long"}),inc,exp,save:inc-exp,txs:mTxs};
            });
            return <>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setOvExp(p=>({...p,repTab:"yearly",repMonth:null}))} style={{...S.btn("#10b981",false),padding:"8px 14px",fontSize:13}}>📆 سنوي</button>
                <button onClick={()=>setOvExp(p=>({...p,repTab:"filter"}))} style={{...S.btn("#e2e8f0",false),padding:"8px 14px",fontSize:13,color:"#64748b"}}>🔍 فلتر</button>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <select style={{...S.sel,flex:1}} value={selYear} onChange={e=>setOvExp(p=>({...p,repYear:e.target.value,repMonth:null}))}>
                  {years.map(y=><option key={y} value={y}>{y}</option>)}
                </select>
                {selMonth&&<button style={{...S.btn("#e2e8f0",false),padding:"8px 12px",fontSize:13,color:"#64748b"}} onClick={()=>setOvExp(p=>({...p,repMonth:null}))}>← رجوع</button>}
              </div>
              {!selMonth&&<>
                <div style={{...S.card,background:"#f8fafc"}}>
                  <div style={{fontSize:12,color:"#64748b",marginBottom:10,fontWeight:700}}>📅 ملخص {selYear}</div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1,textAlign:"center",background:"#10b98110",borderRadius:10,padding:"10px 4px"}}><div style={{fontSize:10,color:"#10b981"}}>الدخل</div><div style={{fontSize:14,fontWeight:900,color:"#10b981"}}>{fmt(yInc)}</div></div>
                    <div style={{flex:1,textAlign:"center",background:"#ef444410",borderRadius:10,padding:"10px 4px"}}><div style={{fontSize:10,color:"#ef4444"}}>المصاريف</div><div style={{fontSize:14,fontWeight:900,color:"#ef4444"}}>{fmt(yExp)}</div></div>
                    <div style={{flex:1,textAlign:"center",background:"#6366f110",borderRadius:10,padding:"10px 4px"}}><div style={{fontSize:10,color:"#6366f1"}}>التوفير</div><div style={{fontSize:14,fontWeight:900,color:"#6366f1"}}>{fmt(yInc-yExp)}</div></div>
                  </div>
                </div>
                <div style={S.card}>
                  {monthsData.map(md=>{
                    const pct=md.inc>0?Math.min((md.exp/md.inc)*100,100):0;
                    const color=pct>90?"#ef4444":pct>70?"#f59e0b":"#10b981";
                    return(
                      <div key={md.m} style={{padding:"12px 0",borderBottom:"1px solid #e2e8f0",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,repMonth:md.m}))}>
                        <div style={{...S.row,marginBottom:6}}>
                          <span style={{fontWeight:700,fontSize:14}}>{md.lbl}</span>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:12,fontWeight:700,color:md.save>=0?"#10b981":"#ef4444"}}>{fmt(Math.abs(md.save))}</span>
                            <span style={{color:"#94a3b8",fontSize:16}}>›</span>
                          </div>
                        </div>
                        {(md.inc>0||md.exp>0)&&<>
                          <div className="pbar"><div className="pfill" style={{width:pct+"%",background:color}}/></div>
                          <div style={{...S.row,marginTop:4}}>
                            <span style={{fontSize:10,color:"#94a3b8"}}>دخل: {fmt(md.inc)}</span>
                            <span style={{fontSize:10,color:"#94a3b8"}}>مصاريف: {fmt(md.exp)}</span>
                          </div>
                        </>}
                      </div>
                    );
                  })}
                </div>
              </>}
              {selMonth&&(()=>{
                const md=monthsData.find(m=>m.m===selMonth);
                if(!md)return null;
                const incTxs=md.txs.filter(t=>t.type==="income");
                const expTxs=md.txs.filter(t=>t.type==="expense"&&!t.isAsset);
                return <>
                  <div style={{...S.card,background:"#f8fafc"}}>
                    <div style={{fontWeight:800,fontSize:15,marginBottom:10}}>{md.lbl} {selYear}</div>
                    <div style={{display:"flex",gap:8}}>
                      <div style={{flex:1,textAlign:"center",background:"#10b98110",borderRadius:10,padding:"8px 4px"}}><div style={{fontSize:10,color:"#10b981"}}>الدخل</div><div style={{fontSize:14,fontWeight:900,color:"#10b981"}}>{fmt(md.inc)}</div></div>
                      <div style={{flex:1,textAlign:"center",background:"#ef444410",borderRadius:10,padding:"8px 4px"}}><div style={{fontSize:10,color:"#ef4444"}}>المصاريف</div><div style={{fontSize:14,fontWeight:900,color:"#ef4444"}}>{fmt(md.exp)}</div></div>
                      <div style={{flex:1,textAlign:"center",background:"#6366f110",borderRadius:10,padding:"8px 4px"}}><div style={{fontSize:10,color:"#6366f1"}}>التوفير</div><div style={{fontSize:14,fontWeight:900,color:"#6366f1"}}>{fmt(Math.abs(md.save))}</div></div>
                    </div>
                  </div>
                  {incTxs.length>0&&<div style={S.card}>
                    <div style={{fontWeight:700,marginBottom:10,color:"#10b981"}}>💰 المداخل ({incTxs.length})</div>
                    {incTxs.map(t=>{const c=gc("income",t.catId);return(
                      <div key={t.id} className="tx">
                        <div style={{width:36,height:36,borderRadius:10,background:"#10b98120",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{c?.icon||"💰"}</div>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.desc||c?.name||"—"}</div><div style={{fontSize:10,color:"#94a3b8"}}>{t.date}</div></div>
                        <span style={{fontSize:13,fontWeight:700,color:"#10b981"}}>+{fmt(t.amount)}</span>
                      </div>
                    );})}
                  </div>}
                  {expTxs.length>0&&<div style={S.card}>
                    <div style={{fontWeight:700,marginBottom:10,color:"#ef4444"}}>💸 المصاريف ({expTxs.length})</div>
                    {expTxs.map(t=>{const c=gc("expense",t.catId);return(
                      <div key={t.id} className="tx">
                        <div style={{width:36,height:36,borderRadius:10,background:"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{c?.icon||"💸"}</div>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.desc||c?.name||"—"}</div><div style={{fontSize:10,color:"#94a3b8"}}>{t.date}</div></div>
                        <span style={{fontSize:13,fontWeight:700,color:"#ef4444"}}>-{fmt(t.amount)}</span>
                      </div>
                    );})}
                  </div>}
                </>;
              })()}
            </>;
          }

          if(repTab==="filter"){
            const dateFrom=ovExp.fDateFrom||"2017-01-01";
            const dateTo=ovExp.fDateTo||new Date().toISOString().split("T")[0];
            const catFilter=ovExp.fCat||"all";
            let filtTxs=txs.filter(t=>t.date>=dateFrom&&t.date<=dateTo&&!t.isTransfer&&t.pm!=="تحويل");
            if(catFilter==="income") filtTxs=filtTxs.filter(t=>t.type==="income");
            else if(catFilter==="expense") filtTxs=filtTxs.filter(t=>t.type==="expense"&&!t.isAsset);
            else if(catFilter==="salaf") filtTxs=loans.map(l=>({...l,type:"loan"}));
            else if(catFilter==="credit") filtTxs=filtTxs.filter(t=>t.pm==="كريدي"&&t.type==="expense");
            const total=catFilter==="salaf"?loans.reduce((s,l)=>s+l.remaining,0):filtTxs.reduce((s,t)=>s+t.amount,0);
            return <>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setOvExp(p=>({...p,repTab:"yearly"}))} style={{...S.btn("#e2e8f0",false),padding:"8px 14px",fontSize:13,color:"#64748b"}}>📆 سنوي</button>
                <button onClick={()=>setOvExp(p=>({...p,repTab:"filter"}))} style={{...S.btn("#10b981",false),padding:"8px 14px",fontSize:13}}>🔍 فلتر</button>
              </div>
              <div style={{...S.card,padding:"12px 16px"}}>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <div style={{flex:1}}><div style={{fontSize:10,color:"#94a3b8",marginBottom:4}}>من</div><input style={{...S.inp,padding:"8px 10px",fontSize:12}} type="date" value={dateFrom} onChange={e=>setOvExp(p=>({...p,fDateFrom:e.target.value}))}/></div>
                  <div style={{flex:1}}><div style={{fontSize:10,color:"#94a3b8",marginBottom:4}}>إلى</div><input style={{...S.inp,padding:"8px 10px",fontSize:12}} type="date" value={dateTo} onChange={e=>setOvExp(p=>({...p,fDateTo:e.target.value}))}/></div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[["all","كلشي","#10b981"],["income","مداخل","#10b981"],["expense","مصاريف","#ef4444"],["salaf","سلف","#8b5cf6"],["credit","كريدي","#f59e0b"]].map(([val,lbl,col])=>(
                    <button key={val} onClick={()=>setOvExp(p=>({...p,fCat:val}))}
                      style={{...S.btn(catFilter===val?col:"#e2e8f0",false),padding:"7px 12px",fontSize:12,color:catFilter===val?"white":"#64748b"}}>{lbl}</button>
                  ))}
                </div>
              </div>
              <div style={{...S.card,textAlign:"center",background:"#10b98110",border:"1px solid #10b98133"}}>
                <div style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:4}}>إجمالي الفترة</div>
                <div style={{fontSize:26,fontWeight:900,color:"#10b981"}}>{fmt(total)}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{filtTxs.length} معاملة</div>
              </div>
              <div style={S.card}>
                {filtTxs.slice(0,50).map(t=>{
                  const c=gc(t.type==="income"?"income":"expense",t.catId);
                  return(<div key={t.id} className="tx">
                    <div style={{width:36,height:36,borderRadius:10,background:t.type==="income"?"#10b98120":"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{c?.icon||(t.type==="income"?"💰":"💸")}</div>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc||c?.name||"—"}</div><div style={{fontSize:10,color:"#94a3b8"}}>{t.date}</div></div>
                    <span style={{fontSize:13,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444",whiteSpace:"nowrap"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  </div>);
                })}
                {filtTxs.length===0&&<div style={{textAlign:"center",color:"#94a3b8",padding:20}}>لا توجد بيانات</div>}
                {filtTxs.length>50&&<div style={{textAlign:"center",color:"#94a3b8",padding:10,fontSize:12}}>أول 50 من {filtTxs.length}</div>}
              </div>
            </>;
          }

          return null;
        })()}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",background:"#ffffff",borderTop:"1px solid #e2e8f0",display:"flex",padding:"8px 4px",zIndex:50}}>
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
                {modal==="transfer"&&"تحويل بين الحسابات"}
                {modal==="buyAsset"&&"🏠 شراء ممتلك"}
                {modal==="addBudget"&&"إضافة ميزانية"}
                {modal==="addSaving"&&"هدف ادخار جديد"}
                {modal==="dep"&&"إضافة للادخار"}
                {modal==="budgetSettings"&&"⚙️ إعدادات الميزانية"}
                {modal==="changePw"&&"تغيير كلمة السر"}
                {modal==="returnLoan"&&"رجوع سلفة"}
              </h3>
              <button onClick={cm} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer"}}><X size={20}/></button>
            </div>

            {(modal==="addTx"||modal==="edTx")&&<div style={S.col}>
              <div style={{padding:"8px 14px",background:form.txType==="income"?"#10b98122":"#ef444422",borderRadius:10,marginBottom:4,textAlign:"center",fontWeight:700,fontSize:14,color:form.txType==="income"?"#10b981":"#ef4444"}}>
                {modal==="addTx"?(form.txType==="income"?"🟢 إضافة دخل":"🔴 إضافة مصروف"):"✏️ تعديل المعاملة"}
              </div>
              <input style={S.num} placeholder="0.00" type="number" value={modal==="addTx"?form.amount||"":ei?.amount||""} onChange={e=>modal==="addTx"?F("amount",e.target.value):setEi(p=>({...p,amount:e.target.value}))} step="0.01"/>
              <select style={S.sel} value={modal==="addTx"?form.catId||"":ei?.catId||""} onChange={e=>{if(modal==="addTx"){F("catId",e.target.value);F("subId","");}else setEi(p=>({...p,catId:e.target.value,subId:""}));}}>
                <option value="">اختر التصنيف</option>
                {cats[modal==="addTx"?(form.txType||"expense"):(ei?.type||"expense")].map(c=><option key={c.id} value={c.id}>{c.ci?"📷":c.icon} {c.name}</option>)}
              </select>
              {(()=>{const cid=parseInt(modal==="addTx"?form.catId:ei?.catId);const cat=gc(modal==="addTx"?(form.txType||"expense"):(ei?.type||"expense"),cid);return cat?.subs?.length>0?<select style={S.sel} value={modal==="addTx"?form.subId||"":ei?.subId||""} onChange={e=>{if(modal==="addTx")F("subId",e.target.value);else setEi(p=>({...p,subId:e.target.value}));}}><option value="">الفرع (اختياري)</option>{cat.subs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>:null;})()}
              {modal==="addTx"&&(form.pm||"نقدي")!=="كريدي"&&<select style={{...S.sel,border:"2px solid #6366f1"}} value={form.akey||""} onChange={e=>F("akey",e.target.value)}><option value="">⚠️ اختر الحساب (إجباري)</option>{allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}</select>}
              {modal==="addTx"&&(form.txType||"expense")==="income"&&<select style={{...S.sel,border:"2px solid #10b981"}} value={form.akey||""} onChange={e=>F("akey",e.target.value)}><option value="">⚠️ اختر الحساب (إجباري)</option>{allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}</select>}
              <input style={S.inp} placeholder="الوصف" value={modal==="addTx"?form.desc||"":ei?.desc||""} onChange={e=>modal==="addTx"?F("desc",e.target.value):setEi(p=>({...p,desc:e.target.value}))}/>
              <input style={S.inp} type="date" value={modal==="addTx"?form.date||new Date().toISOString().split("T")[0]:ei?.date||""} onChange={e=>modal==="addTx"?F("date",e.target.value):setEi(p=>({...p,date:e.target.value}))}/>
              {(modal==="addTx"?(form.txType||"expense"):ei?.type)==="expense"&&<PmBtns val={modal==="addTx"?form.pm||"نقدي":ei?.pm||"نقدي"} onChange={v=>modal==="addTx"?F("pm",v):setEi(p=>({...p,pm:v}))}/>}
              <button style={S.btn(modal==="addTx"?"#10b981":"#6366f1")} onClick={modal==="addTx"?addTx:saveTxEdit}>حفظ</button>
            </div>}

            {(modal==="addMCat"||modal==="edMCat")&&<div style={S.col}>
              <input style={S.inp} placeholder="اسم التصنيف" defaultValue={modal==="edMCat"?ei?.name:""} onChange={e=>modal==="addMCat"?F("cn",e.target.value):setEi(p=>({...p,name:e.target.value}))}/>
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:4}}>الأيقونة:</div>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div>
                  <div className="iu" style={{width:52,height:52}} onClick={()=>(modal==="addMCat"?iRef:eiRef).current.click()}>
                    {(modal==="addMCat"?form.ci:ei?.ci)?<img src={modal==="addMCat"?form.ci:ei.ci} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<><Camera size={16} color="#94a3b8"/><div style={{fontSize:9,color:"#94a3b8",marginTop:2}}>تحميل</div></>}
                  </div>
                  {(modal==="addMCat"?form.ci:ei?.ci)&&<button style={{background:"none",border:"none",color:"#ef4444",fontSize:10,cursor:"pointer",fontFamily:"Tajawal",marginTop:2}} onClick={()=>modal==="addMCat"?F("ci",null):setEi(p=>({...p,ci:null}))}>إزالة</button>}
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
              <div style={{padding:"10px 14px",background:"#f8fafc",borderRadius:10,fontSize:13,color:"#64748b"}}>الحالي: <strong style={{color:"#1e293b"}}>{ei.name}</strong></div>
              <input style={S.inp} placeholder="الاسم الجديد" defaultValue={ei.name} onChange={e=>setEi(p=>({...p,newName:e.target.value}))}/>
              <button style={S.btn()} onClick={()=>{edSCat(ei.catType,ei.catId,ei.id,ei.newName||ei.name);cm();}}>حفظ</button>
            </div>}

            {modal==="addBank"&&<div style={S.col}><input style={S.inp} placeholder="اسم البنك" value={form.name||""} onChange={e=>F("name",e.target.value)}/><input style={S.inp} placeholder="العنوان" value={form.addr||""} onChange={e=>F("addr",e.target.value)}/><button style={S.btn()} onClick={addBank}>حفظ</button></div>}
            {modal==="addBAcc"&&<div style={S.col}><input style={S.inp} placeholder="اسم الحساب" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">نوع الحساب</option>{["جاري","توفير","استثماري","راتب","أعمال"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="الرصيد" type="number" value={form.bal||""} onChange={e=>F("bal",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn()} onClick={addBAcc}>حفظ</button></div>}
            {modal==="edBAcc"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["جاري","توفير","استثماري","راتب","أعمال"].map(t=><option key={t} value={t}>{t}</option>)}</select><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn()} onClick={()=>{edBAcc(ei._bid,ei.id,{name:ei.name,type:ei.type,color:ei.color});cm();}}>حفظ</button></div>}
            {modal==="addCash"&&<div style={S.col}><input style={S.inp} placeholder="الاسم" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">النوع</option>{["نقدية يومية","خزنة","صندوق","مال الجيب"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="الرصيد" type="number" value={form.bal||""} onChange={e=>F("bal",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn("#f59e0b")} onClick={addCash}>حفظ</button></div>}
            {modal==="edCash"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["نقدية يومية","خزنة","صندوق","مال الجيب"].map(t=><option key={t} value={t}>{t}</option>)}</select><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn("#f59e0b")} onClick={()=>{setCash(p=>p.map(x=>x.id===ei.id?{...x,...ei}:x));cm();}}>حفظ</button></div>}
            {modal==="addAst"&&<div style={S.col}><input style={S.inp} placeholder="الاسم" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">النوع</option>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="ملاحظة (اختياري)" value={form.val||""} onChange={e=>F("val",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn("#14b8a6")} onClick={addAst}>حفظ</button></div>}
            {modal==="edAst"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} type="number" defaultValue={ei.value} onChange={e=>setEi(p=>({...p,value:parseFloat(e.target.value)}))}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn("#14b8a6")} onClick={()=>{setAssets(p=>p.map(x=>x.id===ei.id?{...x,...ei}:x));cm();}}>حفظ</button></div>}

            {modal==="addLoan"&&<div style={S.col}>
              <div style={{display:"flex",gap:8}}>{["أعطيت","أخذت"].map(k=><button key={k} onClick={()=>F("kind",k)} style={{flex:1,padding:10,border:"2px solid",borderColor:form.kind===k?(k==="أعطيت"?"#10b981":"#ef4444"):"#e2e8f0",borderRadius:10,background:form.kind===k?(k==="أعطيت"?"#10b98122":"#ef444422"):"transparent",color:form.kind===k?(k==="أعطيت"?"#10b981":"#ef4444"):"#94a3b8",fontFamily:"Tajawal",fontWeight:700,cursor:"pointer",fontSize:13}}>{k}</button>)}</div>
              <input style={S.inp} placeholder="الشخص / الجهة" value={form.person||""} onChange={e=>F("person",e.target.value)}/>
              <input style={S.inp} placeholder="المبلغ" type="number" value={form.amount||""} onChange={e=>F("amount",e.target.value)}/>
              <select style={{...S.sel,border:"2px solid #6366f1"}} value={form.akey||""} onChange={e=>F("akey",e.target.value)}>
                <option value="">⚠️ اختر الحساب (إجباري)</option>
                {allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}
              </select>
              <div style={{fontSize:11,color:"#6366f1",marginTop:-4,fontWeight:600}}>{form.kind==="أعطيت"?"↓ سيتقطع المبلغ من الحساب":"↑ سيضاف المبلغ للحساب"}</div>
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

            {modal==="changePw"&&<div style={S.col}>
              <div style={{fontSize:13,color:"#475569",fontWeight:700}}>🔑 تغيير كلمة السر</div>
              <input style={S.inp} type="password" placeholder="كلمة السر الحالية" value={form.oldPw||""} onChange={e=>F("oldPw",e.target.value)}/>
              <input style={S.inp} type="password" placeholder="كلمة السر الجديدة" value={form.newPw||""} onChange={e=>F("newPw",e.target.value)}/>
              <input style={S.inp} type="password" placeholder="تأكيد كلمة السر الجديدة" value={form.confirmPw||""} onChange={e=>F("confirmPw",e.target.value)}/>
              {form.pwErr&&<div style={{color:"#ef4444",fontSize:13}}>{form.pwErr}</div>}
              <button style={S.btn()} onClick={()=>{
                if(form.oldPw!==appPassword){F("pwErr","❌ كلمة السر الحالية غلط");return;}
                if(!form.newPw||form.newPw.length<4){F("pwErr","❌ كلمة السر قصيرة — 4 أحرف على الأقل");return;}
                if(form.newPw!==form.confirmPw){F("pwErr","❌ كلمة السر ما تطابقتش");return;}
                localStorage.setItem("mhf_pw",form.newPw);setAppPassword(form.newPw);cm();
                setErr("✅ تم تغيير كلمة السر");setTimeout(()=>setErr(null),3000);
              }}>حفظ كلمة السر الجديدة</button>
              <div style={{marginTop:12,borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:12}}>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:6}}>📱 جهة استرجاع كلمة السر</div>
                <input style={S.inp} type="text" placeholder="إيميل أو رقم الهاتف" value={recoveryContact}
                  onChange={e=>setRecoveryContact(e.target.value)}/>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:4}}>تستعمل للتذكير بكلمة السر عند النسيان</div>
              </div>
            </div>}

            {modal==="transfer"&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#6366f122",borderRadius:10,fontSize:14,color:"#6366f1",fontWeight:700,textAlign:"center"}}>⇄ تحويل بين الحسابات</div>
              <div><div style={{fontSize:12,color:"#475569",marginBottom:6}}>من حساب:</div>
              <select style={S.sel} value={form.fromKey||""} onChange={e=>F("fromKey",e.target.value)}><option value="">اختر الحساب المصدر</option>{allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}</select></div>
              <div style={{textAlign:"center",fontSize:24,color:"#6366f1"}}>↓</div>
              <div><div style={{fontSize:12,color:"#475569",marginBottom:6}}>إلى حساب:</div>
              <select style={S.sel} value={form.toKey||""} onChange={e=>F("toKey",e.target.value)}><option value="">اختر الحساب الوجهة</option>{allAcc.filter(a=>a.key!==form.fromKey).map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}</select></div>
              <input style={S.inp} placeholder="المبلغ" type="number" value={form.amount||""} onChange={e=>F("amount",e.target.value)}/>
              <input style={S.inp} type="date" value={form.transferDate||new Date().toISOString().split("T")[0]} onChange={e=>F("transferDate",e.target.value)}/>
              {form.fromKey&&form.toKey&&form.amount&&(
                <div style={{padding:"10px 14px",background:"#6366f115",borderRadius:10,fontSize:13,color:"#6366f1",textAlign:"center"}}>
                  تحويل <strong>{fmt(parseFloat(form.amount||0))}</strong> من <strong>{allAcc.find(a=>a.key===form.fromKey)?.name}</strong> إلى <strong>{allAcc.find(a=>a.key===form.toKey)?.name}</strong>
                </div>
              )}
              <button style={S.btn("#6366f1")} onClick={doTransfer}>تأكيد التحويل ⇄</button>
            </div>}

            {modal==="buyAsset"&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#14b8a615",borderRadius:10,fontSize:13,color:"#14b8a6",fontWeight:700,textAlign:"center"}}>🏠 شراء ممتلك — لن يحسب في المصاريف</div>
              <input style={S.inp} placeholder="اسم الممتلك" value={form.astName||""} onChange={e=>F("astName",e.target.value)}/>
              <select style={S.sel} value={form.astType||""} onChange={e=>F("astType",e.target.value)}><option value="">نوع الممتلك</option>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select>
              <input style={S.num} placeholder="0.00" type="number" step="0.01" value={form.astAmt||""} onChange={e=>F("astAmt",e.target.value)}/>
              <select style={{...S.sel,border:"2px solid #14b8a6"}} value={form.akey||""} onChange={e=>F("akey",e.target.value)}><option value="">⚠️ اختر الحساب (إجباري)</option>{allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}</select>
              <input style={S.inp} placeholder="ملاحظة" value={form.astNote||""} onChange={e=>F("astNote",e.target.value)}/>
              <input style={S.inp} type="date" value={form.astDate||new Date().toISOString().split("T")[0]} onChange={e=>F("astDate",e.target.value)}/>
              <button style={S.btn("#14b8a6")} onClick={()=>{
                if(!form.astName||!form.astAmt||!form.akey){showErr("⛔ أكمل البيانات");return;}
                const amt=parseFloat(form.astAmt);
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc){showErr("⛔ اختر الحساب");return;}
                if(amt>(acc.balance||0)){showErr("⛔ الرصيد غير كافي — الرصيد المتاح: "+fmt(acc.balance||0));return;}
                updBal(acc.ref,amt,"expense","add");
                setAssets(p=>[...p,{id:uid(),type:form.astType||"أخرى",name:form.astName,value:amt,note:form.astNote||"",color:"#14b8a6"}]);
                setTxs(p=>[{id:uid(),type:"expense",amount:amt,catId:null,subId:null,desc:`شراء ممتلك: ${form.astName}`,date:new Date().toISOString().split("T")[0],pm:"نقدي",ref:acc.ref,isAsset:true},...p]);
                cm();
              }}>تأكيد الشراء 🏠</button>
            </div>}

            {modal==="returnLoan"&&ei&&<div style={S.col}>
              <div style={{padding:"12px 14px",background:"#0c0f1e",borderRadius:10,fontSize:13}}>
                <div style={{color:"#94a3b8",marginBottom:4}}>رجوع سلفة من:</div>
                <div style={{fontWeight:700,fontSize:16,color:"#0f172a"}}>{ei.person}</div>
                <div style={{color:"#10b981",marginTop:4}}>المتبقي: {fmt(ei.remaining)}</div>
              </div>
              <select style={S.sel} value={form.akey||""} onChange={e=>F("akey",e.target.value)}>
                <option value="">اختر الحساب اللي يدخل فيه المبلغ</option>
                {allAcc.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name}</option>)}
              </select>
              <input style={S.inp} type="number" placeholder="المبلغ المرجع" value={form.amount||""} onChange={e=>F("amount",e.target.value)} max={ei.remaining}/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <button style={S.btn("#10b981")} onClick={()=>{
                if(!form.amount||!form.akey){showErr("⛔ أكمل البيانات");return;}
                const amt=parseFloat(form.amount);
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc)return;
                setTxs(p=>[{id:uid(),type:"income",amount:amt,catId:null,subId:null,desc:`رجوع سلفة — ${ei.person}`,date:form.date||new Date().toISOString().split("T")[0],pm:"نقدي",ref:acc.ref},...p]);
                updBal(acc.ref,amt,"income","add");
                setLoans(p=>p.map(l=>l.id===ei.id?{...l,remaining:Math.max(0,l.remaining-amt)}:l));
                cm();
              }}>تأكيد الرجوع ✓</button>
            </div>}

            {modal==="addBudget"&&<div style={S.col}><select style={S.sel} value={form.catId||""} onChange={e=>F("catId",e.target.value)}><option value="">اختر تصنيف النفقات</option>{cats.expense.map(c=><option key={c.id} value={c.id}>{c.ci?"📷":c.icon} {c.name}</option>)}</select><input style={S.inp} placeholder="الحد الأقصى" type="number" value={form.limit||""} onChange={e=>F("limit",e.target.value)}/><button style={S.btn()} onClick={addBudget}>حفظ</button></div>}

            {/* ======= BUDGET SETTINGS MODAL — الجديد ======= */}
            {modal==="budgetSettings"&&<div style={S.col}>
              <div style={{fontSize:14,color:"#f1f5f9",fontWeight:800,marginBottom:4}}>⚙️ إعدادات الميزانية</div>

              {/* الأهداف الشهرية */}
              <div style={{fontSize:12,color:"#94a3b8",fontWeight:700}}>🎯 الأهداف الشهرية</div>
              <div style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:12,border:"1px solid #10b98133"}}>
                <div style={{fontWeight:700,color:"#10b981",marginBottom:10,fontSize:13}}>💰 هدف الدخل</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <button style={{...S.btn(!(budgetSettings.goals?.incomeAuto)?"#10b981":"#334155",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,incomeAuto:false}}))}>يدوي</button>
                  <button style={{...S.btn(budgetSettings.goals?.incomeAuto?"#10b981":"#334155",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,incomeAuto:true}}))}>تلقائي</button>
                </div>
                {!budgetSettings.goals?.incomeAuto&&<input style={{...S.inp,padding:"8px 10px",fontSize:13}} type="number" placeholder="هدف الدخل الشهري" value={budgetSettings.goals?.incomeGoal||15000}
                  onChange={e=>setBudgetSettings(p=>({...p,goals:{...p.goals,incomeGoal:parseFloat(e.target.value)||0}}))}/>}
                {budgetSettings.goals?.incomeAuto&&<div style={{fontSize:11,color:"#94a3b8",padding:"8px 0"}}>يحسب تلقائياً من متوسط الدخل الشهري</div>}
                <div style={{fontWeight:700,color:"#ef4444",marginBottom:10,marginTop:12,fontSize:13}}>💸 هدف المصاريف</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <button style={{...S.btn(!(budgetSettings.goals?.expenseAuto)?"#ef4444":"#334155",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,expenseAuto:false}}))}>يدوي</button>
                  <button style={{...S.btn(budgetSettings.goals?.expenseAuto?"#ef4444":"#334155",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,expenseAuto:true}}))}>تلقائي</button>
                </div>
                {!budgetSettings.goals?.expenseAuto&&<input style={{...S.inp,padding:"8px 10px",fontSize:13}} type="number" placeholder="هدف المصاريف الشهرية" value={budgetSettings.goals?.expenseGoal||5000}
                  onChange={e=>setBudgetSettings(p=>({...p,goals:{...p.goals,expenseGoal:parseFloat(e.target.value)||0}}))}/>}
                {budgetSettings.goals?.expenseAuto&&<div style={{fontSize:11,color:"#94a3b8",padding:"8px 0"}}>يحسب تلقائياً من متوسط المصاريف الشهرية</div>}
              </div>

              {/* الشرائح */}
              <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginTop:4}}>📊 الشرائح — توزيع الدخل</div>
              {(budgetSettings.tranches||[]).map((tr)=>{
                const total=Object.values(tr.pcts).reduce((s,v)=>s+(v||0),0);
                return(
                  <div key={tr.id} style={{background:"rgba(255,255,255,.06)",borderRadius:12,padding:14,border:`1px solid ${total===100?"#10b98144":"#ef444444"}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontWeight:700,color:"#f1f5f9",fontSize:13}}>شريحة {tr.id}</span>
                      <span style={{fontSize:11,color:total===100?"#10b981":"#ef4444",fontWeight:700}}>{total}% {total===100?"✅":"⚠️"}</span>
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:8}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>من (درهم)</div>
                        <input style={{...S.inp,padding:"6px 8px",fontSize:12}} type="number" value={tr.min}
                          onChange={e=>setBudgetSettings(p=>({...p,tranches:p.tranches.map(x=>x.id===tr.id?{...x,min:parseFloat(e.target.value)||0}:x)}))}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>إلى (درهم)</div>
                        <input style={{...S.inp,padding:"6px 8px",fontSize:12}} type="number" value={tr.max===999999?"":tr.max}
                          onChange={e=>setBudgetSettings(p=>({...p,tranches:p.tranches.map(x=>x.id===tr.id?{...x,max:parseFloat(e.target.value)||999999}:x)}))}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>فيكس (درهم)</div>
                        <input style={{...S.inp,padding:"6px 8px",fontSize:12}} type="number" value={tr.fix||0}
                          onChange={e=>setBudgetSettings(p=>({...p,tranches:p.tranches.map(x=>x.id===tr.id?{...x,fix:parseFloat(e.target.value)||0}:x)}))}/>
                      </div>
                    </div>
                    {(budgetSettings.allocations||[]).map(a=>(
                      <div key={a.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                        <span style={{fontSize:14}}>{a.icon}</span>
                        <span style={{flex:1,fontSize:11,color:"#f1f5f9"}}>{a.name}</span>
                        <input style={{...S.inp,width:55,textAlign:"center",padding:"4px 6px",fontSize:12}} type="number" min="0" max="100" value={tr.pcts[a.id]||0}
                          onChange={e=>setBudgetSettings(p=>({...p,tranches:p.tranches.map(x=>x.id===tr.id?{...x,pcts:{...x.pcts,[a.id]:parseInt(e.target.value)||0}}:x)}))}/>
                        <span style={{fontSize:10,color:"#64748b"}}>%</span>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* ربط الحسابات */}
              <div style={{fontSize:12,color:"#94a3b8",fontWeight:700,marginTop:4}}>🏦 ربط الحسابات</div>
              {(budgetSettings.allocations||[]).map(a=>{
                const takenKeys=(budgetSettings.allocations||[]).filter(x=>x.id!==a.id).flatMap(x=>x.accountKeys||[]);
                const availableAccs=allAcc.filter(ac=>!takenKeys.includes(ac.key));
                return(
                  <div key={a.id} style={{background:"rgba(255,255,255,.05)",borderRadius:12,padding:10,border:`2px solid ${a.color}44`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <span style={{fontSize:18}}>{a.icon}</span>
                      <span style={{fontWeight:700,color:"#f1f5f9",fontSize:13}}>{a.name}</span>
                    </div>
                    {a.type==="expenses"&&<>
                      <div style={{display:"flex",gap:6,marginBottom:6}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>تنبيه عند (درهم)</div>
                          <input style={{...S.inp,padding:"6px 8px",fontSize:12}} type="number" value={a.minAlert||300}
                            onChange={e=>setBudgetSettings(p=>({...p,allocations:p.allocations.map(x=>x.id===a.id?{...x,minAlert:parseFloat(e.target.value)||300}:x)}))}/>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:9,color:"#64748b",marginBottom:3}}>تحويل من الطوارئ</div>
                          <input style={{...S.inp,padding:"6px 8px",fontSize:12}} type="number" value={a.emergencyTransfer||0}
                            onChange={e=>setBudgetSettings(p=>({...p,allocations:p.allocations.map(x=>x.id===a.id?{...x,emergencyTransfer:parseFloat(e.target.value)||0}:x)}))}/>
                        </div>
                      </div>
                    </>}
                    {(a.accountKeys||[]).map(key=>{
                      const acc=allAcc.find(x=>x.key===key);
                      return acc?(
                        <div key={key} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:a.color+"15",borderRadius:8,marginBottom:5}}>
                          <span style={{flex:1,fontSize:11,color:"#f1f5f9"}}>{acc.bn} — {acc.name}</span>
                          <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:6,padding:"2px 7px",cursor:"pointer",color:"#fca5a5",fontSize:10,fontFamily:"inherit"}}
                            onClick={()=>setBudgetSettings(p=>({...p,allocations:p.allocations.map(x=>x.id===a.id?{...x,accountKeys:(x.accountKeys||[]).filter(k=>k!==key)}:x)}))}>حذف</button>
                        </div>
                      ):null;
                    })}
                    <select style={{...S.sel,fontSize:12}} value="" onChange={e=>{
                      if(!e.target.value)return;
                      setBudgetSettings(p=>({...p,allocations:p.allocations.map(x=>x.id===a.id?{...x,accountKeys:[...(x.accountKeys||[]),e.target.value]}:x)}));
                    }}>
                      <option value="">+ إضافة حساب</option>
                      {availableAccs.filter(ac=>!(a.accountKeys||[]).includes(ac.key)).map(ac=>(
                        <option key={ac.key} value={ac.key}>{ac.bn} - {ac.name}</option>
                      ))}
                    </select>
                  </div>
                );
              })}

              <button style={S.btn()} onClick={()=>{
                const invalid=(budgetSettings.tranches||[]).some(tr=>Object.values(tr.pcts).reduce((s,v)=>s+(v||0),0)!==100);
                if(invalid){showErr("⛔ مجموع النسب خاص يكون 100% في كل شريحة");return;}
                cm();setErr("✅ تم حفظ الإعدادات");setTimeout(()=>setErr(null),3000);
              }}>✅ حفظ الإعدادات</button>
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
              {selSv&&<div style={{padding:12,background:"#f8fafc",borderRadius:10,display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:24}}>{selSv.icon}</span><div><div style={{fontWeight:700}}>{selSv.name}</div><div style={{fontSize:12,color:"#94a3b8"}}>متبقي: {fmt(selSv.target-selSv.saved)}</div></div></div>}
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
              <div style={{fontSize:14,color:"#64748b"}}>هل تبغي تحذف <strong style={{color:"#1e293b"}}>"{cd.lbl}"</strong>؟</div>
              <div style={{fontSize:12,color:"#ef4444",marginTop:6}}>هذا الإجراء لا يمكن التراجع عنه</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("#e2e8f0"),border:"1px solid #334155",color:"#64748b"}} onClick={()=>setCd(null)}>إلغاء</button>
              <button style={S.btn("#ef4444")} onClick={doDel}>حذف</button>
            </div>
          </div>
        </div>
      )}

      {err&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#ffffff",border:"1px solid #ef4444",borderRadius:12,padding:"12px 20px",zIndex:400,color:"#ef4444",fontSize:13,fontWeight:700,maxWidth:340,textAlign:"center"}}>{err}</div>}

      {/* توزيع الدخل التلقائي */}
      {distModal&&(()=>{
        const inc=distModal.income;
        const thr=budgetSettings.threshold||5000;
        const surplus=Math.max(0,inc-thr);
        const pcts=distModal.customPcts||{2:20,3:15,4:15,5:10};
        const totalPct=Object.values(pcts).reduce((s,v)=>s+(v||0),0);
        const expPct=Math.max(0,100-totalPct);
        const BKTS=budgetSettings.allocations||[];
        const fmt2=n=>new Intl.NumberFormat("ar-MA",{minimumFractionDigits:2}).format(n);
        const calcAmt=(id)=>{
          if(id===1)return Math.min(inc,thr)+surplus*(expPct/100);
          return surplus*((pcts[id]||0)/100);
        };
        const steps=["الدخل","النسب","معاينة","تأكيد","✅"];
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div style={{background:"white",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,padding:20,maxHeight:"90vh",overflowY:"auto"}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{fontSize:17,fontWeight:900,color:"#0f172a"}}>💰 توزيع الدخل</span>
                <button onClick={()=>setDistModal(null)} style={{background:"#f1f5f9",border:"none",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:13,color:"#64748b"}}>تخطي</button>
              </div>
              {/* Steps dots */}
              <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20}}>
                {steps.map((s,i)=>(
                  <div key={i} style={{width:distModal.step===i+1?24:8,height:8,borderRadius:4,background:i+1<=distModal.step?"#10b981":"#e2e8f0",transition:"all .3s"}}/>
                ))}
              </div>

              {/* Step 1: Info */}
              {distModal.step===1&&<>
                <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:40,marginBottom:8}}>💵</div>
                  <div style={{fontSize:14,color:"#64748b",marginBottom:4}}>دخل جديد</div>
                  <div style={{fontSize:32,fontWeight:900,color:"#10b981"}}>{fmt2(inc)} <span style={{fontSize:16}}>د.م</span></div>
                </div>
                <div style={{background:"#f8fafc",borderRadius:14,padding:14,marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:"#64748b"}}>الحد الثابت للمصاريف</span>
                    <span style={{fontWeight:700,color:"#0f172a"}}>{fmt2(Math.min(inc,thr))} د.م</span>
                  </div>
                  {surplus>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginTop:8}}>
                    <span style={{color:"#64748b"}}>الفائض للتوزيع</span>
                    <span style={{fontWeight:700,color:"#6366f1"}}>{fmt2(surplus)} د.م</span>
                  </div>}
                </div>
                <button style={{...S.btn(),width:"100%",padding:14,fontSize:15}} onClick={()=>setDistModal(p=>({...p,step:2}))}>التالي ←</button>
              </>}

              {/* Step 2: Adjust percentages */}
              {distModal.step===2&&<>
                <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>عدل النسب حسب رغبتك</div>
                {BKTS.map(b=>(
                  <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:b.bg||"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{b.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{b.name}</div>
                      <div style={{fontSize:11,color:"#94a3b8"}}>{b.fixed?"الحد الثابت + "+expPct+"%":fmt2(calcAmt(b.id))+" د.م"}</div>
                    </div>
                    {!b.fixed&&<div style={{display:"flex",alignItems:"center",gap:4}}>
                      <input type="number" min="0" max="100" value={pcts[b.id]||0}
                        style={{width:56,padding:"6px 4px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:14,fontWeight:700,textAlign:"center",fontFamily:"Tajawal",outline:"none"}}
                        onChange={e=>setDistModal(p=>({...p,customPcts:{...p.customPcts,[b.id]:parseInt(e.target.value)||0}}))}/>
                      <span style={{fontSize:12,color:"#94a3b8"}}>%</span>
                    </div>}
                    {b.fixed&&<span style={{fontSize:13,fontWeight:700,color:"#ef4444"}}>{expPct}%</span>}
                  </div>
                ))}
                <div style={{textAlign:"center",fontSize:12,fontWeight:700,padding:"10px",borderRadius:10,marginTop:8,background:totalPct<=100?"#d1fae5":"#fee2e2",color:totalPct<=100?"#065f46":"#991b1b"}}>
                  {totalPct<=100?`✅ مجموع الفائض: ${totalPct}% — المصاريف: ${expPct}%`:`⚠️ المجموع ${totalPct}% تجاوز 100%!`}
                </div>
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button style={{...S.btn("#e2e8f0"),flex:1,padding:12,color:"#64748b"}} onClick={()=>setDistModal(p=>({...p,step:1}))}>← رجوع</button>
                  <button style={{...S.btn(),flex:2,padding:12}} onClick={()=>{if(totalPct>100){showErr("⚠️ المجموع تجاوز 100%");return;}setDistModal(p=>({...p,step:3}));}}>التالي ←</button>
                </div>
              </>}

              {/* Step 3: Preview */}
              {distModal.step===3&&<>
                <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>معاينة التوزيع</div>
                {BKTS.map(b=>{
                  const amt=calcAmt(b.id);
                  const pct=inc>0?(amt/inc*100):0;
                  return(
                    <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                      <div style={{width:40,height:40,borderRadius:12,background:b.bg||"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{b.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700}}>{b.name}</div>
                        <div style={{height:4,background:"#f1f5f9",borderRadius:4,marginTop:4,overflow:"hidden"}}>
                          <div style={{width:pct+"%",height:"100%",background:b.color,borderRadius:4}}/>
                        </div>
                      </div>
                      <div style={{fontSize:15,fontWeight:900,color:b.color}}>{fmt2(amt)}</div>
                    </div>
                  );
                })}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button style={{...S.btn("#e2e8f0"),flex:1,padding:12,color:"#64748b"}} onClick={()=>setDistModal(p=>({...p,step:2}))}>← رجوع</button>
                  <button style={{...S.btn(),flex:2,padding:12}} onClick={()=>setDistModal(p=>({...p,step:4}))}>موافق ✅</button>
                </div>
              </>}

              {/* Step 4: Confirm */}
              {distModal.step===4&&<>
                <div style={{fontSize:13,color:"#64748b",marginBottom:12}}>تأكيد التحويلات</div>
                {BKTS.map(b=>{
                  const amt=calcAmt(b.id);
                  if(amt<=0)return null;
                  return(
                    <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:b.bg||"#f8fafc",borderRadius:12,marginBottom:8}}>
                      <span style={{fontSize:20}}>{b.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{b.name}</div>
                        <div style={{fontSize:11,color:"#64748b"}}>{(b.accountKeys||[]).length>0?"→ "+b.name:"ما كاين حساب مربوط"}</div>
                      </div>
                      <div style={{fontSize:15,fontWeight:900,color:b.color}}>{fmt2(amt)}</div>
                    </div>
                  );
                })}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button style={{...S.btn("#e2e8f0"),flex:1,padding:12,color:"#64748b"}} onClick={()=>setDistModal(p=>({...p,step:3}))}>← رجوع</button>
                  <button style={{...S.btn(),flex:2,padding:12,fontSize:15}} onClick={()=>setDistModal(p=>({...p,step:5}))}>تنفيذ التوزيع 🚀</button>
                </div>
              </>}

              {/* Step 5: Success */}
              {distModal.step===5&&<>
                <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:60,marginBottom:8}}>🎉</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#0f172a",marginBottom:4}}>تم التوزيع!</div>
                  <div style={{fontSize:13,color:"#64748b"}}>{fmt2(inc)} د.م تقسمو على {BKTS.length} حسابات</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {BKTS.map(b=>(
                    <div key={b.id} style={{background:b.bg||"#f8fafc",borderRadius:14,padding:12,textAlign:"center"}}>
                      <div style={{fontSize:20,marginBottom:4}}>{b.icon}</div>
                      <div style={{fontSize:10,color:"#64748b",marginBottom:2}}>{b.name}</div>
                      <div style={{fontSize:14,fontWeight:900,color:b.color}}>{fmt2(calcAmt(b.id))}</div>
                    </div>
                  ))}
                </div>
                <button style={{...S.btn(),width:"100%",padding:14,fontSize:15}} onClick={()=>setDistModal(null)}>تم ✅</button>
              </>}
            </div>
          </div>
        );
      })()}

    </div>
  );
}
