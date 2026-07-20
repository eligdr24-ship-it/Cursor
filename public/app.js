let current = null;
const $ = id => document.getElementById(id);
const USERS = {
  operator1: { id:'operator1', name:'Operator 1' },
  operator2: { id:'operator2', name:'Operator 2' },
  operator3: { id:'operator3', name:'Operator 3' },
  operator4: { id:'operator4', name:'Operator 4' }
};
function currentUserId(){ const p = location.pathname.split('/').filter(Boolean); const id=String(p[1]||'').toLowerCase().replace(/[^a-z0-9_-]/g,''); return /^operator\d+$/.test(id) ? id : 'operator1'; }
const USER_ID = currentUserId();
let USER = USERS[USER_ID] || { id: USER_ID, name: `Operator ${USER_ID.replace('operator','')||''}`.trim() };
function setUserName(name){ if(name){ USER.name=name; if($('operatorLabel')) $('operatorLabel').textContent = `${USER.name} Work Dashboard`; document.title = `${USER.name} Work Dashboard`; }}
async function api(p,opt={}){
  opt.headers = { ...(opt.headers || {}), 'Content-Type':'application/json' };
  const r = await fetch(p,opt);
  const text = await r.text();
  let j;
  try { j = text ? JSON.parse(text) : {}; }
  catch { throw new Error(`Backend returned ${r.status}: ${text.slice(0,120)}`); }
  if(!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}
function showWork(){
  document.title = `${USER.name} Work Dashboard`;
  $('operatorLabel').textContent = `${USER.name} Work Dashboard`;
  $('analyticsLink').href = `/analytics/${USER_ID}`;
}
function setStatus(message, tone=''){
  const el = $('updatedLabel');
  if(!el) return;
  el.textContent = message;
  el.className = tone ? `status-text ${tone}` : 'status-text';
}
function setBusy(isBusy){
  ['next','copy','done'].forEach(id=>{ const el=$(id); if(el) el.disabled = !!isBusy; });
  const open=$('open');
  if(open) open.classList.toggle('is-disabled', !!isBusy);
}
function setEmpty(msg){
  $('txt').value = msg;
  $('open').href = '#';
  $('openTextLink').href = '#';
  $('openTextLink').textContent = 'No active link';
  $('sourceLabel').textContent = '';
  current = null;
  $('readyPill').textContent = 'Complete';
  setStatus('All work in this upload is complete.', 'success');
}
async function loadNext(){
  setBusy(true);
  setStatus('Loading the next randomized link and text...');
  const j = await api(`/api/next?user=${USER_ID}`);
  if(j.completed){
    if(j.status && j.status.user) setUserName(j.status.user.name);
    setEmpty('All available links or text suggestions have already been marked done. Upload more data or reset progress in admin.');
    setBusy(false);
    return;
  }
  current = j;
  if(j.status && j.status.user) setUserName(j.status.user.name);
  $('txt').value = j.text;
  $('open').href = j.link;
  $('openTextLink').href = j.link;
  $('openTextLink').textContent = j.link;
  $('sourceLabel').textContent = j.source ? `Source: ${j.source}` : '';
  $('linkLabel').textContent = `Link ${j.linkIdx + 1}: ${j.link}`;
  $('copy').textContent = '▣ Copy Text';
  $('readyPill').textContent = 'Ready';
  $('submittedLink').value = '';
  setStatus('Ready. Copy the text, open the link, then mark done.', 'success');
  setBusy(false);
}
async function markDone(){
  if(!current) return;
  setBusy(true);
  setStatus('Saving completion and loading the next item...');
  const submittedLink = $('submittedLink').value.trim();
  await api('/api/done',{
    method:'POST',
    body:JSON.stringify({ linkIdx:current.linkIdx, textIdx:current.textIdx, userId:USER_ID, submittedLink })
  });
  await loadNext();
}
function init(){
  showWork();
  $('next').onclick = () => loadNext().then(()=>setStatus('Skipped. A fresh item is ready.')).catch(e => { setBusy(false); setStatus(e.message, 'error'); alert(e.message); });
  $('copy').onclick = async()=>{
    try { await navigator.clipboard.writeText($('txt').value); $('copy').textContent = 'Copied'; setStatus('Text copied. Now open the link and post the review text.', 'success'); setTimeout(()=>$('copy').textContent='▣ Copy Text',1100); }
    catch { setStatus('Copy failed. Select the text and copy manually.', 'error'); alert('Copy failed. Select the text and copy manually.'); }
  };
  $('done').onclick = () => markDone().catch(e => { setBusy(false); setStatus(e.message, 'error'); alert(e.message); });
  loadNext().catch(e => { setBusy(false); setStatus(e.message, 'error'); alert(e.message); });
}
init();
