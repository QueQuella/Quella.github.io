(() => {
  const canvas = document.getElementById('quella-mascot');
  const ctx = canvas.getContext('2d');
  const links = [...document.querySelectorAll('.side-main')];
  const sections = [...document.querySelectorAll('main > [id]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const modes = {about:'still', biography:'balloons', projects:'sparks', images:'light', videos:'light', articles:'type'};
  let active='about', hover=null, focus=null, target='still', last=0, time=0, tailPhase=0, walkClock=0, arrival=0, raf=0;
  const pose={sit:0,light:0,sparks:0,balloons:0,still:1};
  // Twelve drawings at eight frames per second: contact, down, passing, up,
  // then the same weight transfer on the opposite leg. Grounded feet linger.
  const walkKeys=[
    [-17,15,0,0,0],[-17,14,0,0,2],[-14,11,0,2,2],[-9,5,0,8,0],
    [-4,-3,0,12,-2],[4,-11,0,6,-1],[15,-17,0,0,0],
    [14,-17,0,0,2],[11,-14,2,0,2],[5,-9,8,0,0],
    [-3,-4,12,0,-2],[-11,4,6,0,-1]
  ];
  function choose() {
    const next=modes[hover || focus || active] || 'still';
    if(next!==target && next==='light'){arrival=1;walkClock=0;}
    target=next;canvas.dataset.state=target;
  }
  function setSection(id) {
    if (!modes[id]) return;
    active=id; document.body.dataset.activeSection=id;
    links.forEach(a => { if(a.dataset.section===id) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    choose();
  }
  links.forEach(a => {
    a.addEventListener('pointerenter',()=>{hover=a.dataset.section;choose();});
    a.addEventListener('pointerleave',()=>{hover=null;choose();});
    a.addEventListener('focus',()=>{focus=a.matches(':focus-visible')?a.dataset.section:null;choose();});
    a.addEventListener('blur',()=>{focus=null;choose();});
    a.addEventListener('click',()=>{focus=null;setSection(a.dataset.section);});
  });
  document.querySelectorAll('.subnav a').forEach(a=>a.addEventListener('click',()=>setSection(a.closest('.subnav').dataset.for)));
  function track() {
    const line=innerHeight*.3;
    let current='about';
    for(const section of sections) if(section.getBoundingClientRect().top<=line) current=section.id;
    if(current!==active) setSection(current);
  }
  addEventListener('scroll',track,{passive:true});
  addEventListener('hashchange',()=>{const el=document.getElementById(location.hash.slice(1));setSection(el?.closest('section')?.id || (el?.id==='about'?'about':active));});
  function resize(){const r=canvas.getBoundingClientRect();const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);}
  new ResizeObserver(resize).observe(canvas);
  const mix=(a,b,t)=>a+(b-a)*t;
  function path(d,fill='#090909'){ctx.fillStyle=fill;ctx.fill(new Path2D(d));}
  function line(points,width=10,color='#090909') {ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;ctx.stroke();}
  function draw(dt) {
    if(!reduce.matches)time+=dt;
    const easing=reduce.matches?1:1-Math.exp(-dt*7);
    const poseMode={sit:'type',light:'light',sparks:'sparks',balloons:'balloons',still:'still'};
    for(const k of Object.keys(pose))pose[k]=mix(pose[k],Number(target===poseMode[k]),easing);
    const {sit,light,sparks,balloons,still}=pose;
    if(!reduce.matches){tailPhase+=dt*1.7;walkClock+=dt;arrival=Math.max(0,arrival-dt*1.2);}
    const walk=reduce.matches?0:arrival;
    const walkKey=walkKeys[Math.floor(walkClock*8)%walkKeys.length];
    const bob=walk*walkKey[4];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.scale(canvas.width/300,canvas.height/380);
    // A window opens into the dark-blue beam when Images or Videos is selected.
    ctx.globalAlpha=light;
    const glow=ctx.createLinearGradient(0,52,205,300);
    glow.addColorStop(0,'rgba(22,104,174,.56)');glow.addColorStop(1,'rgba(27,111,189,.06)');
    path('M0 23 L74 34 L224 346 L9 288 Z',glow);
    // The sash pivots around its right edge as the beam comes in.
    ctx.save();ctx.translate(69,30);ctx.rotate(-.12*light);ctx.scale(1-.18*light,1);
    line([[-69,-10],[0,0],[0,68],[-69,48],[-69,-10]],5,'#18334c');
    line([[-35,-5],[-35,58]],3,'#18334c');
    line([[-69,18],[0,34]],3,'#18334c');ctx.restore();
    ctx.globalAlpha=1;
    // Small desk and chair face left, just like the character.
    ctx.globalAlpha=sit;
    line([[37,265],[112,265]],5);line([[52,265],[45,354]],4);
    path('M22 210 L64 213 L66 249 L20 247 Z');path('M43 247 L49 262 L32 262 L38 247 Z');
    line([[133,286],[176,286],[184,350]],5);line([[133,286],[118,349]],4);line([[176,286],[185,244]],5);
    ctx.globalAlpha=1;
    const x=109+sit*39, y=249+sit*26+bob;
    // Long fluffy tail, waved from its base with a slower follow-through at the tip.
    ctx.save();ctx.translate(x+12,y-5);ctx.rotate(Math.sin(tailPhase)*.055*(1-sit*.6)*(1-still));ctx.scale(.55-sit*.05,.76);
    path('M0 0 C35 -10 48 30 81 36 C110 43 139 34 153 13 C161 0 168 -3 172 2 L171 -5 L178 4 L178 -1 C196 22 179 53 154 65 L159 65 C115 89 68 70 42 43 C24 22 19 8 0 10 Z');ctx.restore();
    // The front and back feet hold the ground during contact and down poses.
    for(const i of [1,0]){
      const stepX=walkKey[i]*walk+still*(i?18:-7);
      const footLift=walk*walkKey[i+2]+still*(i?9:0);
      const ankle=[mix(x+(i?-5:4)+stepX,x-42+(i?8:0),sit),mix(346-footLift,345,sit)];
      const hip=[x+(i?-6:5),y];
      const knee=[mix((hip[0]+ankle[0])/2+(i?-5:5)+footLift*.2,x-37+(i?3:-3),sit),mix(y+45+footLift*.12,y+9,sit)];
      line([hip,knee,ankle],i?12:15);
      line([ankle,[ankle[0]-13,ankle[1]+2]],i?8:10);
    }
    // Shorts and oversized shirt.
    ctx.save();ctx.translate(x,y);
    path('M-17 -14 L17 -15 L21 16 L-19 17 Z');
    path('M-12 -94 C-26 -85 -27 -64 -23 -46 L-20 -8 Q1 0 25 -16 C27 -51 12 -72 6 -93 Z');
    line([[-4,-94],[-7,-107]],12);
    // Scale the head around the neck so the body-to-head ratio stays consistent.
    ctx.save();ctx.translate(-6,-109);ctx.rotate(-sit*1.18-balloons*.58);ctx.scale(.67,.67);
    path('M-11 6 L-17 -18 L-29 -27 Q-39 -33 -32 -40 L-28 -46 L-28 -54 L-16 -51 C-14 -68 9 -73 21 -63 L18 -69 Q48 -76 56 -49 L61 -57 Q68 -38 57 -27 L70 -35 Q70 -13 55 -10 L66 -11 Q60 0 47 -2 L50 5 Q38 10 32 2 Q29 13 19 5 Q7 14 1 5 Z');
    path('M30 -37 L43 -48 L40 -26 L31 -17 L36 -33 Z','#f6f5f1');ctx.restore();
    // Arms stay pocketed during the still poses and brief cautious step.
    for(const sign of [-1,1]){
      const shoulder=[x+sign*8,y-82];
      let elbow=[x-24+sign*4,y-49], hand=[x-11+sign*3,y-22];
      elbow=[mix(elbow[0],x-28,balloons),mix(elbow[1],y-53,balloons)];
      hand=[mix(hand[0],x-43,balloons),mix(hand[1],y-69,balloons)];
      elbow=[mix(elbow[0],x-26,sit),mix(elbow[1],y-23,sit)];
      hand=[mix(hand[0],x-62+sign*4,sit),mix(hand[1],y-20+Math.sin(time*15+sign)*2,sit)];
      ctx.restore();line([shoulder,elbow,hand],9);ctx.save();ctx.translate(x,y);
    }
    ctx.restore();
    // Individual colored balloons share a hand anchor and sway on fine strings.
    ctx.globalAlpha=balloons;
    const colors=['#b63856','#d9a738','#458783','#7564a0','#d57542'];
    colors.forEach((color,i)=>{
      const bx=x-43+(i-2)*19+Math.sin(time*1.4+i*.7)*5;
      const by=y-185-Math.sin(i*1.7)*17+Math.sin(time*1.8+i)*3;
      line([[x-43,y-69],[bx,by+20]],.65,'#77746e');
      ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(bx,by,13,18,-.12+(i-2)*.1,0,Math.PI*2);ctx.fill();
      path('M'+(bx-2)+' '+(by+18)+' L'+(bx+2)+' '+(by+18)+' L'+bx+' '+(by+22)+' Z',color);
    });
    ctx.globalAlpha=1;
    // Pixel sparks rise independently from the head in the Projects section.
    const palette=['#d34f39','#b57c08','#5d49a4','#187f7d','#cc477e'];
    for(let i=0;i<36;i++){
      const progress=(time*(.56+(i%4)*.09)+i*.271)%1;
      const spread=Math.sin(i*12.9898)*20;
      const px=x-8+spread+Math.sin(progress*4+i)*5;
      const py=y-160-progress*(52+(i%3)*13);
      ctx.globalAlpha=sparks*(1-progress*.7);
      ctx.fillStyle=palette[i%palette.length];
      ctx.fillRect(Math.round(px),Math.round(py),i%5===0?6:4,i%5===0?6:4);
    }
    ctx.restore();
  }
  function frame(now){const dt=Math.min((now-last)/1000||0,.04);last=now;draw(dt);raf=requestAnimationFrame(frame);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else{last=performance.now();raf=requestAnimationFrame(frame);}});
  const initial=document.getElementById(location.hash.slice(1));setSection(initial?.closest('section')?.id || 'about');
  resize();raf=requestAnimationFrame(frame);
})();
