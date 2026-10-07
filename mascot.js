(() => {
  const canvas = document.getElementById('quella-mascot');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
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
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current=sections.at(-1)?.id || current;
    if(current!==active) setSection(current);
  }
  addEventListener('scroll',track,{passive:true});
  addEventListener('hashchange',()=>{const el=document.getElementById(location.hash.slice(1));setSection(el?.closest('section')?.id || (el?.id==='about'?'about':active));});
  function resize(){const r=canvas.getBoundingClientRect();const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);}
  new ResizeObserver(resize).observe(canvas);

  const shapes={"head":"M252,88 L262,88 L263,90 L254,96 L251,103 L264,97 L280,96 L287,91 L296,89 L316,90 L334,97 L348,107 L354,116 L359,136 L357,152 L365,140 L367,125 L370,124 L376,144 L376,175 L374,183 L365,198 L381,191 L390,182 L397,167 L401,166 L399,198 L390,217 L385,222 L386,224 L394,218 L396,222 L383,239 L369,244 L373,253 L379,256 L380,259 L366,261 L353,255 L352,268 L345,284 L336,295 L323,304 L319,304 L319,301 L324,290 L311,297 L305,297 L297,289 L293,290 L287,299 L287,305 L267,298 L259,289 L250,291 L253,296 L251,299 L240,293 L237,305 L229,301 L231,307 L240,307 L244,316 L232,316 L226,341 L159,341 L159,329 L166,325 L167,321 L167,303 L160,287 L155,258 L147,249 L120,230 L109,217 L110,211 L119,197 L120,185 L129,182 L129,166 L137,164 L139,148 L161,154 L173,152 L176,142 L189,127 L210,115 L224,112 L223,110 L214,111 L213,109 L216,106 L236,93 Z M203,134 L181,148 L181,150 L188,152 L198,159 L198,146 Z M333,154 L303,173 L297,185 L297,198 L312,178 L325,172 L324,187 L323,203 L311,227 L326,217 L333,204 L335,165 L335,154 Z","body":"M230,307 L247,326 L247,332 L275,378 L277,390 L286,412 L292,442 L295,490 L279,496 L274,507 L260,512 L254,550 L271,595 L272,630 L279,634 L282,652 L286,654 L287,658 L291,697 L299,739 L295,742 L282,744 L283,753 L198,768 L167,774 L163,774 L163,769 L135,769 L138,751 L135,746 L135,713 L139,682 L136,647 L141,640 L131,620 L129,600 L117,567 L108,528 L105,502 L121,413 L148,341 L157,336 L158,330 L166,325 L168,313 Z M138,459 L138,502 L162,521 L173,569 L167,608 L159,627 L161,629 L169,626 L181,622 L187,581 L164,514 L161,499 L142,495 Z","torso":"M230,307 L247,326 L247,332 L275,378 L277,390 L286,412 L292,442 L295,490 L279,496 L274,507 L260,512 L254,550 L271,595 L272,630 L279,634 L282,652 L286,654 L287,658 L291,697 L299,739 L295,742 L282,744 L283,753 L189,769 L167,774 L163,774 L163,769 L135,769 L168,627 L181,622 L187,588 L187,581 L164,514 L161,499 L151,498 L146,495 L135,448 L154,340 L158,330 L166,325 L169,318 Z","nearLeg":"M248,745 L260,786 L248,843 L236,919 L236,970 L240,980 L240,1023 L253,1083 L252,1124 L247,1175 L248,1205 L251,1223 L264,1261 L264,1279 L262,1285 L258,1287 L240,1286 L180,1294 L163,1294 L158,1297 L150,1295 L137,1297 L133,1294 L122,1295 L120,1292 L112,1290 L107,1284 L107,1277 L110,1273 L119,1272 L134,1264 L155,1259 L184,1245 L194,1236 L209,1215 L206,1161 L183,999 L174,976 L177,928 L168,860 L160,748 Z M263,799 L271,828 L250,901 L250,904 L248,904 L245,897 L247,874 Z","farLeg":"M275,744 L282,744 L291,785 L301,817 L326,946 L334,964 L351,984 L365,1010 L405,1149 L420,1170 L440,1186 L448,1201 L448,1208 L441,1218 L419,1232 L387,1264 L384,1271 L377,1278 L356,1285 L339,1285 L332,1288 L322,1286 L316,1278 L316,1273 L331,1263 L345,1258 L350,1253 L382,1188 L369,1150 L343,1099 L292,997 L274,979 L264,938 L245,897 L248,867 L262,810 L264,785 L259,786 L236,919 L236,970 L250,1024 L254,1062 L229,957 L246,748 Z","tail":"M1012,617 L1035,617 L1047,623 L1049,623 L1047,619 L1053,619 L1062,626 L1068,627 L1079,643 L1081,633 L1084,633 L1090,641 L1096,667 L1098,664 L1097,656 L1099,656 L1107,681 L1105,702 L1107,713 L1102,728 L1104,730 L1103,746 L1091,765 L1088,775 L1076,789 L1076,791 L1081,789 L1080,792 L1066,807 L1055,814 L1056,816 L1065,812 L1065,815 L1053,824 L1050,829 L1035,838 L1042,837 L1040,841 L1024,850 L1022,855 L1007,862 L1009,863 L1007,867 L980,877 L979,879 L988,878 L988,880 L966,887 L971,888 L970,890 L940,896 L950,897 L950,899 L926,904 L924,905 L925,909 L905,912 L903,915 L880,917 L879,921 L873,923 L851,924 L851,927 L813,925 L810,926 L812,930 L808,931 L783,930 L787,932 L786,934 L736,931 L723,932 L724,934 L710,932 L711,934 L708,935 L682,926 L678,929 L658,920 L655,920 L660,923 L658,925 L637,916 L633,917 L625,914 L607,903 L608,908 L604,908 L589,898 L584,898 L579,893 L574,892 L565,884 L560,886 L547,875 L543,877 L526,860 L523,863 L492,829 L489,830 L486,827 L477,810 L473,811 L469,798 L457,777 L449,770 L451,775 L451,778 L449,778 L434,755 L429,752 L420,738 L418,737 L419,741 L417,741 L407,731 L400,719 L386,706 L383,708 L377,706 L348,690 L310,688 L301,685 L290,687 L299,739 L295,742 L280,745 L278,634 L283,654 L304,650 L313,650 L313,652 L318,653 L366,654 L398,662 L404,665 L405,668 L423,674 L464,702 L467,709 L485,721 L485,726 L518,754 L516,757 L527,765 L533,774 L552,786 L546,786 L547,788 L569,797 L569,802 L593,811 L596,815 L611,819 L613,822 L636,825 L638,828 L647,830 L687,834 L732,830 L764,822 L773,823 L791,816 L806,815 L822,810 L837,798 L844,797 L863,780 L867,783 L877,773 L886,770 L893,762 L895,764 L892,768 L897,768 L897,772 L914,752 L917,754 L928,738 L928,736 L924,739 L921,737 L928,726 L924,726 L924,723 L932,710 L930,701 L938,689 L940,681 Z"};
  const mix=(a,b,t)=>a+(b-a)*t;
  function shape(name,warp) {
    let d=shapes[name];
    if(warp)d=d.replace(/(-?\d+),(-?\d+)/g,(_,x,y)=>{const p=warp(+x,+y);return p[0]+','+p[1];});
    ctx.fillStyle='#090909';ctx.fill(new Path2D(d),'evenodd');
  }
  function path(d,color='#090909'){ctx.fillStyle=color;ctx.fill(new Path2D(d));}
  function line(p,width=1,color='#535450'){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
  // Draw each special pose as a complete figure in the 300 × 380 canvas.
  // Neck, waist, hips and joints share coordinates instead of mixing outlines.
  function portraitHead(x,y,tilt=0) {
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.scale(.23,.23);
    ctx.translate(-199,-320);shape('head');ctx.restore();
  }
  function portraitTail(x,y,amount=1) {
    ctx.save();ctx.translate(x,y);
    ctx.rotate(reduce.matches?0:Math.sin(tailPhase)*.022*amount);
    ctx.scale(.15,.19);ctx.translate(-280,-665);shape('tail');ctx.restore();
  }
  function drawBiography(alpha) {
    if(alpha<.001)return;
    ctx.save();ctx.globalAlpha=alpha;
    portraitTail(101,214);
    // Far leg, then near leg: both connect inside the same pelvis.
    path('M88 213 Q102 213 105 227 L111 270 Q111 279 117 289 L132 325 L143 332 Q148 338 141 341 L123 341 Q117 340 116 333 L102 294 Q98 283 97 276 L84 241 Z');
    path('M72 214 L94 216 Q98 237 92 258 L86 282 L84 323 Q84 329 88 334 Q91 341 83 342 L52 342 Q46 340 49 336 L68 326 L70 282 L68 255 Z');
    // A straight shirt and softly shaped pelvis preserve a substantial waist.
    path('M73 116 L88 116 Q98 121 102 133 Q107 149 104 167 L101 189 Q100 201 104 214 L108 228 Q91 234 68 228 L71 211 Q74 202 72 189 L65 164 Q62 149 65 135 Q66 123 73 116 Z');
    // Relaxed far hand rests by the hip.
    path('M96 130 Q104 131 106 143 L111 181 L105 211 Q103 219 98 217 Q94 216 97 209 L101 182 L92 146 Z');
    // Bent near arm and closed hand meet the balloon strings at (38,158).
    path('M77 127 Q66 127 64 142 L61 173 L44 158 Q40 151 35 154 Q30 158 36 163 L56 186 Q65 193 74 182 L84 151 Q91 134 77 127 Z');
    portraitHead(81,119,-.025);
    const colors=['#ae5365','#b59645','#4c8986','#797099','#bc784d'];
    const centers=[[19,47],[32,31],[45,55],[58,42],[71,30]];
    centers.forEach(([x,y],i)=>{
      const bx=x+(reduce.matches?0:Math.sin(time*.8+i)*1.7);
      const by=y+(reduce.matches?0:Math.sin(time+i)*1.4);
      line([[38,158],[bx,by+14]],.65,'#87847c');
      ctx.fillStyle=colors[i];ctx.beginPath();ctx.ellipse(bx,by,9,14,(i-2)*.06,0,Math.PI*2);ctx.fill();
    });
    // Repaint the fingers above the strings so the grip is unambiguous.
    path('M35 154 Q40 152 43 157 L45 164 L39 166 L34 160 Z');
    ctx.restore();
  }
  function drawArticles(alpha) {
    if(alpha<.001)return;
    ctx.save();ctx.globalAlpha=alpha;
    // Desk and chair use the same floor (y=342) and a seat at y=246.
    path('M22 145 L58 145 L58 181 L22 181 Z');
    path('M37 181 L42 181 L43 188 L51 190 L28 190 L36 188 Z');
    path('M72 189 L104 189 L107 192 L70 192 Z');
    line([[17,195],[118,195]],3,'#111');
    line([[26,196],[26,342]],2.2,'#111');line([[113,196],[113,342]],2.2,'#111');
    line([[114,246],[164,246],[169,195]],3,'#111');
    line([[124,247],[119,342]],2.5,'#111');line([[158,247],[173,342]],2.5,'#111');
    portraitTail(147,224,.7);
    // Far thigh is horizontal; the calf and shoe sit slightly behind the near leg.
    path('M139 216 Q157 216 157 231 Q153 244 136 247 L102 249 L110 322 L122 331 Q130 339 122 342 L97 342 Q91 340 94 332 L95 322 L85 252 Q82 234 96 228 Z');
    // The near thigh extends from the seat toward a clear knee below the desk.
    path('M125 219 Q143 216 149 231 Q151 240 138 245 L88 245 L89 323 L91 333 Q96 341 87 343 L60 343 Q54 341 58 336 L74 325 L71 246 Q69 231 83 228 Z');
    // Continuous torso: shoulders → ribcage → waist → seated pelvis.
    path('M112 117 L126 116 Q138 123 141 138 L146 175 L142 198 Q140 209 151 222 Q157 232 148 238 L123 237 Q115 232 116 221 L116 205 L110 183 L106 154 Q104 131 112 117 Z');
    // Far forearm rests on the keyboard; near elbow bends through a full contour.
    path('M130 133 Q137 133 139 143 L138 176 Q139 186 130 189 L98 192 L94 188 L122 180 L122 148 Z');
    const tap=reduce.matches?0:Math.sin(time*9)*.7;
    path('M116 133 Q107 133 108 146 L111 176 Q112 184 104 185 L78 '+(187+tap)+' Q70 '+(187+tap)+' 70 '+(190+tap)+' L77 '+(193+tap)+' L108 193 Q123 193 124 179 L124 147 Q126 136 116 133 Z');
    portraitHead(119,120,-.42);
    ctx.restore();
  }
  function draw(dt) {
    if(!reduce.matches){time+=dt;tailPhase+=dt*1.2;walkClock+=dt;arrival=Math.max(0,arrival-dt*.5);}
    const ease=reduce.matches?1:1-Math.exp(-dt*5);
    const map={sit:'type',light:'light',sparks:'sparks',balloons:'balloons',still:'still'};
    for(const k of Object.keys(pose))pose[k]=mix(pose[k],Number(target===map[k]),ease);
    const {sit,light,sparks,balloons,still}=pose;
    const walk=reduce.matches?0:Math.min(1,walkClock/.18,arrival/.24);
    const step=walkClock*8,frameIndex=Math.floor(step)%walkKeys.length;
    const blend=(step%1)*(step%1)*(3-2*(step%1));
    const key=walkKeys[frameIndex].map((v,i)=>mix(v,walkKeys[(frameIndex+1)%walkKeys.length][i],blend));
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();ctx.scale(canvas.width/300,canvas.height/380);
    ctx.globalAlpha=light;
    const beam=ctx.createLinearGradient(0,58,180,300);
    beam.addColorStop(0,'rgba(28,111,165,.4)');beam.addColorStop(1,'rgba(71,136,174,.025)');
    path('M0 20 L58 36 L210 340 L0 284 Z',beam);
    ctx.save();ctx.translate(58,36);ctx.rotate(-.13*light);ctx.scale(1-.16*light,1);
    line([[-58,-16],[0,0],[0,60],[-58,44],[-58,-16]],3,'#284659');
    line([[-29,-8],[-29,52]],1.5,'#284659');line([[-58,14],[0,30]],1.5,'#284659');ctx.restore();
    // Ordinary standing/walking poses retain their original traced silhouette.
    const standing=Math.max(0,1-sit-balloons);
    const offsetX=23,offsetY=44+walk*key[4]*.55;
    ctx.save();ctx.globalAlpha=standing;
    ctx.translate(offsetX,offsetY);ctx.scale(.23,.23);
    ctx.save();ctx.translate(280,665);
    ctx.rotate(Math.sin(tailPhase)*.024*(1-still));
    ctx.scale(.62,.86);ctx.translate(-280,-665);shape('tail');ctx.restore();
    const leg=(name,i)=>{
      shape(name,(x,y)=>{
        const t=Math.max(0,Math.min(1,(y-740)/560));
        const footShift=(key[i]*6.2+(i===1?-85:25))*walk;
        return [x+footShift*t*t,y-key[i+2]*walk*3*t*t];
      });
    };
    leg('farLeg',1);leg('nearLeg',0);shape('body');shape('head');
    ctx.restore();
    drawBiography(balloons);
    drawArticles(sit);
    ctx.globalAlpha=1;
    const colors2=['#bf593e','#a78435','#78639a','#528f89','#b76489'];
    for(let i=0;i<28;i++){
      const p=(time*(.35+(i%4)*.065)+i*.271)%1;
      ctx.globalAlpha=sparks*(1-p)*.85;
      ctx.fillStyle=colors2[i%colors2.length];
      const px=offsetX+56+Math.sin(i*12.99)*18*p+Math.sin(p*3+i)*3;
      const py=offsetY+18-p*(42+(i%3)*10);
      ctx.fillRect(Math.round(px),Math.round(py),i%6===0?4:2,i%6===0?4:2);
    }
    ctx.restore();
  }
  function frame(now){const dt=Math.min((now-last)/1000||0,.04);last=now;draw(dt);raf=requestAnimationFrame(frame);}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else{last=performance.now();raf=requestAnimationFrame(frame);}});
  const initial=document.getElementById(location.hash.slice(1));setSection(initial?.closest('section')?.id || 'about');
  resize();raf=requestAnimationFrame(frame);
})();

