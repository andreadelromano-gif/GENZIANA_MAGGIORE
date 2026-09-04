import { useEffect, useState } from 'react'
import './App.css'

import agenda from './assets/045c9ed5-306b-470d-acef-a6a375156cb9.jpg'
import territory from './assets/33ed28ae-d21f-43c7-b8ef-5fbd9d17c63f.png'
import rootsPoster from './assets/5a393aa9-e65b-4493-886b-58eb0e2f17ad.png'
import logo from './assets/7014de58-9fdf-4857-8c4b-9ba1ff61445e.png'
import rootsTexture from './assets/b632118d-c274-4686-b8d5-7d48cfc391d3.png'
import bottlePair from './assets/bottiglia-maggiore-fronte-retro.png'
import bottleFront from './assets/bottiglia-maggiore-fronte-trasparente.png'
import maggiorePhoto from './assets/ff80f0cc-6b66-4bb9-b9df-a72d43d7bf10.png'

const images = {
  'logo-maggiore.png': logo,
  'bottle-front.png': bottleFront,
  'bottle-front-back.png': bottlePair,
  'root-story.jpg': rootsPoster,
  'root-texture-dark.jpg': rootsTexture,
  'territorio-maiella.jpg': territory,
}
function Image({name, alt, className=''}) {
  const [ok,setOk]=useState(true)
  return ok ? <img src={images[name]} alt={alt} className={className} onError={()=>setOk(false)}/> : null
}
function Header(){
  const [open,setOpen]=useState(false)
  useEffect(()=>{document.body.classList.toggle('menu-open',open);return()=>document.body.classList.remove('menu-open')},[open])
  const close=()=>setOpen(false)
  return <header className="site-header"><a className="brand" href="#top" onClick={close}><Image name="logo-maggiore.png" alt=""/><span>GENZIANA<br/>MAGGIORE</span></a><button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}><span className="sr-only">{open?'Chiudi menu':'Apri menu'}</span><i/><i/></button><nav id="main-nav" className={open?'nav open':'nav'} aria-label="Navigazione principale"><a href="#storia" onClick={close}>Storia</a><a href="#genziana" onClick={close}>Genziana</a><a href="#territorio" onClick={close}>Territorio</a><a href="#contatti" onClick={close}>Contatti</a></nav></header>
}
function Bottle({large=false}){return <div className="bottle-wrap"><Image name="bottle-front.png" alt="Bottiglia di Genziana Maggiore" className="bottle-image"/><div className={'bottle-fallback '+(large?'large':'')} aria-hidden="true"><span>MAGGIORE</span><b>GENZIANA</b><small>ABRUZZO</small></div></div>}
function App(){return <main id="top">
  <section className="hero" aria-labelledby="hero-title"><Header/><div className="hero-copy"><p className="eyebrow">Liquore artigianale · Abruzzo</p><h1 id="hero-title">GENZIANA<br/><span>MAGGIORE</span></h1><p className="hero-line">Radici forti.<br/>Carattere deciso.</p><a className="text-link" href="#storia">Scopri la storia <span>↓</span></a></div><div className="hero-product"><Bottle/></div><p className="hero-meta">ABRUZZO <i/> 50 CL <i/> 26% VOL</p><div className="mountains" aria-hidden="true"><i/><i/><i/></div></section>
  <section className="manifesto section" aria-labelledby="manifesto-title"><p className="index">01 — Manifesto</p><div className="manifesto-grid"><h2 id="manifesto-title">DALLA TERRA.<br/><em>DALLA MEMORIA.</em></h2><p>Una radice di genziana, il vino Cococciola e una ricetta custodita in famiglia. Maggiore nasce in Abruzzo, dove l'amaro non è un difetto: è carattere.</p></div></section>
  <section id="storia" className="story" aria-labelledby="story-title">
    <div className="story-open section"><div><p className="index">02 — La nostra storia</p><h2 id="story-title">Tutto parte<br/>da una radice.</h2></div><div className="prose"><p>Mi chiamo Andrea Del Romano e sono cresciuto con la genziana in casa.</p><p>A prepararla era mio nonno, Maggiore.</p><p>Un uomo legato alla terra, all'orto e, in anni precedenti ai miei ricordi, anche a una sua vigna di Cococciola.</p></div></div>
    <figure className="grandfather"><div className="grandfather-photo"><img src={maggiorePhoto} alt="Maggiore in un momento conviviale"/></div><figcaption><span>Mio nonno, Maggiore.</span><p>Un uomo legato alla terra, all'orto e a una sua vigna di Cococciola. Forte, autorevole e gentile.</p></figcaption></figure>
    <div className="story-image"><Image name="root-story.jpg" alt="Radici nella terra scura"/><div className="root-lines"><i/><i/><i/><i/></div><p>Da lui ho imparato che la genziana non è solo un liquore.</p></div>
    <div className="shared section"><p>È il fine pasto.<br/>È il brindisi.<br/>È la famiglia.<br/><strong>È il tempo condiviso.</strong></p><div><p>Dopo la sua scomparsa, tra le sue cose, abbiamo ritrovato una vecchia agenda.</p><p>Dentro c'erano numeri di telefono di familiari e amici. E, tra quelle pagine, anche la sua ricetta.</p></div></div>
    <figure className="agenda"><img src={agenda} alt="La ricetta originale della genziana scritta a mano nell'agenda di Maggiore"/><figcaption><span>La ricetta originale</span><p>Ritrovata tra numeri di telefono, familiari e amici.</p></figcaption></figure>
    <blockquote className="hand"><span>Scritta a mano.</span><span>In stampatello.</span><span>Con qualche errore.</span><strong>Vera.</strong></blockquote>
    <div className="memory section"><div className="prose"><p>Era la stessa ricetta che mi era stata tramandata a voce.</p><p>Per me quella pagina è diventata una radice.</p><p>La memoria di un uomo che aveva conosciuto la guerra, l'emigrazione in Venezuela, il lavoro e la fatica, restando sempre forte, autorevole e gentile.</p></div><p className="like">Come l'Abruzzo.<br/>Come la genziana.</p></div>
    <div className="turn section"><p className="index">Una cena. Un assaggio.</p><div className="turn-grid"><div><p>Anni dopo, durante una cena di lavoro con Guido Primavera, giovane imprenditore edile del territorio, ordinammo una genziana.</p><p>Era troppo dolce.</p></div><blockquote>Mancava l'amaro.<br/>Mancava il carattere.<br/><strong>Mancava la radice.</strong></blockquote></div></div>
    <div className="birth section"><div className="prose"><p>Gli raccontai la storia di mio nonno.</p><p>Guido ci credette.</p><p>Con la sua esperienza, le sue conoscenze e la sua capacità di costruire, trasformammo insieme quella memoria in un progetto.</p></div><div className="birth-lines"><p>Così è nata Maggiore.</p><p>Da una ricetta.<br/>Da una famiglia.<br/>Da una terra.</p><strong>Da una radice.</strong></div><p className="signature">MAGGIORE <span>Forte e gentile.</span></p></div>
  </section>
  <section id="genziana" className="root-section" aria-labelledby="root-title"><Image name="root-texture-dark.jpg" alt="Texture della radice di genziana" className="cover"/><div className="root-content section"><p className="index">03 — La radice</p><p className="botanical">GENTIANA</p><h2 id="root-title">LUTEA</h2><p className="root-copy">Sotto la superficie vive l'anima del liquore. Una radice tenace, intensa, profondamente amara. L'origine del carattere di Maggiore.</p></div></section>
  <section className="cococciola section" aria-labelledby="cococciola-title"><div className="vertical">COCOCCIOLA</div><div className="cocco-copy"><p className="index">04 — Il vino</p><h2 id="cococciola-title">Un legame<br/>che viene<br/><em>dalla terra.</em></h2><p>Il vino Cococciola entra nella ricetta come traccia del territorio: un vitigno abruzzese, memoria della vigna di Maggiore e parte viva dell'identità del liquore.</p></div><div className="earth" aria-hidden="true"><i/></div></section>
  <section id="territorio" className="territory" aria-labelledby="territory-title"><Image name="territorio-maiella.jpg" alt="La Maiella, in Abruzzo" className="cover"/><div className="territory-art"/><div className="territory-copy"><p className="index">05 — Territorio</p><h2 id="territory-title">ABRUZZO</h2><p className="maiella">Maiella</p><p>Montagna, terra, silenzio. Non uno sfondo, ma l'origine. Un paesaggio severo che insegna la misura e lascia il carattere.</p></div></section>
  <section className="product section" aria-labelledby="product-title"><div className="product-copy"><p className="index">06 — Il liquore</p><h2 id="product-title">GENZIANA<br/>MAGGIORE</h2><p className="italic">Liquore di genziana</p><dl><div><dt>Formato</dt><dd>50 cl</dd></div><div><dt>Gradazione</dt><dd>26% vol.</dd></div><div><dt>Origine</dt><dd>Abruzzo</dd></div></dl></div><div className="product-visual"><Image name="bottle-front-back.png" alt="Bottiglia Genziana Maggiore vista dal fronte e dal retro" className="bottle-pair"/></div></section>
  <section className="closing"><p>LE RADICI<br/><span>NON SI</span><br/>INVENTANO.</p></section>
  <footer id="contatti" className="footer"><div className="footer-brand"><Image name="logo-maggiore.png" alt=""/><strong>GENZIANA<br/>MAGGIORE</strong><span>Liquore artigianale alla genziana</span></div><nav aria-label="Social"><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Facebook</a><a href="#">LinkedIn</a></nav><nav aria-label="Informazioni"><a href="mailto:#">Email</a><a href="#">Privacy</a><a href="#">Cookie</a></nav><p>ABRUZZO · 50 CL · 26% VOL.</p></footer>
 </main>}
export default App
