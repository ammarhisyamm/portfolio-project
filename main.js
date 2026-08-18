const projects = [
  {slug:'gadai-mulia',title:'Gadai Mulia',category:'Fintech / Mobile Application',filters:['Fintech','Mobile'],role:'Product design, UX/UI',year:'2024',image:'',desc:'A digital pawnbroking and financial service experience designed to make transactions more accessible and understandable.'},
  {slug:'synqra',title:'Synqra',category:'SaaS / Productivity',filters:['SaaS','Web'],role:'Product strategy, UX/UI',year:'2024',image:'',desc:'A meeting notes and workflow platform that helps teams turn discussions into actionable work.'},
  {slug:'drawtopia',title:'Drawtopia',category:'AI / Creative Platform',filters:['AI','Web'],role:'Interaction design, visual system',year:'2023',image:'',desc:'An AI-assisted story-generation experience that helps users create imaginative content.'},
  {slug:'task-sharing',title:'Task-sharing platform',category:'Marketplace / Gig Economy',filters:['Marketplace','Mobile'],role:'UX research, end-to-end design',year:'2023',image:'',desc:'A platform connecting people who need tasks completed with trusted service providers.'},
  {slug:'threat-intelligence',title:'Threat intelligence dashboard',category:'Enterprise / Data Visualization',filters:['Enterprise','Web'],role:'Information architecture, UI',year:'2022',image:'',desc:'A structured dashboard for monitoring threats, incidents, and security information.'},
  {slug:'omnichannel',title:'Omnichannel communication platform',category:'SaaS / Communication',filters:['SaaS','Web'],role:'Product design, design system',year:'2022',image:'',desc:'A unified communication product for managing conversations across multiple channels.'},
  {slug:'wedding-dashboard',title:'Wedding planning dashboard',category:'Lifestyle / Web Application',filters:['Web','Mobile'],role:'UX/UI design',year:'2021',image:'',desc:'A planning workspace for organizing wedding tasks, vendors, schedules, and budgets.'},
  {slug:'english-learning',title:'TOEFL & IELTS learning platform',category:'Education / Learning Platform',filters:['Education','Mobile','Web'],role:'UX/UI design, prototyping',year:'2021',image:'',desc:'A focused learning platform for users preparing for English proficiency examinations.'}
];
const HOME_SPANS = [7,5,4,4,4,6,6,12];
const app = document.querySelector('#app');
const template = (strings,...values) => strings.reduce((out,s,i)=>out+s+(values[i]??''),'');
const phIcon = () => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.4"/><path d="M21 15.5l-5-5-8.5 8.5"/></svg>';
function ph(p){return `<span class="media-ph" role="img" aria-label="Visual placeholder for ${p.title}">${phIcon()}<span>Visual · ${p.year}</span></span>`}
function media(p){return p.image ? `<img class="card-img" src="${p.image}" alt="Visual for ${p.title}" loading="lazy"/>` : ph(p)}
const card = (p, span) => template`<article class="project-card" data-project="${p.slug}" tabindex="0" role="button" aria-label="View ${p.title} case study" style="--span:${span}"><div class="card-media" data-title="${p.title}" data-year="${p.year}">${media(p)}</div><div class="card-body"><div class="card-top"><span class="tag">${p.category}</span><span class="year">${p.year} <i aria-hidden="true">↗</i></span></div><h3>${p.title}</h3><p>${p.desc}</p></div></article>`;

function home(){const trust=['Serba Mulia Group','Peak Haven','Gadai Mulia','Synqra','Drawtopia','Base44','Fintech products','SaaS platforms','AI-powered tools'];return template`
<section class="page reveal">
  <div class="panel hero-panel">
    <div class="hero-main">
      <span class="badge"><span></span>Available for selected projects</span>
      <div class="hero-id">
        <div class="avatar" aria-hidden="true">H</div>
        <div><h1>Hisyam</h1><p>Senior UX/UI &amp; Product Designer</p></div>
      </div>
      <h2 class="hero-headline">I design thoughtful digital products that make complex experiences feel simple.</h2>
      <p class="hero-copy">I help teams turn ideas into clear, useful, and engaging experiences across fintech, SaaS, marketplaces, dashboards, and AI-powered products.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="mailto:hello@hisyam.design">Let’s work together <span aria-hidden="true">→</span></a>
        <a class="btn btn-secondary" href="#work">View my projects</a>
      </div>
    </div>
    <div class="hero-decor" aria-hidden="true"></div>
  </div>

  <div class="panel trust-panel">
    <div class="trust-head"><span class="kicker">Experience</span><p>Experience across product, UX/UI, and digital experiences.</p></div>
    <ul class="trust-row">${trust.map(t=>`<li>${t}</li>`).join('')}</ul>
  </div>

  <div class="panel about-panel">
    <div class="about-main">
      <span class="kicker">About myself</span>
      <p class="lead">Hey, I’m Hisyam — a strategy-driven product designer with more than 15 years of experience creating scalable digital experiences.</p>
      <p>I work across UX/UI design, product strategy, user research, interaction design, design systems, prototyping, and design-to-development handoff. I collaborate closely with teams and clients to turn decisions into momentum.</p>
    </div>
    <div class="about-meta">
      <a href="mailto:hello@hisyam.design"><span>Email</span>hello@hisyam.design</a>
      <a href="#"><span>Location</span>Jakarta, Indonesia</a>
      <a href="#"><span>LinkedIn</span>View profile</a>
      <a class="btn btn-secondary" href="#">Download CV</a>
    </div>
  </div>

  <section class="section">
    <div class="section-head"><span class="kicker">Selected work</span><a href="#work">View all projects <span aria-hidden="true">→</span></a></div>
    <div class="project-grid">${projects.map((p,i)=>card(p,HOME_SPANS[i])).join('')}</div>
  </section>
</section>`}

function about(){return template`
<section class="page reveal">
  <div class="panel intro-panel"><span class="kicker">About</span><h1>Designing systems that help people make sense of complex things.</h1></div>
  <div class="bento-grid">
    <div class="panel span-8 intro-lead">
      <span class="kicker">Introduction</span>
      <p class="lead">Hey, I’m Hisyam — a strategy-driven product designer with more than 15 years of experience creating scalable digital experiences.</p>
      <p>I enjoy shaping a product from the early question through to a considered interface and a practical handoff. My work is grounded in attention to people, business context, and the small details that make a product feel trustworthy.</p>
    </div>
    <div class="panel span-4 cv-panel">
      <span class="kicker">Get in touch</span>
      <a href="mailto:hello@hisyam.design">hello@hisyam.design</a>
      <a href="#">LinkedIn</a>
      <a class="btn btn-primary" href="mailto:hello@hisyam.design">Let’s talk</a>
      <a class="btn btn-secondary" href="#">Download CV</a>
    </div>
    <div class="panel span-6 philosophy">
      <span class="kicker">Design philosophy</span>
      <h3>Complexity should be resolved long before it reaches the interface.</h3>
      <p>I design with structure and restraint. Every layout, flow, and pattern should earn its place and make the next decision easier for both users and the team building it.</p>
    </div>
    <div class="panel span-6 background-panel">
      <span class="kicker">Professional background</span>
      <p>More than 15 years across product teams, agencies, and client work — spanning fintech, SaaS, marketplaces, education, security, communication, and AI-powered platforms.</p>
      <p>From strategy and research to interaction, visual systems, and developer handoff, I stay involved across the full arc of a product.</p>
    </div>
    <div class="panel span-12 cap-panel">
      <span class="kicker">Core capabilities</span>
      <ul>${['Product strategy','UX research','User flows & IA','Wireframing','Prototyping','Interaction design','Visual design','Design systems','Usability testing','Design handoff','Competitor analysis','Product audits'].map(c=>`<li>${c}</li>`).join('')}</ul>
    </div>
    <div class="panel span-6 tools-panel">
      <span class="kicker">Tools &amp; workflow</span>
      <p>Figma, FigJam, Adobe tools, Photopea, Notion, and AI-assisted design and research tools. I work openly with product, engineering, and stakeholders to turn decisions into momentum.</p>
    </div>
    <div class="panel span-6 industries-panel">
      <span class="kicker">Selected industries</span>
      <ul class="tag-list">${['Fintech','SaaS','Marketplaces','Education','Enterprise','Communication','AI products','Lifestyle'].map(i=>`<li>${i}</li>`).join('')}</ul>
    </div>
  </div>
</section>`}

function work(){const filters=['All','Fintech','SaaS','Mobile','Web','AI','Enterprise','Marketplace','Education'];return template`
<section class="page reveal">
  <div class="panel intro-panel"><span class="kicker">Work</span><h1>A selection of products made clearer, more useful, and easier to move through.</h1></div>
  <div class="panel filters-panel">
    <div class="filters" role="toolbar" aria-label="Filter projects">${filters.map(x=>`<button type="button" class="${x==='All'?'active':''}" data-filter="${x}">${x}</button>`).join('')}</div>
  </div>
  <div class="project-grid work-grid">${projects.map(p=>card(p,6)).join('')}</div>
</section>`}

function render(){let route=location.hash.slice(1)||'home';if(!['home','about','work'].includes(route))route='home';app.innerHTML=route==='home'?home():route==='about'?about():work();document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.route===route));document.querySelectorAll('.card-img').forEach(img=>img.addEventListener('error',()=>{const wrap=img.closest('.card-media,.case-media');if(wrap)wrap.innerHTML=ph({title:wrap.dataset.title||'Project',year:wrap.dataset.year||''})}));bind();window.scrollTo({top:0,behavior:'instant'})}

function bind(){document.querySelectorAll('[data-project]').forEach(el=>{el.addEventListener('click',()=>openProject(el.dataset.project));el.addEventListener('keydown',e=>{if(e.key==='Enter')openProject(el.dataset.project)})});document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('.work-grid .project-card').forEach(el=>{const p=projects.find(x=>x.slug===el.dataset.project);el.hidden=btn.dataset.filter!=='All'&&!p.filters.includes(btn.dataset.filter)})}))}

const dialog=document.querySelector('.project-dialog');
function openProject(slug){const p=projects.find(x=>x.slug===slug);document.querySelector('#dialog-content').innerHTML=template`
<div class="case-hero"><span class="kicker">${p.category} · ${p.year}</span><h2>${p.title}</h2><p>${p.desc}</p></div>
<div class="case-media" data-title="${p.title}" data-year="${p.year}">${media(p)}</div>
<div class="case-grid"><div><span class="kicker">Context</span><h3>A focused product problem, approached with care.</h3></div><div><p>This case study is structured as a ready-to-complete project record. The work centered on translating a complex workflow into a calm, navigable product experience.</p><p><b>Role</b><br>${p.role}</p><p><b>Approach</b><br>Discovery, user flows, wireframes, interface design, prototyping, and developer handoff.</p></div></div>
<div class="case-stages"><span>01<b>Understand</b><small>Clarify the context, users, and constraints.</small></span><span>02<b>Structure</b><small>Map flows and create a usable information model.</small></span><span>03<b>Refine</b><small>Build a visual system that makes the work feel natural.</small></span></div>
<p class="case-outcome"><span>Outcome</span>A scalable product foundation with clear patterns for the team to develop and extend.</p>`;dialog.showModal();document.body.classList.add('modal-open');document.querySelectorAll('.case-img').forEach(img=>img.addEventListener('error',()=>{const wrap=img.closest('.case-media');if(wrap)wrap.innerHTML=ph({title:wrap.dataset.title,year:wrap.dataset.year})}))}

document.querySelector('.dialog-close').onclick=()=>{dialog.close();document.body.classList.remove('modal-open')};
dialog.addEventListener('click',e=>{if(e.target===dialog){dialog.close();document.body.classList.remove('modal-open')}});
document.querySelector('.menu-toggle').onclick=()=>{const b=document.querySelector('.menu-toggle'),n=document.querySelector('nav');b.setAttribute('aria-expanded',!n.classList.toggle('open'))};
document.querySelector('.back-top').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
document.querySelector('#year').textContent=new Date().getFullYear();
const clock=document.getElementById('clock');
function tick(){if(clock)clock.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit'})}
tick();setInterval(tick,30000);
window.addEventListener('hashchange',render);render();
