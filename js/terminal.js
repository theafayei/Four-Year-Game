// A small, scenario-driven terminal. No shell commands are executed on the computer.
class TerminalEngine {
  constructor({container, scenario, state, onChange, onFinish}) {
    this.container=container;this.scenario=scenario;this.state=state;
    this.onChange=onChange;this.onFinish=onFinish;this.historyIndex=state.history.length;this.draft='';
  }
  mount() {
    this.container.innerHTML = '<div class="mission"><h3></h3><p class="situation"></p><p class="mission-goal"></p><strong class="mission-progress"></strong><label class="patience-label">Patience <progress max="100"></progress></label><div class="hint-controls"><button type="button" class="hint-one">Hint 1: idea</button><button type="button" class="hint-two">Hint 2: command</button></div><div class="mission-hint hidden" role="status"></div></div>' +
      '<div class="terminal-workspace"><div class="remote-login hidden"><p>SSH connection · Client server</p><label>Username <input value="admin" readonly></label><p class="sticky-note">Password on your note: campus123</p><label>Password <input class="login-password" type="text" autocomplete="off"></label><button type="button" class="login-connect">Connect</button><p class="login-feedback" role="status"></p></div>' +
      '<div class="fake-browser hidden"><div class="browser-title">Capstone · localhost <button class="browser-reload" type="button">Reload</button></div><div class="browser-error"></div><p class="browser-clue"></p></div>' +
      '<div class="terminal-window"><div class="terminal-title"><span aria-hidden="true">● ● ●</span> student terminal</div><div class="terminal-output" role="log" aria-label="Command output" aria-live="polite"></div><form class="terminal-input-row"><label class="terminal-prompt" for="bossCommand">project &gt;</label><input id="bossCommand" class="terminal-input" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command"><span class="terminal-cursor" aria-hidden="true">▌</span><button type="submit">Run</button></form></div>' +
      '<label class="easy-label"><input class="easy-toggle" type="checkbox"> Easy Mode · command suggestions</label><div class="command-suggestions"></div><button type="button" class="terminal-continue hidden">Continue</button></div>';
    const find=selector=>this.container.querySelector(selector);
    this.log=find('.terminal-output');this.input=find('.terminal-input');
    find('.mission h3').textContent=this.scenario.title;
    find('.situation').textContent=this.scenario.situation;
    find('.mission-goal').textContent='Goal: '+this.scenario.goal;
    find('.terminal-input-row').addEventListener('submit',event=>{event.preventDefault();const command=this.input.value;this.input.value='';this.execute(command);});
    this.input.addEventListener('keydown',event=>{
      if(event.key!=='ArrowUp'&&event.key!=='ArrowDown')return;
      event.preventDefault();
      if(this.historyIndex===this.state.history.length)this.draft=this.input.value;
      this.historyIndex=Math.max(0,Math.min(this.state.history.length,this.historyIndex+(event.key==='ArrowUp'?-1:1)));
      this.input.value=this.historyIndex===this.state.history.length?this.draft:this.state.history[this.historyIndex];
    });
    find('.hint-one').addEventListener('click',()=>this.showHint(1));
    find('.hint-two').addEventListener('click',()=>this.showHint(2));
    find('.easy-toggle').checked=this.state.easy;
    find('.easy-toggle').addEventListener('change',event=>{this.state.easy=event.target.checked;this.refresh();this.onChange();});
    find('.browser-reload').addEventListener('click',()=>this.execute('reload'));
    find('.terminal-continue').addEventListener('click',()=>{
      find('.terminal-continue').disabled=true;
      this.onFinish(this.state.won);
    });
    find('.login-connect').addEventListener('click',()=>{
      if(find('.login-password').value.trim()!=='campus123') {
        find('.login-feedback').textContent='Use campus123 from the sticky note. No patience lost.';return;
      }
      find('.login-feedback').textContent='Connecting…';find('.login-connect').disabled=true;
      setTimeout(()=>{this.state.loggedIn=true;this.print('Connected as admin. Check what is filling the disk.','success');this.refresh();this.onChange();this.input.focus();},450);
    });
    if(!this.state.output.length)this.print(this.scenario.situation,'info');
    this.refresh();
  }
  print(text,type='info') {
    this.state.output.push({text:String(text),type});
    // Bound save size, while retaining enough scrollback to review the mission.
    if(this.state.output.length>150)this.state.output.shift();
    if(this.log){const line=document.createElement('div');line.className='terminal-line '+type;line.textContent=text;this.log.appendChild(line);this.log.scrollTop=this.log.scrollHeight;}
  }
  showHint(level) {
    if(this.state.finished)return;
    this.state.hintLevel=level;this.refresh();this.onChange();
  }
  commands() {
    const basics=[['help','List commands and their meanings'],['clear','Clear the terminal window'],['history','Show your earlier commands']];
    const steps=this.scenario.steps.map(step=>[step.command,step.meaning]);
    const extra=this.scenario.browser?[['ls','List project files'],['cat .env','Read the app settings'],['php artisan list','List maintenance commands'],['php artisan about','Show application details'],['npm install','Install frontend dependencies'],['reload','Refresh the capstone page']]:[];
    return [...basics,...steps,...extra].filter(([command],index,all)=>all.findIndex(([other])=>normalizeCommand(other)===normalizeCommand(command))===index);
  }
  execute(raw) {
    if(this.state.finished||!this.state.loggedIn)return;
    const command=String(raw||'').trim();if(!command)return;
    this.state.history.push(command);this.historyIndex=this.state.history.length;
    this.print('project > '+command,'prompt');
    const normalized=normalizeCommand(command);
    const known=this.commands().find(([key])=>normalizeCommand(key)===normalized);
    if(!known){
      this.print('✖ command not found: '+command,'error');
      this.print('Type help to see the commands you can use.','clue');
      this.state.patience=Math.max(0,this.state.patience-10);this.state.wrongStreak+=1;
      if(this.state.wrongStreak>=2)this.state.hintLevel=Math.max(1,this.state.hintLevel);
      if(this.state.patience===0)this.complete(false);
      soundEngine.fail();this.refresh();this.onChange();return;
    }
    this.print('✔ Correct command','success');
    this.state.wrongStreak=0;
    const step=this.scenario.steps[this.state.step];
    if(normalized==='help')this.commands().forEach(([key,meaning])=>this.print(key+' — '+meaning));
    else if(normalized==='clear'){this.state.output=[];this.print('✔ Terminal cleared','success');}
    else if(normalized==='history')this.print(this.state.history.join('\n'));
    else if(normalized==='reload'&&this.scenario.browser){
      if(this.state.awaitReload){
        this.state.awaitReload=false;this.state.step+=1;this.state.hintLevel=0;
        if(this.state.step>=this.scenario.steps.length)this.complete(true);
        else this.print('New page error: '+this.scenario.errors[this.state.step],'clue');
      }else this.print('The page still shows the current error. Fix it first, then reload.','clue');
    }else if(this.scenario.browser&&['ls','cat .env','php artisan list','php artisan about','npm install'].includes(normalized)){
      const keyed=this.state.step>0||(this.state.step===0&&this.state.awaitReload);
      const outputs={'ls':'app  artisan  .env  database  public  resources  package.json','cat .env':'APP_NAME=Capstone\nAPP_KEY='+(keyed?'base64:demo-generated-key':'')+'\nAPP_DEBUG=true\nDB_DATABASE=capstone','php artisan list':'key:generate — create app key\nmigrate — create tables\nconfig:clear — forget cached settings','php artisan about':'Laravel capstone · local environment','npm install':'Dependencies installed successfully.'};
      this.print(outputs[normalized]);
    }else if(normalized===normalizeCommand(step.command)){
      if(this.state.awaitReload)this.print('This fix is already applied. Type reload to inspect the page.','clue');
      else{
        this.print(step.output,'success');soundEngine.success();
        if(this.scenario.browser){this.state.awaitReload=true;this.print('Fix applied. Type reload or click Reload.','clue');}
        else{
          this.state.step+=1;this.state.hintLevel=0;this.print(step.clue,'clue');
          if(this.state.step>=this.scenario.steps.length)this.complete(true);
        }
      }
    }else{
      const found=this.scenario.steps.find(item=>normalizeCommand(item.command)===normalized);
      const isDiagnostic=/^(show|select|ping|tail|ls|df|systemctl status)\b/i.test(command);
      if(found&&isDiagnostic){
        let output=found.output;
        if(this.scenario.id==='databaseDown'&&normalized==='select count(*) from students')output=this.state.step>=4?'120':'0';
        this.print(output);
      }
      this.print('Follow the current task first: '+step.meaning+'. No patience lost.','clue');
    }
    this.refresh();this.onChange();
  }
  complete(won) {
    this.state.finished=true;this.state.won=won;
    this.print(won?'✔ SYSTEM RECOVERED — well done!':'Patience ran out. You can continue the story.',''+(won?'success':'error'));
  }
  refresh() {
    const find=selector=>this.container.querySelector(selector);
    const step=this.scenario.steps[this.state.step];
    const fixed=this.state.step+(this.state.awaitReload?1:0);
    find('.mission-progress').textContent=(this.scenario.browser?'Bugs fixed: ':'Steps completed: ')+fixed+'/'+this.scenario.steps.length;
    find('progress').value=this.state.patience;
    find('progress').setAttribute('aria-label','Patience: '+this.state.patience+'/100');
    this.log.replaceChildren();
    this.state.output.forEach(({text,type})=>{const line=document.createElement('div');line.className='terminal-line '+type;line.textContent=text;this.log.appendChild(line);});
    this.log.scrollTop=this.log.scrollHeight;
    find('.remote-login').classList.toggle('hidden',this.state.loggedIn);
    find('.terminal-window').classList.toggle('hidden',!this.state.loggedIn);
    find('.easy-label').classList.toggle('hidden',!this.state.loggedIn||this.state.finished);
    this.input.disabled=this.state.finished;
    find('.terminal-continue').classList.toggle('hidden',!this.state.finished);
    find('.fake-browser').classList.toggle('hidden',!this.scenario.browser);
    if(this.scenario.browser){
      find('.browser-error').textContent=this.state.won?'✔ Capstone dashboard — everything is working!':'➜ Read this line: '+this.scenario.errors[Math.min(this.state.step,3)];
      find('.browser-clue').textContent=this.state.won?'Ready for defense.':this.scenario.clues[Math.min(this.state.step,3)];
      find('.browser-reload').disabled=this.state.finished;
    }
    const hint=find('.mission-hint');hint.classList.toggle('hidden',this.state.hintLevel===0||this.state.finished);
    if(step)hint.textContent=this.state.awaitReload?'Type reload to check the page.':this.state.hintLevel===2?'Type: '+step.command:'Try this: '+step.meaning+'.';
    const suggestions=find('.command-suggestions');suggestions.replaceChildren();
    if(this.state.easy&&this.state.loggedIn&&!this.state.finished){
      const command=this.state.awaitReload?'reload':step.command;
      const button=document.createElement('button');button.type='button';button.textContent=command;button.title='Fill this command, then press Enter';
      button.addEventListener('click',()=>{this.input.value=command;this.input.focus();});suggestions.appendChild(button);
      const note=document.createElement('small');note.textContent='Click to fill, then press Enter or Run.';suggestions.appendChild(note);
    }
  }
}
