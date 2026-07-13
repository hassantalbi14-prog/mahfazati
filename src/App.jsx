import React, { useState, useRef, useEffect } from "react";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// ========== نظام تخزين محلي آمن (بحال تطبيقات Play Store) ==========
// كل البيانات تتخزن فملف واحد JSON فالمساحة الخاصة بالتطبيق (Directory.Data)
// + نسخة احتياطية تلقائية (.bak) قبل كل كتابة جديدة، باش إذا طاحت الكتابة الجديدة، نقدر نرجعو للنسخة السابقة
const DATA_FILE="mahfazati_data.json";
const BACKUP_FILE="mahfazati_data.bak.json";
let _memCache=null; // كاش فالذاكرة لتفادي قراءة الملف فكل مرة

const _readFullFile=async()=>{
  if(_memCache)return _memCache;
  try{
    const r=await Filesystem.readFile({path:DATA_FILE,directory:Directory.Data,encoding:Encoding.UTF8});
    const parsed=JSON.parse(r.data);
    _memCache=parsed;
    return parsed;
  }catch(e){
    // الملف الأساسي ماكاينش ولا تخرب - نحاول النسخة الاحتياطية
    try{
      const rb=await Filesystem.readFile({path:BACKUP_FILE,directory:Directory.Data,encoding:Encoding.UTF8});
      const parsedB=JSON.parse(rb.data);
      _memCache=parsedB;
      console.log("⚠️ تم استرجاع البيانات من النسخة الاحتياطية");
      return parsedB;
    }catch(e2){
      _memCache={};
      return {};
    }
  }
};

const _writeFullFile=async(obj)=>{
  try{
    // أولاً نسخ الملف الحالي كـ backup قبل الكتابة (حماية من التعطل وقت الكتابة)
    try{
      const cur=await Filesystem.readFile({path:DATA_FILE,directory:Directory.Data,encoding:Encoding.UTF8});
      await Filesystem.writeFile({path:BACKUP_FILE,directory:Directory.Data,data:cur.data,encoding:Encoding.UTF8});
    }catch(e){/* أول مرة، ماكاينش ملف قديم - عادي */}
    await Filesystem.writeFile({path:DATA_FILE,directory:Directory.Data,data:JSON.stringify(obj),encoding:Encoding.UTF8});
    _memCache=obj;
  }catch(e){
    console.log("save err",e);
  }
};

const _save = async(k,v)=>{
  const all=await _readFullFile();
  all[k]=v;
  await _writeFullFile(all);
};
const _load = async(k)=>{
  const all=await _readFullFile();
  return all[k]!==undefined?all[k]:null;
};
import { X, Home, CreditCard, Wallet, Target, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Menu, ChevronLeft, ChevronRight, Plus, Trash2, Cloud, Settings, Building2, Coins, Package, HandCoins, Download, Upload, Check, Camera } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from "recharts";

const PAL=["#10b981","#6366f1","#f59e0b","#ef4444","#14b8a6","#f97316","#8b5cf6","#ec4899","#06b6d4","#84cc16"];
const MONTH = new Date().toISOString().slice(0,7);
const fmt=n=>(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const uid=()=>Date.now()+Math.floor(Math.random()*9999);
const EE=["🍔","🚗","🏠","💊","🎓","👗","🎮","📱","💡","🛒","✈️","🎵","🍕","⚽","📚","💈","🧴","🐾","🎁","🏋️","🌿","🏥","💻","🎨","🔧"];
const IE=["💼","💻","🏠","🚕","📦","🎨","🎓","💹","🤝","🏭","📊","🎵","🛍️","🌐","✍️","💰","🏆","🎯","🔑","📝"];

const IC={"expense":[{"id":1783600840102,"name":"المواصلات","icon":"🚗","color":"#f97316","subs":[{"id":1783600840101,"name":"الوقود"},{"id":1783600840136,"name":"تامين وضريبة"},{"id":1783600840049,"name":"النقل العام"},{"id":1783600840070,"name":"صيانة سيارة"}]},{"id":1783600840109,"name":"المأكل","icon":"🍔","color":"#10b981","subs":[{"id":1783600840055,"name":"سقاطة"},{"id":1783600840127,"name":"مقهى"},{"id":1783600840125,"name":"سوق اسبوعي"},{"id":1783600840152,"name":"مطعم"}]},{"id":1783600840098,"name":"الملابس","icon":"👗","color":"#ec4899","subs":[{"id":1783600840081,"name":"مصبنة"},{"id":1783600840110,"name":"ملابس الاولاد"},{"id":1783600840140,"name":"ملابسي"},{"id":1783600840084,"name":"ملابس زوجة"}]},{"id":1783600840120,"name":"الصحة","icon":"💊","color":"#14b8a6","subs":[{"id":1783600840065,"name":"الاسنان"},{"id":1783600840141,"name":"دواء"},{"id":1783600840132,"name":"تحاليل"},{"id":1783600840068,"name":"طبيب"}]},{"id":1783600840132,"name":"السكن","icon":"🏠","color":"#6366f1","subs":[{"id":1783600840087,"name":"صيانة منزل"},{"id":1783600840140,"name":"ماء وكهرباء"}]},{"id":1783600840133,"name":"الاتصالات","icon":"📱","color":"#8b5cf6","subs":[{"id":1783600840118,"name":"وثائق وبنك"},{"id":1783600840096,"name":"برامج وانترنيت"},{"id":1783600840169,"name":"الهاتف ولوازمه"},{"id":1783600840102,"name":"الاشتراك"}]},{"id":1783600840117,"name":"العناية الشخصية","icon":"💈","color":"#06b6d4","subs":[{"id":1783600840110,"name":"مصروف الجيب"},{"id":1783600840130,"name":"كحول وسيجار"},{"id":1783600840094,"name":"حلاق وحمام"}]},{"id":1783600840092,"name":"الترفيه","icon":"🎮","color":"#f59e0b","subs":[{"id":1783600840171,"name":"الالعاب اطفال"},{"id":1783600840182,"name":"رحلات"},{"id":1783600840154,"name":"ويكاند"},{"id":1783600840150,"name":"السفر"}]},{"id":1783600840160,"name":"الاسرة","icon":"👨‍👩‍👧","color":"#ec4899","subs":[{"id":1783600840094,"name":"مناسبات"},{"id":1783600840147,"name":"حفلات واعياد"},{"id":1783600840140,"name":"نفقة الاولاد"},{"id":1783600840174,"name":"الهدايا العطا"}]}],"income":[{"id":1783600840116,"name":"الراتب","icon":"💼","color":"#10b981","subs":[{"id":1783600840089,"name":"SOGEFAM"},{"id":1783600840097,"name":"shop"},{"id":1783600840079,"name":"CNSS"}]},{"id":1783600840119,"name":"اللوبان","icon":"💰","color":"#6366f1","subs":[{"id":1783600840133,"name":"FACTURE"},{"id":1783600840073,"name":"ROMISE"},{"id":1783600840097,"name":"STOCK"}]},{"id":1783600840102,"name":"الهدايا وبنك","icon":"🎁","color":"#8b5cf6","subs":[{"id":1783600840083,"name":"بترومين"},{"id":1783600840144,"name":"منحة البنك"}]}]};
const IBK=[{"id":1783600840182,"name":"وفا بنك","accounts":[{"id":1783600840122,"name":"حساب الشيك وفا","type":"جاري","balance":96815.29752000001,"color":"#10b981"},{"id":1783600840163,"name":"حساب الدفتر مديونة","type":"توفير","balance":-32027.117520000018,"color":"#6366f1"},{"id":1783600840121,"name":"حساب الدفتر سوالم","type":"توفير","balance":209938.50000000003,"color":"#f59e0b"}]},{"id":1783600840132,"name":"البريد بنك","accounts":[{"id":1783600840098,"name":"حساب الشيك بريد","type":"جاري","balance":100,"color":"#8b5cf6"},{"id":1783600840193,"name":"حساب الدفتر البريد","type":"توفير","balance":95718.62000000001,"color":"#06b6d4"}]}];
const ICS=[{"id":1783600840113,"name":"بزضام","group":"محفظة","type":"نقدية","balance":15327,"color":"#f59e0b"},{"id":1783600840139,"name":"جيبي","group":"محفظة","type":"نقدية","balance":0,"color":"#10b981"},{"id":1783600840163,"name":"السوالم","group":"كوافرفور","type":"نقدية","balance":70000,"color":"#ec4899"},{"id":1783600840161,"name":"تمازيرت","group":"كوافرفور","type":"نقدية","balance":285000,"color":"#14b8a6"}];
const IAS=[];
const ILN=[];
const IINV=[];
const ITX=[];
const IBG=[];
const ISV=[];

const S={
  card:{background:"rgba(255,255,255,0.85)",borderRadius:20,padding:18,border:"1px solid rgba(226,232,240,0.7)",boxShadow:"0 2px 16px rgba(15,23,42,0.07)",backdropFilter:"blur(12px)"},
  inp:{background:"rgba(248,250,252,0.9)",border:"1.5px solid #e2e8f0",borderRadius:12,padding:"11px 14px",color:"#1a1a1a",fontFamily:"Tajawal",fontSize:14,width:"100%",outline:"none",transition:"border-color .2s"},
  num:{background:"rgba(248,250,252,0.9)",border:"2px solid #e2e8f0",borderRadius:14,padding:"14px 16px",color:"#1a1a1a",fontFamily:"Tajawal",fontSize:22,fontWeight:900,width:"100%",outline:"none",textAlign:"center",letterSpacing:1},
  sel:{background:"rgba(248,250,252,0.9)",border:"1.5px solid #e2e8f0",borderRadius:12,padding:"11px 14px",color:"#1a1a1a",fontFamily:"Tajawal",fontSize:14,width:"100%",outline:"none"},
  btn:(bg="#10b981",full=true)=>({background:bg,color:"#1a1a1a",border:"none",padding:"12px 18px",borderRadius:14,fontFamily:"Tajawal",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 2px 8px ${bg}40`,...(full?{width:"100%"}:{})}),
  row:{display:"flex",alignItems:"center",justifyContent:"space-between"},
  col:{display:"flex",flexDirection:"column",gap:12},
};

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;font-weight:600;}
input,select,textarea{font-weight:700;}
body{background:linear-gradient(135deg,#f0f4ff 0%,#e8f5f0 50%,#f0f4ff 100%);min-height:100vh;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}
.tx{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(226,232,240,0.6);}.tx:last-child{border-bottom:none;}
.nb{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border-radius:14px;cursor:pointer;color:#94a3b8;font-size:10px;flex:1;background:none;border:none;font-family:Tajawal;transition:all .25s;font-weight:600;}
.nb.on{color:#10b981;background:rgba(16,185,129,.1);}
.pbar{height:7px;background:#e2e8f0;border-radius:4px;overflow:hidden;}.pfill{height:100%;border-radius:4px;transition:width .8s;}
.drw{position:fixed;top:0;right:0;height:100%;width:285px;background:linear-gradient(180deg,#1a6b4a,#0f4a33);border-left:1px solid rgba(255,255,255,.1);z-index:200;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,.2);}
.drw.op{transform:translateX(0);}
.ovl{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:199;opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(4px);}
.ovl.op{opacity:1;pointer-events:all;}
.mwp{position:fixed;inset:0;background:rgba(2,6,23,.75);z-index:300;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(8px);}
.mbx{background:linear-gradient(180deg,rgba(30,41,59,.98),rgba(15,23,42,.98));border-radius:24px 24px 0 0;padding:24px;width:100%;border-top:1px solid rgba(255,255,255,.12);max-height:90vh;overflow-y:auto;box-shadow:0 -8px 40px rgba(0,0,0,.3);}
.mi{display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.07);color:white;font-size:15px;font-weight:600;transition:background .2s;border-radius:10px;margin:2px 4px;}
.mi:hover{background:rgba(255,255,255,.1);}
.si{display:flex;align-items:center;gap:12px;padding:13px 14px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.85);font-size:14px;transition:all .2s;}
.si:hover{background:rgba(255,255,255,.08);color:white;padding-right:20px;}
.cd{width:28px;height:28px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:border-color .2s;}.cd.sl{border-color:white;}
.eb{width:38px;height:38px;border-radius:12px;border:2px solid #e2e8f0;background:rgba(248,250,252,.9);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.eb.sl{border-color:#10b981;background:#10b98115;box-shadow:0 0 0 3px #10b98120;}
.fch{display:flex;align-items:center;gap:12px;padding:16px 14px;background:rgba(0,0,0,.15);border-bottom:1px solid rgba(255,255,255,.07);}
.fsi{display:flex;align-items:center;gap:12px;padding:15px 14px 15px 32px;border-bottom:1px solid rgba(255,255,255,.05);}
.stg{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:4px 10px;font-size:12px;color:white;margin:3px;}
.iu{border-radius:16px;border:2px dashed rgba(255,255,255,.25);background:rgba(0,0,0,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;transition:all .2s;}
.iu:hover{border-color:rgba(255,255,255,.75);background:rgba(0,0,0,.25);}
.acc-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:rgba(30,41,59,.95);border-radius:12px;margin-bottom:6px;border:1px solid rgba(255,255,255,.08);box-shadow:0 2px 8px rgba(0,0,0,.15);}
`;

// v3.9
export default function App(){
  const[page,setPage]=useState("dashboard");
  const[drw,setDrw]=useState(false);
  const[period,setPeriod]=useState({type:"month",month:new Date().toISOString().slice(0,7),year:new Date().getFullYear().toString()});
  const[recoveryContact,setRecoveryContact]=useState("");
  const[resetCode,setResetCode]=useState("");
  const[sentCode,setSentCode]=useState("");
  const[resetStep,setResetStep]=useState(0); // 0=none, 1=sent, 2=verified
  const EMAILJS_SVC="service_5v67rxb";
  const EMAILJS_TPL="template_ampwze8";
  const EMAILJS_KEY="xQEWmslup-DUKjzz0";
  // ── إرسال كود الاسترجاع ──
  const sendResetEmail=async()=>{
    if(!recoveryContact||!recoveryContact.includes("@")){
      showErr("خاصك تسجل إيميل صحيح في الإعدادات أولاً");return;
    }
    const code=Math.floor(100000+Math.random()*900000).toString();
    setSentCode(code);
    try{
      await window.emailjs.send(EMAILJS_SVC,EMAILJS_TPL,{
        email:recoveryContact,
        passcode:code,
        to_email:recoveryContact,
      },EMAILJS_KEY);
      setResetStep(1);
      setResetCode("");
    }catch(e){
      showErr("فشل إرسال الإيميل — تحقق من الاتصال");
    }
  };
  const getBucketAccKeys=(bucketType)=>{
    const bkt=(budgetSettings.buckets||[]).find(b=>b.type===bucketType);
    return bkt?.accountKeys||[];
  };
  const getBucketAccs=(bucketType)=>{
    const keys=getBucketAccKeys(bucketType);
    if(keys.length===0)return allAcc;
    return allAcc.filter(a=>keys.includes(a.key));
  };
  const getBucketBalance2=(a)=>{
    if(!a||!a.accountKeys||a.accountKeys.length===0)return 0;
    return allAcc.filter(ac=>(a.accountKeys||[]).includes(ac.key)).reduce((s,ac)=>s+(ac.balance||0),0);
  };
  const filterByPeriod=(txList)=>{if(period.type==="month")return txList.filter(t=>t.date.startsWith(period.month));if(period.type==="year")return txList.filter(t=>t.date.startsWith(period.year));return txList;};
  const[fontScale,setFontScale]=useState(()=>parseFloat(localStorage.getItem("mhf_fontScale"))||1.1);
  useEffect(()=>{localStorage.setItem("mhf_fontScale",fontScale);},[fontScale]);
  const[hideBalance,setHideBalance]=useState(false);
  const[showActions,setShowActions]=useState(false);
  const[dp,setDp]=useState(null);
  const[modal,setModal]=useState(null);
  const[form,setForm]=useState({});
  const[ei,setEi]=useState(null);
  const[cd,setCd]=useState(null);
  const[err,setErr]=useState(null);
  const[selSv,setSelSv]=useState(null);
  const[selBk,setSelBk]=useState(null);
  const[ovExp,setOvExp]=useState({});
  const[openTxId,setOpenTxId]=useState(null);
  const[txTypeFilter,setTxTypeFilter]=useState("all");
  const[bkMsg,setBkMsg]=useState(null);
  const[lastDeleted,setLastDeleted]=useState(null);
  const undoTimerRef=useRef(null);
  const[budgetSec,setBudgetSec]=useState({goals:false,tranches:false,alloc:false});
  const[selBucket,setSelBucket]=useState(null);
  const[resetErr,setResetErr]=useState(false);
  const[isAuth,setIsAuth]=useState(()=>sessionStorage.getItem("mhf_auth")==="1");
  const[bioEnabled,setBioEnabled]=useState(()=>localStorage.getItem("mhf_bio")==="1");
  const[bioTried,setBioTried]=useState(false);
  const[darkMode,setDarkMode]=useState(()=>localStorage.getItem("mhf_dark")==="1");
  const[pwInput,setPwInput]=useState("");
  const[showPw,setShowPw]=useState(false);
  const[pwErr,setPwErr]=useState(false);
  const[appPassword,setAppPassword]=useState(()=>localStorage.getItem("mhf_pw")||"1234");
  const fRef=useRef();
  const excelRef=useRef();
  const iRef=useRef();
  const eiRef=useRef();

  const[banks,setBanks]=useState(IBK);
  const[cash,setCash]=useState(ICS);
  const[assets,setAssets]=useState(IAS);
  const[investments,setInvestments]=useState(IINV);
  const[loans,setLoans]=useState(ILN);
  const[cats,setCats]=useState(IC);
  const[txs,setTxs]=useState(ITX);
  const[budgets,setBudgets]=useState(IBG);
  const[savings,setSavings]=useState(ISV);
  const[budgetSettings,setBudgetSettings]=useState({
    buckets:[
      {id:1,name:"الميزانية",icon:"🛒",color:"#3b82f6",pct:40,accountKeys:[],type:"expenses"},
      {id:2,name:"الطوارئ",icon:"🚨",color:"#f97316",pct:20,accountKeys:[],type:"emergency",emergencyPct:20},
      {id:3,name:"الممتلكات",icon:"🏠",color:"#14b8a6",pct:15,accountKeys:[],type:"assets"},
      {id:4,name:"الاستثمار",icon:"📈",color:"#8b5cf6",pct:15,accountKeys:[],type:"investment"},
      {id:5,name:"التقاعد",icon:"🏦",color:"#6366f1",pct:10,accountKeys:[],type:"retirement"}
    ]
  });
  const[loaded,setLoaded]=useState(false);

  // Load EmailJS
  useEffect(()=>{
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload=()=>window.emailjs.init(EMAILJS_KEY);
    document.head.appendChild(s);
  },[]);

  useEffect(()=>{
    const loadAll=async()=>{
      const b=await _load('banks'); if(b)setBanks(b);
      const c=await _load('cash'); if(c)setCash(c);
      const a=await _load('assets'); if(a)setAssets(a);
      const inv=await _load('investments'); if(inv)setInvestments(inv);
      const l=await _load('loans'); if(l)setLoans(l);
      const ct=await _load('cats'); if(ct)setCats(ct);
      const tx=await _load('txs'); if(tx){
        const migrated=tx.map(t=>{
          if(t.isLoan&&!t.loanKind){
            const d=t.desc||"";
            const kind=(d.startsWith("تسديد")||/من\s/.test(d))?"أخذت":"أعطيت";
            return{...t,loanKind:kind};
          }
          return t;
        });
        setTxs(migrated);
      }
      const pw=await _load('appPassword'); if(pw){setAppPassword(pw);localStorage.setItem("mhf_pw",pw);}
      const rc=await _load('recoveryContact'); if(rc)setRecoveryContact(rc);
      const bs=await _load('budgetSettings');
      const OLD2NEW_COLOR={"#ef4444":"#3b82f6","#f59e0b":"#f97316","#1a6b4a":"#8b5cf6"};
      const migrateColor=c=>OLD2NEW_COLOR[c]||c;
      const defaultBuckets=[
        ...[{"id":1,"name":"الميزانية","icon":"🛒","color":"#3b82f6","pct":50,"accountKeys":["b-1783600840182-1783600840122"],"type":"expenses"},{"id":2,"name":"الطوارئ","icon":"🚨","color":"#f97316","pct":10,"accountKeys":["b-1783600840182-1783600840163"],"type":"emergency","emergencyPct":20},{"id":3,"name":"الممتلكات","icon":"🏠","color":"#14b8a6","pct":17,"accountKeys":["b-1783600840132-1783600840193"],"type":"assets"},{"id":4,"name":"الاستثمار","icon":"📈","color":"#8b5cf6","pct":15,"accountKeys":["c-1783600840163"],"type":"investment"},{"id":5,"name":"التقاعد","icon":"🏦","color":"#6366f1","pct":8,"accountKeys":["c-1783600840161"],"type":"retirement"}].slice(0)
      ];
      if(bs){
        if(bs.buckets&&bs.buckets.length>0){
          // نظام جديد — حمل مباشرة (مع تحديث الألوان القديمة تلقائيا)
          setBudgetSettings({...bs,buckets:bs.buckets.map(b=>({...b,color:migrateColor(b.color),accountKeys:Array.isArray(b.accountKeys)?b.accountKeys:[]}))});
        } else if(bs.allocations&&bs.allocations.length>0){
          // ترحيل من النظام القديم
          setBudgetSettings({buckets:bs.allocations.map(a=>({...a,accountKeys:Array.isArray(a.accountKeys)?a.accountKeys:[]}))});
        } else {
          // ما فيهوش buckets ولا allocations — استعمل default
          setBudgetSettings({buckets:defaultBuckets});
        }
      } else {
        // أول مرة — استعمل default
        setBudgetSettings({buckets:defaultBuckets});
      }
      setLoaded(true);
    };
    loadAll();
  },[]);

  useEffect(()=>{if(loaded)_save('banks',banks);},[banks,loaded]);
  useEffect(()=>{if(loaded)_save('cash',cash);},[cash,loaded]);
  useEffect(()=>{if(loaded)_save('assets',assets);},[assets,loaded]);
  useEffect(()=>{if(loaded)_save('investments',investments);},[investments,loaded]);
  useEffect(()=>{if(loaded)_save('loans',loans);},[loans,loaded]);
  useEffect(()=>{if(loaded)_save('cats',cats);},[cats,loaded]);
  useEffect(()=>{if(loaded)_save('txs',txs);},[txs,loaded]);
  useEffect(()=>{if(loaded)_save('budgetSettings',budgetSettings);},[budgetSettings,loaded]);
  useEffect(()=>{if(loaded)_save('appPassword',appPassword);},[appPassword,loaded]);
  useEffect(()=>{if(loaded&&recoveryContact)_save('recoveryContact',recoveryContact);},[recoveryContact,loaded]);

  const allAcc=[
    ...banks.flatMap(b=>b.accounts.map(a=>({...a,bn:b.name,bid:b.id,key:`b-${b.id}-${a.id}`,ref:{k:"bank",bid:b.id,aid:a.id}}))),
    ...cash.map(c=>({...c,bn:c.type,key:`c-${c.id}`,ref:{k:"cash",cid:c.id}})),
  ];
  const totBal=allAcc.reduce((s,a)=>s+(a.balance||0),0);
  const totAst=assets.reduce((s,a)=>s+(a.value||0),0);
  const totGiv=loans.filter(l=>l.kind==="أعطيت").reduce((s,l)=>s+l.remaining,0);
  const totOwd=loans.filter(l=>l.kind==="أخذت").reduce((s,l)=>s+l.remaining,0);
  const totInv=investments.reduce((s,i)=>s+(i.amount||0),0);
  const mInc=txs.filter(t=>t.type==="income"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isLoan&&!t.isInvest&&!t.isAsset&&!(t.desc||"").includes("رجوع سلفة")).reduce((s,t)=>s+t.amount,0);
  const mExp=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isLoan&&!t.isAsset&&!t.isInvest&&!(t.desc||"").includes("تحويل")).reduce((s,t)=>s+t.amount,0);

  const gc=(tp,id)=>cats[tp]?.find(c=>c.id===id);
  const gs=(tp,cid,sid)=>gc(tp,cid)?.subs?.find(s=>s.id===sid);
  const tl=t=>{const tp=t.type==="income"?"income":"expense";const c=gc(tp,t.catId);const s=gs(tp,t.catId,t.subId);return{cn:c?.name||"—",sn:s?.name||"",ic:c?.ci||c?.icon||"📌",hi:!!c?.ci,col:c?.color||"#64748b"};};
  const al=ref=>{if(!ref)return"";if(ref.k==="bank"){const b=banks.find(x=>x.id===ref.bid);const a=b?.accounts.find(x=>x.id===ref.aid);return`${b?.name} - ${a?.name}`;}if(ref.k==="cash"){return cash.find(x=>x.id===ref.cid)?.name;}return"";};

  const expByCat=txs.filter(t=>t.type==="expense"&&t.date.startsWith(MONTH)&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((acc,t)=>{const c=gc("expense",t.catId);const k=c?.name||"أخرى";acc[k]=(acc[k]||0)+t.amount;return acc;},{});
  const pie=Object.entries(expByCat).map(([name,value])=>({name,value}));
  const chart=Array.from({length:6},(_,i)=>{const now=new Date();const d=new Date(now.getFullYear(),now.getMonth()-i,1);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;return{lbl:d.toLocaleString("ar-MA",{month:"short"}),inc:txs.filter(t=>t.type==="income"&&t.date.startsWith(k)&&t.pm!=="تحويل"&&!t.isTransfer).reduce((s,t)=>s+t.amount,0),exp:txs.filter(t=>t.type==="expense"&&t.date.startsWith(k)&&t.pm!=="تحويل"&&!t.isTransfer&&!t.isAsset&&!t.isInvest).reduce((s,t)=>s+t.amount,0)};}).reverse();

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

  const getBucketBalanceLive=(type)=>{
    const bkt=(budgetSettings.buckets||[]).find(b=>b.type===type);
    if(!bkt)return null;
    const totalInc=txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
    const allocated=totalInc*(bkt.pct/100);
    if(type==="expenses"){
      const spent=txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
      return allocated-spent;
    }
    if(type==="emergency"){
      const out=txs.filter(t=>t.type==="expense"&&t.isTransfer&&(t.desc||"").includes("إعاشة")).reduce((s,t)=>s+t.amount,0);
      return allocated-out;
    }
    if(type==="assets"){
      const out=txs.filter(t=>t.type==="expense"&&t.isAsset).reduce((s,t)=>s+t.amount,0);
      const inB=txs.filter(t=>t.type==="income"&&t.isAsset).reduce((s,t)=>s+t.amount,0);
      return allocated-out+inB;
    }
    if(type==="investment"){
      const out=txs.filter(t=>t.type==="expense"&&t.isInvest).reduce((s,t)=>s+t.amount,0);
      const inB=txs.filter(t=>t.type==="income"&&t.isInvest).reduce((s,t)=>s+t.amount,0);
      return allocated-out+inB;
    }
    if(type==="retirement"){
      const out=loans.filter(l=>l.kind==="أعطيت").reduce((s,l)=>s+(l.remaining||0),0);
      return allocated-out;
    }
    return allocated;
  };

  const addTx=()=>{
    if(!form.amount){showErr("⛔ أدخل المبلغ");return;}
    if(!form.catId){showErr("⛔ اختر التصنيف");return;}
    // تحقق من الفرع إذا كان التصنيف عنده فروع
    const _selCat=gc(form.txType||"expense",parseInt(form.catId));
    if(_selCat?.subs?.length>0&&!form.subId){showErr("⛔ الفرع إجباري — اختر الفرع");return;}
    if(form.pm!=="كريدي"&&!form.akey){showErr("⛔ اختر الحساب");return;}
    // منع المصروف إذا الميزانية ناقصة
    if((form.txType||"expense")==="expense"&&!form.isLoan&&!form.isInvest&&!form.isAsset){
      const expBkt=(budgetSettings.buckets||[]).find(b=>b.type==="expenses");
      if(expBkt){
        const totalInc2=txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
        const totalExp2=txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
        const bktBal=(totalInc2*(expBkt.pct/100))-totalExp2;
        const newAmt=parseFloat(form.amount)||0;
        if(bktBal-newAmt<0){
          showErr(`⛔ رصيد الميزانية غير كافي — المتاح: ${fmt(Math.max(0,bktBal))} د.م`);return;
        }
      }
    }
    const acc=form.akey?allAcc.find(a=>a.key===form.akey):null;
    if(form.pm!=="كريدي"&&!acc)return;
    const amt=parseFloat(form.amount);
    if(isNaN(amt)||amt<=0){showErr("⛔ المبلغ غير صحيح");return;}
    if((form.txType||"expense")==="expense"&&form.pm!=="كريدي"&&acc&&amt>(acc.balance||0)){
      showErr("⛔ الرصيد غير كافي — الرصيد المتاح: "+fmt(acc.balance||0));return;
    }
    const tx={id:uid(),type:form.txType||"expense",amount:amt,catId:(isNaN(parseInt(form.catId))?form.catId:parseInt(form.catId)),subId:form.subId?(isNaN(parseInt(form.subId))?form.subId:parseInt(form.subId)):null,desc:form.desc||"",date:form.date||new Date().toISOString().split("T")[0],pm:form.pm||"نقدي",ref:acc?.ref||null};
    setTxs(p=>[tx,...p]);
    if(tx.pm!=="كريدي"&&acc)updBal(acc.ref,tx.amount,tx.type,"add");
    cm();
    // ملاحظة: توزيع الأقسام الخمسة أوتوماتيكي بالكامل (نسبة % من كل دخل)
    // ما خاصوش أي خطوة يدوية — الأرصدة كتتحسب مباشرة فصفحة الميزانية
  };
  const delTx=(id)=>{
    const t=txs.find(x=>x.id===id);if(!t)return;
    updBal(t.ref,t.amount,t.type,"remove");
    // إذا كانت معاملة مرتبطة بسلفة (رجوع/سداد)، نرجعو remaining للسلفة الأصلية
    let loanAdjustId=null;
    if(t.isLoan&&(t.desc||"").includes("رجوع سلفة")){
      const personMatch=loans.find(l=>(t.desc||"").includes(l.person));
      if(personMatch){
        loanAdjustId=personMatch.id;
        setLoans(p=>p.map(l=>l.id===personMatch.id?{...l,remaining:Math.min(l.amount,l.remaining+t.amount)}:l));
      }
    }
    setTxs(p=>p.filter(x=>x.id!==id));
    if(undoTimerRef.current)clearTimeout(undoTimerRef.current);
    setLastDeleted({tx:t,loanAdjustId});
    undoTimerRef.current=setTimeout(()=>setLastDeleted(null),6000);
  };
  const undoDelete=()=>{
    if(!lastDeleted)return;
    const{tx:t,loanAdjustId}=lastDeleted;
    if(undoTimerRef.current)clearTimeout(undoTimerRef.current);
    updBal(t.ref,t.amount,t.type,"add");
    if(loanAdjustId){
      setLoans(p=>p.map(l=>l.id===loanAdjustId?{...l,remaining:Math.max(0,l.remaining-t.amount)}:l));
    }
    setTxs(p=>[t,...p]);
    setLastDeleted(null);
  };
  const saveTxEdit=()=>{
    if(!ei||!ei.amount)return;
    const _editCat=gc(ei.type||"expense",ei.catId);
    if(_editCat?.subs?.length>0&&!ei.subId){showErr("⛔ الفرع إجباري — اختر الفرع");return;}
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
    setInvestments([]);setSavings([]);setBudgets([]);
    setBudgetSettings({buckets:[
      {id:1,name:"الميزانية",icon:"🛒",color:"#3b82f6",pct:40,accountKeys:[],type:"expenses"},
      {id:2,name:"الطوارئ",icon:"🚨",color:"#f97316",pct:20,accountKeys:[],type:"emergency",emergencyPct:20},
      {id:3,name:"الممتلكات",icon:"🏠",color:"#14b8a6",pct:15,accountKeys:[],type:"assets"},
      {id:4,name:"الاستثمار",icon:"📈",color:"#8b5cf6",pct:15,accountKeys:[],type:"investment"},
      {id:5,name:"التقاعد",icon:"🏦",color:"#6366f1",pct:10,accountKeys:[],type:"retirement"}
    ]});
    setBkMsg("✅ تم إعادة الضبط الكامل");
    setTimeout(()=>setBkMsg(null),3000);
  };

  const addBank=()=>{if(!form.name)return;setBanks(p=>[...p,{id:uid(),name:form.name,address:form.addr||"",accounts:[]}]);cm();};
  const addBAcc=()=>{if(!form.type||!form.name||!selBk)return;setBanks(p=>p.map(b=>b.id===selBk?{...b,accounts:[...b.accounts,{id:uid(),type:form.type,name:form.name,balance:parseFloat(form.bal||0),color:form.color||"#10b981"}]}:b));cm();};
  const edBAcc=(bid,aid,d)=>setBanks(p=>p.map(b=>b.id===bid?{...b,accounts:b.accounts.map(a=>a.id===aid?{...a,...d}:a)}:b));
  const addCash=()=>{if(!form.name)return;setCash(p=>[...p,{id:uid(),type:form.type||"نقدية",name:form.name,balance:parseFloat(form.bal||0),color:form.color||"#f59e0b"}]);cm();};
  const addAst=()=>{if(!form.name)return;setAssets(p=>[...p,{id:uid(),type:form.type||"أخرى",name:form.name,value:0,note:form.val||"",color:form.color||"#14b8a6"}]);cm();};
  const scheduleLoanReminder=async(loanId,person,amount,dateStr,kind)=>{
    if(!dateStr)return;
    try{
      const {LocalNotifications}=await import("@capacitor/local-notifications");
      const perm=await LocalNotifications.checkPermissions();
      if(perm.display!=="granted"){
        const req=await LocalNotifications.requestPermissions();
        if(req.display!=="granted")return;
      }
      const notifId=Math.abs(loanId.split("").reduce((a,c)=>a+c.charCodeAt(0),0))%2000000000;
      await LocalNotifications.schedule({notifications:[{
        title:kind==="أعطيت"?"🔔 تذكير: استرجاع سلفة":"🔔 تذكير: تسديد قرض",
        body:kind==="أعطيت"?`حان وقت استرجاع ${fmt(amount)} من ${person}`:`حان وقت تسديد ${fmt(amount)} لـ ${person}`,
        id:notifId,
        schedule:{at:new Date(dateStr+"T09:00:00")},
        smallIcon:"ic_stat_icon_config_sample",
      }]});
    }catch(e){console.error("reminder schedule failed",e);}
  };
  const addLoan=()=>{
    if(!form.person||!form.amount)return;
    if(!form.akey){showErr("⛔ خاصك تختار الحساب");return;}
    const amt=parseFloat(form.amount);
    const acc=allAcc.find(a=>a.key===form.akey);
    if(acc&&form.kind==="أعطيت"&&amt>(acc.balance||0)){showErr("⛔ الرصيد غير كافي — المتاح: "+fmt(acc.balance||0));return;}
    if(form.kind==="أعطيت"){
      const retBal=getBucketBalanceLive("retirement");
      if(retBal!==null&&amt>retBal){showErr(`⛔ قسم التقاعد ناقص — المتاح: ${fmt(Math.max(retBal,0))}`);return;}
    }
    const txType=form.kind==="أعطيت"?"expense":"income";
    if(acc)updBal(acc.ref,amt,txType,"add");
    const ldate=form.date||new Date().toISOString().split("T")[0];
    setTxs(p=>[{id:uid(),type:txType,amount:amt,catId:null,subId:null,desc:`${form.kind==="أعطيت"?"سلفة لـ":form.wi?"قرض من":"سلفة من"} ${form.person}`,date:ldate,pm:"نقدي",ref:acc?.ref||null,isLoan:true,isTransfer:true,loanKind:form.kind||"أعطيت"},...p]);
    const newLoanId=uid();
    setLoans(p=>[...p,{id:newLoanId,kind:form.kind||"أعطيت",person:form.person,amount:amt,remaining:amt,date:ldate,note:form.note||"",wi:!!form.wi,interest:parseFloat(form.irate||0),inst:!!form.inst,minst:parseFloat(form.minst||0),akey:form.akey,remindDate:form.remindDate||null}]);
    if(form.remindDate)scheduleLoanReminder(newLoanId,form.person,amt,form.remindDate,form.kind||"أعطيت");
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

  // ===== نظام الحماية المتشددة =====
  const getBackupData=()=>({banks,cash,assets,investments,loans,cats,txs,budgetSettings});

  const autoBackup=async(label="auto")=>{
    try{
      const {Filesystem,Directory,Encoding}=await import("@capacitor/filesystem");
      const d=JSON.stringify(getBackupData());
      const date=new Date().toISOString().split("T")[0];
      // نسخة باليوم
      await Filesystem.writeFile({path:`backup-${label}-${date}.json`,directory:Directory.Data,data:d,encoding:Encoding.UTF8});
      // نسخة ثابتة (آخر نسخة)
      await Filesystem.writeFile({path:`backup-${label}-latest.json`,directory:Directory.Data,data:d,encoding:Encoding.UTF8});
    }catch(e){console.log("autoBackup err",e);}
  };

  // Auto-save كل 5 دقائق
  useEffect(()=>{
    const interval=setInterval(()=>{
      if(loaded)autoBackup("autosave");
    },5*60*1000);
    return()=>clearInterval(interval);
  },[loaded,banks,cash,assets,investments,loans,cats,txs,budgetSettings]);

  const expData=async()=>{
    const d=JSON.stringify({banks,cash,assets,loans,cats,txs,budgetSettings,investments},null,2);
    const fileName="mahfazati-backup-"+new Date().toISOString().split("T")[0]+".json";
    try{
      // محاولة الكتابة فـ Downloads الحقيقي ديال الهاتف (Capacitor)
      const {Filesystem,Directory,Encoding}=await import("@capacitor/filesystem");
      await Filesystem.writeFile({
        path:fileName,
        data:d,
        directory:Directory.Documents,
        encoding:Encoding.UTF8,
        recursive:true
      });
      setBkMsg("✅ تم الحفظ فـ Documents/"+fileName);setTimeout(()=>setBkMsg(null),4000);
    }catch(e){
      // fallback للمتصفح العادي
      const b=new Blob([d],{type:"application/json"});
      const u=URL.createObjectURL(b);
      const a=document.createElement("a");
      a.href=u;a.download=fileName;a.click();
      URL.revokeObjectURL(u);
      setBkMsg("✅ تم التحميل — شوف Downloads");setTimeout(()=>setBkMsg(null),3500);
    }
  };
  const GOOGLE_WEB_CLIENT_ID="34722943454-fh1mq1vodlnhpch0u1q020f7jar3ba4f.apps.googleusercontent.com";
  const DRIVE_FILE_NAME="mahfazati-backup.json";
  let _socialLoginInit=false;
  const driveSignIn=async()=>{
    const {SocialLogin}=await import("@capgo/capacitor-social-login");
    if(!_socialLoginInit){
      await SocialLogin.initialize({
        google:{webClientId:GOOGLE_WEB_CLIENT_ID,mode:"online"},
      });
      _socialLoginInit=true;
    }
    const res=await SocialLogin.login({
      provider:"google",
      options:{scopes:["email","profile","https://www.googleapis.com/auth/drive.file"]},
    });
    console.log("SocialLogin result",JSON.stringify(res));
    const token=res?.result?.accessToken?.token||res?.result?.accessToken;
    if(!token)throw new Error("ما توصلناش بتوكن دخول صحيح");
    return token;
  };
  const openDriveAfterExport=async()=>{
    try{
      setBkMsg("🔐 تسجيل الدخول لـ Google...");
      const token=await driveSignIn();
      setBkMsg("☁️ كنبحث على النسخة القديمة...");
      const d=JSON.stringify({banks,cash,assets,loans,cats,txs,budgetSettings,investments},null,2);
      const q=encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false`);
      const searchRes=await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&spaces=drive&fields=files(id,name)`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      const searchData=await searchRes.json();
      const existing=searchData.files&&searchData.files[0];
      const boundary="mahfazati_"+Date.now();
      const metaPart=existing?"{}":JSON.stringify({name:DRIVE_FILE_NAME,mimeType:"application/json"});
      const body=`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metaPart}\r\n`+
        `--${boundary}\r\nContent-Type: application/json\r\n\r\n${d}\r\n`+
        `--${boundary}--`;
      const url=existing
        ?`https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
        :`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
      setBkMsg("📤 كنرفع النسخة...");
      const uploadRes=await fetch(url,{
        method:existing?"PATCH":"POST",
        headers:{Authorization:`Bearer ${token}`,"Content-Type":`multipart/related; boundary=${boundary}`},
        body
      });
      if(!uploadRes.ok)throw new Error("رمز "+uploadRes.status);
      setBkMsg("✅ تم الحفظ فـ Google Drive بنجاح");setTimeout(()=>setBkMsg(null),4000);
    }catch(e){
      console.error(e);
      setBkMsg("⛔ فشل الحفظ فـ Drive — "+(e.message||"خطأ غير معروف"));setTimeout(()=>setBkMsg(null),5000);
    }
  };
  const applyImportedData=(d)=>{
    if(d.banks){setBanks(d.banks);_save('banks',d.banks);}
    if(d.cash){setCash(d.cash);_save('cash',d.cash);}
    if(d.assets&&d.assets.length>0){setAssets(d.assets);_save('assets',d.assets);}
    if(d.loans&&d.loans.length>0){setLoans(d.loans);_save('loans',d.loans);}
    if(d.budgetSettings){
      const bs=d.budgetSettings;
      let newBS;
      if(bs.buckets&&bs.buckets.length>0){
        newBS={...bs,buckets:bs.buckets.map(b=>({...b,accountKeys:Array.isArray(b.accountKeys)?b.accountKeys:[]}))};
      } else if(bs.allocations&&bs.allocations.length>0){
        newBS={buckets:bs.allocations.map(a=>({...a,accountKeys:Array.isArray(a.accountKeys)?a.accountKeys:[]}))};
      } else {
        newBS=bs;
      }
      setBudgetSettings(newBS);_save('budgetSettings',newBS);
    }
    if(d.investments){setInvestments(d.investments);_save('investments',d.investments);}
    if(d.cats){
      const newCats={expense:d.cats.expense||[],income:d.cats.income||[]};
      setCats(newCats);_save('cats',newCats);
    }
    if(d.txs&&d.txs.length>0){
      const sortedTxs=[...d.txs].sort((a,b)=>b.date.localeCompare(a.date));
      setTxs(sortedTxs);_save('txs',sortedTxs);
    }
  };
  const restoreFromDrive=async()=>{
    try{
      setBkMsg("🔐 تسجيل الدخول لـ Google...");
      const token=await driveSignIn();
      setBkMsg("☁️ كنبحث على النسخة فـ Drive...");
      const q=encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false`);
      const searchRes=await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&spaces=drive&fields=files(id,name,modifiedTime)`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      const searchData=await searchRes.json();
      const existing=searchData.files&&searchData.files[0];
      if(!existing){setBkMsg("⛔ ما لقيتش نسخة محفوظة فـ Drive");setTimeout(()=>setBkMsg(null),4000);return;}
      if(!window.confirm(`لقيت نسخة محفوظة (آخر تحديث: ${new Date(existing.modifiedTime).toLocaleString("ar-MA")}).\n\n⚠️ هادشي غادي يبدل كل البيانات الحالية فهاد الهاتف بالنسخة ديال Drive. متأكد؟`)){
        setBkMsg(null);return;
      }
      // نسخة احتياطية محلية قبل الاسترجاع
      autoBackup("before-drive-restore");
      setBkMsg("⬇️ كنجيب البيانات...");
      const fileRes=await fetch(`https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      if(!fileRes.ok)throw new Error("رمز "+fileRes.status);
      const d=await fileRes.json();
      applyImportedData(d);
      setBkMsg(`✅ تم الاسترجاع من Drive — ${d.txs?.length||0} معاملة`);setTimeout(()=>setBkMsg(null),4000);
    }catch(e){
      console.error(e);
      setBkMsg("⛔ فشل الاسترجاع من Drive — "+(e.message||"خطأ غير معروف"));setTimeout(()=>setBkMsg(null),5000);
    }
  };
  const exportExcel=async()=>{
    try{
      const XLSX=await import("xlsx");
      const rows=txs.map(t=>{
        const tp=t.type==="income"?"income":"expense";
        const c=gc(tp,t.catId);
        const s=t.subId?gs(tp,t.catId,t.subId):null;
        const acc=allAcc.find(a=>JSON.stringify(a.ref)===JSON.stringify(t.ref));
        return{
          "التاريخ":t.date,
          "النوع":t.type==="income"?"دخل":"مصروف",
          "التصنيف":c?.name||"",
          "الفرع":s?.name||"",
          "المبلغ":t.amount,
          "الحساب":acc?`${acc.bn} - ${acc.name}`:"",
          "الوصف":t.desc||"",
          "طريقة الدفع":t.pm||"",
        };
      });
      const ws=XLSX.utils.json_to_sheet(rows);
      const wb=XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,ws,"المعاملات");
      const base64=XLSX.write(wb,{type:"base64",bookType:"xlsx"});
      const fileName="mahfazati-transactions-"+new Date().toISOString().split("T")[0]+".xlsx";
      try{
        const {Filesystem,Directory}=await import("@capacitor/filesystem");
        await Filesystem.writeFile({path:fileName,data:base64,directory:Directory.Documents,recursive:true});
        setBkMsg("✅ تم الحفظ فـ Documents/"+fileName);setTimeout(()=>setBkMsg(null),4000);
      }catch(e2){
        const bin=atob(base64);const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
        const blob=new Blob([arr],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=fileName;a.click();URL.revokeObjectURL(u);
        setBkMsg("✅ تم التحميل — شوف Downloads");setTimeout(()=>setBkMsg(null),3500);
      }
    }catch(e){showErr("⛔ فشل تصدير Excel — خاصك تدير npm install xlsx");setTimeout(()=>setErr(null),4000);}
  };
  const importExcel=async(e)=>{
    const file=e.target.files[0];if(!file)return;
    try{
      const XLSX=await import("xlsx");
      const buf=await file.arrayBuffer();
      const wb=XLSX.read(buf,{type:"array"});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=XLSX.utils.sheet_to_json(ws);
      autoBackup("before-excel-import");
      const newTxs=rows.map(r=>{
        const type=r["النوع"]==="دخل"?"income":"expense";
        const catName=r["التصنيف"];
        const cat=(cats[type]||[]).find(c=>c.name===catName);
        const subName=r["الفرع"];
        const sub=cat&&subName?(cat.subs||[]).find(s=>s.name===subName):null;
        const accLabel=r["الحساب"];
        const acc=allAcc.find(a=>`${a.bn} - ${a.name}`===accLabel);
        let dateStr=r["التاريخ"];
        if(dateStr instanceof Date)dateStr=dateStr.toISOString().split("T")[0];
        else if(typeof dateStr==="number")dateStr=new Date(Math.round((dateStr-25569)*86400*1000)).toISOString().split("T")[0];
        else dateStr=(dateStr||new Date().toISOString().split("T")[0]).toString();
        return{
          id:uid(),type,amount:parseFloat(r["المبلغ"])||0,
          catId:cat?cat.id:null,subId:sub?sub.id:null,
          desc:r["الوصف"]||"",date:dateStr,
          pm:r["طريقة الدفع"]||"نقدي",ref:acc?acc.ref:null
        };
      }).filter(t=>t.amount>0);
      newTxs.forEach(t=>{if(t.ref&&t.pm!=="كريدي")updBal(t.ref,t.amount,t.type,"add");});
      setTxs(p=>[...newTxs,...p]);
      setBkMsg(`✅ تم استيراد ${newTxs.length} معاملة من Excel`);setTimeout(()=>setBkMsg(null),4000);
    }catch(err){console.error(err);showErr("⛔ فشل الاستيراد — تأكد من شكل الملف (نفس أعمدة التصدير)");setTimeout(()=>setErr(null),4000);}
    e.target.value="";
  };
  const impData=e=>{
    const file=e.target.files[0];if(!file)return;
    // حفظ نسخة احتياطية قبل الاستيراد
    autoBackup("before-import");
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const d=JSON.parse(ev.target.result);
        applyImportedData(d);
        setBkMsg(`تم الاستيراد ✅ — ${d.txs?.length||0} معاملة`);
      }catch(err){setBkMsg("خطأ في الملف ❌");}
      setTimeout(()=>setBkMsg(null),4000);
    };
    r.readAsText(file);e.target.value="";
  };

  const tryBiometric=async()=>{
    try{
      const {NativeBiometric}=await import("@capgo/capacitor-native-biometric");
      const avail=await NativeBiometric.isAvailable();
      if(!avail.isAvailable)return false;
      await NativeBiometric.verifyIdentity({
        reason:"افتح محفظتي بالبصمة",
        title:"محفظتي",
        subtitle:"تحقق من هويتك",
        description:"استعمل بصمتك للدخول",
      });
      sessionStorage.setItem("mhf_auth","1");setIsAuth(true);
      return true;
    }catch(e){return false;}
  };
  useEffect(()=>{
    if(bioEnabled&&!isAuth&&!bioTried){setBioTried(true);tryBiometric();}
  },[bioEnabled,isAuth,bioTried]);

  if(!isAuth) return (
    <div dir="rtl" style={{fontFamily:"'Tajawal',sans-serif",background:"linear-gradient(135deg,#f5f5f0,#e8f5ee)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,filter:darkMode?"invert(1) hue-rotate(180deg)":"none"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{background:"white",borderRadius:24,padding:36,width:"100%",maxWidth:340,boxShadow:"0 8px 32px rgba(26,107,74,.12)",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:16}}>💰</div>
        <div style={{fontSize:22,fontWeight:900,color:"#1a6b4a",marginBottom:6}}>محفظتي</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:28}}>أدخل كلمة السر للدخول</div>
        <div style={{position:"relative",marginBottom:8}}>
          <input type={showPw?"text":"password"} placeholder="كلمة السر" value={pwInput}
            onChange={e=>{setPwInput(e.target.value);setPwErr(false);}}
            onKeyDown={e=>{if(e.key==="Enter"){if(pwInput===appPassword){sessionStorage.setItem("mhf_auth","1");setIsAuth(true);}else setPwErr(true);}}}
            style={{background:"#f5f5f0",border:`2px solid ${pwErr?"#ef4444":"#e8e8e4"}`,borderRadius:12,padding:"12px 44px 12px 16px",color:"#1a1a1a",fontFamily:"Tajawal",fontSize:16,width:"100%",outline:"none",textAlign:"center"}}
            autoFocus/>
          <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",padding:0}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {showPw?<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>:<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>}
            </svg>
          </button>
        </div>
        {pwErr&&<div style={{color:"#ef4444",fontSize:13,marginBottom:8}}>❌ كلمة السر غلط</div>}
                {/* نسيت كلمة السر */}
        {resetStep===0&&<button style={{background:"none",border:"none",color:"#6366f1",fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:8,textDecoration:"underline"}}
          onClick={()=>{if(!recoveryContact||!recoveryContact.includes("@")){showErr("سجل إيميلك في الإعدادات أولاً");return;}sendResetEmail();}}>
          🔑 نسيت كلمة السر؟
        </button>}

        {/* خطوة 1: دخل الكود */}
        {resetStep===1&&<div style={{marginTop:12,padding:16,background:"#f0fdf4",borderRadius:12,border:"1px solid #10b98133",width:"100%",boxSizing:"border-box"}}>
          <div style={{fontSize:13,color:"#1a6b4a",fontWeight:700,marginBottom:8,textAlign:"center"}}>📧 وصلك كود على {recoveryContact}</div>
          <input style={{width:"100%",borderRadius:10,border:"2px solid #10b981",padding:"12px 16px",fontSize:18,textAlign:"center",fontFamily:"inherit",boxSizing:"border-box",letterSpacing:4}}
            type="text" placeholder="------" maxLength={6} value={resetCode}
            onChange={e=>setResetCode(e.target.value)}/>
          <button style={{width:"100%",marginTop:10,background:"#10b981",color:"#1a1a1a",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
            onClick={()=>{
              if(resetCode===sentCode){setResetStep(2);setResetCode("");}
              else showErr("الكود غلط — حاول مرة أخرى");
            }}>تأكيد الكود ✅</button>
          <button style={{width:"100%",marginTop:6,background:"none",border:"none",color:"#64748b",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}
            onClick={()=>{setResetStep(0);setSentCode("");setResetCode("");}}>إلغاء</button>
        </div>}

        {/* خطوة 2: كلمة السر الجديدة */}
        {resetStep===2&&<div style={{marginTop:12,padding:16,background:"#f0fdf4",borderRadius:12,border:"1px solid #10b98133",width:"100%",boxSizing:"border-box"}}>
          <div style={{fontSize:13,color:"#1a6b4a",fontWeight:700,marginBottom:8,textAlign:"center"}}>🔐 أدخل كلمة السر الجديدة</div>
          <input style={{width:"100%",borderRadius:10,border:"2px solid #10b981",padding:"12px 16px",fontSize:16,fontFamily:"inherit",boxSizing:"border-box"}}
            type="password" placeholder="كلمة السر الجديدة" value={resetCode}
            onChange={e=>setResetCode(e.target.value)}/>
          <button style={{width:"100%",marginTop:10,background:"#10b981",color:"#1a1a1a",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
            onClick={()=>{
              if(!resetCode||resetCode.length<4){showErr("كلمة السر خاصها 4 أحرف على الأقل");return;}
              setAppPassword(resetCode);
              localStorage.setItem("mhf_pw",resetCode);
              setResetStep(0);setSentCode("");setResetCode("");
              setPwErr(false);setPwInput("");
              setErr("✅ تم تغيير كلمة السر");setTimeout(()=>setErr(null),3000);
            }}>حفظ كلمة السر الجديدة 🔐</button>
        </div>}

        {pwErr&&!resetStep&&<div style={{fontSize:12,color:"#ef4444",marginTop:8}}>❌ كلمة السر غلط</div>}
        <button onClick={()=>{if(pwInput===appPassword){sessionStorage.setItem("mhf_auth","1");setIsAuth(true);}else setPwErr(true);}}
          style={{background:"#10b981",color:"#1a1a1a",border:"none",padding:"13px",borderRadius:12,fontFamily:"Tajawal",fontSize:15,fontWeight:700,cursor:"pointer",width:"100%",marginTop:4}}>
          دخول 🔓
        </button>
        {bioEnabled&&<button onClick={tryBiometric} style={{background:"#e8f5ee",border:"none",borderRadius:12,padding:"11px",fontFamily:"Tajawal",fontSize:14,fontWeight:700,color:"#1a6b4a",cursor:"pointer",width:"100%",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          👆 الدخول بالبصمة
        </button>}
      </div>
    </div>
  );

  const NAV=[{id:"dashboard",icon:<Home size={18}/>,lbl:"الرئيسية"},{id:"transactions",icon:<Wallet size={18}/>,lbl:"المعاملات"},{id:"reports",icon:<BarChart3 size={18}/>,lbl:"التقارير"}];
  const Ico=({src,fb,sz=20})=>src?<img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:sz}}>{fb}</span>;
  const PeriodSelector=()=>{
    const years=[...new Set(txs.map(t=>t.date.slice(0,4)))].sort().reverse();
    const months=[...new Set(txs.map(t=>t.date.slice(0,7)))].sort().reverse();
    return(
      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
        <button onClick={()=>setPeriod(p=>({...p,type:"all"}))} style={{...S.btn(period.type==="all"?"#10b981":"#e8e8e4",false),padding:"6px 12px",fontSize:12,color:period.type==="all"?"white":"#475569"}}>الكل</button>
        <button onClick={()=>setPeriod(p=>({...p,type:"year"}))} style={{...S.btn(period.type==="year"?"#6366f1":"#e8e8e4",false),padding:"6px 12px",fontSize:12,color:period.type==="year"?"white":"#475569"}}>سنوي</button>
        <button onClick={()=>setPeriod(p=>({...p,type:"month"}))} style={{...S.btn(period.type==="month"?"#f59e0b":"#e8e8e4",false),padding:"6px 12px",fontSize:12,color:period.type==="month"?"white":"#475569"}}>شهري</button>
        {period.type==="year"&&<select style={{...S.sel,flex:1,fontSize:12}} value={period.year} onChange={e=>setPeriod(p=>({...p,year:e.target.value}))}>{years.map(y=><option key={y} value={y}>{y}</option>)}</select>}
        {period.type==="month"&&<select style={{...S.sel,flex:1,fontSize:12}} value={period.month} onChange={e=>setPeriod(p=>({...p,month:e.target.value}))}>{months.map(m=><option key={m} value={m}>{m}</option>)}</select>}
      </div>
    );
  };
  const Dot=({color})=><div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>;
  const Btn=({label,onClick,bg="#e8e8e4",color="#475569",style={}})=><button onClick={onClick} style={{background:bg,border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color,fontSize:11,fontFamily:"Tajawal",...style}}>{label}</button>;

  // خانتين: 1) نوع الحساب (بنك/كاش) 2) الحساب نفسه
  const AccPicker=({value,onChange,accList,border="#6366f1",pickerKey="akey"})=>{
    const list=accList||allAcc;
    const selAcc=list.find(a=>a.key===value);
    const typeStateKey=pickerKey+"Type";
    const typeSel=form[typeStateKey]!==undefined?form[typeStateKey]:(selAcc?selAcc.ref.k:"");
    const filtered=list.filter(a=>a.ref.k===typeSel);
    return(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <select style={{...S.sel,border:`2px solid ${border}`}} value={typeSel} onChange={e=>{F(typeStateKey,e.target.value);onChange("");}}>
          <option value="">⚠️ نوع الحساب (إجباري)</option>
          <option value="bank">🏦 بنك</option>
          <option value="cash">💵 كاش</option>
        </select>
        {typeSel&&<select style={{...S.sel,border:`2px solid ${border}`}} value={value||""} onChange={e=>onChange(e.target.value)}>
          <option value="">⚠️ اختر الحساب (إجباري)</option>
          {filtered.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name} ({fmt(a.balance||0)})</option>)}
        </select>}
      </div>
    );
  };

  const PmBtns=({val,onChange})=>(
    <div style={{display:"flex",gap:8}}>
      {["نقدي","كريدي"].map(m=><button key={m} onClick={()=>onChange(m)} style={{flex:1,padding:10,border:"2px solid",borderColor:val===m?(m==="نقدي"?"#10b981":"#f59e0b"):"#e8e8e4",borderRadius:10,background:val===m?(m==="نقدي"?"#10b98122":"#f59e0b22"):"transparent",color:val===m?(m==="نقدي"?"#10b981":"#f59e0b"):"#64748b",fontFamily:"Tajawal",fontWeight:700,cursor:"pointer",fontSize:13}}>{m==="نقدي"?"💵 نقدي":"💳 كريدي"}</button>)}
    </div>
  );

  const CatSection=({catType})=>{
    const isE=catType==="expense";
    return <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
        <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>{isE?"تصنيفات النفقات":"تصنيفات الدخل"}</span>
        <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
      </div>
      <div style={{padding:"10px 14px"}}>
        <button style={{...S.btn(isE?"#ef4444":"#10b981"),padding:"11px"}} onClick={()=>om("addMCat",{catType})}>+ إضافة تصنيف جديد</button>
      </div>
      {cats[catType].map(cat=>(
        <div key={cat.id} style={{background:"white",borderRadius:16,margin:"0 14px 8px",boxShadow:"0 1px 6px rgba(0,0,0,.06)",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",padding:"14px 14px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`cat_${cat.id}`]:!p[`cat_${cat.id}`]}))}>
            <div style={{width:44,height:44,borderRadius:13,background:cat.color+"22"||"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontSize:22,marginLeft:14,flexShrink:0}}>
              <Ico src={cat.ci} fb={cat.icon}/>
            </div>
            <span style={{flex:1,fontWeight:800,fontSize:16,color:"#1a1a1a"}}>{cat.name}</span>
            <div style={{display:"flex",gap:6,opacity:ovExp[`del_cat_${cat.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
              <button style={{background:"#e8f5ee",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#1a6b4a",fontSize:12,fontFamily:"Tajawal",fontWeight:700}} onClick={()=>{setEi({...cat,catType});om("edMCat");}}>تعديل</button>
              <button style={{background:"#fef2f2",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#ef4444",fontSize:12,fontFamily:"Tajawal",fontWeight:700}} onClick={()=>ask("mcat",cat.id,cat.name,catType)}>حذف</button>
            </div>
            <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setOvExp(p=>({...p,[`del_cat_${cat.id}`]:!p[`del_cat_${cat.id}`]}));}}>
              <span style={{fontSize:18,color:"#64748b"}}>⋯</span>
            </div>
            <span style={{color:"#64748b",fontSize:15}}>{ovExp[`cat_${cat.id}`]?"▲":"▼"}</span>
          </div>
          {ovExp[`cat_${cat.id}`]&&<>
            {cat.subs.map(s=>{
              const used=txs.some(t=>t.subId===s.id);
              return <div key={s.id} style={{display:"flex",alignItems:"center",padding:"11px 14px 11px 28px",borderTop:"1px solid #f0f0f0",background:"#fafafa"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#1a6b4a",marginLeft:12,flexShrink:0,opacity:.5}}/>
                <span style={{flex:1,fontSize:14,color:"#333333",fontWeight:600}}>{s.name}</span>
                {used&&<span style={{fontSize:10,color:"#f59e0b",marginLeft:6}}>●</span>}
                <div style={{display:"flex",gap:6,opacity:ovExp[`del_sub_${s.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
                  <button style={{background:"#e8f5ee",border:"none",borderRadius:7,padding:"3px 8px",cursor:"pointer",color:"#1a6b4a",fontSize:11,fontFamily:"Tajawal",fontWeight:700}} onClick={()=>{setEi({...s,catType,catId:cat.id});om("edSCat");}}>تعديل</button>
                  <button style={{background:"#fef2f2",border:"none",borderRadius:7,padding:"3px 8px",cursor:"pointer",color:"#ef4444",fontSize:11,fontFamily:"Tajawal",fontWeight:700}} onClick={()=>ask("scat",s.id,s.name,{ct:catType,cid:cat.id})}>حذف</button>
                </div>
                <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`del_sub_${s.id}`]:!p[`del_sub_${s.id}`]}))}>
                  <span style={{fontSize:16,color:"#64748b"}}>⋯</span>
                </div>
              </div>;
            })}
            <div style={{padding:"8px 14px 10px"}}>
              <button style={{background:"#f0fdf4",border:"1px dashed #1a6b4a66",borderRadius:8,padding:"8px 14px",cursor:"pointer",color:"#1a6b4a",fontSize:13,fontFamily:"Tajawal",fontWeight:700,width:"100%"}} onClick={()=>om("addSCat",{catType,catId:cat.id,catName:cat.name})}>+ إضافة فرع</button>
            </div>
          </>}
        </div>
      ))}
      {cats[catType].length===0&&<div style={{textAlign:"center",padding:30,color:"#64748b",fontSize:14}}>لا توجد تصنيفات — أضف تصنيفاً</div>}
    </>;
  };

  const AccCard=({sec,icon,label,color,amount,count,children})=>(
    <div style={{...S.card,padding:0,overflow:"hidden",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[sec]:!p[sec]}))}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px"}}>
        <div style={{width:44,height:44,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{label}</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>{count}</div></div>
        <div style={{fontSize:17,fontWeight:900,color,marginLeft:8}}>{fmt(amount)}</div>
        <div style={{color:"#64748b",fontSize:22,transform:ovExp[sec]?"rotate(90deg)":"none",transition:"transform .2s"}}>›</div>
      </div>
      {ovExp[sec]&&<div style={{borderTop:"1px solid #e2e8f0",padding:"12px 16px",background:"#f8fafc55"}}>{children}</div>}
    </div>
  );

  return (
    <div dir="rtl" style={{fontFamily:"'Tajawal',sans-serif",background:"#f5f5f0",minHeight:"100vh",color:"#1a1a1a",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",fontSize:(16*fontScale)+"px",zoom:fontScale,filter:darkMode?"invert(1) hue-rotate(180deg)":"none"}}>
      <style>{CSS}</style>
      <input ref={fRef} type="file" accept=".json" style={{display:"none"}} onChange={impData}/>
      <input ref={iRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])rImg(e.target.files[0],b=>F("ci",b));e.target.value="";}}/>
      <input ref={eiRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])rImg(e.target.files[0],b=>setEi(p=>({...p,ci:b})));e.target.value="";}}/>
      <div className={`ovl${drw?" op":""}`} onClick={()=>setDrw(false)}/>

      {/* FAB — مثبت على كل الصفحات */}
      <div style={{position:"fixed",bottom:88,left:16,zIndex:150}}>
        {showActions&&<div style={{position:"absolute",bottom:66,left:0,width:240,zIndex:10,background:"white",borderRadius:16,padding:12,boxShadow:"0 4px 20px rgba(0,0,0,.16)"}}>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <button style={{...S.btn("#ef4444"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("addTx",{txType:"expense"});}}>+ مصروف</button>
            <button style={{...S.btn("#10b981"),flex:1,padding:"11px 8px",fontSize:13}} onClick={()=>{setShowActions(false);om("addTx",{txType:"income"});}}>+ دخل</button>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button style={{...S.btn("#6366f1"),flex:"1 1 45%",padding:"11px 6px",fontSize:12}} onClick={()=>{setShowActions(false);om("transfer");}}>⇄ تحويل</button>
            <button style={{...S.btn("#14b8a6"),flex:"1 1 45%",padding:"11px 6px",fontSize:12}} onClick={()=>{setShowActions(false);om("buyAsset");}}>🏠 ممتلك</button>
            <button style={{...S.btn("#10b981"),flex:"1 1 45%",padding:"11px 6px",fontSize:12}} onClick={()=>{setShowActions(false);om("addInvest");}}>📈 استثمار</button>
            <button style={{...S.btn("#8b5cf6"),flex:"1 1 45%",padding:"11px 6px",fontSize:12}} onClick={()=>{setShowActions(false);setPage("debts");}}>💰 ديون</button>
          </div>
        </div>}
        <button onClick={()=>setShowActions(p=>!p)} style={{width:56,height:56,borderRadius:"50%",background:showActions?"#ef4444":"linear-gradient(135deg,#1a6b4a,#0f4a33)",border:"none",color:"white",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(16,185,129,.4)",transition:"all .2s",transform:showActions?"rotate(45deg)":"none"}}>+</button>
      </div>

      {/* DRAWER */}
      <div className={`drw${drw?" op":""}`} dir="rtl">
        <div style={{padding:"20px 14px 80px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:0,padding:"0 0 14px",borderBottom:"1px solid rgba(255,255,255,.15)"}}>
            <span style={{fontWeight:900,fontSize:18,color:"#1a1a1a"}}>القائمة</span>
            <button onClick={()=>setDrw(false)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 8px",color:"#1a1a1a",cursor:"pointer"}}><X size={18}/></button>
          </div>
          {dp===null&&<>
            <div className="mi" onClick={()=>{setDrw(false);setPage("dashboard");}}><Home size={18}/> الرئيسية</div>
            <div className="mi" onClick={()=>{setDrw(false);setPage("overview");}}><span style={{fontSize:18}}>💼</span> الملخص المالي</div>
            <div className="mi" onClick={()=>{setDrw(false);setPage("buckets");}}><span style={{fontSize:18}}>🧩</span> الأقسام</div>
            <div className="mi" onClick={()=>{setDrw(false);setPage("budget");}}><Target size={18}/> الميزانية</div>
            <div className="mi" onClick={()=>{setDrw(false);setPage("goals");}}><span style={{fontSize:18}}>🎯</span> الأهداف</div>
            <div className="mi" onClick={()=>{setDrw(false);setPage("transactions");}}><Wallet size={18}/> المعاملات</div>
            <div className="mi" onClick={()=>{setDrw(false);setPage("reports");setOvExp(p=>({...p,repTab:"dashboard",repDetails:false}));}}><BarChart3 size={18}/> التقارير</div>
            <div style={{height:1,background:"rgba(255,255,255,.15)",margin:"10px 0"}}/>
            <div className="mi" onClick={()=>{setDrw(false);setPage("settings");}}><Settings size={18}/> الإعدادات <ChevronLeft size={14} style={{marginRight:"auto"}}/></div>
            <div className="mi" onClick={()=>{sessionStorage.removeItem("mhf_auth");setIsAuth(false);setDrw(false);}} style={{color:"#ef4444"}}><span style={{fontSize:18}}>🚪</span> تسجيل خروج</div>
          </>}
          {dp==="settings"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>الإعدادات</span>
              <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px 4px",fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700}}>الأموال والممتلكات</div>
            {[{id:"banks",icon:"🏦",label:"البنوك"},{id:"cash",icon:"💵",label:"الكاش"},{id:"assets",icon:"🏠",label:"الممتلكات"}].map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"14px",borderBottom:"1px solid rgba(255,255,255,.07)",cursor:"pointer"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <span style={{flex:1,fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{item.label}</span>
                <ChevronLeft size={18} color="rgba(255,255,255,.4)"/>
              </div>
            ))}
            <div style={{padding:"12px 14px 4px",fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:700}}>التصنيفات</div>
            {[{id:"expCat",icon:"🔴",label:"تصنيفات النفقات"},{id:"incCat",icon:"🟢",label:"تصنيفات الدخل"}].map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"14px",borderBottom:"1px solid rgba(255,255,255,.07)",cursor:"pointer"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <span style={{flex:1,fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{item.label}</span>
                <ChevronLeft size={18} color="rgba(255,255,255,.4)"/>
              </div>
            ))}
          </>}

          {dp==="banks"&&<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>
              <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>البنوك</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#10b981"),padding:"11px"}} onClick={()=>om("addBank")}>+ إضافة بنك جديد</button>
            </div>
            {banks.map(b=>(
              <div key={b.id} style={{borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{display:"flex",alignItems:"center",padding:"16px 14px",cursor:"pointer"}} onClick={()=>setDp(`bank_${b.id}`)}>
                  <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🏦</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{b.name}</div>
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
                <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>🏦 {bank.name}</span>
                <button onClick={()=>setDp("banks")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
              </div>
              <div style={{padding:"10px 14px"}}>
                <button style={{...S.btn("#6366f1"),padding:"11px"}} onClick={()=>{setSelBk(bid);om("addBAcc");}}>+ إضافة حساب جديد</button>
              </div>
              {bank.accounts.map(a=>(
                <div key={a.id} style={{display:"flex",alignItems:"center",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:a.color,marginLeft:14,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>{a.name}</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{a.type}</div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",opacity:ovExp[`del_acc_${a.id}`]?1:0,transition:"opacity .2s"}} onClick={e=>e.stopPropagation()}>
                    <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#1a1a1a",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setSelBk(bid);setEi({...a,_bid:bid});om("edBAcc");}}>تعديل</button>
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
              <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>الكاش</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#f59e0b"),padding:"11px"}} onClick={()=>om("addCash")}>+ إضافة محفظة جديدة</button>
            </div>
            {cash.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>💵</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{c.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{c.type}</div>
                </div>
                <div style={{display:"flex",gap:8,opacity:ovExp[`del_c_${c.id}`]?1:0,transition:"opacity .2s"}}>
                  <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#1a1a1a",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setEi(c);om("edCash");}}>تعديل</button>
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
              <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>الممتلكات</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#14b8a6"),padding:"11px"}} onClick={()=>om("addAst")}>+ إضافة ممتلك جديد</button>
            </div>
            {assets.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",padding:"16px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🏠</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{a.name}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{a.type}</div>
                </div>
                <div style={{display:"flex",gap:8,opacity:ovExp[`del_a_${a.id}`]?1:0,transition:"opacity .2s"}}>
                  <button style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#1a1a1a",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>{setEi(a);om("edAst");}}>تعديل</button>
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
              <span style={{fontWeight:800,fontSize:17,color:"#1a1a1a"}}>السلف والقروض</span>
              <button onClick={()=>setDp("settings")} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
            </div>
            <div style={{padding:"10px 14px"}}>
              <button style={{...S.btn("#8b5cf6"),padding:"11px"}} onClick={()=>om("addLoan")}>+ إضافة سلفة/قرض جديد</button>
            </div>
            {loans.map(l=>(
              <div key={l.id} style={{padding:"14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{background:l.kind==="أعطيت"?"#10b98130":"#ef444430",color:l.kind==="أعطيت"?"#10b981":"#ef4444",padding:"2px 10px",borderRadius:12,fontSize:12,fontWeight:700}}>{l.kind}</span>
                    <span style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{l.person}</span>
                  </div>
                  <button style={{background:"rgba(239,68,68,.2)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer"}} onClick={()=>ask("loan",l.id,l.person)}><Trash2 size={13} color="#fca5a5"/></button>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>المتبقي: <strong style={{color:"#f59e0b"}}>{fmt(l.remaining)}</strong></span>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>الأصل: {fmt(l.amount)}</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button style={{...S.btn("#10b981",false),flex:1,padding:"9px"}} onClick={()=>{setEi(l);om("returnLoan");}}>💰 تسجيل رجوع/سداد</button>
                </div>
              </div>
            ))}
            {loans.length===0&&<div style={{textAlign:"center",padding:30,color:"rgba(255,255,255,.3)",fontSize:14}}>لا توجد سلف — أضف سلفة</div>}
          </>}

          {dp==="expCat"&&<CatSection catType="expense"/>}
          {dp==="incCat"&&<CatSection catType="income"/>}
        </div>
      </div>

      {/* HEADER */}
      <div style={{padding:"20px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>{setDrw(true);setDp(null);}} style={{background:"#2e8fa8",border:"none",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",cursor:"pointer",color:"#1a1a1a"}}>
          <Menu size={18}/>
        </button>
        <div style={{textAlign:"left"}}><div style={{fontSize:13,color:"#64748b",fontWeight:700}}>{new Date().toLocaleString("ar-MA",{month:"long",year:"numeric"})}</div></div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px 90px",display:"flex",flexDirection:"column",gap:14}}>

        {page==="dashboard"&&<>
          <div style={{background:"linear-gradient(145deg,#1a6b4a,#0f4a33)",borderRadius:24,padding:26,position:"relative",overflow:"hidden",cursor:"pointer",boxShadow:"0 8px 32px rgba(26,107,74,.35)"}} onClick={()=>setPage("overview")}>
            <div style={{position:"absolute",top:-30,left:-30,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
            <div style={{position:"absolute",bottom:-40,right:-20,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
            <div style={{position:"absolute",top:60,left:40,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
            <div style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,.2)",borderRadius:8,padding:"3px 10px",fontSize:11,color:"#1a1a1a",fontWeight:700}}>اضغط للتفاصيل ←</div>
            <button onClick={e=>{e.stopPropagation();setHideBalance(p=>!p);}} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"6px 10px",cursor:"pointer",color:"#1a1a1a",display:"flex",alignItems:"center",gap:4,backdropFilter:"blur(4px)"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {hideBalance?<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>:<><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>}
              </svg>
            </button>
            <div style={{fontSize:12,color:"rgba(255,255,255,.9)",marginBottom:6}}>صافي الثروة الكلية</div>
            <div style={{fontSize:30,fontWeight:900,color:"#1a1a1a"}}>{hideBalance?"••••••":fmt(totBal+totAst+totInv+totGiv-totOwd)}</div>
            <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,.85)"}}>البنوك والكاش</div><div style={{fontSize:13,fontWeight:700,color:"#1a1a1a"}}>{hideBalance?"•••":fmt(totBal)}</div></div>
              <div style={{width:1,background:"rgba(255,255,255,.3)"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,.85)"}}>الممتلكات</div><div style={{fontSize:13,fontWeight:700,color:"#1a1a1a"}}>{hideBalance?"•••":fmt(totAst)}</div></div>
              <div style={{width:1,background:"rgba(255,255,255,.3)"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"rgba(255,255,255,.85)"}}>السلف</div><div style={{fontSize:13,fontWeight:700,color:"#1a1a1a"}}>{hideBalance?"•••":fmt(totGiv-totOwd)}</div></div>
            </div>
          </div>

          <PeriodSelector/>

                    {/* أهداف شهرية */}
          {(()=>{
            const goals=budgetSettings.goals||{incomeGoal:15000,incomeAuto:false,expenseGoal:5000,expenseAuto:false};
            const allMonths=[...new Set(txs.map(t=>t.date.slice(0,7)))];
            const avgInc=allMonths.length>0?txs.filter(t=>t.type==="income"&&!t.isTransfer).reduce((s,t)=>s+t.amount,0)/allMonths.length:0;
            const avgExp=allMonths.length>0?txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isAsset&&!t.isInvest).reduce((s,t)=>s+t.amount,0)/allMonths.length:0;
            const incGoal=goals.incomeAuto?Math.round(avgInc):goals.incomeGoal;
            const expGoal=goals.expenseAuto?Math.round(avgExp):goals.expenseGoal;
            const filtP=filterByPeriod(txs.filter(t=>!t.isTransfer&&t.pm!=="تحويل"));
            const curMonthNum=new Date().getMonth()+1; // الشهر الحالي 1-12
            const goalMult=period.type==="year"?curMonthNum:period.type==="all"?Math.max(allMonths.length,1):1;
            const pInc=filtP.filter(t=>t.type==="income"&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const pExp=filtP.filter(t=>t.type==="expense"&&!t.isTransfer&&t.pm!=="تحويل"&&!t.isAsset&&!t.isInvest).reduce((s,t)=>s+t.amount,0);
            const incGoalAdj=incGoal*goalMult;
            const expGoalAdj=expGoal*goalMult;
            const incPctRaw=incGoalAdj>0?(pInc/incGoalAdj)*100:0;
            const expPctRaw=expGoalAdj>0?(pExp/expGoalAdj)*100:0;
            const incPct=Math.min(incPctRaw,100);
            const expPct=Math.min(expPctRaw,100);
            const incRemaining=incGoalAdj-pInc;
            const expRemaining=expGoalAdj-pExp;
            // دخل: تدريجي أحمر→أخضر كيما كيقرب من الهدف
            const incColor=incPctRaw>=100?"#10b981":incPctRaw>=70?"#10b981":incPctRaw>=40?"#f59e0b":"#ef4444";
            // مصاريف: عكس - أخضر مازال بعيد، أحمر قرب/تجاوز
            const expColor=expPctRaw>=100?"#ef4444":expPctRaw>=85?"#ef4444":expPctRaw>=60?"#f59e0b":"#10b981";
            const r=46;const circ=2*Math.PI*r;
            return(
              <div style={S.card}>
                <div style={{fontSize:13,fontWeight:800,color:"#1a1a1a",marginBottom:14}}>🎯 الأهداف</div>
                <div style={{display:"flex",gap:16,justifyContent:"center",alignItems:"center"}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{position:"relative",width:110,height:110,margin:"0 auto 10px"}}>
                      <svg width="110" height="110" viewBox="0 0 110 110" style={{transform:"rotate(-90deg)"}}>
                        <circle cx="55" cy="55" r={r} fill="none" stroke="#e8e8e4" strokeWidth="11"/>
                        <circle cx="55" cy="55" r={r} fill="none" stroke={incColor} strokeWidth="11" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={circ-(circ*incPct/100)} style={{transition:"stroke .4s, stroke-dashoffset .4s"}}/>
                        <circle cx={55+r*Math.cos(2*Math.PI*incPct/100)} cy={55+r*Math.sin(2*Math.PI*incPct/100)} r="7" fill={incColor} stroke="white" strokeWidth="2"/>
                      </svg>
                      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                        <div style={{fontSize:24,fontWeight:900,color:incColor}}>{Math.round(incPctRaw)}%</div>
                        <div style={{fontSize:9,color:"#64748b"}}>وصلت</div>
                      </div>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1a1a1a"}}>💰 هدف الدخل</div>
                    <div style={{fontSize:10,color:"#475569"}}>{fmt(pInc)} / {fmt(incGoalAdj)}</div>
                    <div style={{fontSize:10,fontWeight:700,color:incRemaining>0?"#64748b":"#10b981",marginTop:2}}>
                      {incRemaining>0?`باقي ${fmt(incRemaining)}`:`✅ تجاوزت بـ ${fmt(Math.abs(incRemaining))}`}
                    </div>
                  </div>
                  <div style={{width:1,height:70,background:"#e8e8e4"}}/>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{position:"relative",width:110,height:110,margin:"0 auto 10px"}}>
                      <svg width="110" height="110" viewBox="0 0 110 110" style={{transform:"rotate(-90deg)"}}>
                        <circle cx="55" cy="55" r={r} fill="none" stroke="#e8e8e4" strokeWidth="11"/>
                        <circle cx="55" cy="55" r={r} fill="none" stroke={expColor} strokeWidth="11" strokeLinecap="round"
                          strokeDasharray={circ} strokeDashoffset={circ-(circ*expPct/100)} style={{transition:"stroke .4s, stroke-dashoffset .4s"}}/>
                        <circle cx={55+r*Math.cos(2*Math.PI*expPct/100)} cy={55+r*Math.sin(2*Math.PI*expPct/100)} r="7" fill={expColor} stroke="white" strokeWidth="2"/>
                      </svg>
                      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                        <div style={{fontSize:24,fontWeight:900,color:expColor}}>{Math.round(expPctRaw)}%</div>
                        <div style={{fontSize:9,color:"#64748b"}}>صرفت</div>
                      </div>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:"#1a1a1a"}}>💸 هدف المصاريف</div>
                    <div style={{fontSize:10,color:"#475569"}}>{fmt(pExp)} / {fmt(expGoalAdj)}</div>
                    <div style={{fontSize:10,fontWeight:700,color:expRemaining>0?"#10b981":"#ef4444",marginTop:2}}>
                      {expRemaining>0?`باقي ${fmt(expRemaining)}`:`⚠️ تجاوزت بـ ${fmt(Math.abs(expRemaining))}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* Budget Widget - bucket الميزانية بنظام الأقسام الخمسة */}
          {(()=>{
            const expBkt=(budgetSettings.buckets||[]).find(b=>b.type==="expenses");
            if(!expBkt)return null;
            const totalInc=txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const totBudget=totalInc*(expBkt.pct/100);
            const totExpReal=txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const remaining=totBudget-totExpReal;
            const pct=totBudget>0?Math.min((totExpReal/totBudget)*100,100):0;
            const pctReal=totBudget>0?(totExpReal/totBudget)*100:0;
            const color=pctReal>=100?"#ef4444":pctReal>=70?"#f59e0b":"#10b981";
            if(totBudget===0)return null;
            return(
              <div style={{...S.card,cursor:"pointer"}} onClick={()=>setPage("budget")}>
                <div style={{...S.row,marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:38,height:38,borderRadius:10,background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛒</div>
                    <div><div style={{fontWeight:700,fontSize:14}}>ميزانية المصاريف</div><div style={{fontSize:11,color:"#64748b"}}>إجمالي كلي — {expBkt.pct}% من الدخل</div></div>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:11,color:"#64748b"}}>الباقي</div>
                    <div style={{fontSize:18,fontWeight:900,color:remaining>=0?color:"#ef4444"}}>{remaining>=0?"":"-"}{fmt(Math.abs(remaining))}</div>
                  </div>
                </div>
                <div className="pbar"><div className="pfill" style={{width:pct+"%",background:color}}/></div>
                <div style={{...S.row,marginTop:6}}>
                  <span style={{fontSize:11,color:"#64748b"}}>مصروف: {fmt(totExpReal)}</span>
                  <span style={{fontSize:11,color:"#64748b"}}>الميزانية: {fmt(totBudget)}</span>
                </div>
                <div style={{...S.row,marginTop:4}}>
                  <span style={{fontSize:11,fontWeight:700,color}}>{Math.round(pctReal)}% مصروفة</span>
                  <span style={{fontSize:11,color:"#64748b"}}>{remaining>=0?`متبقي ${Math.round(100-pctReal)}%`:"⚠️ تجاوزت الميزانية"}</span>
                </div>
              </div>
            );
          })()}

          <div style={S.card}>
            
            <div style={{...S.row,marginBottom:12,marginTop:8}}><span style={{fontWeight:700}}>آخر المعاملات</span><button style={{background:"none",border:"none",color:"#1a6b4a",fontSize:12,cursor:"pointer",fontFamily:"Tajawal"}} onClick={()=>setPage("transactions")}>عرض الكل ←</button></div>
            {txs.slice(0,5).map(t=>{const{cn,sn,ic,hi}=tl(t);return(
              <div key={t.id} className="tx">
                <div style={{width:38,height:38,borderRadius:10,background:t.type==="income"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}><Ico src={hi?ic:null} fb={ic} sz={18}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:13,fontWeight:600}}>{t.desc||cn}</span>{t.pm==="كريدي"&&<span style={{fontSize:9,background:"#f59e0b22",color:"#f59e0b",padding:"1px 6px",borderRadius:10,fontWeight:700}}>💳</span>}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{t.date}{sn&&` • ${sn}`}</div>
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

          if(ovPage==="money") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"main"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>💰 أموال</span>
            </div>
            <div style={{borderRadius:18,padding:18,border:"1px solid #cbd5e1",textAlign:"center",background:"#f8fafc"}}>
              <div style={{fontSize:11,color:"#475569",marginBottom:6}}>مجموع الأموال</div>
              <div style={{fontSize:28,fontWeight:900,color:"#1a6b4a"}}>{fmt(banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0)+cash.reduce((s,c)=>s+c.balance,0))}</div>
            </div>
            {[
              {key:"banks",icon:"🏦",label:"البنوك",color:"#1a6b4a",amount:banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0),sub:`${banks.length} بنك`},
              {key:"cash",icon:"💵",label:"الكاش",color:"#f59e0b",amount:cash.reduce((s,c)=>s+c.balance,0),sub:`${cash.length} محفظة`},
            ].map(item=>(
              <div key={item.key} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:item.key,ovBank:null}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:48,height:48,borderRadius:14,background:item.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{item.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>{item.label}</div><div style={{fontSize:11,color:"#64748b"}}>{item.sub}</div></div>
                  <span style={{fontSize:17,fontWeight:900,color:item.color}}>{fmt(item.amount)}</span>
                  <span style={{color:"#64748b",fontSize:20}}>›</span>
                </div>
              </div>
            ))}
          </>;

          if(ovPage==="holdings") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"main"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🏛️ الأملاك</span>
            </div>
            <div style={{borderRadius:18,padding:18,border:"1px solid #cbd5e1",textAlign:"center",background:"#f8fafc"}}>
              <div style={{fontSize:11,color:"#475569",marginBottom:6}}>مجموع الأملاك</div>
              <div style={{fontSize:28,fontWeight:900,color:"#8b5cf6"}}>{fmt(totAst+investments.reduce((s,i)=>s+i.amount,0)+totGiv-totOwd)}</div>
            </div>
            {[
              {key:"assets",icon:"🏠",label:"الممتلكات",color:"#14b8a6",amount:totAst,sub:`${assets.length} ممتلك`},
              {key:"invest",icon:"📈",label:"الاستثمار",color:"#1a6b4a",amount:investments.reduce((s,i)=>s+i.amount,0),sub:`${investments.length} استثمار`},
              {key:"loans",icon:"🤝",label:"السلف والقروض",color:"#8b5cf6",amount:totGiv+totOwd,sub:`${loans.length} سلفة`},
            ].map(item=>(
              <div key={item.key} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:item.key,ovBank:null}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:48,height:48,borderRadius:14,background:item.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{item.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>{item.label}</div><div style={{fontSize:11,color:"#64748b"}}>{item.sub}</div></div>
                  <span style={{fontSize:17,fontWeight:900,color:item.color}}>{fmt(item.amount)}</span>
                  <span style={{color:"#64748b",fontSize:20}}>›</span>
                </div>
              </div>
            ))}
          </>;

          if(ovPage==="banks") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"money",ovBank:null}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🏦 البنوك</span>
            </div>
            <div style={{...S.card,textAlign:"center",background:"#10b98110",border:"1px solid #10b98133",padding:12}}>
              <div style={{fontSize:11,color:"#1a6b4a"}}>إجمالي البنوك</div>
              <div style={{fontSize:22,fontWeight:900,color:"#1a6b4a"}}>{fmt(banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0))}</div>
            </div>
            {banks.map(b=>(
              <div key={b.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"bank",ovBank:b.id}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏦</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{b.name}</div><div style={{fontSize:11,color:"#64748b"}}>{b.accounts.length} حساب</div></div>
                  <span style={{fontSize:16,fontWeight:900,color:"#1a6b4a"}}>{fmt(b.accounts.reduce((s,a)=>s+a.balance,0))}</span>
                  <span style={{color:"#64748b",fontSize:20}}>›</span>
                </div>
              </div>
            ))}
            {banks.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>لا توجد بنوك</div>}
          </>;

          if(ovPage==="bank"&&ovBank){
            const bank=banks.find(b=>b.id===ovBank);
            if(!bank)return null;
            return <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"banks",ovBank:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>🏦 {bank.name}</span>
              </div>
              {bank.accounts.map(a=>(
                <div key={a.id} style={{...S.card,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"accDetail",ovAcc:{k:"bank",bid:bank.id,aid:a.id}}))}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Dot color={a.color}/>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{a.name}</div><div style={{fontSize:12,color:"#64748b"}}>{a.type}</div></div>
                    <span style={{fontSize:18,fontWeight:900,color:a.color}}>{fmt(a.balance)}</span>
                    <span style={{color:"#64748b",fontSize:18}}>›</span>
                  </div>
                </div>
              ))}
            </>;
          }

          if(ovPage==="accDetail"&&ovExp.ovAcc){
            const ref=ovExp.ovAcc;
            const accInfo=allAcc.find(a=>a.ref.k===ref.k&&(ref.k==="bank"?(a.ref.bid===ref.bid&&a.ref.aid===ref.aid):a.ref.cid===ref.cid));
            if(!accInfo)return null;
            const accTxs=txs.filter(t=>t.ref&&t.ref.k===ref.k&&(ref.k==="bank"?(t.ref.bid===ref.bid&&t.ref.aid===ref.aid):t.ref.cid===ref.cid)).sort((a,b)=>b.date.localeCompare(a.date));
            // نفصل بين المعاملات العادية، التحويلات، الاستثمارات، السلف
            const realAccIn=accTxs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const realAccOut=accTxs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
            const transferIn=accTxs.filter(t=>t.type==="income"&&t.isTransfer).reduce((s,t)=>s+t.amount,0);
            const transferOut=accTxs.filter(t=>t.type==="expense"&&t.isTransfer).reduce((s,t)=>s+t.amount,0);
            const investOut=accTxs.filter(t=>t.isInvest&&t.type==="expense").reduce((s,t)=>s+t.amount,0);
            const investIn=accTxs.filter(t=>t.isInvest&&t.type==="income").reduce((s,t)=>s+t.amount,0);
            const assetOut=accTxs.filter(t=>t.isAsset&&t.type==="expense").reduce((s,t)=>s+t.amount,0);
            const assetIn=accTxs.filter(t=>t.isAsset&&t.type==="income").reduce((s,t)=>s+t.amount,0);
            const loanIn=accTxs.filter(t=>t.isLoan&&t.type==="income").reduce((s,t)=>s+t.amount,0);
            const loanOut=accTxs.filter(t=>t.isLoan&&t.type==="expense").reduce((s,t)=>s+t.amount,0);
            const accIn=realAccIn;
            const accOut=realAccOut;
            return <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:ref.k==="bank"?"bank":"cash",ovAcc:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>{ref.k==="bank"?"🏦":"💵"} {accInfo.name}</span>
              </div>
              <div style={{...S.card,textAlign:"center",background:"#6366f110",border:"1px solid #6366f133",padding:14}}>
                <div style={{fontSize:11,color:"#6366f1"}}>الرصيد الحالي</div>
                <div style={{fontSize:26,fontWeight:900,color:"#6366f1"}}>{fmt(accInfo.balance)}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <div style={{...S.card,flex:1,textAlign:"center",background:"#10b98110",padding:10}}><div style={{fontSize:10,color:"#10b981"}}>💰 دخل</div><div style={{fontSize:15,fontWeight:900,color:"#10b981"}}>{fmt(realAccIn)}</div></div>
                <div style={{...S.card,flex:1,textAlign:"center",background:"#ef444410",padding:10}}><div style={{fontSize:10,color:"#ef4444"}}>💸 مصاريف</div><div style={{fontSize:15,fontWeight:900,color:"#ef4444"}}>{fmt(realAccOut)}</div></div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                {transferIn>0&&<div style={{...S.card,flex:1,textAlign:"center",background:"#3b82f610",padding:8}}><div style={{fontSize:9,color:"#3b82f6"}}>🔄 تحويل وارد</div><div style={{fontSize:13,fontWeight:900,color:"#3b82f6"}}>{fmt(transferIn)}</div></div>}
                {transferOut>0&&<div style={{...S.card,flex:1,textAlign:"center",background:"#3b82f610",padding:8}}><div style={{fontSize:9,color:"#3b82f6"}}>🔄 تحويل صادر</div><div style={{fontSize:13,fontWeight:900,color:"#3b82f6"}}>{fmt(transferOut)}</div></div>}
                {investOut>0&&<div style={{...S.card,flex:1,textAlign:"center",background:"#10b98110",padding:8}}><div style={{fontSize:9,color:"#10b981"}}>📈 استثمار</div><div style={{fontSize:13,fontWeight:900,color:"#10b981"}}>{fmt(investOut)}</div></div>}
                {investIn>0&&<div style={{...S.card,flex:1,textAlign:"center",background:"#10b98110",padding:8}}><div style={{fontSize:9,color:"#10b981"}}>📈 عائد استثمار</div><div style={{fontSize:13,fontWeight:900,color:"#10b981"}}>{fmt(investIn)}</div></div>}
                {assetOut>0&&<div style={{...S.card,flex:1,textAlign:"center",background:"#14b8a610",padding:8}}><div style={{fontSize:9,color:"#14b8a6"}}>🏠 ممتلك</div><div style={{fontSize:13,fontWeight:900,color:"#14b8a6"}}>{fmt(assetOut)}</div></div>}
                {assetIn>0&&<div style={{...S.card,flex:1,textAlign:"center",background:"#14b8a610",padding:8}}><div style={{fontSize:9,color:"#14b8a6"}}>🏠 بيع ممتلك</div><div style={{fontSize:13,fontWeight:900,color:"#14b8a6"}}>{fmt(assetIn)}</div></div>}
                {(loanIn>0||loanOut>0)&&<div style={{...S.card,flex:1,textAlign:"center",background:"#f59e0b10",padding:8}}><div style={{fontSize:9,color:"#f59e0b"}}>🤝 سلف</div><div style={{fontSize:13,fontWeight:900,color:"#f59e0b"}}>{fmt(loanIn||loanOut)}</div></div>}
              </div>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a",marginTop:4}}>📋 سجل المعاملات ({accTxs.length})</div>
              {accTxs.map(t=>(
                <div key={t.id} style={{...S.card,padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:10,background:t.type==="income"?"#10b98120":"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{t.type==="income"?"↓":"↑"}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t.desc||"معاملة"}</div><div style={{fontSize:11,color:"#64748b"}}>{t.date}</div></div>
                    <span style={{fontSize:14,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  </div>
                </div>
              ))}
              {accTxs.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>ما كاينش معاملات على هاد الحساب</div>}
            </>;
          }

          if(ovPage==="cash") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"money"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>💵 الكاش</span>
            </div>
            {cash.map(c=>(
              <div key={c.id} style={{...S.card,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"accDetail",ovAcc:{k:"cash",cid:c.id}}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"#f59e0b22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>💵</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{c.name}</div><div style={{fontSize:12,color:"#64748b"}}>{c.type}</div></div>
                  <span style={{fontSize:18,fontWeight:900,color:c.color}}>{fmt(c.balance)}</span>
                  <span style={{color:"#64748b",fontSize:18}}>›</span>
                </div>
              </div>
            ))}
            {cash.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>لا توجد محافظ</div>}
          </>;

          if(ovPage==="assets") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"holdings"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🏠 الممتلكات</span>
            </div>
            {assets.map(a=>(
              <div key={a.id} style={{...S.card,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"assetDetail",ovAst:a.id}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"#14b8a622",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏠</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{a.name}</div><div style={{fontSize:12,color:"#64748b"}}>{a.type}</div></div>
                  <span style={{fontSize:18,fontWeight:900,color:"#14b8a6"}}>{fmt(a.value)}</span>
                  <span style={{color:"#64748b",fontSize:18}}>›</span>
                </div>
              </div>
            ))}
            {assets.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>لا توجد ممتلكات</div>}
          </>;

          if(ovPage==="assetDetail"&&ovExp.ovAst){
            const ast=assets.find(a=>a.id===ovExp.ovAst);
            if(!ast)return null;
            const astTxs=txs.filter(t=>t.isAsset&&(t.desc||"").includes(ast.name)).sort((a,b)=>b.date.localeCompare(a.date));
            return <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"assets",ovAst:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>🏠 {ast.name}</span>
              </div>
              <div style={{...S.card,textAlign:"center",background:"#14b8a610",border:"1px solid #14b8a633",padding:14}}>
                <div style={{fontSize:11,color:"#14b8a6"}}>القيمة الحالية</div>
                <div style={{fontSize:26,fontWeight:900,color:"#14b8a6"}}>{fmt(ast.value)}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:4}}>النوع: {ast.type}</div>
                {ast.note&&<div style={{fontSize:12,color:"#64748b",marginTop:2}}>{ast.note}</div>}
              </div>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a",marginTop:4}}>📋 سجل المعاملات ({astTxs.length})</div>
              {astTxs.map(t=>(
                <div key={t.id} style={{...S.card,padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:10,background:"#14b8a620",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏠</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t.desc}</div><div style={{fontSize:11,color:"#64748b"}}>{t.date}</div></div>
                    <span style={{fontSize:14,fontWeight:700,color:"#ef4444"}}>-{fmt(t.amount)}</span>
                  </div>
                </div>
              ))}
              {astTxs.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>ما كاينش معاملات مرتبطة</div>}
              <button style={{...S.btn("#ef4444"),marginTop:8,width:"100%",padding:"12px"}} onClick={()=>{setEi(ast);om("sellAst");}}>🏷️ بيع هاد الممتلك</button>
            </>;
          }

          if(ovPage==="invDetail"&&ovExp.ovInv){
            const inv=investments.find(i=>i.id===ovExp.ovInv);
            if(!inv)return null;
            const invTxs=txs.filter(t=>t.isInvest&&(t.invId===inv.id||(t.desc||"").includes(inv.name))).sort((a,b)=>b.date.localeCompare(a.date));
            const net=(inv.profit||0)-inv.amount;
            return <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"invest",ovInv:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>📈 {inv.name}</span>
              </div>
              <div style={{...S.card,background:"#10b98110",border:"1px solid #10b98133",padding:14,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:"#64748b"}}>النوع: {inv.type||"استثمار"}</span>
                  <span style={{fontSize:12,color:"#64748b"}}>{inv.date}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#ef4444"}}>📉 مستثمر</div>
                    <div style={{fontSize:16,fontWeight:900,color:"#ef4444"}}>{fmt(inv.amount)}</div>
                  </div>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#10b981"}}>📈 أرباح</div>
                    <div style={{fontSize:16,fontWeight:900,color:"#10b981"}}>{fmt(inv.profit||0)}</div>
                  </div>
                  <div style={{flex:1,textAlign:"center"}}>
                    <div style={{fontSize:10,color:net>=0?"#1a6b4a":"#ef4444"}}>{net>=0?"💚 ربح":"🔴 خسارة"}</div>
                    <div style={{fontSize:16,fontWeight:900,color:net>=0?"#1a6b4a":"#ef4444"}}>{fmt(Math.abs(net))}</div>
                  </div>
                </div>
              </div>
              {inv.note&&<div style={{...S.card,fontSize:12,color:"#475569",padding:10}}>📝 {inv.note}</div>}
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button style={{...S.btn("#10b981"),flex:1}} onClick={()=>{setEi(inv);om("addProfit");}}>💰 + تسجيل ربح</button>
                <button style={{...S.btn("#6366f1"),flex:1}} onClick={()=>{setEi(inv);om("returnInvest");}}>🏦 استرداد رأس المال</button>
              </div>
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a",marginTop:4}}>📋 سجل المعاملات ({invTxs.length})</div>
              {invTxs.map(t=>(
                <div key={t.id} style={{...S.card,padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:10,background:t.type==="income"?"#10b98120":"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{t.type==="income"?"💰":"📈"}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t.desc}</div><div style={{fontSize:11,color:"#64748b"}}>{t.date}</div></div>
                    <span style={{fontSize:14,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  </div>
                </div>
              ))}
              {invTxs.length===0&&<div style={{...S.card,textAlign:"center",padding:20,color:"#64748b"}}>ما كاينش معاملات مرتبطة</div>}
            </>;
          }

          if(ovPage==="invest") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"holdings"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>📈 الاستثمار</span>
            </div>
            {(()=>{
              // نستعمل investments state (بحال assets) — مع إضافة الأرباح من المعاملات
              const invTotal=investments.reduce((s,i)=>s+i.amount,0);
              const invReturn=investments.reduce((s,i)=>s+(i.profit||0),0);
              const invNet=invReturn-invTotal;

              return <>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <div style={{...S.card,flex:1,textAlign:"center",background:"#ef444410",padding:12}}>
                    <div style={{fontSize:10,color:"#ef4444"}}>📉 إجمالي المستثمر</div>
                    <div style={{fontSize:18,fontWeight:900,color:"#ef4444"}}>{fmt(invTotal)}</div>
                  </div>
                  <div style={{...S.card,flex:1,textAlign:"center",background:"#10b98110",padding:12}}>
                    <div style={{fontSize:10,color:"#10b981"}}>📈 الأرباح</div>
                    <div style={{fontSize:18,fontWeight:900,color:"#10b981"}}>{fmt(invReturn)}</div>
                  </div>
                </div>
                <div style={{...S.card,textAlign:"center",background:invNet>=0?"#10b98110":"#ef444410",border:`1px solid ${invNet>=0?"#10b98133":"#ef444433"}`,padding:12,marginBottom:8}}>
                  <div style={{fontSize:11,color:invNet>=0?"#1a6b4a":"#ef4444"}}>{invNet>=0?"💚 صافي الربح":"🔴 صافي الخسارة"}</div>
                  <div style={{fontSize:22,fontWeight:900,color:invNet>=0?"#1a6b4a":"#ef4444"}}>{invNet>=0?"+":""}{fmt(invNet)}</div>
                </div>
                {investments.length>0&&<>
                  <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a",marginTop:4}}>📋 الاستثمارات ({investments.length})</div>
                  {investments.map(inv=>{
                    const net=(inv.profit||0)-inv.amount;
                    const invTxs=txs.filter(t=>t.isInvest&&t.invId===inv.id);
                    return(
                      <div key={inv.id} style={{...S.card,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"invDetail",ovInv:inv.id}))}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:44,height:44,borderRadius:13,background:"#10b98122",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📈</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,fontSize:15}}>{inv.name}</div>
                            <div style={{fontSize:11,color:"#64748b"}}>{inv.type||"استثمار"} • {inv.date}</div>
                          </div>
                          <div style={{textAlign:"left"}}>
                            <div style={{fontSize:15,fontWeight:900,color:"#ef4444"}}>-{fmt(inv.amount)}</div>
                            {(inv.profit||0)>0&&<div style={{fontSize:12,fontWeight:700,color:"#10b981"}}>+{fmt(inv.profit)}</div>}
                          </div>
                          <span style={{color:"#64748b",fontSize:18}}>›</span>
                        </div>
                        {net!==0&&<div style={{marginTop:8,padding:"6px 10px",borderRadius:8,background:net>=0?"#10b98110":"#ef444410",fontSize:12,fontWeight:700,color:net>=0?"#1a6b4a":"#ef4444",textAlign:"center"}}>
                          {net>=0?"💚 ربح ":"🔴 خسارة "}{fmt(Math.abs(net))} د.م
                        </div>}
                      </div>
                    );
                  })}
                </>}
                {investments.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>ما كاينش استثمارات — ضغط + باش تزيد</div>}
              </>;
            })()}
          </>;

          if(ovPage==="loans") return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"holdings"}))}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🤝 السلف والقروض</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{...S.card,flex:1,textAlign:"center",background:"#10b98110",padding:12}}><div style={{fontSize:11,color:"#1a6b4a"}}>سلفت</div><div style={{fontSize:18,fontWeight:900,color:"#1a6b4a"}}>{fmt(totGiv)}</div></div>
              <div style={{...S.card,flex:1,textAlign:"center",background:"#ef444410",padding:12}}><div style={{fontSize:11,color:"#ef4444"}}>عليّ</div><div style={{fontSize:18,fontWeight:900,color:"#ef4444"}}>{fmt(totOwd)}</div></div>
            </div>
            {loans.map(l=>(
              <div key={l.id} style={{...S.card,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:"loanDetail",ovLoan:l.id}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:l.kind==="أعطيت"?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{l.kind==="أعطيت"?"↑":"↓"}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{l.person}</div><div style={{fontSize:12,color:"#64748b"}}>{l.date}</div></div>
                  <div style={{textAlign:"left"}}><div style={{fontSize:16,fontWeight:900,color:l.kind==="أعطيت"?"#10b981":"#ef4444"}}>{fmt(l.remaining)}</div><div style={{fontSize:10,color:"#64748b"}}>من {fmt(l.amount)}</div></div>
                  <span style={{color:"#64748b",fontSize:18}}>›</span>
                </div>
              </div>
            ))}
            {loans.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>لا توجد سلف</div>}
          </>;

          if(ovPage==="loanDetail"&&ovExp.ovLoan){
            const loan=loans.find(l=>l.id===ovExp.ovLoan);
            if(!loan)return null;
            const loanTxs=txs.filter(t=>t.isLoan&&(t.desc||"").includes(loan.person)).sort((a,b)=>b.date.localeCompare(a.date));
            const paidBack=loan.amount-loan.remaining;
            const pct=loan.amount>0?Math.min((paidBack/loan.amount)*100,100):0;
            return <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,ovPage:"loans",ovLoan:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>{loan.kind==="أعطيت"?"🤝":"💸"} {loan.person}</span>
              </div>
              <div style={{...S.card,textAlign:"center",background:loan.kind==="أعطيت"?"#10b98110":"#ef444410",border:`1px solid ${loan.kind==="أعطيت"?"#10b98133":"#ef444433"}`,padding:14}}>
                <div style={{fontSize:11,color:loan.kind==="أعطيت"?"#10b981":"#ef4444"}}>{loan.kind==="أعطيت"?"باقي ليك عندو":"باقي عليك ليه"}</div>
                <div style={{fontSize:26,fontWeight:900,color:loan.kind==="أعطيت"?"#10b981":"#ef4444"}}>{fmt(loan.remaining)}</div>
                <div style={{fontSize:12,color:"#64748b",marginTop:4}}>من أصل {fmt(loan.amount)} — {loan.date}</div>
              </div>
              <div style={{height:8,background:"#e8e8e4",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:pct+"%",background:loan.kind==="أعطيت"?"#10b981":"#ef4444",borderRadius:4}}/>
              </div>
              <div style={{fontSize:12,color:"#64748b",textAlign:"center"}}>تم رجوع {fmt(paidBack)} ({Math.round(pct)}%)</div>
              {(()=>{
                const txTotal=loanTxs.reduce((s,t)=>s+t.amount,0);
                const diff=paidBack-txTotal;
                if(Math.abs(diff)>0.01)return(
                  <div style={{...S.card,background:"#fef3c7",border:"1px solid #f59e0b33",padding:10,fontSize:11,color:"#92400e"}}>
                    <div style={{marginBottom:8}}>⚠️ كاين {fmt(Math.abs(diff))} د.م متسجلة فالسلفة لكن بلا معاملة (سجلات قديمة من bug تصلح دابا)</div>
                    <button style={{...S.btn("#f59e0b",false),padding:"7px 12px",fontSize:11}} onClick={()=>{
                      if(window.confirm(`واش بغيتي تصلح الباقي ديال السلفة ليطابق ${fmt(txTotal)} د.م رجوع مسجل؟`)){
                        setLoans(p=>p.map(l=>l.id===loan.id?{...l,remaining:Math.max(0,l.amount-txTotal)}:l));
                      }
                    }}>✓ تصحيح الباقي ليطابق السجل</button>
                  </div>
                );
                return null;
              })()}
              <div style={{fontWeight:700,fontSize:14,color:"#1a1a1a",marginTop:4}}>📋 سجل الدفعات ({loanTxs.length})</div>
              {loanTxs.map(t=>(
                <div key={t.id} style={{...S.card,padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:10,background:t.type==="income"?"#10b98120":"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{t.type==="income"?"↓":"↑"}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t.desc}</div><div style={{fontSize:11,color:"#64748b"}}>{t.date}</div></div>
                    <span style={{fontSize:14,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                  </div>
                </div>
              ))}
              {loanTxs.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>ما كاينش دفعات مسجلة بعد</div>}
            </>;
          }

          return <>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setPage("dashboard")}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>الملخص المالي</span>
            </div>
            <div style={{borderRadius:18,padding:20,border:"1px solid #cbd5e1",textAlign:"center",background:"#f8fafc"}}>
              <div style={{fontSize:11,color:"#475569",marginBottom:6}}>صافي الثروة</div>
              <div style={{fontSize:34,fontWeight:900,color:"#1a6b4a"}}>{fmt(totBal+totAst+totInv+totGiv-totOwd)}</div>
            </div>
            {[
              {key:"money",icon:"💰",label:"أموال",color:"#1a6b4a",amount:banks.flatMap(b=>b.accounts).reduce((s,a)=>s+a.balance,0)+cash.reduce((s,c)=>s+c.balance,0),sub:`${banks.length} بنك، ${cash.length} محفظة`},
              {key:"holdings",icon:"🏛️",label:"الأملاك",color:"#8b5cf6",amount:totAst+investments.reduce((s,i)=>s+i.amount,0)+totGiv-totOwd,sub:`${assets.length} ممتلك، ${investments.length} استثمار، ${loans.length} سلفة`},
            ].map(item=>(
              <div key={item.key} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,ovPage:item.key,ovBank:null}))}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:48,height:48,borderRadius:14,background:item.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{item.icon}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>{item.label}</div><div style={{fontSize:11,color:"#64748b"}}>{item.sub}</div></div>
                  <span style={{fontSize:17,fontWeight:900,color:item.color}}>{fmt(item.amount)}</span>
                  <span style={{color:"#64748b",fontSize:20}}>›</span>
                </div>
              </div>
            ))}
          </>;
        })()}
        {page==="settings"&&<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontWeight:800,fontSize:18}}>الإعدادات</span>
            <button onClick={()=>setPage("dashboard")} style={{background:"#e8e8e4",border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",color:"#1a1a1a",fontFamily:"Tajawal",fontSize:13}}>← رجوع</button>
          </div>
          <div style={S.card}>
            <div style={{fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,marginBottom:10}}>🔠 حجم الخط</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <button onClick={()=>setFontScale(p=>Math.max(0.9,Math.round((p-0.1)*10)/10))} style={{width:38,height:38,borderRadius:10,border:"none",background:"#e8e8e4",color:"#1a1a1a",fontSize:18,fontWeight:900,cursor:"pointer"}}>－</button>
              <div style={{flex:1,textAlign:"center",fontSize:16,fontWeight:900,color:"#1a6b4a"}}>{Math.round(fontScale*100)}%</div>
              <button onClick={()=>setFontScale(p=>Math.min(1.6,Math.round((p+0.1)*10)/10))} style={{width:38,height:38,borderRadius:10,border:"none",background:"#e8e8e4",color:"#1a1a1a",fontSize:18,fontWeight:900,cursor:"pointer"}}>＋</button>
            </div>
            <div style={{display:"flex",gap:6}}>
              {[1,1.1,1.2,1.3,1.4].map(v=>(
                <button key={v} onClick={()=>setFontScale(v)} style={{flex:1,padding:"7px",borderRadius:8,border:`1.5px solid ${fontScale===v?"#1a6b4a":"#e8e8e4"}`,background:fontScale===v?"#e8f5ee":"white",color:fontScale===v?"#1a6b4a":"#64748b",fontFamily:"Tajawal",fontSize:11,fontWeight:700,cursor:"pointer"}}>{Math.round(v*100)}%</button>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>🌙 الوضع الليلي</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:2}}>ألوان معكوسة لراحة العين فالليل (تجريبي)</div>
              </div>
              <button onClick={()=>{const nv=!darkMode;localStorage.setItem("mhf_dark",nv?"1":"0");setDarkMode(nv);}} style={{width:50,height:28,borderRadius:14,border:"none",background:darkMode?"#1a6b4a":"#e8e8e4",position:"relative",cursor:"pointer",transition:"background .2s"}}>
                <div style={{position:"absolute",top:3,[darkMode?"right":"left"]:3,width:22,height:22,borderRadius:"50%",background:"white",transition:"all .2s"}}/>
              </button>
            </div>
          </div>
          <div style={S.card}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>👆 الدخول بالبصمة</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:2}}>افتح التطبيق بالبصمة عوض كلمة السر</div>
              </div>
              <button onClick={async()=>{
                if(bioEnabled){localStorage.removeItem("mhf_bio");setBioEnabled(false);return;}
                try{
                  const {NativeBiometric}=await import("@capgo/capacitor-native-biometric");
                  const avail=await NativeBiometric.isAvailable();
                  if(!avail.isAvailable){showErr("⛔ البصمة غير متاحة على هاد الهاتف");setTimeout(()=>setErr(null),3500);return;}
                  await NativeBiometric.verifyIdentity({reason:"تفعيل الدخول بالبصمة",title:"محفظتي",subtitle:"تحقق من هويتك"});
                  localStorage.setItem("mhf_bio","1");setBioEnabled(true);
                  setErr("✅ تم تفعيل البصمة");setTimeout(()=>setErr(null),3000);
                }catch(e){showErr("⛔ فشل التفعيل — خاصك npm install @capgo/capacitor-native-biometric");setTimeout(()=>setErr(null),4000);}
              }} style={{width:50,height:28,borderRadius:14,border:"none",background:bioEnabled?"#1a6b4a":"#e8e8e4",position:"relative",cursor:"pointer",transition:"background .2s"}}>
                <div style={{position:"absolute",top:3,[bioEnabled?"right":"left"]:3,width:22,height:22,borderRadius:"50%",background:"white",transition:"all .2s"}}/>
              </button>
            </div>
          </div>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>الأموال والممتلكات</div>
            {[{id:"banks",icon:"🏦",label:"البنوك"},{id:"cash",icon:"💵",label:"الكاش"},{id:"assets",icon:"🏠",label:"الممتلكات"}].map((item,i,arr)=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid #e2e8f0":"none"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"#f5f5f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <span style={{flex:1,fontSize:16,fontWeight:700,color:"#1a1a1a"}}>{item.label}</span>
                <ChevronLeft size={18} color="#64748b"/>
              </div>
            ))}
          </div>
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>التصنيفات</div>
            {[{id:"expCat",icon:"🔴",label:"تصنيفات النفقات",count:`${cats.expense.length} تصنيف`},{id:"incCat",icon:"🟢",label:"تصنيفات الدخل",count:`${cats.income.length} تصنيف`}].map((item,i,arr)=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:i<arr.length-1?"1px solid #e2e8f0":"none"}} onClick={()=>setDp(item.id)}>
                <div style={{width:42,height:42,borderRadius:12,background:"#f5f5f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>{item.label}</div><div style={{fontSize:12,color:"#64748b"}}>{item.count}</div></div>
                <ChevronLeft size={18} color="#64748b"/>
              </div>
            ))}
          </div>
          {/* ====== إعدادات الميزانية الجديدة ====== */}
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>⚙️ توزيع الدخل — الأقسام الخمسة</div>

            <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:"1px solid #f1f5f9"}} onClick={()=>setPage("goals")}>
              <div style={{width:42,height:42,borderRadius:12,background:"#f5f5f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🎯</div>
              <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:"#1a1a1a"}}>هدف الدخل ونسب التوزيع</div><div style={{fontSize:11,color:"#64748b"}}>إدارة الأهداف من صفحة "الأهداف" مباشرة</div></div>
              <ChevronLeft size={18} color="#64748b"/>
            </div>

            {/* نسبة الطوارئ للميزانية */}
            <div style={{padding:"14px 16px",borderBottom:"1px solid #f1f5f9"}}>
              <div style={{background:"#fef3c7",borderRadius:10,padding:10}}>
                <div style={{fontSize:12,color:"#92400e",fontWeight:700,marginBottom:8}}>🚨 إعاشة الميزانية من الطوارئ</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,fontSize:12,color:"#78350f"}}>نسبة ما تأخذه الميزانية من الطوارئ إذا نفذت</div>
                  {(()=>{const emg=(budgetSettings.buckets||[]).find(b=>b.type==="emergency");if(!emg)return null;return(<>
                    <input style={{...S.inp,width:70,textAlign:"center",padding:"8px",fontSize:16,fontWeight:700,color:"#f59e0b",border:"2px solid #f59e0b44"}}
                      type="number" min="0" max="100" value={emg.emergencyPct||20}
                      onChange={e=>{const nb={...budgetSettings,buckets:(budgetSettings.buckets||[]).map(x=>x.id===emg.id?{...x,emergencyPct:parseInt(e.target.value)||20}:x)};setBudgetSettings(nb);_save('budgetSettings',nb);}}/>
                    <span style={{fontSize:13,color:"#64748b"}}>%</span>
                  </>);})()}
                </div>
              </div>
            </div>

            {/* ربط الحسابات */}
            <div style={{borderBottom:"1px solid #f1f5f9"}}>
              <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setBudgetSec(p=>({...p,alloc:!p.alloc}))}>
                <div style={{fontWeight:700,fontSize:14}}>🏦 ربط الحسابات</div>
                <span style={{fontSize:16,color:"#64748b"}}>{budgetSec.alloc?"▲":"▼"}</span>
              </div>
              {budgetSec.alloc&&<div style={{padding:"0 16px 14px"}}>
                {(budgetSettings.buckets||[]).map(b=>{
                  const takenKeys=(budgetSettings.buckets||[]).filter(x=>x.id!==b.id).flatMap(x=>x.accountKeys||[]);
                  const available=allAcc.filter(ac=>!takenKeys.includes(ac.key));
                  const bal=allAcc.filter(ac=>(b.accountKeys||[]).includes(ac.key)).reduce((s,ac)=>s+(ac.balance||0),0);
                  return(
                    <div key={b.id} style={{borderRadius:12,padding:12,border:`2px solid ${b.color}33`,marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <div style={{width:38,height:38,borderRadius:10,background:b.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{b.icon}</div>
                        <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{b.name}</div><div style={{fontSize:12,color:b.color,fontWeight:700}}>{fmt(bal)} د.م</div></div>
                      </div>
                      {(b.accountKeys||[]).map(key=>{
                        const acc=allAcc.find(x=>x.key===key);
                        return acc?(
                          <div key={key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:b.color+"12",borderRadius:8,marginBottom:6}}>
                            <span style={{flex:1,fontSize:12}}>{acc.bn} — {acc.name}</span>
                            <span style={{fontSize:12,fontWeight:700,color:b.color}}>{fmt(acc.balance)}</span>
                            <button style={{background:"#ef444420",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",color:"#ef4444",fontSize:11,fontFamily:"inherit"}}
                              onClick={()=>{const nb={...budgetSettings,buckets:(budgetSettings.buckets||[]).map(x=>x.id===b.id?{...x,accountKeys:(x.accountKeys||[]).filter(k=>k!==key)}:x)};setBudgetSettings(nb);_save('budgetSettings',nb);}}>✕</button>
                          </div>
                        ):null;
                      })}
                      <select style={{...S.sel,marginTop:4}} value="" onChange={e=>{
                        if(!e.target.value)return;
                        const nb={...budgetSettings,buckets:(budgetSettings.buckets||[]).map(x=>x.id===b.id?{...x,accountKeys:[...(x.accountKeys||[]),e.target.value]}:x)};
                        setBudgetSettings(nb);_save('budgetSettings',nb);
                      }}>
                        <option value="">+ إضافة حساب لهاد القسم</option>
                        {available.filter(ac=>!(b.accountKeys||[]).includes(ac.key)).map(ac=>(
                          <option key={ac.key} value={ac.key}>{ac.bn} - {ac.name} ({fmt(ac.balance)})</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>}
            </div>

            {/* حفظ */}
            <div style={{padding:16}}>
              <button style={S.btn()} onClick={()=>{
                const tot=(budgetSettings.buckets||[]).reduce((s,b)=>s+(b.pct||0),0);
                if(tot!==100){showErr(`⛔ مجموع النسب ${tot}% — خاص يكون 100%`);return;}
                _save('budgetSettings',budgetSettings);showErr("✅ تم حفظ إعدادات الميزانية ✓");setTimeout(()=>setErr(null),3000);
              }}>✅ حفظ إعدادات الميزانية</button>
            </div>
          </div>

          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px 6px",fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>الحساب</div>
            <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:"1px solid #e2e8f0"}} onClick={()=>om("changePw")}>
              <div style={{width:42,height:42,borderRadius:12,background:"#f5f5f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>🔑</div>
              <span style={{flex:1,fontSize:16,fontWeight:700,color:"#1a1a1a"}}>تغيير كلمة السر</span>
              <ChevronLeft size={18} color="#64748b"/>
            </div>
            {/* جهة الاسترجاع */}
            <div style={{padding:"14px 16px",borderTop:"1px solid #f1f5f9"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>📱 جهة استرجاع كلمة السر</div>
              <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>إيميل أو رقم الهاتف — كيبان ملي تنسى كلمة السر</div>
              <input style={{...S.inp,marginBottom:8}} type="text"
                placeholder="example@email.com أو 0600000000"
                value={recoveryContact}
                onChange={e=>setRecoveryContact(e.target.value)}/>
              {recoveryContact&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#10b98110",borderRadius:8}}>
                <span style={{fontSize:16}}>✅</span>
                <span style={{fontSize:12,color:"#1a6b4a",fontWeight:700}}>{recoveryContact}</span>
              </div>}
              {!recoveryContact&&<div style={{fontSize:11,color:"#f59e0b"}}>⚠️ ما سجلتيش جهة استرجاع بعد</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer"}} onClick={()=>setDp("cloud")}>
              <div style={{width:42,height:42,borderRadius:12,background:"#f5f5f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14,flexShrink:0}}>☁️</div>
              <span style={{flex:1,fontSize:16,fontWeight:700,color:"#1a1a1a"}}>النسخ الاحتياطي</span>
              <ChevronLeft size={18} color="#64748b"/>
            </div>
          </div>
          {dp&&["banks","cash","assets","expCat","incCat","cloud"].includes(dp)&&(
            <div style={{position:"fixed",inset:0,background:"#f5f5f0",zIndex:100,overflowY:"auto",padding:"20px 20px 90px"}}>
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');`}</style>
              <div dir="rtl" style={{fontFamily:"Tajawal",color:"#1a1a1a",display:"flex",flexDirection:"column",gap:14}}>
                {dp==="banks"&&<>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>البنوك</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  <button style={{...S.btn("#10b981"),padding:"13px"}} onClick={()=>om("addBank")}>+ إضافة بنك جديد</button>
                  {banks.map(b=>(
                    <div key={b.id} style={{background:"#1a1d27",borderRadius:14,overflow:"hidden",border:"1px solid #e8e8e4"}}>
                      <div style={{display:"flex",alignItems:"center",padding:"16px",cursor:"pointer",borderBottom:ovExp[`bk_${b.id}`]?"1px solid #e8e8e4":"none"}} onClick={()=>setOvExp(p=>({...p,[`bk_${b.id}`]:!p[`bk_${b.id}`]}))}>
                        <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14}}>🏦</div>
                        <span style={{flex:1,fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{b.name}</span>
                        <div style={{display:"flex",gap:8,opacity:ovExp[`del_bank_${b.id}`]?1:0,transition:"opacity .2s",marginLeft:8}} onClick={e=>e.stopPropagation()}>
                          <button style={{background:"rgba(239,68,68,.25)",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#fca5a5",fontSize:12,fontFamily:"Tajawal"}} onClick={()=>ask("bank",b.id,b.name)}>حذف</button>
                        </div>
                        <div style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={e=>{e.stopPropagation();setOvExp(p=>({...p,[`del_bank_${b.id}`]:!p[`del_bank_${b.id}`]}));}}>
                          <span style={{fontSize:18,color:"rgba(255,255,255,.3)"}}>⋯</span>
                        </div>
                      </div>
                      {ovExp[`bk_${b.id}`]&&<>
                        {b.accounts.map(a=>(
                          <div key={a.id} style={{display:"flex",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid #e8e8e4"}}>
                            <div style={{width:8,height:8,borderRadius:"50%",background:a.color,marginLeft:14}}/>
                            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{a.name}</div><div style={{fontSize:12,color:"#475569"}}>{a.type}</div></div>
                            <div style={{display:"flex",gap:8,opacity:ovExp[`del_acc_${a.id}`]?1:0,transition:"opacity .2s"}}>
                              <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"#1a1a1a",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setSelBk(b.id);setEi({...a,_bid:b.id});om("edBAcc");}}>تعديل</button>
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
                    <span style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>الكاش</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  <button style={{...S.btn("#f59e0b"),padding:"13px"}} onClick={()=>om("addCash")}>+ إضافة محفظة جديدة</button>
                  {cash.map(c=>(
                    <div key={c.id} style={{display:"flex",alignItems:"center",padding:"16px",background:"#1a1d27",borderRadius:14,border:"1px solid #e8e8e4"}}>
                      <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14}}>💵</div>
                      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{c.name}</div><div style={{fontSize:12,color:"#475569"}}>{c.type}</div></div>
                      <div style={{display:"flex",gap:8,opacity:ovExp[`del_c_${c.id}`]?1:0,transition:"opacity .2s"}}>
                        <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"#1a1a1a",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setEi(c);om("edCash");}}>تعديل</button>
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
                    <span style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>الممتلكات</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  <button style={{...S.btn("#14b8a6"),padding:"13px"}} onClick={()=>om("addAst")}>+ إضافة ممتلك جديد</button>
                  {assets.map(a=>(
                    <div key={a.id} style={{display:"flex",alignItems:"center",padding:"16px",background:"#1a1d27",borderRadius:14,border:"1px solid #e8e8e4"}}>
                      <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginLeft:14}}>🏠</div>
                      <div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{a.name}</div><div style={{fontSize:12,color:"#475569"}}>{a.type}{a.note?` · ${a.note}`:""}</div></div>
                      <div style={{display:"flex",gap:8,opacity:ovExp[`del_a_${a.id}`]?1:0,transition:"opacity .2s"}}>
                        <button style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,padding:"4px 8px",cursor:"pointer",color:"#1a1a1a",fontSize:11,fontFamily:"Tajawal"}} onClick={()=>{setEi(a);om("edAst");}}>تعديل</button>
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
                    <span style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>النسخ الاحتياطي</span>
                    <button onClick={()=>setDp(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"6px 10px",color:"#1a1a1a",cursor:"pointer",fontFamily:"Tajawal",fontSize:12}}>← رجوع</button>
                  </div>
                  {bkMsg&&<div style={{background:"rgba(16,185,129,.2)",border:"1px solid #10b981",borderRadius:10,padding:"10px",fontSize:13,color:"#1a6b4a"}}>{bkMsg}</div>}
                  <button style={{...S.btn("#10b981"),padding:"13px"}} onClick={expData}>📤 تحميل نسخة احتياطية</button>
                  <button style={{...S.btn("#0ea5e9"),padding:"13px"}} onClick={openDriveAfterExport}>☁️ حفظ في Google Drive</button>
                  <button style={{...S.btn("#6366f1"),padding:"13px"}} onClick={restoreFromDrive}>⬇️ استرجاع من Google Drive</button>
                  <button style={{...S.btn("#6366f1"),padding:"13px"}} onClick={()=>fRef.current.click()}>📥 استيراد من ملف</button>
                  <button style={{...S.btn("#16a34a"),padding:"13px"}} onClick={exportExcel}>📊 تصدير Excel (المعاملات)</button>
                  <button style={{...S.btn("#16a34a"),padding:"13px"}} onClick={()=>excelRef.current.click()}>📥 استيراد Excel</button>
                  <input ref={excelRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={importExcel}/>
                  <div style={{background:"#1a1d27",borderRadius:14,padding:16,border:"1px solid #ef444433"}}>
                    <div style={{fontWeight:700,color:"#ef4444",marginBottom:8,fontSize:15}}>🗑️ إعادة ضبط كامل</div>
                    <div style={{fontSize:12,color:"#475569",marginBottom:12}}>كتمسح كل البيانات بما فيها البنوك والتصنيفات</div>
                    <input style={{...S.inp,marginBottom:8}} type="password" placeholder="كلمة السر للتأكيد" value={resetCode} onChange={e=>{setResetCode(e.target.value);setResetErr(false);}}/>
                    {resetErr&&<div style={{color:"#ef4444",fontSize:12,marginBottom:6}}>❌ كلمة السر غلط</div>}
                    <button style={S.btn("#ef4444")} onClick={()=>{if(resetCode!==appPassword){setResetErr(true);return;}resetData();setResetCode("");}}>تأكيد إعادة الضبط</button>
                  </div>
                  <button style={{...S.btn("#f59e0b"),padding:"13px"}} onClick={()=>{
                    setBudgetSettings(p=>({...p,
                      buckets:[
                        {id:1,name:"الميزانية",icon:"🛒",color:"#3b82f6",pct:40,accountKeys:[],type:"expenses"},
                        {id:2,name:"الطوارئ",icon:"🚨",color:"#f97316",pct:20,accountKeys:[],type:"emergency",emergencyPct:20},
                        {id:3,name:"الممتلكات",icon:"🏠",color:"#14b8a6",pct:15,accountKeys:[],type:"assets"},
                        {id:4,name:"الاستثمار",icon:"📈",color:"#8b5cf6",pct:15,accountKeys:[],type:"investment"},
                        {id:5,name:"التقاعد",icon:"🏦",color:"#6366f1",pct:10,accountKeys:[],type:"retirement"}
                      ]
                    }));
                    setErr("✅ تم إعادة ضبط الميزانية");setTimeout(()=>setErr(null),3000);
                  }}>🔄 إعادة ضبط الميزانية فقط</button>
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
              <button style={{...S.btn("#e8e8e4",false),padding:"7px 12px",fontSize:12}} onClick={()=>setOvExp(p=>({...p,debtPage:null}))}>← رجوع</button>
            </div>
            {ovExp.debtPage==="salaf"&&<>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1,textAlign:"center",background:"#10b98110",borderRadius:12,padding:"12px 6px",border:"1px solid #10b98133"}}>
                  <div style={{fontSize:11,color:"#1a6b4a",fontWeight:700}}>سلفت</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#1a6b4a"}}>{fmt(totSalaf)}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{salafGiven.length} شخص</div>
                </div>
                <div style={{flex:1,textAlign:"center",background:"#ef444410",borderRadius:12,padding:"12px 6px",border:"1px solid #ef444433"}}>
                  <div style={{fontSize:11,color:"#ef4444",fontWeight:700}}>عندي دَين</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#ef4444"}}>{fmt(totDain-qorudh.reduce((s,l)=>s+l.remaining,0))}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{salafTaken.length} شخص</div>
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
                      <div><div style={{fontSize:14,fontWeight:700,color:"#1a1a1a"}}>{l.person}</div><div style={{fontSize:11,color:"#64748b"}}>{l.date}{l.note?` · ${l.note}`:""}</div></div>
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:16,fontWeight:900,color:l.kind==="أعطيت"?"#10b981":"#ef4444"}}>{fmt(l.remaining)}</div>
                      {l.remaining<l.amount&&<div style={{fontSize:10,color:"#64748b"}}>من {fmt(l.amount)}</div>}
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
              {salafGiven.length===0&&salafTaken.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>لا توجد سلف</div>}
            </>}
            {ovExp.debtPage==="qorudh"&&<>
              <button style={{...S.btn("#6366f1"),padding:"12px"}} onClick={()=>om("addLoan",{kind:"أخذت",wi:true})}>+ إضافة قرض جديد</button>
              {qorudh.map(l=>{
                const pct=Math.min(((l.amount-l.remaining)/l.amount)*100,100);
                return(
                  <div key={l.id} style={S.card}>
                    <div style={{...S.row,marginBottom:10}}>
                      <div><div style={{fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{l.person}</div><div style={{fontSize:12,color:"#64748b"}}>فائدة {l.interest}%{l.inst?` · قسط ${fmt(l.minst)}/شهر`:""}</div></div>
                      <div style={{textAlign:"left"}}><div style={{fontSize:17,fontWeight:900,color:"#ef4444"}}>{fmt(l.remaining)}</div><div style={{fontSize:11,color:"#64748b"}}>من {fmt(l.amount)}</div></div>
                    </div>
                    <div className="pbar" style={{marginBottom:6}}><div className="pfill" style={{width:pct+"%",background:"#10b981"}}/></div>
                    <div style={{...S.row,marginBottom:10}}>
                      <span style={{fontSize:11,color:"#64748b"}}>مسدد {pct.toFixed(0)}%</span>
                      <span style={{fontSize:11,color:"#64748b"}}>متبقي {fmt(l.remaining)}</span>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={{...S.btn("#10b981",false),padding:"9px 14px"}} onClick={()=>{setEi(l);om("returnLoan");}}> سدد</button>
                      <button style={{background:"#ef444415",border:"1px solid #ef444433",borderRadius:10,padding:"9px 12px",cursor:"pointer"}} onClick={()=>ask("loan",l.id,l.person)}><Trash2 size={14} color="#ef4444"/></button>
                    </div>
                  </div>
                );
              })}
              {qorudh.length===0&&<div style={{...S.card,textAlign:"center",padding:30,color:"#64748b"}}>لا توجد قروض</div>}
            </>}
            {ovExp.debtPage==="credit"&&<>
              <div style={{...S.card,textAlign:"center",background:"#f59e0b10",border:"1px solid #f59e0b33"}}>
                <div style={{fontSize:12,color:"#f59e0b",marginBottom:4,fontWeight:700}}>إجمالي الكريدي غير المخلص</div>
                <div style={{fontSize:28,fontWeight:900,color:"#f59e0b"}}>{fmt(creditTotal)}</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{creditTxs.length} معاملة</div>
              </div>
              {creditTxs.length===0?
                <div style={{...S.card,textAlign:"center",padding:30}}><div style={{fontSize:30,marginBottom:8}}>✅</div><div style={{color:"#64748b"}}>ما كاين ديون كريدي</div></div>:
                creditTxs.map(t=>(
                  <div key={t.id} style={S.card}>
                    <div style={{...S.row,marginBottom:10}}>
                      <div><div style={{fontSize:14,fontWeight:700,color:"#1a1a1a"}}>{t.desc}</div><div style={{fontSize:11,color:"#64748b"}}>{t.date}</div></div>
                      <div style={{fontSize:17,fontWeight:900,color:"#f59e0b"}}>{fmt(t.amount)}</div>
                    </div>
                    {ovExp[`pay_${t.id}`]?
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <select style={{...S.sel,border:`2px solid ${ovExp[`payErr_${t.id}`]?"#ef4444":"#e8e8e4"}`}} value={ovExp[`pacc_${t.id}`]||""} onChange={e=>setOvExp(p=>({...p,[`pacc_${t.id}`]:e.target.value,[`payErr_${t.id}`]:false}))}>
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
                        <button style={{background:"none",border:"none",color:"#64748b",fontFamily:"Tajawal",fontSize:12,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,[`pay_${t.id}`]:false}))}>إلغاء</button>
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
                <div style={{fontSize:11,color:"#1a6b4a",fontWeight:700}}>سلفت</div>
                <div style={{fontSize:20,fontWeight:900,color:"#1a6b4a"}}>{fmt(totSalaf)}</div>
              </div>
              <div style={{flex:1,textAlign:"center",...S.card,background:"#f59e0b10",border:"1px solid #f59e0b33",padding:"14px 8px"}}>
                <div style={{fontSize:11,color:"#f59e0b",fontWeight:700}}>كريدي</div>
                <div style={{fontSize:20,fontWeight:900,color:"#f59e0b"}}>{fmt(creditTotal)}</div>
              </div>
            </div>
            {[
              {key:"salaf",icon:"🤝",title:"السلف",sub:"اللي سلفت واللي عندك دَين عند حد",color:"#1a6b4a",count:`${salafGiven.length+salafTaken.length} سلفة`},
              {key:"qorudh",icon:"🏦",title:"الكريدي الكبير",sub:"قروض بنكية أو عند أشخاص",color:"#6366f1",count:`${qorudh.length} قرض`},
              {key:"credit",icon:"💳",title:"الكريدي الصغير",sub:"مشتريات بالكريدي لم تُخلص",color:"#f59e0b",count:`${creditTxs.length} معاملة · ${fmt(creditTotal)}`},
            ].map(item=>(
              <div key={item.key} style={{...S.card,cursor:"pointer",padding:0,overflow:"hidden"}} onClick={()=>setOvExp(p=>({...p,debtPage:item.key}))}>
                <div style={{display:"flex",alignItems:"center",padding:"16px"}}>
                  <div style={{width:50,height:50,borderRadius:14,background:item.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginLeft:14,flexShrink:0}}>{item.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,fontWeight:800,color:"#1a1a1a"}}>{item.title}</div>
                    <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{item.sub}</div>
                    <div style={{fontSize:12,fontWeight:700,color:item.color,marginTop:4}}>{item.count}</div>
                  </div>
                  <ChevronLeft size={20} color="#64748b"/>
                </div>
              </div>
            ))}
          </>;
        })()}

        {page==="transactions"&&(()=>{
          const getTxType=t=>{
            if(t.isLoan)return"loan";
            if(t.isInvest)return"invest";
            if(t.isAsset)return"asset";
            if(t.isTransfer||t.pm==="تحويل")return"transfer";
            if(t.pm==="كريدي")return"credit";
            return t.type==="income"?"income":"expense";
          };
          const periodTxs=filterByPeriod(txs);
          const typeFiltered0=txTypeFilter==="all"?periodTxs:periodTxs.filter(t=>getTxType(t)===txTypeFilter);
          const searchQ=(ovExp.txSearch||"").trim().toLowerCase();
          const typeFiltered=searchQ?typeFiltered0.filter(t=>{
            const c=gc(t.type==="income"?"income":"expense",t.catId);
            const s=t.subId?gs(t.type==="income"?"income":"expense",t.catId,t.subId):null;
            const hay=`${t.desc||""} ${c?.name||""} ${s?.name||""} ${t.amount}`.toLowerCase();
            return hay.includes(searchQ);
          }):typeFiltered0;
          const mInc=periodTxs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset&&t.pm!=="تحويل").reduce((s,t)=>s+t.amount,0);
          const mExp=periodTxs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset&&t.pm!=="تحويل").reduce((s,t)=>s+t.amount,0);
          const typeLabels={all:"الكل",income:"💰 المداخل",expense:"💸 المصاريف",transfer:"🔄 التحويلات",credit:"💳 الكريدي",loan:"🤝 السلف",asset:"🏠 الممتلكات",invest:"📈 الاستثمار"};
          return(<>
          <div style={{...S.row}}><span style={{fontWeight:700,fontSize:16}}>المعاملات</span></div>
          <PeriodSelector/>
          <input style={{...S.inp,marginBottom:10}} placeholder="🔍 بحث بالاسم، التصنيف، أو المبلغ..." value={ovExp.txSearch||""} onChange={e=>setOvExp(p=>({...p,txSearch:e.target.value}))}/>
          <select style={{...S.sel,marginBottom:10}} value={txTypeFilter} onChange={e=>{setTxTypeFilter(e.target.value);setOpenTxId(null);}}>
            {Object.entries(typeLabels).map(([k,l])=><option key={k} value={k}>{l}</option>)}
          </select>
          <div style={{display:"flex",gap:8}}>
            {[["الدخل",mInc,"#10b981"],["المصاريف",mExp,"#ef4444"],["الصافي",mInc-mExp,mInc-mExp>=0?"#10b981":"#ef4444"]].map(([l,v,c])=>(
              <div key={l} style={{...S.card,flex:1,textAlign:"center",padding:"10px 4px"}}><div style={{fontSize:10,color:c}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:c}}>{fmt(Math.abs(v))}</div></div>
            ))}
          </div>
          <div style={S.card}>
            {typeFiltered.length===0&&<div style={{textAlign:"center",color:"#64748b",padding:20,fontSize:13}}>ما كاينش معاملات</div>}
            {typeFiltered.map(t=>{const{cn,sn,ic,hi}=tl(t);const ac=al(t.ref);const isOpen=openTxId===t.id;const txType=getTxType(t);
              const typeIcon={income:"💰",expense:"💸",transfer:"🔄",credit:"💳",loan:"🤝",asset:"🏠",invest:"📈"}[txType];
              const isPositive=t.type==="income";
              return(
              <div key={t.id}>
                {/* سطر مضغوط: ايقونة - تاريخ - الفئة - المبلغ */}
                <div className="tx" style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}} onClick={()=>setOpenTxId(isOpen?null:t.id)}>
                  <div style={{width:36,height:36,borderRadius:10,background:isPositive?"#10b98122":"#ef444422",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}><Ico src={hi?ic:null} fb={ic||typeIcon}/></div>
                  <span style={{fontSize:11,color:"#64748b",whiteSpace:"nowrap",flexShrink:0}}>{t.date.slice(2).split("-").reverse().join("/")}</span>
                  <span style={{fontSize:13,fontWeight:600,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc||cn}</span>
                  <span style={{fontSize:13,fontWeight:700,color:isPositive?"#10b981":"#ef4444",whiteSpace:"nowrap",flexShrink:0}}>{isPositive?"+":"-"}{fmt(t.amount)} د.م</span>
                </div>
                {/* تفاصيل كاملة عند الكليك */}
                {isOpen&&<div style={{background:"#f8fafc",borderRadius:10,padding:12,margin:"4px 0 8px",border:"1px solid #e2e8f0"}}>
                  <div style={{fontSize:12,color:"#475569",marginBottom:8,display:"flex",flexDirection:"column",gap:4}}>
                    <div>🏷️ {typeIcon} {typeLabels[txType]}</div>
                    <div>📂 {cn}{sn&&` ← ${sn}`}</div>
                    {ac&&<div>📍 {ac}</div>}
                    {t.pm&&<div>💳 طريقة الدفع: {t.pm}</div>}
                    <div>📅 {t.date}</div>
                    <div style={{fontWeight:700,color:isPositive?"#10b981":"#ef4444"}}>💵 {isPositive?"+":"-"}{fmt(t.amount)} د.م</div>
                    {t.note&&<div>📝 {t.note}</div>}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{...S.btn("#6366f1"),flex:1,padding:"8px",fontSize:12}} onClick={e=>{e.stopPropagation();setEi({...t,amount:t.amount.toString(),catId:t.catId?.toString(),subId:t.subId?.toString()});om("edTx");}}>✏️ تعديل</button>
                    <button style={{...S.btn("#ef4444"),flex:1,padding:"8px",fontSize:12}} onClick={e=>{e.stopPropagation();ask("tx",t.id,t.desc||cn);}}>🗑️ حذف</button>
                  </div>
                </div>}
              </div>
            );})}
          </div>
          </>);
        })()}

        {page==="goals"&&(()=>{
          const todayStr=new Date().toISOString().split("T")[0];
          const incomeGoals=(budgetSettings.incomeGoals||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
          const pctHistory=(budgetSettings.pctGoalHistory||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
          const activeIncome=incomeGoals[0]||null;
          const activePct=pctHistory[0]||null;
          const bucketsDef=budgetSettings.buckets||[];
          const currentPcts=activePct?activePct.pcts:Object.fromEntries(bucketsDef.map(b=>[b.type,b.pct]));
          const daysSince=dateStr=>(new Date(todayStr)-new Date(dateStr))/86400000;
          const canAddIncome = incomeGoals.length===0 || daysSince(incomeGoals[0].date)>=365;
          const canAddPct = pctHistory.length===0 || daysSince(pctHistory[0].date)>=365;
          const addDays=(dateStr,n)=>{const d=new Date(dateStr);d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];};
          const nextIncomeDate = incomeGoals.length? addDays(incomeGoals[0].date,365) : null;
          const nextPctDate = pctHistory.length? addDays(pctHistory[0].date,365) : null;

          const now=new Date();
          const last3=[0,1,2].map(i=>{const d=new Date(now.getFullYear(),now.getMonth()-i,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;});
          const monthlyIncomes=last3.map(m=>txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset&&t.date.startsWith(m)).reduce((s,t)=>s+t.amount,0));
          const validMonths=monthlyIncomes.filter(v=>v>0);
          const avg3=validMonths.length? validMonths.reduce((a,b)=>a+b,0)/validMonths.length : 0;
          const minM=validMonths.length?Math.min(...validMonths):0;
          const suggestions = avg3>0 ? [
            {label:"محافظ",value:Math.round(minM)},
            {label:"متوسط",value:Math.round(avg3)},
            {label:"طموح",value:Math.round(avg3*1.15)},
          ] : [];

          return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setPage("dashboard")}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🎯 الأهداف</span>
            </div>

            {/* هدف الدخل */}
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:8}}>💰 هدف الدخل الشهري</div>
              {activeIncome ? (
                <div style={{background:"#e8f5ee",borderRadius:12,padding:12,marginBottom:10,textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#64748b"}}>الهدف الحالي (منذ {activeIncome.date})</div>
                  <div style={{fontSize:24,fontWeight:900,color:"#1a6b4a"}}>{fmt(activeIncome.amount)}</div>
                </div>
              ) : <div style={{textAlign:"center",color:"#64748b",fontSize:12,padding:10}}>ما حددتيش هدف بعد</div>}

              {incomeGoals.length>0 && <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:6}}>السجل</div>
                {incomeGoals.map((g,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:12,borderBottom:"1px solid #f1f5f9"}}>
                    <span style={{color:"#64748b"}}>{g.date}</span><span style={{fontWeight:700}}>{fmt(g.amount)}</span>
                  </div>
                ))}
              </div>}

              {!canAddIncome && <div style={{background:"#fef3c7",color:"#92400e",fontSize:11,fontWeight:700,padding:"8px 10px",borderRadius:8,marginBottom:8,textAlign:"center"}}>
                ⚠️ خاص يمر عام كامل على آخر تحديث — تقدر تحدث بداية من {nextIncomeDate}
              </div>}

              {canAddIncome && <>
                {suggestions.length>0 && <div style={{display:"flex",gap:6,marginBottom:8}}>
                  {suggestions.map(s=>(
                    <button key={s.label} onClick={()=>setOvExp(p=>({...p,newIncomeAmt:String(s.value)}))} style={{...S.btn("#f1f5f9",false),flex:1,padding:"9px 4px",fontSize:11,color:"#475569"}}>
                      <div style={{fontWeight:800}}>{s.label}</div>
                      <div style={{fontSize:10}}>{fmt(s.value)}</div>
                    </button>
                  ))}
                </div>}
                <input style={{...S.inp,marginBottom:8}} type="number" placeholder="المبلغ الشهري" value={ovExp.newIncomeAmt||""} onChange={e=>setOvExp(p=>({...p,newIncomeAmt:e.target.value}))}/>
                <input style={{...S.inp,marginBottom:8}} type="date" value={ovExp.newIncomeDate||todayStr} onChange={e=>setOvExp(p=>({...p,newIncomeDate:e.target.value}))}/>
                <button style={S.btn("#1a6b4a")} onClick={()=>{
                  const amt=parseFloat(ovExp.newIncomeAmt);
                  const dt=ovExp.newIncomeDate||todayStr;
                  if(!amt||amt<=0){showErr("⛔ أدخل مبلغ صحيح");setTimeout(()=>setErr(null),3000);return;}
                  if(incomeGoals.length>0 && daysSince(incomeGoals[0].date)<365){showErr("⛔ خاص يمر عام كامل على آخر تحديث");setTimeout(()=>setErr(null),3000);return;}
                  const nb={...budgetSettings,incomeGoals:[...(budgetSettings.incomeGoals||[]),{date:dt,amount:amt}]};
                  setBudgetSettings(nb);_save('budgetSettings',nb);
                  setOvExp(p=>({...p,newIncomeAmt:"",newIncomeDate:""}));
                  setErr("✅ تم حفظ هدف الدخل");setTimeout(()=>setErr(null),3000);
                }}>💾 حفظ هدف جديد</button>
              </>}
            </div>

            {/* نسب التوزيع */}
            <div style={S.card}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:8}}>📊 نسب توزيع الأقسام</div>
              <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>منذ {activePct?activePct.date:"—"} — المجموع خاص 100%</div>
              {bucketsDef.map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:13}}>
                  <span>{b.icon} {b.name}</span><span style={{fontWeight:700,color:b.color}}>{currentPcts[b.type]||0}%</span>
                </div>
              ))}

              {pctHistory.length>0 && <div style={{marginTop:10,marginBottom:10}}>
                <div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:6}}>السجل</div>
                {pctHistory.map((g,i)=>(
                  <div key={i} style={{fontSize:11,color:"#64748b",padding:"4px 0",borderBottom:"1px solid #f1f5f9"}}>{g.date} — {bucketsDef.map(b=>`${b.icon}${g.pcts[b.type]||0}%`).join(" ")}</div>
                ))}
              </div>}

              {!canAddPct && <div style={{background:"#fef3c7",color:"#92400e",fontSize:11,fontWeight:700,padding:"8px 10px",borderRadius:8,marginTop:8,textAlign:"center"}}>
                ⚠️ خاص يمر عام كامل على آخر تحديث — تقدر تحدث بداية من {nextPctDate}
              </div>}

              {canAddPct && <div style={{marginTop:8}}>
                {bucketsDef.map(b=>(
                  <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:32,height:32,borderRadius:9,background:b.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{b.icon}</div>
                    <div style={{flex:1,fontSize:13,fontWeight:700}}>{b.name}</div>
                    <input style={{...S.inp,width:64,textAlign:"center",padding:"7px"}} type="number" min="0" max="100"
                      value={ovExp[`newPct_${b.type}`]!==undefined?ovExp[`newPct_${b.type}`]:(currentPcts[b.type]||0)}
                      onChange={e=>setOvExp(p=>({...p,[`newPct_${b.type}`]:e.target.value}))}/>
                    <span style={{fontSize:12,color:"#64748b"}}>%</span>
                  </div>
                ))}
                {(()=>{const tot=bucketsDef.reduce((s,b)=>s+(parseInt(ovExp[`newPct_${b.type}`]!==undefined?ovExp[`newPct_${b.type}`]:(currentPcts[b.type]||0))||0),0);
                  return <div style={{textAlign:"center",fontSize:12,fontWeight:700,color:tot===100?"#10b981":"#ef4444",marginBottom:8}}>المجموع: {tot}% {tot===100?"✅":"⚠️"}</div>;
                })()}
                <input style={{...S.inp,marginBottom:8}} type="date" value={ovExp.newPctDate||todayStr} onChange={e=>setOvExp(p=>({...p,newPctDate:e.target.value}))}/>
                <button style={S.btn("#6366f1")} onClick={()=>{
                  const pcts={};
                  bucketsDef.forEach(b=>{pcts[b.type]=parseInt(ovExp[`newPct_${b.type}`]!==undefined?ovExp[`newPct_${b.type}`]:(currentPcts[b.type]||0))||0;});
                  const tot=Object.values(pcts).reduce((s,v)=>s+v,0);
                  if(tot!==100){showErr(`⛔ المجموع ${tot}% — خاص يكون 100%`);setTimeout(()=>setErr(null),3500);return;}
                  const dt=ovExp.newPctDate||todayStr;
                  if(pctHistory.length>0 && daysSince(pctHistory[0].date)<365){showErr("⛔ خاص يمر عام كامل على آخر تحديث");setTimeout(()=>setErr(null),3000);return;}
                  const nb={...budgetSettings,pctGoalHistory:[...(budgetSettings.pctGoalHistory||[]),{date:dt,pcts}],
                    buckets:(budgetSettings.buckets||[]).map(b=>({...b,pct:pcts[b.type]!==undefined?pcts[b.type]:b.pct}))};
                  setBudgetSettings(nb);_save('budgetSettings',nb);
                  setOvExp(p=>{
                    const np={...p,newPctDate:""};
                    bucketsDef.forEach(b=>{delete np[`newPct_${b.type}`];});
                    return np;
                  });
                  setErr("✅ تم حفظ النسب الجديدة");setTimeout(()=>setErr(null),3000);
                }}>💾 حفظ نسب جديدة</button>
              </div>}
            </div>

            {/* معاينة سريعة */}
            {activeIncome && <div style={S.card}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:8}}>👁️ معاينة الأهداف الشهرية</div>
              {bucketsDef.map(b=>(
                <div key={b.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
                  <span>{b.icon} {b.name}</span>
                  <span style={{fontWeight:800,color:b.color}}>{fmt(activeIncome.amount*(currentPcts[b.type]||0)/100)}</span>
                </div>
              ))}
            </div>}
          </>;
        })()}

        {page==="budget"&&(()=>{
          const buckets = budgetSettings.buckets||[];
          const totalPct = buckets.reduce((s,b)=>s+b.pct,0);
          const allInc = txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset);
          const periodInc = filterByPeriod(allInc).reduce((s,t)=>s+t.amount,0);
          const periodExp = filterByPeriod(txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset)).reduce((s,t)=>s+t.amount,0);
          const totalInc = allInc.reduce((s,t)=>s+t.amount,0);
          const getBucketData = b=>{
            const allocated = totalInc * (b.pct/100);
            if(b.type==="expenses"){
              const spent = txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
              return {allocated, spent, transferIn:0, balance:allocated-spent, bucketTxs:[]};
            } else if(b.type==="emergency"){
              const out = txs.filter(t=>t.type==="expense"&&t.isTransfer&&(t.desc||"").includes("إعاشة")).reduce((s,t)=>s+t.amount,0);
              return {allocated, spent:out, transferIn:0, balance:allocated-out, bucketTxs:[]};
            }
            return {allocated, spent:0, transferIn:0, balance:allocated, bucketTxs:[]};
          };
          const getBucketBalance = b => getBucketData(b);
          const expBucket = buckets.find(b=>b.type==="expenses");
          const expBalance = expBucket ? getBucketBalance(expBucket).balance : 0;
          const emergBucket = buckets.find(b=>b.type==="emergency");

          return <>
            <PeriodSelector/>

            {/* تنبيه نفاذ الميزانية */}
            {expBalance < 0 && emergBucket && (()=>{
              const emergBal = getBucketBalance(emergBucket).balance;
              const transferAmt = emergBal * ((emergBucket.emergencyPct||20)/100);
              return <div style={{...S.card,background:"#fef3c7",border:"2px solid #f59e0b",padding:14,marginBottom:10}}>
                <div style={{fontWeight:700,color:"#d97706",marginBottom:4}}>⚠️ الميزانية نفذت!</div>
                <div style={{fontSize:12,color:"#78350f",marginBottom:8}}>العجز: {fmt(Math.abs(expBalance))} د.م</div>
                <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>رصيد الطوارئ: {fmt(emergBal)} — يمكن تحويل {fmt(transferAmt)} ({emergBucket.emergencyPct||20}%)</div>
                <button style={{...S.btn("#f59e0b"),padding:"10px",fontSize:13}} onClick={()=>{
                  const fromAcc = allAcc.find(a=>(emergBucket.accountKeys||[]).includes(a.key));
                  const toAcc = allAcc.find(a=>((expBucket||{}).accountKeys||[]).includes(a.key));
                  if(!fromAcc||!toAcc){showErr("⛔ ربط الحسابات ناقص — ربط حسابات الميزانية والطوارئ أولاً");return;}
                  if(transferAmt>(fromAcc.balance||0)){showErr("⛔ رصيد حساب الطوارئ الحقيقي غير كافي — المتاح: "+fmt(fromAcc.balance||0));return;}
                  const txDate=new Date().toISOString().split("T")[0];
                  setTxs(p=>[
                    {id:uid(),type:"expense",amount:transferAmt,desc:"إعاشة من الطوارئ للميزانية",date:txDate,ref:fromAcc.ref,isTransfer:true,isLoan:false,isInvest:false,isAsset:false,catId:null,subId:null,note:"",pm:"تحويل"},
                    {id:uid(),type:"income",amount:transferAmt,desc:"إعاشة من الطوارئ للميزانية",date:txDate,ref:toAcc.ref,isTransfer:true,isLoan:false,isInvest:false,isAsset:false,catId:null,subId:null,note:"",pm:"تحويل"},
                    ...p
                  ]);
                  updBal(fromAcc.ref,transferAmt,"expense","add");
                  updBal(toAcc.ref,transferAmt,"income","add");
                  showErr(`✅ تم تحويل ${fmt(transferAmt)} من الطوارئ للميزانية`);setTimeout(()=>setErr(null),4000);
                }}>🔄 تحويل {fmt(transferAmt)} من الطوارئ للميزانية</button>
              </div>;
            })()}

            {/* ملخص الفترة */}
            <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:20,padding:18,marginBottom:12}}>
              <div style={{fontSize:12,color:"rgba(255,255,255,.75)",fontWeight:700,marginBottom:12}}>📊 ملخص {period.type==="month"?"الشهر":period.type==="year"?"السنة":"الكلي"}</div>
              <div style={{display:"flex",gap:10,marginBottom:12}}>
                {[["📥 الدخل",periodInc,"#10b981"],["📤 المصاريف",periodExp,"#ef4444"]].map(([l,v,c])=>(
                  <div key={l} style={{flex:1,background:"rgba(255,255,255,.07)",borderRadius:14,padding:"12px 10px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.75)",marginBottom:4}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:900,color:c}}>{fmt(v)}</div>
                  </div>
                ))}
              </div>
              <div style={{background:(periodInc-periodExp)>=0?"rgba(16,185,129,.15)":"rgba(239,68,68,.15)",borderRadius:14,padding:"12px 16px",display:"flex",justifyContent:"space-between"}}>
                <div style={{fontSize:13,color:(periodInc-periodExp)>=0?"#10b981":"#ef4444",fontWeight:700}}>{(periodInc-periodExp)>=0?"💚 الفائض":"🔴 العجز"}</div>
                <div style={{fontSize:20,fontWeight:900,color:(periodInc-periodExp)>=0?"#10b981":"#ef4444"}}>{fmt(Math.abs(periodInc-periodExp))}</div>
              </div>
            </div>

            {/* نسب التوزيع */}
            {totalPct!==100&&<div style={{...S.card,background:"#fef3c7",border:"1px solid #f59e0b",padding:10,fontSize:12,color:"#92400e",marginBottom:8}}>
              ⚠️ مجموع النسب {totalPct}% — خاص يكون 100%
            </div>}
            <div style={{...S.card,textAlign:"center",cursor:"pointer",padding:14}} onClick={()=>setPage("buckets")}>
              <span style={{fontSize:13,fontWeight:700,color:"#1a6b4a"}}>🧩 عرض الأقسام الخمسة بالتفصيل ›</span>
            </div>
          </>;
        })()}

        {page==="buckets"&&(()=>{
          const buckets = budgetSettings.buckets||[];
          const allInc = txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset);
          const totalInc = allInc.reduce((s,t)=>s+t.amount,0);
          const getBucketData = b=>{
            const allocated = totalInc * (b.pct/100);
            if(b.type==="expenses"){
              const spent = txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
              const balance = allocated - spent;
              return {allocated, spent, transferIn:0, balance,
                bucketTxs: txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).slice(0,20)
              };
            } else if(b.type==="emergency"){
              const out = txs.filter(t=>t.type==="expense"&&t.isTransfer&&(t.desc||"").includes("إعاشة")).reduce((s,t)=>s+t.amount,0);
              const balance = allocated - out;
              return {allocated, spent:out, transferIn:0, balance, bucketTxs: txs.filter(t=>t.isTransfer&&(t.desc||"").includes("إعاشة")).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20)};
            } else if(b.type==="assets"){
              const out = txs.filter(t=>t.type==="expense"&&t.isAsset).reduce((s,t)=>s+t.amount,0);
              const inBack = txs.filter(t=>t.type==="income"&&t.isAsset).reduce((s,t)=>s+t.amount,0);
              const balance = allocated - out + inBack;
              return {allocated, spent:out, transferIn:inBack, balance,
                bucketTxs: txs.filter(t=>t.isAsset).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20)
              };
            } else if(b.type==="investment"){
              const out = txs.filter(t=>t.type==="expense"&&t.isInvest).reduce((s,t)=>s+t.amount,0);
              const inBack = txs.filter(t=>t.type==="income"&&t.isInvest).reduce((s,t)=>s+t.amount,0);
              const balance = allocated - out + inBack;
              return {allocated, spent:out, transferIn:inBack, balance,
                bucketTxs: txs.filter(t=>t.isInvest).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20)
              };
            } else if(b.type==="retirement"){
              const out = loans.filter(l=>l.kind==="أعطيت").reduce((s,l)=>s+(l.remaining||0),0);
              const balance = allocated - out;
              return {allocated, spent:out, transferIn:0, balance,
                bucketTxs: txs.filter(t=>t.isLoan&&(t.loanKind||"أعطيت")==="أعطيت").sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20)
              };
            }
            return {allocated, spent:0, transferIn:0, balance:allocated, bucketTxs:[]};
          };
          const expBucket = buckets.find(b=>b.type==="expenses");
          const expBalance = expBucket ? getBucketData(expBucket).balance : 0;
          const bktSel = ovExp.bktSel||null;

          if(!bktSel) return <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setPage("dashboard")}>← رجوع</button>
              <span style={{fontWeight:800,fontSize:17}}>🧩 الأقسام الخمسة</span>
            </div>
            {buckets.map(b=>{
              const {balance} = getBucketData(b);
              return(
                <div key={b.id} style={{...S.card,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,bktSel:b.id}))}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:48,height:48,borderRadius:14,background:b.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{b.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>{b.name}</div><div style={{fontSize:11,color:"#64748b"}}>{b.pct}% من الدخل{balance<0?" — 🔴 عجز":""}</div></div>
                    <span style={{fontSize:17,fontWeight:900,color:balance>=0?b.color:"#ef4444"}}>{fmt(Math.abs(balance))}</span>
                    <span style={{color:"#64748b",fontSize:20}}>›</span>
                  </div>
                </div>
              );
            })}
          </>;

          const b = buckets.find(x=>x.id===bktSel);
          if(!b) return null;
          const {allocated, spent, transferIn, balance, bucketTxs} = getBucketData(b);
          const pct_used = allocated>0?((spent)/allocated*100):0;
          const accBal = (b.accountKeys||[]).reduce((s,k)=>{const acc=allAcc.find(a=>a.key===k);return s+(acc?.balance||0);},0);
          return(
            <>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                <button style={{...S.btn("#e8e8e4",false),padding:"8px 12px",fontSize:13,color:"#475569"}} onClick={()=>setOvExp(p=>({...p,bktSel:null}))}>← رجوع</button>
                <span style={{fontWeight:800,fontSize:17}}>{b.icon} {b.name}</span>
              </div>
              <div style={{...S.card,marginBottom:10,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:42,height:42,borderRadius:12,background:b.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{b.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:15,color:"#1a1a1a"}}>{b.name}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>التوزيع: {b.pct}% من الدخل</div>
                  </div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:16,fontWeight:900,color:balance>=0?"#1a6b4a":"#ef4444"}}>{fmt(Math.abs(balance))}</div>
                    <div style={{fontSize:10,color:balance>=0?"#10b981":"#ef4444"}}>{balance>=0?"✅ متاح":"🔴 عجز"}</div>
                  </div>
                </div>

                {(b.accountKeys||[]).length===0&&<div style={{background:"#fef3c7",color:"#92400e",fontSize:11,fontWeight:700,padding:"6px 10px",borderRadius:8,marginBottom:8,textAlign:"center"}}>⚠️ ماكاينش حساب مربوط بهاد القسم</div>}
                {(b.accountKeys||[]).length>0&&accBal<balance-1&&<div style={{background:"#fee2e2",color:"#991b1b",fontSize:11,fontWeight:700,padding:"6px 10px",borderRadius:8,marginBottom:8,textAlign:"center"}}>⚠️ رصيد الحسابات المربوطة ({fmt(accBal)}) أقل من رصيد القسم ({fmt(balance)}) — تحقق من الربط</div>}

                <div style={{height:5,background:"#f0f0f0",borderRadius:3,overflow:"hidden",marginBottom:8}}>
                  <div style={{height:"100%",width:Math.min(pct_used,100)+"%",background:pct_used>100?"#ef4444":b.color,borderRadius:3}}/>
                </div>

                <div style={{display:"flex",gap:6}}>
                  <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"7px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"#64748b"}}>المخصص</div>
                    <div style={{fontSize:11,fontWeight:700,color:b.color}}>{fmt(allocated)}</div>
                  </div>
                  <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"7px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"#64748b"}}>{b.type==="expenses"?"خرج":"استخدم"}</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#ef4444"}}>{fmt(spent)}</div>
                  </div>
                  {transferIn>0&&<div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"7px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"#64748b"}}>رجع</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#10b981"}}>{fmt(transferIn)}</div>
                  </div>}
                  <div style={{flex:1,background:"#f8fafc",borderRadius:8,padding:"7px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"#64748b"}}>الحسابات</div>
                    <div style={{fontSize:11,fontWeight:700,color:"#6366f1"}}>{fmt(accBal)}</div>
                  </div>
                </div>

                <div style={{marginTop:10,borderTop:"1px solid #f0f0f0",paddingTop:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>📋 سجل الحركات ({bucketTxs.length})</div>
                  {bucketTxs.length===0?
                    <div style={{textAlign:"center",color:"#64748b",padding:16,fontSize:12}}>ما كاينش حركات بعد</div>:
                    bucketTxs.slice(0,10).map(t=>(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #f5f5f5"}}>
                        <div style={{width:30,height:30,borderRadius:8,background:t.type==="income"?"#10b98120":"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                          {t.type==="income"?"↓":"↑"}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600}}>{t.desc||"معاملة"}</div>
                          <div style={{fontSize:10,color:"#64748b"}}>{t.date}</div>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
                      </div>
                    ))
                  }
                  {bucketTxs.length>10&&<div style={{textAlign:"center",fontSize:11,color:"#64748b",marginTop:6}}>و{bucketTxs.length-10} معاملة أخرى...</div>}
                </div>

                {b.type==="emergency"&&expBalance<0&&(()=>{
                  const transferAmt = getBucketData(b).allocated * ((b.emergencyPct||20)/100);
                  return <button style={{...S.btn("#f59e0b"),width:"100%",marginTop:8,padding:"10px",fontSize:12}} onClick={()=>{
                    const fromAcc=allAcc.find(a=>(b.accountKeys||[]).includes(a.key));
                    const toAcc=allAcc.find(a=>((expBucket||{}).accountKeys||[]).includes(a.key));
                    if(!fromAcc||!toAcc){showErr("⛔ ربط حسابات الميزانية والطوارئ أولاً");return;}
                    if(transferAmt>(fromAcc.balance||0)){showErr("⛔ رصيد حساب الطوارئ الحقيقي غير كافي — المتاح: "+fmt(fromAcc.balance||0));return;}
                    const emgBalNow=getBucketBalanceLive("emergency");
                    if(emgBalNow!==null&&transferAmt>emgBalNow){showErr(`⛔ قسم الطوارئ ناقص — المتاح: ${fmt(Math.max(emgBalNow,0))}`);return;}
                    const txDate=new Date().toISOString().split("T")[0];
                    setTxs(p=>[
                      {id:uid(),type:"expense",amount:transferAmt,desc:"إعاشة للميزانية",date:txDate,ref:fromAcc.ref,isTransfer:true,isLoan:false,isInvest:false,isAsset:false,catId:null,subId:null,note:"",pm:"تحويل"},
                      {id:uid(),type:"income",amount:transferAmt,desc:"إعاشة من الطوارئ",date:txDate,ref:toAcc.ref,isTransfer:true,isLoan:false,isInvest:false,isAsset:false,catId:null,subId:null,note:"",pm:"تحويل"},
                      ...p
                    ]);
                    updBal(fromAcc.ref,transferAmt,"expense","add");
                    updBal(toAcc.ref,transferAmt,"income","add");
                    showErr(`✅ تم تحويل ${fmt(transferAmt)} للميزانية`);setTimeout(()=>setErr(null),4000);
                  }}>🔄 إعاشة الميزانية: {fmt(transferAmt)} د.م ({b.emergencyPct||20}%)</button>;
                })()}
              </div>
            </>
          );
        })()}
                {page==="reports"&&(()=>{
          const repTab="dashboard";

          if(repTab==="dashboard"){
            const pad=n=>String(n).padStart(2,"0");
            const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
            const startOfWeek=d=>{const x=new Date(d);const day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);x.setHours(0,0,0,0);return x;};
            const getPresetRange=(preset,yearOv,monthOv)=>{
              const now=new Date();
              if(preset==="today")return{from:iso(now),to:iso(now)};
              if(preset==="yesterday"){const y=new Date(now);y.setDate(y.getDate()-1);return{from:iso(y),to:iso(y)};}
              if(preset==="week"){const s=startOfWeek(now);const e=new Date(s);e.setDate(e.getDate()+6);return{from:iso(s),to:iso(e)};}
              if(preset==="lastweek"){const s=startOfWeek(now);s.setDate(s.getDate()-7);const e=new Date(s);e.setDate(e.getDate()+6);return{from:iso(s),to:iso(e)};}
              if(preset==="month"){const ym=monthOv||`${now.getFullYear()}-${pad(now.getMonth()+1)}`;const[yy,mm]=ym.split("-").map(Number);const s=new Date(yy,mm-1,1);const e=new Date(yy,mm,0);return{from:iso(s),to:iso(e)};}
              if(preset==="lastmonth"){const s=new Date(now.getFullYear(),now.getMonth()-1,1);const e=new Date(now.getFullYear(),now.getMonth(),0);return{from:iso(s),to:iso(e)};}
              if(preset==="year"){const yy=parseInt(yearOv)||now.getFullYear();const s=new Date(yy,0,1);const e=new Date(yy,11,31);return{from:iso(s),to:iso(e)};}
              if(preset==="lastyear"){const s=new Date(now.getFullYear()-1,0,1);const e=new Date(now.getFullYear()-1,11,31);return{from:iso(s),to:iso(e)};}
              if(preset==="all"){const dates=txs.map(t=>t.date);const minD=dates.length?dates.reduce((a,b)=>a<b?a:b):iso(now);return{from:minD,to:iso(now)};}
              return{from:ovExp.rfFrom||iso(new Date(now.getFullYear(),0,1)),to:ovExp.rfTo||iso(now)};
            };
            const allYearsList=(()=>{const now=new Date();const ys=new Set([now.getFullYear()]);txs.forEach(t=>ys.add(parseInt(t.date.slice(0,4))));return[...ys].sort((a,b)=>b-a);})();
            const MONTH_NAMES=["يناير","فبراير","مارس","أبريل","ماي","يونيو","يوليوز","غشت","شتنبر","أكتوبر","نونبر","دجنبر"];
            const YearMonthPicker=({year,month,onYear,onMonth,color})=>(
              <div className="no-print" style={{marginTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:month!==undefined?8:0}}>
                  <button onClick={()=>onYear(year-1)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>◀</button>
                  <select style={{...S.sel,flex:1,fontSize:13,padding:"7px 8px",textAlign:"center",fontWeight:800,color}} value={year} onChange={e=>onYear(parseInt(e.target.value))}>
                    {allYearsList.map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                  <button onClick={()=>onYear(year+1)} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>▶</button>
                </div>
                {month!==undefined&&<div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>{let m=month-1,y=year;if(m<0){m=11;y--;}onMonth(y,m);}} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>◀</button>
                  <select style={{...S.sel,flex:1,fontSize:13,padding:"7px 8px",textAlign:"center",fontWeight:800,color}} value={month} onChange={e=>onMonth(year,parseInt(e.target.value))}>
                    {MONTH_NAMES.map((mn,i)=><option key={i} value={i}>{mn}</option>)}
                  </select>
                  <button onClick={()=>{let m=month+1,y=year;if(m>11){m=0;y++;}onMonth(y,m);}} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>▶</button>
                </div>}
              </div>
            );
            const classifyTx=t=>{
              if(t.isAsset)return t.type==="expense"?"buy_assets":"sell_assets";
              if(t.isInvest){if(t.type==="expense")return"buy_invest";if((t.desc||"").startsWith("ربح"))return"invest_profit";return"sell_invest";}
              if(t.isLoan)return t.type==="expense"?"retire_out":"retire_in";
              if(t.isTransfer){if((t.desc||"").includes("طوارئ")||(t.desc||"").includes("إعاشة"))return"emergency_use";return"transfer";}
              if(t.pm==="تحويل")return"transfer";
              return t.type;
            };
            const txBucket=t=>{
              if(t.isAsset)return"assets";
              if(t.isInvest)return"investment";
              if(t.isLoan)return"retirement";
              if(t.isTransfer&&((t.desc||"").includes("طوارئ")||(t.desc||"").includes("إعاشة")))return"emergency";
              if(t.isTransfer||t.pm==="تحويل")return null;
              return"expenses";
            };
            const buildCatBreakdownFor=(tp,txList)=>(cats[tp]||[]).map(c=>{
              const cTxs=txList.filter(t=>t.type===tp&&t.catId===c.id);
              const amount=cTxs.reduce((s,t)=>s+t.amount,0);
              const subs=(c.subs||[]).map(s=>{
                const amt=cTxs.filter(t=>t.subId===s.id).reduce((sum,t)=>sum+t.amount,0);
                return{...s,amount:amt};
              }).filter(s=>s.amount>0).sort((a,b)=>b.amount-a.amount);
              return{...c,amount,count:cTxs.length,subs};
            }).filter(c=>c.amount>0).sort((a,b)=>b.amount-a.amount);
            const buckets=budgetSettings.buckets||[];
            const allAccList=allAcc;
            const gaugeOffset=(pct,circ)=>circ-(Math.max(0,Math.min(100,pct))/100)*circ;

            const BackBtn=({title})=>(
              <div style={{display:"grid",gridTemplateColumns:"40px 1fr 40px",alignItems:"center",marginBottom:2}} className="no-print">
                <button onClick={()=>setPage("dashboard")} style={{background:"#f1f5f9",border:"none",borderRadius:10,padding:"7px 10px",cursor:"pointer",fontSize:13}}>←</button>
                <div style={{fontSize:15,fontWeight:900,color:"#1a1a1a",textAlign:"center"}}>{title}</div>
                <div/>
              </div>
            );

            {
              const rfPeriod=ovExp.rfPeriod||"month";
              const rfAcc=ovExp.rfAcc||"all";
              const rfType=ovExp.rfType||"all";
              const rfBucket=ovExp.rfBucket||"all";
              const rfCats=ovExp.rfCats||[];
              const rfYear=ovExp.rfYear||new Date().getFullYear();
              const rfMonth=ovExp.rfMonth||`${new Date().getFullYear()}-${pad(new Date().getMonth()+1)}`;
              const range=getPresetRange(rfPeriod,rfYear,rfMonth);
              let baseTxs=txs.filter(t=>t.date>=range.from&&t.date<=range.to);
              if(rfAcc!=="all"){const accSel=allAccList.find(a=>a.key===rfAcc);if(accSel)baseTxs=baseTxs.filter(t=>JSON.stringify(t.ref)===JSON.stringify(accSel.ref));}
              if(rfType!=="all")baseTxs=baseTxs.filter(t=>classifyTx(t)===rfType);
              if(rfBucket!=="all")baseTxs=baseTxs.filter(t=>txBucket(t)===rfBucket);
              if(rfCats.length>0)baseTxs=baseTxs.filter(t=>rfCats.includes(t.catId));
              const isDefaultFilter=rfType==="all"&&rfBucket==="all";
              const flowTxs=isDefaultFilter?baseTxs.filter(t=>!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset):baseTxs;
              const totalIncome=flowTxs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
              const totalExpense=flowTxs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
              const netBalance=totalIncome-totalExpense;
              const wealthNow=totBal+totAst+totInv+totGiv-totOwd;
              const savingsRate=totalIncome>0?(netBalance/totalIncome*100):0;

              const totalIncAllTime=txs.filter(t=>t.type==="income"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);
              const getBucketSnap=b=>{
                const allocated=totalIncAllTime*(b.pct/100);
                if(b.type==="expenses"){const spent=txs.filter(t=>t.type==="expense"&&!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset).reduce((s,t)=>s+t.amount,0);return{allocated,spent,balance:allocated-spent};}
                if(b.type==="emergency"){const out=txs.filter(t=>t.type==="expense"&&t.isTransfer&&(t.desc||"").includes("إعاشة")).reduce((s,t)=>s+t.amount,0);return{allocated,spent:out,balance:allocated-out};}
                if(b.type==="assets"){const out=txs.filter(t=>t.type==="expense"&&t.isAsset).reduce((s,t)=>s+t.amount,0);const inB=txs.filter(t=>t.type==="income"&&t.isAsset).reduce((s,t)=>s+t.amount,0);return{allocated,spent:out,balance:allocated-out+inB};}
                if(b.type==="investment"){const out=txs.filter(t=>t.type==="expense"&&t.isInvest).reduce((s,t)=>s+t.amount,0);const inB=txs.filter(t=>t.type==="income"&&t.isInvest).reduce((s,t)=>s+t.amount,0);return{allocated,spent:out,balance:allocated-out+inB};}
                if(b.type==="retirement"){const out=loans.filter(l=>l.kind==="أعطيت").reduce((s,l)=>s+(l.remaining||0),0);return{allocated,spent:out,balance:allocated-out};}
                return{allocated,spent:0,balance:allocated};
              };
              const bucketSnaps=buckets.map(b=>({...b,...getBucketSnap(b)}));
              const expBkt2=bucketSnaps.find(b=>b.type==="expenses");
              const emgBkt=bucketSnaps.find(b=>b.type==="emergency");
              const invBkt=bucketSnaps.find(b=>b.type==="investment");
              const retBkt=bucketSnaps.find(b=>b.type==="retirement");
              const periodTxs=txs.filter(t=>t.date>=range.from&&t.date<=range.to);
              const emgUsage=periodTxs.filter(t=>t.isTransfer&&(t.desc||"").includes("إعاشة"));
              const emgUsedTotal=emgUsage.filter(t=>t.type==="income"&&(t.desc||"").includes("للميزانية")).reduce((s,t)=>s+t.amount,0);
              const totInvProfit=investments.reduce((s,i)=>s+(i.profit||0),0);
              const invROI=totInv>0?(totInvProfit/totInv*100):0;
              const retireGoal=budgetSettings.retireGoal||100000;
              const retirePct=retireGoal>0?Math.min((retBkt?.balance||0)/retireGoal*100,100):0;
              const topExpCatPeriod=buildCatBreakdownFor("expense",periodTxs.filter(t=>!t.isTransfer&&!t.isLoan&&!t.isInvest&&!t.isAsset))[0];
              const topAssetTxPeriod=[...periodTxs.filter(t=>t.isAsset)].sort((a,b)=>b.amount-a.amount)[0];
              const topInvTxPeriod=[...periodTxs.filter(t=>t.isInvest)].sort((a,b)=>b.amount-a.amount)[0];
              const topRetireTxPeriod=[...periodTxs.filter(t=>t.isLoan&&(t.loanKind||"أعطيت")==="أعطيت")].sort((a,b)=>b.amount-a.amount)[0];
              const expCatBreak=buildCatBreakdownFor("expense",flowTxs);
              const incCatBreak=buildCatBreakdownFor("income",flowTxs);
              const catTab=ovExp.catTab||"expense";
              const activeCatBreak=catTab==="expense"?expCatBreak:incCatBreak;
              const activeCatTotal=activeCatBreak.reduce((s,c)=>s+c.amount,0)||1;
              const accBreakdown=allAccList.map(a=>{
                const aTxs=flowTxs.filter(t=>JSON.stringify(t.ref)===JSON.stringify(a.ref));
                const amount=aTxs.reduce((s,t)=>s+t.amount,0);
                return{...a,amount,count:aTxs.length};
              }).filter(a=>a.amount>0).sort((a,b)=>b.amount-a.amount);
              const accTotal=accBreakdown.reduce((s,a)=>s+a.amount,0)||1;
              const healthPct=Math.max(0,Math.min(100,savingsRate));
              const healthColor=savingsRate>=20?"#10b981":savingsRate>=0?"#f59e0b":"#ef4444";
              const healthLabel=savingsRate>=20?"ادخار صحي":savingsRate>=0?"ادخار منخفض":"⚠️ عجز";
              const HERO_R=72,HERO_CIRC=2*Math.PI*HERO_R;
              const MINI_R=23,MINI_CIRC=2*Math.PI*MINI_R;
              const showDetails=!!ovExp.repDetails;
              const showFilters=!!ovExp.repFilters;
              const expandedCat=ovExp.expandedCat;
              const catList=[...(cats.expense||[]),...(cats.income||[])];
              const daysDiff=Math.max((new Date(range.to)-new Date(range.from))/86400000,1);
              const granularity=daysDiff<=31?"day":daysDiff<=370?"month":"year";
              const buildPeriods=()=>{
                const arr=[];let cur=new Date(range.from);const end=new Date(range.to);
                if(granularity==="day"){while(cur<=end&&arr.length<62){arr.push({key:iso(cur),label:cur.toLocaleDateString("ar-MA",{day:"2-digit",month:"2-digit"})});cur.setDate(cur.getDate()+1);}}
                else if(granularity==="month"){cur=new Date(cur.getFullYear(),cur.getMonth(),1);while(cur<=end&&arr.length<36){arr.push({key:`${cur.getFullYear()}-${pad(cur.getMonth()+1)}`,label:cur.toLocaleString("ar-MA",{month:"short",year:"2-digit"})});cur.setMonth(cur.getMonth()+1);}}
                else{cur=new Date(cur.getFullYear(),0,1);while(cur<=end&&arr.length<20){arr.push({key:String(cur.getFullYear()),label:String(cur.getFullYear())});cur.setFullYear(cur.getFullYear()+1);}}
                return arr;
              };
              const matchKey=d=>granularity==="day"?d:granularity==="month"?d.slice(0,7):d.slice(0,4);
              const periodsArr=buildPeriods();
              const cashFlowData=periodsArr.map(p=>{
                const pt=flowTxs.filter(t=>matchKey(t.date)===p.key);
                const inc=pt.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
                const exp=pt.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
                return{...p,دخل:inc,مصاريف:exp,صافي:inc-exp};
              });
              let running=0;
              const balanceEvoData=cashFlowData.map(p=>{running+=p.صافي;return{...p,الرصيد:running};});
              const topExpenses=[...flowTxs.filter(t=>t.type==="expense")].sort((a,b)=>b.amount-a.amount).slice(0,8);
              const pieData=bucketSnaps.map(b=>({name:b.name,value:Math.max(b.balance,0),color:b.color}));

              return <div id="reportsDashboard">
                <style>{`@media print{.no-print{display:none!important}body{background:white!important}}`}</style>
                <BackBtn title="📊 تقرير شامل"/>

                <div style={{...S.card,padding:"12px 14px"}} className="no-print">
                  <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                    {[["today","اليوم"],["month","الشهر"],["year","السنة"],["all","الكل"],["custom","بين تاريخين"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setOvExp(p=>({...p,rfPeriod:v}))} style={{...S.btn(rfPeriod===v?"#1a6b4a":"#f1f5f9",false),flexShrink:0,padding:"7px 13px",fontSize:11,color:rfPeriod===v?"white":"#64748b"}}>{l}</button>
                    ))}
                  </div>
                  {rfPeriod==="year"&&<YearMonthPicker year={rfYear} onYear={y=>setOvExp(p=>({...p,rfYear:y}))} color="#1a6b4a"/>}
                  {rfPeriod==="month"&&<YearMonthPicker year={parseInt(rfMonth.split("-")[0])} month={parseInt(rfMonth.split("-")[1])-1}
                    onYear={y=>setOvExp(p=>({...p,rfMonth:`${y}-${pad(parseInt(rfMonth.split("-")[1]))}`}))}
                    onMonth={(y,m)=>setOvExp(p=>({...p,rfMonth:`${y}-${pad(m+1)}`}))} color="#1a6b4a"/>}
                  {rfPeriod==="custom"&&<div style={{display:"flex",gap:8,alignItems:"center",marginTop:10}}>
                    <input style={{...S.inp,flex:1,padding:"8px 10px",fontSize:12,textAlign:"center"}} type="date" value={ovExp.rfFrom||""} onChange={e=>setOvExp(p=>({...p,rfFrom:e.target.value}))}/>
                    <span style={{fontSize:11,color:"#94a3b8"}}>→</span>
                    <input style={{...S.inp,flex:1,padding:"8px 10px",fontSize:12,textAlign:"center"}} type="date" value={ovExp.rfTo||""} onChange={e=>setOvExp(p=>({...p,rfTo:e.target.value}))}/>
                  </div>}
                </div>

                <div className="no-print" style={{...S.card,padding:"11px 14px",cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,repFilters:!p.repFilters}))}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>🔧 فلاتر إضافية (حساب/نوع/صندوق/تصنيف)</span>
                    <span style={{fontSize:11,color:"#94a3b8"}}>{showFilters?"▲":"▼"}</span>
                  </div>
                </div>
                {showFilters&&<div className="no-print" style={{...S.card,padding:"14px"}}>
                  <div style={{display:"flex",gap:8,marginBottom:10}}>
                    <select style={{...S.sel,flex:1,fontSize:12,padding:"8px 10px"}} value={rfAcc} onChange={e=>setOvExp(p=>({...p,rfAcc:e.target.value}))}>
                      <option value="all">كل الحسابات</option>
                      {allAccList.map(a=><option key={a.key} value={a.key}>{a.bn} - {a.name}</option>)}
                    </select>
                    <select style={{...S.sel,flex:1,fontSize:12,padding:"8px 10px"}} value={rfBucket} onChange={e=>setOvExp(p=>({...p,rfBucket:e.target.value}))}>
                      <option value="all">كل الصناديق</option>
                      {buckets.map(b=><option key={b.id} value={b.type}>{b.icon} {b.name}</option>)}
                    </select>
                  </div>
                  <select style={{...S.sel,fontSize:12,padding:"8px 10px",marginBottom:10}} value={rfType} onChange={e=>setOvExp(p=>({...p,rfType:e.target.value}))}>
                    <option value="all">كل أنواع المعاملات</option>
                    <option value="income">المداخل</option>
                    <option value="expense">المصاريف</option>
                    <option value="transfer">تحويل بين الحسابات</option>
                    <option value="buy_assets">شراء ممتلكات</option>
                    <option value="sell_assets">بيع ممتلكات</option>
                    <option value="buy_invest">شراء استثمار</option>
                    <option value="sell_invest">استرداد استثمار</option>
                    <option value="invest_profit">أرباح الاستثمار</option>
                    <option value="retire_out">مساهمة في التقاعد (سلف)</option>
                    <option value="retire_in">رجوع للتقاعد (تسديد)</option>
                    <option value="emergency_use">استخدام صندوق الطوارئ</option>
                  </select>
                  {catList.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {catList.map(c=>(
                      <button key={c.id} onClick={()=>setOvExp(p=>{const cur=p.rfCats||[];return{...p,rfCats:cur.includes(c.id)?cur.filter(x=>x!==c.id):[...cur,c.id]};})}
                        style={{...S.btn(rfCats.includes(c.id)?c.color:"#f1f5f9",false),padding:"5px 9px",fontSize:11,color:rfCats.includes(c.id)?"white":"#475569"}}>{c.icon} {c.name}</button>
                    ))}
                  </div>}
                </div>}

                <div style={{...S.card,textAlign:"center",padding:"22px 20px"}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#1a1a1a",marginBottom:8}}>مؤشر الصحة المالية</div>
                  <div style={{width:170,height:170,margin:"0 auto",position:"relative"}}>
                    <svg width="170" height="170" style={{transform:"rotate(-90deg)"}}>
                      <circle cx="85" cy="85" r={HERO_R} fill="none" stroke="#f1f5f9" strokeWidth="14"/>
                      <circle cx="85" cy="85" r={HERO_R} fill="none" stroke={healthColor} strokeWidth="14"
                        strokeDasharray={HERO_CIRC} strokeDashoffset={gaugeOffset(healthPct,HERO_CIRC)} strokeLinecap="round" style={{transition:"stroke-dashoffset .6s"}}/>
                    </svg>
                    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
                      <div style={{fontSize:34,fontWeight:900,color:healthColor}}>{savingsRate.toFixed(0)}%</div>
                      <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,marginTop:2}}>{healthLabel}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:14,paddingTop:14,borderTop:"1px solid #f1f5f9"}}>
                    <div><div style={{fontSize:15,fontWeight:900,color:"#10b981"}}>{fmt(totalIncome)}</div><div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>دخل</div></div>
                    <div><div style={{fontSize:15,fontWeight:900,color:"#ef4444"}}>{fmt(totalExpense)}</div><div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>مصروف</div></div>
                    <div><div style={{fontSize:15,fontWeight:900,color:netBalance>=0?"#3b82f6":"#ef4444"}}>{fmt(netBalance)}</div><div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>صافي</div></div>
                  </div>
                  <div style={{marginTop:12,fontSize:11,color:"#94a3b8"}}>💎 الثروة الكلية: <span style={{fontWeight:900,color:"#1a1a1a"}}>{fmt(wealthNow)}</span></div>
                </div>

                <div style={{fontSize:13,fontWeight:800,color:"#334155",margin:"4px 2px 8px"}}>الأقسام الخمسة</div>
                <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,marginBottom:6}}>
                  {bucketSnaps.map(b=>{
                    const base=b.type==="expenses"?b.spent:b.balance;
                    const gp=b.allocated>0?Math.min(base/b.allocated*100,100):0;
                    return(
                      <div key={b.id} style={{flex:"0 0 auto",width:104,background:"white",borderRadius:18,padding:"12px 8px",textAlign:"center",boxShadow:"0 3px 10px rgba(15,23,42,.06)"}}>
                        <div style={{width:56,height:56,margin:"0 auto 6px",position:"relative"}}>
                          <svg width="56" height="56" style={{transform:"rotate(-90deg)"}}>
                            <circle cx="28" cy="28" r={MINI_R} fill="none" stroke="#f1f5f9" strokeWidth="7"/>
                            <circle cx="28" cy="28" r={MINI_R} fill="none" stroke={b.color} strokeWidth="7" strokeDasharray={MINI_CIRC} strokeDashoffset={gaugeOffset(gp,MINI_CIRC)} strokeLinecap="round"/>
                          </svg>
                          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:19}}>{b.icon}</div>
                        </div>
                        <div style={{fontSize:11,fontWeight:800,color:"#1a1a1a"}}>{b.name}</div>
                        <div style={{fontSize:11,fontWeight:700,color:b.color,marginTop:2}}>{fmt(b.balance)}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{fontSize:13,fontWeight:800,color:"#334155",margin:"10px 2px 8px"}}>🏷️ حسب التصنيف</div>
                <div style={S.card}>
                  <div className="no-print" style={{display:"flex",gap:6,marginBottom:10}}>
                    <button onClick={()=>setOvExp(p=>({...p,catTab:"expense"}))} style={{...S.btn(catTab==="expense"?"#ef4444":"#f1f5f9",false),flex:1,padding:"7px",fontSize:12,color:catTab==="expense"?"white":"#64748b"}}>مصاريف</button>
                    <button onClick={()=>setOvExp(p=>({...p,catTab:"income"}))} style={{...S.btn(catTab==="income"?"#10b981":"#f1f5f9",false),flex:1,padding:"7px",fontSize:12,color:catTab==="income"?"white":"#64748b"}}>دخل</button>
                  </div>
                  {activeCatBreak.length===0&&<div style={{textAlign:"center",color:"#94a3b8",fontSize:12,padding:10}}>لا توجد بيانات فهاد الفترة</div>}
                  {activeCatBreak.map(c=>{
                    const pct=(c.amount/activeCatTotal*100);
                    const isOpen=expandedCat===c.id;
                    return(
                      <div key={c.id} style={{padding:"9px 0",borderBottom:"1px solid #f8fafc"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setOvExp(p=>({...p,expandedCat:isOpen?null:c.id}))}>
                          <div style={{width:34,height:34,borderRadius:10,background:c.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{c.icon}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,color:"#1a1a1a"}}><span>{c.name}</span><span style={{color:c.color}}>{fmt(c.amount)}</span></div>
                            <div style={{height:4,background:"#f1f5f9",borderRadius:3,marginTop:5,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:c.color,borderRadius:3}}/></div>
                            <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>{pct.toFixed(0)}% · {c.count} معاملة{c.subs.length>0?(isOpen?" · إخفاء ▲":" · عرض الفروع ▾"):""}</div>
                          </div>
                        </div>
                        {isOpen&&c.subs.length>0&&<div style={{marginRight:44,marginTop:4,paddingTop:4}}>
                          {c.subs.map(s=>(
                            <div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:11,color:"#64748b",borderBottom:"1px dashed #f1f5f9"}}>
                              <span>{s.name}</span><span>{fmt(s.amount)}</span>
                            </div>
                          ))}
                        </div>}
                      </div>
                    );
                  })}
                </div>

                <div style={{fontSize:13,fontWeight:800,color:"#334155",margin:"14px 2px 8px"}}>🏦 حسب الحساب</div>
                <div style={S.card}>
                  {accBreakdown.length===0&&<div style={{textAlign:"center",color:"#94a3b8",fontSize:12,padding:10}}>لا توجد بيانات فهاد الفترة</div>}
                  {accBreakdown.map(a=>{
                    const pct=(a.amount/accTotal*100);
                    return(
                      <div key={a.key} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid #f8fafc"}}>
                        <div style={{width:34,height:34,borderRadius:10,background:(a.color||"#10b981")+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{a.type==="نقدية"?"💵":"🏦"}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,color:"#1a1a1a"}}><span>{a.bn} — {a.name}</span><span style={{color:"#1a6b4a"}}>{fmt(a.amount)}</span></div>
                          <div style={{height:4,background:"#f1f5f9",borderRadius:3,marginTop:5,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a6b4a",borderRadius:3}}/></div>
                          <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>{pct.toFixed(0)}% من الحركة · {a.count} معاملة</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="no-print" style={{...S.card,padding:"12px 14px",textAlign:"center",cursor:"pointer",marginTop:14}} onClick={()=>setOvExp(p=>({...p,repDetails:!p.repDetails}))}>
                  <span style={{fontSize:13,fontWeight:700,color:"#475569"}}>📈 عرض الرسوم والتحليلات المتقدمة {showDetails?"▲":"▼"}</span>
                </div>

                {showDetails&&<>
                {cashFlowData.length>0&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>💵 التدفق النقدي</div>
                  <div style={{height:220}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="label" fontSize={10}/>
                        <YAxis fontSize={10}/>
                        <Tooltip formatter={v=>fmt(v)}/>
                        <Legend/>
                        <Bar dataKey="دخل" fill="#10b981" radius={[4,4,0,0]}/>
                        <Bar dataKey="مصاريف" fill="#ef4444" radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>}
                {balanceEvoData.length>0&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>📉 تطور صافي التدفق خلال الفترة</div>
                  <div style={{height:200}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={balanceEvoData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="label" fontSize={10}/>
                        <YAxis fontSize={10}/>
                        <Tooltip formatter={v=>fmt(v)}/>
                        <Line type="monotone" dataKey="الرصيد" stroke="#6366f1" strokeWidth={2} dot={false}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>}
                {topExpenses.length>0&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>🔝 أعلى المصروفات</div>
                  {topExpenses.map(t=>{const c=gc("expense",t.catId);return(
                    <div key={t.id} className="tx">
                      <div style={{width:32,height:32,borderRadius:9,background:"#ef444420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{c?.icon||"💸"}</div>
                      <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc||c?.name||"—"}</div><div style={{fontSize:10,color:"#64748b"}}>{t.date}</div></div>
                      <span style={{fontSize:13,fontWeight:700,color:"#ef4444"}}>{fmt(t.amount)}</span>
                    </div>
                  );})}
                </div>}
                {pieData.some(p=>p.value>0)&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:6}}>🧩 توزيع الأموال بين الصناديق</div>
                  <div style={{height:200}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={p=>fmt(p.value)}>
                          {pieData.map((p,i)=><Cell key={i} fill={p.color}/>)}
                        </Pie>
                        <Tooltip formatter={v=>fmt(v)}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>}

                {expBkt2&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>🛒 الميزانية</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["مخصص",expBkt2.allocated,"#3b82f6"],["مصروف",expBkt2.spent,"#ef4444"],["الحالي",expBkt2.balance,expBkt2.balance>=0?"#10b981":"#ef4444"],["نسبة الاستهلاك",expBkt2.allocated>0?(expBkt2.spent/expBkt2.allocated*100).toFixed(0)+"%":"0%","#f59e0b"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,minWidth:80,background:"#f8fafc",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:9,color:"#64748b"}}>{l}</div><div style={{fontSize:12,fontWeight:900,color:c}}>{typeof v==="number"?fmt(v):v}</div></div>
                    ))}
                  </div>
                  {topExpCatPeriod&&<div style={{marginTop:8,fontSize:11,color:"#64748b"}}>🔝 أهم تصنيف فالفترة: <b style={{color:"#1a1a1a"}}>{topExpCatPeriod.icon} {topExpCatPeriod.name}</b> — {fmt(topExpCatPeriod.amount)}</div>}
                </div>}

                {emgBkt&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>🚨 صندوق الطوارئ</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["الرصيد الحالي",emgBkt.balance,"#10b981"],["مرات الاستخدام (الفترة)",emgUsage.length,"#f97316"],["المستخدم (الفترة)",emgUsedTotal,"#ef4444"],["نسبة الاعتماد",emgBkt.allocated>0?(emgUsedTotal/emgBkt.allocated*100).toFixed(0)+"%":"0%","#f97316"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,minWidth:80,background:"#f8fafc",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:9,color:"#64748b"}}>{l}</div><div style={{fontSize:12,fontWeight:900,color:c}}>{typeof v==="number"?fmt(v):v}</div></div>
                    ))}
                  </div>
                </div>}

                <div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>🏠 الممتلكات</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                    {[["العدد",assets.length,"#14b8a6"],["القيمة الإجمالية",totAst,"#14b8a6"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,minWidth:80,background:"#f8fafc",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:9,color:"#64748b"}}>{l}</div><div style={{fontSize:12,fontWeight:900,color:c}}>{typeof v==="number"&&l!=="العدد"?fmt(v):v}</div></div>
                    ))}
                  </div>
                  {topAssetTxPeriod&&<div style={{marginBottom:8,fontSize:11,color:"#64748b"}}>🔝 أهم حركة فالفترة: <b style={{color:"#1a1a1a"}}>{topAssetTxPeriod.desc}</b> — {fmt(topAssetTxPeriod.amount)}</div>}
                  {assets.slice(0,6).map(a=>(
                    <div key={a.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f1f5f9",fontSize:12}}>
                      <span>{a.name}</span><span style={{fontWeight:700,color:"#14b8a6"}}>{fmt(a.value)}</span>
                    </div>
                  ))}
                </div>

                {invBkt&&<div style={S.card}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a",marginBottom:8}}>📈 الاستثمار</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["رأس المال",totInv,"#8b5cf6"],["الأرباح",totInvProfit,totInvProfit>=0?"#10b981":"#ef4444"],["ROI",invROI.toFixed(1)+"%","#8b5cf6"],["نسبة النمو",invBkt.allocated>0?((invBkt.balance/invBkt.allocated-1)*100).toFixed(1)+"%":"0%","#8b5cf6"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,minWidth:80,background:"#f8fafc",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:9,color:"#64748b"}}>{l}</div><div style={{fontSize:12,fontWeight:900,color:c}}>{typeof v==="number"?fmt(v):v}</div></div>
                    ))}
                  </div>
                  {topInvTxPeriod&&<div style={{marginTop:8,fontSize:11,color:"#64748b"}}>🔝 أهم حركة فالفترة: <b style={{color:"#1a1a1a"}}>{topInvTxPeriod.desc}</b> — {fmt(topInvTxPeriod.amount)}</div>}
                </div>}

                {retBkt&&<div style={S.card}>
                  <div style={{...S.row,marginBottom:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#1a1a1a"}}>🏦 التقاعد</div>
                    <input className="no-print" type="number" defaultValue={retireGoal} style={{width:100,padding:"4px 8px",fontSize:11,border:"1.5px solid #e2e8f0",borderRadius:8,textAlign:"center"}}
                      onBlur={e=>{const v=parseFloat(e.target.value)||0;const nb={...budgetSettings,retireGoal:v};setBudgetSettings(nb);_save('budgetSettings',nb);}} placeholder="الهدف"/>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["الرصيد الحالي",retBkt.balance,"#6366f1"],["الهدف",retireGoal,"#6366f1"],["نسبة التحقيق",retirePct.toFixed(0)+"%","#10b981"],["الباقي",Math.max(retireGoal-retBkt.balance,0),"#f97316"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,minWidth:80,background:"#f8fafc",borderRadius:10,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:9,color:"#64748b"}}>{l}</div><div style={{fontSize:12,fontWeight:900,color:c}}>{typeof v==="number"?fmt(v):v}</div></div>
                    ))}
                  </div>
                  {topRetireTxPeriod&&<div style={{marginTop:8,fontSize:11,color:"#64748b"}}>🔝 أهم حركة فالفترة: <b style={{color:"#1a1a1a"}}>{topRetireTxPeriod.desc}</b> — {fmt(topRetireTxPeriod.amount)}</div>}
                </div>}
                </>}
              </div>;
            }

            return null;
          }

          return null;
        })()}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",background:"rgba(255,255,255,0.85)",borderTop:"1px solid rgba(226,232,240,0.5)",display:"flex",padding:"8px 4px",zIndex:50,backdropFilter:"blur(20px)",boxShadow:"0 -2px 20px rgba(15,23,42,0.08)"}}>
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
                {modal==="addInvest"&&"📈 إضافة استثمار"}
                {modal==="addBudget"&&"إضافة ميزانية"}
                {modal==="addSaving"&&"هدف ادخار جديد"}
                {modal==="dep"&&"إضافة للادخار"}
                {modal==="budgetSettings"&&"⚙️ إعدادات الميزانية"}
                {modal==="changePw"&&"تغيير كلمة السر"}
                {modal==="returnLoan"&&"رجوع سلفة"}
              </h3>
              <button onClick={cm} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><X size={20}/></button>
            </div>

            {(modal==="addTx"||modal==="edTx")&&<div style={S.col}>
              <div style={{padding:"8px 14px",background:form.txType==="income"?"#10b98122":"#ef444422",borderRadius:10,marginBottom:4,textAlign:"center",fontWeight:700,fontSize:14,color:form.txType==="income"?"#10b981":"#ef4444"}}>
                {modal==="addTx"?(form.txType==="income"?"🟢 إضافة دخل":form.txType==="invest"?"📈 إضافة استثمار":form.txType==="retire"?"🏦 التقاعد":form.txType==="emergency"?"🚨 الطوارئ":"🔴 إضافة مصروف"):"✏️ تعديل المعاملة"}
              </div>
              <input style={S.num} placeholder="0.00" type="number" value={modal==="addTx"?form.amount||"":ei?.amount||""} onChange={e=>modal==="addTx"?F("amount",e.target.value):setEi(p=>({...p,amount:e.target.value}))} step="0.01"/>
              <select style={S.sel} value={modal==="addTx"?form.catId||"":ei?.catId||""} onChange={e=>{if(modal==="addTx"){F("catId",e.target.value);F("subId","");}else setEi(p=>({...p,catId:e.target.value,subId:""}));}}>
                <option value="">اختر التصنيف</option>
                {cats[modal==="addTx"?(form.txType||"expense"):(ei?.type||"expense")].map(c=><option key={c.id} value={c.id}>{c.ci?"📷":c.icon} {c.name}</option>)}
              </select>
              {(()=>{const cid=parseInt(modal==="addTx"?form.catId:ei?.catId);const cat=gc(modal==="addTx"?(form.txType||"expense"):(ei?.type||"expense"),cid);return cat?.subs?.length>0?<select style={S.sel} value={modal==="addTx"?form.subId||"":ei?.subId||""} onChange={e=>{if(modal==="addTx")F("subId",e.target.value);else setEi(p=>({...p,subId:e.target.value}));}}><option value="">⚠️ الفرع (إجباري)</option>{cat.subs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>:null;})()}
              {modal==="addTx"&&(form.pm||"نقدي")!=="كريدي"&&(form.txType||"expense")!=="income"&&<AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#6366f1"
                accList={form.txType==="invest"?getBucketAccs("investment"):form.txType==="retire"?getBucketAccs("retirement"):form.txType==="emergency"?getBucketAccs("emergency"):form.txType==="assets_buy"?getBucketAccs("assets"):getBucketAccs("expenses")}/>}
              {modal==="addTx"&&(form.txType||"expense")==="income"&&<AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#10b981"/>}
              <input style={S.inp} placeholder="الوصف" value={modal==="addTx"?form.desc||"":ei?.desc||""} onChange={e=>modal==="addTx"?F("desc",e.target.value):setEi(p=>({...p,desc:e.target.value}))}/>
              <input style={S.inp} type="date" value={modal==="addTx"?form.date||new Date().toISOString().split("T")[0]:ei?.date||""} onChange={e=>modal==="addTx"?F("date",e.target.value):setEi(p=>({...p,date:e.target.value}))}/>
              {(modal==="addTx"?(form.txType||"expense"):ei?.type)==="expense"&&<PmBtns val={modal==="addTx"?form.pm||"نقدي":ei?.pm||"نقدي"} onChange={v=>modal==="addTx"?F("pm",v):setEi(p=>({...p,pm:v}))}/>}
              <button style={S.btn(modal==="addTx"?"#10b981":"#6366f1")} onClick={modal==="addTx"?addTx:saveTxEdit}>حفظ</button>
            </div>}

            {(modal==="addMCat"||modal==="edMCat")&&<div style={S.col}>
              <input style={S.inp} placeholder="اسم التصنيف" defaultValue={modal==="edMCat"?ei?.name:""} onChange={e=>modal==="addMCat"?F("cn",e.target.value):setEi(p=>({...p,name:e.target.value}))}/>
              <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>الأيقونة:</div>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div>
                  <div className="iu" style={{width:52,height:52}} onClick={()=>(modal==="addMCat"?iRef:eiRef).current.click()}>
                    {(modal==="addMCat"?form.ci:ei?.ci)?<img src={modal==="addMCat"?form.ci:ei.ci} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<><Camera size={16} color="#64748b"/><div style={{fontSize:9,color:"#64748b",marginTop:2}}>تحميل</div></>}
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
              <div style={{padding:"10px 14px",background:"#f8fafc",borderRadius:10,fontSize:13,color:"#475569"}}>الحالي: <strong style={{color:"#1a1a1a"}}>{ei.name}</strong></div>
              <input style={S.inp} placeholder="الاسم الجديد" defaultValue={ei.name} onChange={e=>setEi(p=>({...p,newName:e.target.value}))}/>
              <button style={S.btn()} onClick={()=>{edSCat(ei.catType,ei.catId,ei.id,ei.newName||ei.name);cm();}}>حفظ</button>
            </div>}

            {modal==="addBank"&&<div style={S.col}><input style={S.inp} placeholder="اسم البنك" value={form.name||""} onChange={e=>F("name",e.target.value)}/><input style={S.inp} placeholder="العنوان" value={form.addr||""} onChange={e=>F("addr",e.target.value)}/><button style={S.btn()} onClick={addBank}>حفظ</button></div>}
            {modal==="addBAcc"&&<div style={S.col}><input style={S.inp} placeholder="اسم الحساب" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">نوع الحساب</option>{["جاري","توفير","استثماري","راتب","أعمال"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="الرصيد" type="number" value={form.bal||""} onChange={e=>F("bal",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn()} onClick={addBAcc}>حفظ</button></div>}
            {modal==="edBAcc"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["جاري","توفير","استثماري","راتب","أعمال"].map(t=><option key={t} value={t}>{t}</option>)}</select><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div>
              <div style={{background:"#fef3c7",border:"1px solid #f59e0b33",borderRadius:10,padding:10,fontSize:11,color:"#92400e",marginBottom:4}}>⚠️ تصحيح الرصيد يدوياً — استعملو فقط لتصحيح الأخطاء، ماشي بدل المعاملات العادية</div>
              <input style={S.inp} type="number" placeholder="الرصيد الحالي" defaultValue={ei.balance} onChange={e=>setEi(p=>({...p,balance:parseFloat(e.target.value)||0}))}/>
              <button style={S.btn()} onClick={()=>{edBAcc(ei._bid,ei.id,{name:ei.name,type:ei.type,color:ei.color,balance:ei.balance});cm();}}>حفظ</button></div>}
            {modal==="addCash"&&<div style={S.col}><input style={S.inp} placeholder="الاسم" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">النوع</option>{["نقدية يومية","خزنة","صندوق","مال الجيب"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="الرصيد" type="number" value={form.bal||""} onChange={e=>F("bal",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn("#f59e0b")} onClick={addCash}>حفظ</button></div>}
            {modal==="edCash"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["نقدية يومية","خزنة","صندوق","مال الجيب"].map(t=><option key={t} value={t}>{t}</option>)}</select><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div>
              <div style={{background:"#fef3c7",border:"1px solid #f59e0b33",borderRadius:10,padding:10,fontSize:11,color:"#92400e",marginBottom:4}}>⚠️ تصحيح الرصيد يدوياً — استعملو فقط لتصحيح الأخطاء، ماشي بدل المعاملات العادية</div>
              <input style={S.inp} type="number" placeholder="الرصيد الحالي" defaultValue={ei.balance} onChange={e=>setEi(p=>({...p,balance:parseFloat(e.target.value)||0}))}/>
              <button style={S.btn("#f59e0b")} onClick={()=>{setCash(p=>p.map(x=>x.id===ei.id?{...x,...ei}:x));cm();}}>حفظ</button></div>}
            {modal==="addAst"&&<div style={S.col}><input style={S.inp} placeholder="الاسم" value={form.name||""} onChange={e=>F("name",e.target.value)}/><select style={S.sel} value={form.type||""} onChange={e=>F("type",e.target.value)}><option value="">النوع</option>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} placeholder="ملاحظة (اختياري)" value={form.val||""} onChange={e=>F("val",e.target.value)}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${form.color===c?" sl":""}`} style={{background:c}} onClick={()=>F("color",c)}/>)}</div><button style={S.btn("#14b8a6")} onClick={addAst}>حفظ</button></div>}
            {modal==="edAst"&&ei&&<div style={S.col}><input style={S.inp} defaultValue={ei.name} onChange={e=>setEi(p=>({...p,name:e.target.value}))}/><select style={S.sel} defaultValue={ei.type} onChange={e=>setEi(p=>({...p,type:e.target.value}))}>{["عقار","سيارة","ذهب","أرض","معدات","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}</select><input style={S.inp} type="number" defaultValue={ei.value} onChange={e=>setEi(p=>({...p,value:parseFloat(e.target.value)}))}/><div style={{display:"flex",gap:8}}>{PAL.slice(0,6).map(c=><div key={c} className={`cd${ei.color===c?" sl":""}`} style={{background:c}} onClick={()=>setEi(p=>({...p,color:c}))}/>)}</div><button style={S.btn("#14b8a6")} onClick={()=>{setAssets(p=>p.map(x=>x.id===ei.id?{...x,...ei}:x));cm();}}>حفظ</button></div>}

            {modal==="addLoan"&&<div style={S.col}>
              <div style={{display:"flex",gap:8}}>{["أعطيت","أخذت"].map(k=><button key={k} onClick={()=>F("kind",k)} style={{flex:1,padding:10,border:"2px solid",borderColor:form.kind===k?(k==="أعطيت"?"#10b981":"#ef4444"):"#e8e8e4",borderRadius:10,background:form.kind===k?(k==="أعطيت"?"#10b98122":"#ef444422"):"transparent",color:form.kind===k?(k==="أعطيت"?"#10b981":"#ef4444"):"#64748b",fontFamily:"Tajawal",fontWeight:700,cursor:"pointer",fontSize:13}}>{k}</button>)}</div>
              <input style={S.inp} placeholder="الشخص / الجهة" value={form.person||""} onChange={e=>F("person",e.target.value)}/>
              <input style={S.inp} placeholder="المبلغ" type="number" value={form.amount||""} onChange={e=>F("amount",e.target.value)}/>
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#6366f1"/>
              <div style={{fontSize:11,color:"#6366f1",marginTop:-4,fontWeight:600}}>{form.kind==="أعطيت"?"↓ سيتقطع المبلغ من الحساب":"↑ سيضاف المبلغ للحساب"}</div>
              <input style={S.inp} placeholder="ملاحظة" value={form.note||""} onChange={e=>F("note",e.target.value)}/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <div style={{display:"flex",gap:16}}>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!form.wi} onChange={e=>F("wi",e.target.checked)}/> فائدة</label>
                <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!form.inst} onChange={e=>F("inst",e.target.checked)}/> أقساط</label>
              </div>
              {form.wi&&<input style={S.inp} placeholder="نسبة الفائدة %" type="number" value={form.irate||""} onChange={e=>F("irate",e.target.value)}/>}
              {form.inst&&<input style={S.inp} placeholder="القسط الشهري" type="number" value={form.minst||""} onChange={e=>F("minst",e.target.value)}/>}
              <div style={{fontSize:11,color:"#64748b",marginTop:4}}>🔔 تذكير السداد (اختياري)</div>
              <input style={S.inp} type="date" value={form.remindDate||""} onChange={e=>F("remindDate",e.target.value)}/>
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
                <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>📱 جهة استرجاع كلمة السر</div>
                <input style={S.inp} type="text" placeholder="إيميل أو رقم الهاتف" value={recoveryContact}
                  onChange={e=>setRecoveryContact(e.target.value)}/>
                <div style={{fontSize:10,color:"#64748b",marginTop:4}}>تستعمل للتذكير بكلمة السر عند النسيان</div>
              </div>
            </div>}

            {modal==="transfer"&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#6366f122",borderRadius:10,fontSize:14,color:"#6366f1",fontWeight:700,textAlign:"center"}}>⇄ تحويل بين الحسابات</div>
              <div><div style={{fontSize:12,color:"#475569",marginBottom:6}}>من حساب:</div>
              <AccPicker value={form.fromKey} onChange={v=>F("fromKey",v)} border="#6366f1" pickerKey="fromKey"/></div>
              <div style={{textAlign:"center",fontSize:24,color:"#6366f1"}}>↓</div>
              <div><div style={{fontSize:12,color:"#475569",marginBottom:6}}>إلى حساب:</div>
              <AccPicker value={form.toKey} onChange={v=>F("toKey",v)} border="#6366f1" pickerKey="toKey" accList={allAcc.filter(a=>a.key!==form.fromKey)}/></div>
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
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#14b8a6"/>
              <input style={S.inp} placeholder="ملاحظة" value={form.astNote||""} onChange={e=>F("astNote",e.target.value)}/>
              <input style={S.inp} type="date" value={form.astDate||new Date().toISOString().split("T")[0]} onChange={e=>F("astDate",e.target.value)}/>
              <button style={S.btn("#14b8a6")} onClick={()=>{
                if(!form.astName||!form.astAmt||!form.akey){showErr("⛔ أكمل البيانات");return;}
                const amt=parseFloat(form.astAmt);
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc){showErr("⛔ اختر الحساب");return;}
                if(amt>(acc.balance||0)){showErr("⛔ الرصيد غير كافي — الرصيد المتاح: "+fmt(acc.balance||0));return;}
                const astBal=getBucketBalanceLive("assets");
                if(astBal!==null&&amt>astBal){showErr(`⛔ قسم الممتلكات ناقص — المتاح: ${fmt(Math.max(astBal,0))}`);return;}
                updBal(acc.ref,amt,"expense","add");
                setAssets(p=>[...p,{id:uid(),type:form.astType||"أخرى",name:form.astName,value:amt,note:form.astNote||"",color:"#14b8a6"}]);
                setTxs(p=>[{id:uid(),type:"expense",amount:amt,catId:null,subId:null,desc:`شراء ممتلك: ${form.astName}`,date:new Date().toISOString().split("T")[0],pm:"نقدي",ref:acc.ref,isAsset:true},...p]);
                cm();
              }}>تأكيد الشراء 🏠</button>
            </div>}

            {modal==="addInvest"&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#10b98115",borderRadius:10,fontSize:13,color:"#1a6b4a",fontWeight:700,textAlign:"center"}}>📈 إضافة استثمار — لن يحسب في المصاريف</div>
              <input style={S.inp} placeholder="اسم الاستثمار" value={form.invName||""} onChange={e=>F("invName",e.target.value)}/>
              <select style={S.sel} value={form.invType||""} onChange={e=>F("invType",e.target.value)}>
                <option value="">نوع الاستثمار</option>
                {["تجارة","عقار","أسهم","ذهب","شركة","عملة رقمية","أخرى"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <input style={S.num} placeholder="0.00" type="number" step="0.01" value={form.amount||""} onChange={e=>F("amount",e.target.value)}/>
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#10b981"/>
              <input style={S.inp} placeholder="ملاحظة (اختياري)" value={form.note||""} onChange={e=>F("note",e.target.value)}/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <button style={S.btn("#10b981")} onClick={()=>{
                if(!form.invName){showErr("⛔ خاصك تدخل اسم الاستثمار");return;}
                const amt=parseFloat(form.amount);
                if(!amt||amt<=0){showErr("⛔ خاصك تدخل المبلغ");return;}
                if(!form.akey){showErr("⛔ خاصك تختار الحساب");return;}
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc){showErr("⛔ الحساب غير موجود");return;}
                if(amt>(acc.balance||0)){showErr("⛔ الرصيد غير كافي — المتاح: "+fmt(acc.balance||0));return;}
                const invBal=getBucketBalanceLive("investment");
                if(invBal!==null&&amt>invBal){showErr(`⛔ قسم الاستثمار ناقص — المتاح: ${fmt(Math.max(invBal,0))}`);return;}
                const invId=uid();
                const date=form.date||new Date().toISOString().split("T")[0];
                // زيادة record مستقل للاستثمار (بحال الممتلكات)
                setInvestments(p=>[...p,{
                  id:invId,
                  name:form.invName,
                  type:form.invType||"أخرى",
                  amount:amt,
                  profit:0,
                  date,
                  note:form.note||""
                }]);
                // تسجيل معاملة isInvest:true
                setTxs(p=>[{
                  id:uid(),type:"expense",amount:amt,catId:null,subId:null,
                  desc:`استثمار: ${form.invName}`,date,
                  pm:form.invType||"استثمار",ref:acc.ref,
                  isAsset:false,isInvest:true,
                  invId,invName:form.invName,invType:form.invType||"",note:form.note||""
                },...p]);
                // تحيد المبلغ من الحساب (بحال الممتلكات)
                updBal(acc.ref,amt,"expense","add");
                cm();showErr("✅ تم تسجيل الاستثمار");
              }}>تأكيد الاستثمار 📈</button>
            </div>}
            {modal==="addProfit"&&ei&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#10b98115",borderRadius:10,fontSize:13,color:"#1a6b4a",fontWeight:700,textAlign:"center"}}>💰 تسجيل ربح — {ei.name}</div>
              <div style={{fontSize:12,color:"#64748b",textAlign:"center"}}>رأس المال: {fmt(ei.amount)} | أرباح سابقة: {fmt(ei.profit||0)}</div>
              <input style={S.num} placeholder="مبلغ الربح/العائد" type="number" step="0.01" value={form.profitAmt||""} onChange={e=>F("profitAmt",e.target.value)}/>
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#10b981"/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <input style={S.inp} placeholder="ملاحظة (اختياري)" value={form.note||""} onChange={e=>F("note",e.target.value)}/>
              <button style={S.btn("#10b981")} onClick={()=>{
                const profit=parseFloat(form.profitAmt);
                if(!profit||profit<=0){showErr("⛔ أدخل مبلغ الربح");return;}
                if(!form.akey){showErr("⛔ اختر الحساب اللي سيدخل فيه الربح");return;}
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc)return;
                const date=form.date||new Date().toISOString().split("T")[0];
                // تحديث الأرباح فالـ record
                setInvestments(p=>p.map(i=>i.id===ei.id?{...i,profit:(i.profit||0)+profit}:i));
                // تسجيل معاملة دخل isInvest:true
                setTxs(p=>[{id:uid(),type:"income",amount:profit,catId:null,subId:null,
                  desc:`ربح: ${ei.name}`,date,pm:"استثمار",ref:acc.ref,
                  isAsset:false,isInvest:true,invId:ei.id,invName:ei.name,note:form.note||""
                },...p]);
                // دخول الربح للحساب
                updBal(acc.ref,profit,"income","add");
                cm();showErr("✅ تم تسجيل الربح وإضافته للحساب");
              }}>تأكيد الربح 💰</button>
            </div>}

            {modal==="returnInvest"&&ei&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#6366f115",borderRadius:10,fontSize:13,color:"#6366f1",fontWeight:700,textAlign:"center"}}>🏦 استرداد رأس المال — {ei.name}</div>
              <div style={{fontSize:12,color:"#64748b",textAlign:"center"}}>رأس المال: {fmt(ei.amount)}</div>
              <input style={S.num} placeholder="المبلغ المسترد" type="number" step="0.01" value={form.returnAmt||String(ei.amount)} onChange={e=>F("returnAmt",e.target.value)}/>
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#6366f1"/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <button style={S.btn("#6366f1")} onClick={()=>{
                const returnAmt=parseFloat(form.returnAmt||ei.amount);
                if(!returnAmt||returnAmt<=0){showErr("⛔ أدخل المبلغ المسترد");return;}
                if(!form.akey){showErr("⛔ اختر الحساب");return;}
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc)return;
                const date=form.date||new Date().toISOString().split("T")[0];
                // تسجيل معاملة دخل استرداد
                setTxs(p=>[{id:uid(),type:"income",amount:returnAmt,catId:null,subId:null,
                  desc:`استرداد: ${ei.name}`,date,pm:"استثمار",ref:acc.ref,
                  isAsset:false,isInvest:true,invId:ei.id,invName:ei.name,note:""
                },...p]);
                // دخول المبلغ للحساب
                updBal(acc.ref,returnAmt,"income","add");
                // تحديث رأس المال
                setInvestments(p=>p.map(i=>i.id===ei.id?{...i,amount:Math.max(0,i.amount-returnAmt)}:i));
                cm();showErr("✅ تم الاسترداد وإضافته للحساب");
              }}>تأكيد الاسترداد 🏦</button>
            </div>}

            {modal==="sellAst"&&ei&&<div style={S.col}>
              <div style={{padding:"10px 14px",background:"#14b8a615",borderRadius:10,fontSize:13,color:"#14b8a6",fontWeight:700,textAlign:"center"}}>🏷️ بيع ممتلك — {ei.name}</div>
              <div style={{fontSize:12,color:"#64748b",textAlign:"center"}}>قيمة الشراء: {fmt(ei.value)}</div>
              <input style={S.num} placeholder="سعر البيع" type="number" step="0.01" value={form.sellAmt||""} onChange={e=>F("sellAmt",e.target.value)}/>
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#14b8a6"/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              {(()=>{
                const sellAmt=parseFloat(form.sellAmt||0);
                const diff=sellAmt-ei.value;
                if(!form.sellAmt)return null;
                return <div style={{padding:"8px 12px",background:diff>=0?"#10b98115":"#ef444415",borderRadius:8,fontSize:12,fontWeight:700,color:diff>=0?"#10b981":"#ef4444",textAlign:"center"}}>
                  {diff>=0?"💚 ربح: ":"🔴 خسارة: "}{fmt(Math.abs(diff))} د.م
                </div>;
              })()}
              <button style={S.btn("#14b8a6")} onClick={()=>{
                const sellAmt=parseFloat(form.sellAmt);
                if(!sellAmt||sellAmt<=0){showErr("⛔ أدخل سعر البيع");return;}
                if(!form.akey){showErr("⛔ اختر الحساب");return;}
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc)return;
                const date=form.date||new Date().toISOString().split("T")[0];
                const diff=sellAmt-ei.value;
                // رجوع المبلغ للحساب
                updBal(acc.ref,sellAmt,"income","add");
                // تسجيل معاملة رجوع isAsset
                setTxs(p=>[{id:uid(),type:"income",amount:sellAmt,catId:null,subId:null,
                  desc:`بيع: ${ei.name}`,date,pm:"بيع ممتلك",ref:acc.ref,
                  isAsset:true,isTransfer:false,isLoan:false,isInvest:false,note:""
                },...p]);
                // إذا كاين ربح → معاملة دخل عادي
                if(diff>0){
                  setTxs(p=>[{id:uid(),type:"income",amount:diff,catId:null,subId:null,
                    desc:`ربح بيع: ${ei.name}`,date,ref:acc.ref,
                    isAsset:false,isTransfer:false,isLoan:false,isInvest:false,note:"",pm:""
                  },...p]);
                }
                // إذا كاينة خسارة → معاملة مصروف عادي
                if(diff<0){
                  setTxs(p=>[{id:uid(),type:"expense",amount:Math.abs(diff),catId:null,subId:null,
                    desc:`خسارة بيع: ${ei.name}`,date,ref:acc.ref,
                    isAsset:false,isTransfer:false,isLoan:false,isInvest:false,note:"",pm:""
                  },...p]);
                }
                // حذف الممتلك من القائمة
                setAssets(p=>p.filter(a=>a.id!==ei.id));
                cm();showErr(`✅ تم البيع — ${diff>=0?"ربح":"خسارة"}: ${fmt(Math.abs(diff))}`);
              }}>تأكيد البيع 🏷️</button>
            </div>}

            {modal==="returnLoan"&&ei&&<div style={S.col}>
              <div style={{padding:"12px 14px",background:"#f5f5f0",borderRadius:10,fontSize:13}}>
                <div style={{color:"#64748b",marginBottom:4}}>{ei.kind==="أعطيت"?"رجوع سلفة من:":"تسديد لـ:"}</div>
                <div style={{fontWeight:700,fontSize:16,color:"#1a1a1a"}}>{ei.person}</div>
                <div style={{color:"#1a6b4a",marginTop:4}}>المتبقي: {fmt(ei.remaining)}</div>
              </div>
              <AccPicker value={form.akey} onChange={v=>F("akey",v)} border="#10b981"/>
              <input style={S.inp} type="number" placeholder={ei.kind==="أعطيت"?"المبلغ المرجع":"المبلغ المسدد"} value={form.amount||""} onChange={e=>F("amount",e.target.value)} max={ei.remaining}/>
              <input style={S.inp} type="date" value={form.date||new Date().toISOString().split("T")[0]} onChange={e=>F("date",e.target.value)}/>
              <button style={S.btn("#10b981")} onClick={()=>{
                if(!form.amount||!form.akey){showErr("⛔ أكمل البيانات");return;}
                const amt=parseFloat(form.amount);
                const acc=allAcc.find(a=>a.key===form.akey);
                if(!acc)return;
                const isGiven=ei.kind==="أعطيت";
                const txType=isGiven?"income":"expense";
                const desc=isGiven?`رجوع سلفة — ${ei.person}`:`تسديد ${ei.wi?"قرض":"سلفة"} — ${ei.person}`;
                setTxs(p=>[{id:uid(),type:txType,amount:amt,catId:null,subId:null,desc,date:form.date||new Date().toISOString().split("T")[0],pm:"نقدي",ref:acc.ref,isLoan:true,isTransfer:true,loanKind:ei.kind},...p]);
                updBal(acc.ref,amt,txType,"add");
                setLoans(p=>p.map(l=>l.id===ei.id?{...l,remaining:Math.max(0,l.remaining-amt)}:l));
                cm();
              }}>تأكيد {ei.kind==="أعطيت"?"الرجوع":"التسديد"} ✓</button>
            </div>}

            {modal==="addBudget"&&<div style={S.col}><select style={S.sel} value={form.catId||""} onChange={e=>F("catId",e.target.value)}><option value="">اختر تصنيف النفقات</option>{cats.expense.map(c=><option key={c.id} value={c.id}>{c.ci?"📷":c.icon} {c.name}</option>)}</select><input style={S.inp} placeholder="الحد الأقصى" type="number" value={form.limit||""} onChange={e=>F("limit",e.target.value)}/><button style={S.btn()} onClick={addBudget}>حفظ</button></div>}

            {/* ======= BUDGET SETTINGS MODAL — الجديد ======= */}
            {modal==="budgetSettings"&&<div style={S.col}>
              <div style={{fontSize:14,color:"#f5f5f0",fontWeight:800,marginBottom:4}}>⚙️ إعدادات الميزانية</div>

              {/* الأهداف الشهرية */}
              <div style={{fontSize:12,color:"#64748b",fontWeight:700}}>🎯 الأهداف الشهرية</div>
              <div style={{background:"white",borderRadius:12,padding:12,border:"1px solid #10b98133"}}>
                <div style={{fontWeight:700,color:"#1a6b4a",marginBottom:10,fontSize:13}}>💰 هدف الدخل</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <button style={{...S.btn(!(budgetSettings.goals?.incomeAuto)?"#10b981":"#444444",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,incomeAuto:false}}))}>يدوي</button>
                  <button style={{...S.btn(budgetSettings.goals?.incomeAuto?"#10b981":"#444444",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,incomeAuto:true}}))}>تلقائي</button>
                </div>
                {!budgetSettings.goals?.incomeAuto&&<input style={{...S.inp,padding:"8px 10px",fontSize:13}} type="number" placeholder="هدف الدخل الشهري" value={budgetSettings.goals?.incomeGoal||15000}
                  onChange={e=>setBudgetSettings(p=>({...p,goals:{...p.goals,incomeGoal:parseFloat(e.target.value)||0}}))}/>}
                {budgetSettings.goals?.incomeAuto&&<div style={{fontSize:11,color:"#64748b",padding:"8px 0"}}>يحسب تلقائياً من متوسط الدخل الشهري</div>}
                <div style={{fontWeight:700,color:"#ef4444",marginBottom:10,marginTop:12,fontSize:13}}>💸 هدف المصاريف</div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <button style={{...S.btn(!(budgetSettings.goals?.expenseAuto)?"#ef4444":"#444444",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,expenseAuto:false}}))}>يدوي</button>
                  <button style={{...S.btn(budgetSettings.goals?.expenseAuto?"#ef4444":"#444444",false),flex:1,padding:"6px",fontSize:12}} onClick={()=>setBudgetSettings(p=>({...p,goals:{...p.goals,expenseAuto:true}}))}>تلقائي</button>
                </div>
                {!budgetSettings.goals?.expenseAuto&&<input style={{...S.inp,padding:"8px 10px",fontSize:13}} type="number" placeholder="هدف المصاريف الشهرية" value={budgetSettings.goals?.expenseGoal||5000}
                  onChange={e=>setBudgetSettings(p=>({...p,goals:{...p.goals,expenseGoal:parseFloat(e.target.value)||0}}))}/>}
                {budgetSettings.goals?.expenseAuto&&<div style={{fontSize:11,color:"#64748b",padding:"8px 0"}}>يحسب تلقائياً من متوسط المصاريف الشهرية</div>}
              </div>

              <div style={{fontSize:11,color:"#64748b",padding:"6px 2px"}}>لتعديل نسب الأقسام الخمسة وربط الحسابات، دخل من صفحة "الميزانية" مباشرة.</div>

              <button style={S.btn()} onClick={()=>{
                _save('budgetSettings',budgetSettings);cm();setErr("✅ تم حفظ الإعدادات");setTimeout(()=>setErr(null),3000);
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
              {selSv&&<div style={{padding:12,background:"#f8fafc",borderRadius:10,display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:24}}>{selSv.icon}</span><div><div style={{fontWeight:700}}>{selSv.name}</div><div style={{fontSize:12,color:"#64748b"}}>متبقي: {fmt(selSv.target-selSv.saved)}</div></div></div>}
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
              <div style={{fontSize:14,color:"#475569"}}>هل تبغي تحذف <strong style={{color:"#1a1a1a"}}>"{cd.lbl}"</strong>؟</div>
              <div style={{fontSize:12,color:"#ef4444",marginTop:6}}>هذا الإجراء لا يمكن التراجع عنه</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={{...S.btn("#e8e8e4"),border:"1px solid #334155",color:"#475569"}} onClick={()=>setCd(null)}>إلغاء</button>
              <button style={S.btn("#ef4444")} onClick={doDel}>حذف</button>
            </div>
          </div>
        </div>
      )}

      {err&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#ffffff",border:"1px solid #ef4444",borderRadius:12,padding:"12px 20px",zIndex:400,color:"#ef4444",fontSize:13,fontWeight:700,maxWidth:340,textAlign:"center"}}>{err}</div>}
      {lastDeleted&&<div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",borderRadius:14,padding:"12px 16px",zIndex:400,display:"flex",alignItems:"center",gap:14,boxShadow:"0 6px 20px rgba(0,0,0,.3)",maxWidth:340}}>
        <span style={{color:"white",fontSize:13,fontWeight:600}}>🗑️ تم حذف المعاملة</span>
        <button onClick={undoDelete} style={{background:"#10b981",border:"none",borderRadius:8,padding:"7px 14px",color:"white",fontFamily:"Tajawal",fontSize:13,fontWeight:800,cursor:"pointer"}}>تراجع ↺</button>
      </div>}

      {/* توزيع الدخل التلقائي */}
    </div>
  );
}
