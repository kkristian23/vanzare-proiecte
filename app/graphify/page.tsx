"use client";

import { ArrowLeft, Check, RotateCcw, Sparkles, TrendingDown, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "./graphify.css";

const models = [
  { name: "Fast", input: 0.15, output: 0.6, color: "#c7ff3d" },
  { name: "Balanced", input: 2.5, output: 10, color: "#8b6cff" },
  { name: "Premium", input: 15, output: 60, color: "#ff7c58" },
];
const defaults = { budget: 5000, requests: 12000, inputTokens: 850, outputTokens: 320, days: 30, fast: 55, balanced: 35 };

function money(value: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "EUR", maximumFractionDigits: value < 10 ? 2 : 0 }).format(value);
}

export default function GraphifyPage() {
  const [settings, setSettings] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("graphify-settings");
    if (saved) try { setSettings({ ...defaults, ...JSON.parse(saved) }); } catch { /* keep safe defaults */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem("graphify-settings", JSON.stringify(settings)); }, [settings, ready]);

  const premium = Math.max(0, 100 - settings.fast - settings.balanced);
  const result = useMemo(() => {
    const shares = [settings.fast, settings.balanced, premium];
    const daily = models.map((model, index) => {
      const requests = settings.requests * shares[index] / 100;
      return requests * ((settings.inputTokens * model.input + settings.outputTokens * model.output) / 1_000_000);
    });
    const monthly = daily.reduce((sum, value) => sum + value, 0) * settings.days;
    const tokens = settings.requests * (settings.inputTokens + settings.outputTokens) * settings.days;
    const optimized = monthly * 0.68;
    return { daily, monthly, tokens, optimized, saving: monthly - optimized };
  }, [settings, premium]);
  const update = (key: keyof typeof defaults, value: number) => setSettings(current => ({ ...current, [key]: value }));
  const setShare = (key: "fast" | "balanced", value: number) => setSettings(current => {
    if (key === "fast") return { ...current, fast: Math.min(value, 100 - current.balanced) };
    return { ...current, balanced: Math.min(value, 100 - current.fast) };
  });
  const budgetUse = result.monthly / settings.budget * 100;
  const health = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, budgetUse - 55) * .8)));

  return <main className="g-app">
    <header className="g-nav"><Link href="/"><ArrowLeft/> MONO/DEV</Link><div className="g-logo"><b>G</b> GRAPHIFY</div><span className="g-live"><i/> ENGINE LIVE</span></header>
    <section className="g-hero"><div><span className="g-kicker">AI TOKEN ECONOMY OS / LIVE SIMULATOR</span><h1>FĂ FIECARE TOKEN<br/><em>SĂ CONTEZE.</em></h1><p>Modelează consumul, controlează bugetul și descoperă cât poți economisi înainte de următoarea factură AI.</p></div><div className="g-score"><span>ECONOMY HEALTH</span><strong>{health}</strong><small>/ 100</small><i style={{"--score":`${health}%`} as React.CSSProperties}/></div></section>
    <section className="g-stats">
      <article><span>COST ESTIMAT / LUNĂ</span><strong>{money(result.monthly)}</strong><small className={budgetUse > 100 ? "danger" : "good"}>{budgetUse.toFixed(0)}% din buget</small></article>
      <article><span>TOKENI / LUNĂ</span><strong>{(result.tokens / 1e9).toFixed(2)}B</strong><small>{(settings.requests * settings.days).toLocaleString("ro-RO")} requesturi</small></article>
      <article className="accent"><span>ECONOMIE POSIBILĂ</span><strong>{money(result.saving)}</strong><small>{money(result.saving * 12)} anual</small></article>
      <article><span>COST / REQUEST</span><strong>{money(result.monthly / (settings.requests * settings.days))}</strong><small>medie ponderată</small></article>
    </section>
    <section className="g-workspace">
      <div className="g-controls"><div className="g-panel-head"><div><span>01 / INPUTS</span><h2>Configurează traficul</h2></div><button onClick={()=>setSettings(defaults)} aria-label="Resetează setările"><RotateCcw/></button></div>
        <NumberInput label="Buget lunar" suffix="EUR" value={settings.budget} min={100} max={100000} step={100} onChange={v=>update("budget",v)}/>
        <NumberInput label="Requesturi / zi" suffix="REQ" value={settings.requests} min={100} max={1000000} step={100} onChange={v=>update("requests",v)}/>
        <NumberInput label="Tokeni input / request" suffix="TOK" value={settings.inputTokens} min={10} max={100000} step={10} onChange={v=>update("inputTokens",v)}/>
        <NumberInput label="Tokeni output / request" suffix="TOK" value={settings.outputTokens} min={10} max={50000} step={10} onChange={v=>update("outputTokens",v)}/>
        <NumberInput label="Zile active" suffix="ZILE" value={settings.days} min={1} max={31} step={1} onChange={v=>update("days",v)}/>
      </div>
      <div className="g-analysis"><div className="g-panel-head"><div><span>02 / MODEL MIX</span><h2>Distribuie inteligent</h2></div><Zap/></div>
        <ShareRow model={models[0]} value={settings.fast} onChange={v=>setShare("fast",v)} cost={result.daily[0] * settings.days}/>
        <ShareRow model={models[1]} value={settings.balanced} onChange={v=>setShare("balanced",v)} cost={result.daily[1] * settings.days}/>
        <ShareRow model={models[2]} value={premium} cost={result.daily[2] * settings.days}/>
        <div className="g-chart"><div className="g-chart-head"><span>PROIECȚIE COST / ZI</span><b>{money(result.monthly / settings.days)}</b></div><div className="g-bars">{Array.from({length:settings.days},(_,index)=>{const wave=.78+((index*7)%9)/40; return <i key={index} style={{height:`${Math.min(100,wave*82)}%`}}/>})}</div><div className="g-budget-line" style={{bottom:`${Math.min(95, settings.budget / settings.days / Math.max(1,result.monthly/settings.days) * 70)}%`}}><span>LIMITĂ BUGET</span></div></div>
      </div>
    </section>
    <section className="g-optimize"><div><span className="g-kicker">03 / OPTIMIZATION PLAN</span><h2>Economisește <em>{money(result.saving)}</em><br/>în fiecare lună.</h2></div><div className="g-actions">
      <button onClick={()=>setSettings(s=>({...s,inputTokens:Math.round(s.inputTokens*.75)}))}><span><Sparkles/> COMPACT PROMPTS</span><b>−25% input</b><Check/></button>
      <button onClick={()=>setSettings(s=>({...s,fast:Math.min(80,100-s.balanced)}))}><span><TrendingDown/> SMART ROUTING</span><b>mută traficul pe Fast</b><Check/></button>
      <button onClick={()=>setSettings(s=>({...s,requests:Math.round(s.requests*.88)}))}><span><Zap/> RESPONSE CACHE</span><b>−12% requesturi</b><Check/></button>
    </div></section>
    <footer className="g-footer"><div className="g-logo"><b>G</b> GRAPHIFY</div><span>CALCULE LOCALE · SETĂRI SALVATE AUTOMAT · DATE PRIVATE</span><Link href="/?categorie=ai-token-economy#proiecte">Vezi licența completă →</Link></footer>
  </main>;
}

function NumberInput({label,suffix,value,min,max,step,onChange}:{label:string;suffix:string;value:number;min:number;max:number;step:number;onChange:(value:number)=>void}) {
  return <label className="g-field"><span>{label}</span><div><input type="number" value={value} min={min} max={max} step={step} onChange={event=>onChange(Math.max(min,Math.min(max,Number(event.target.value))))}/><b>{suffix}</b></div><input aria-label={`${label} slider`} type="range" value={value} min={min} max={max} step={step} onChange={event=>onChange(Number(event.target.value))}/></label>;
}

function ShareRow({model,value,cost,onChange}:{model:(typeof models)[number];value:number;cost:number;onChange?:(value:number)=>void}) {
  return <div className="g-share"><div><i style={{background:model.color}}/><b>{model.name}</b><span>{model.input} / {model.output} € per 1M</span><strong>{money(cost)}</strong></div>{onChange ? <input aria-label={`Procent ${model.name}`} type="range" min="0" max="100" value={value} onChange={e=>onChange(Number(e.target.value))}/> : <div className="g-static-range"><i style={{width:`${value}%`,background:model.color}}/></div>}<small>{value}% din trafic</small></div>;
}
