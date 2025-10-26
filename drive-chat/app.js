/* global CHAT_PORTAL_CONFIG */
(function(){
  const cfg = (typeof CHAT_PORTAL_CONFIG !== 'undefined') ? CHAT_PORTAL_CONFIG : {
    webhookUrl: 'https://your-n8n-domain/webhook/chat-message',
    apiKey: '',
  };

  const chatEl = document.getElementById('chat');
  const inputEl = document.getElementById('input');
  const formEl = document.getElementById('composer');
  const statusEl = document.getElementById('status');
  const clearBtn = document.getElementById('clear');

  const sessionId = (()=>{
    const k='chat_portal_session_id';
    let v = localStorage.getItem(k);
    if(!v){ v = crypto.randomUUID(); localStorage.setItem(k, v); }
    return v;
  })();

  const historyKey = 'chat_portal_history_v1';
  let history = []; try{ history = JSON.parse(localStorage.getItem(historyKey)||'[]'); }catch{}
  history.forEach(m => renderMsg(m.role, m.text));
  scrollToBottom();

  clearBtn.addEventListener('click', () => {
    history = []; localStorage.setItem(historyKey, '[]'); chatEl.innerHTML=''; setStatus('Cleared');
  });

  formEl.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = inputEl.value.trim(); if(!text) return;
    inputEl.value='';
    pushHistory('user', text); renderMsg('user', text); scrollToBottom();

    const typingId = renderTyping();
    setSending(true);
    try{
      const res = await fetch(cfg.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {})
        },
        body: JSON.stringify({ chatInput: text, sessionId })
      });

      if(!res.ok){ throw new Error(`HTTP ${res.status}`); }

      const ct = res.headers.get('content-type') || '';
      let replyText = '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        // Support different field names: reply | result | output | message
        replyText = data.reply ?? data.result ?? data.output ?? data.message ?? JSON.stringify(data);
      } else {
        replyText = await res.text();
      }

      removeTyping(typingId);
      pushHistory('assistant', replyText); renderMsg('assistant', replyText); scrollToBottom();
      setStatus('OK');
    } catch(err){
      removeTyping(typingId);
      const msg = `Error: ${err.message}. Check CORS/URL.`;
      pushHistory('assistant', msg); renderMsg('assistant', msg); scrollToBottom();
      setStatus('Error');
    } finally {
      setSending(false);
    }
  });

  function pushHistory(role, text){
    history.push({ role, text });
    localStorage.setItem(historyKey, JSON.stringify(history).slice(0, 200000));
  }

  function renderMsg(role, text){
    const tpl = document.getElementById('msg-template');
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.classList.toggle('user', role === 'user');
    node.querySelector('.avatar').textContent = role === 'user' ? 'U' : 'A';
    node.querySelector('.bubble').textContent = text;
    chatEl.appendChild(node);
  }

  function renderTyping(){
    const tpl = document.getElementById('msg-template');
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector('.avatar').textContent = 'A';
    const b = node.querySelector('.bubble');
    b.innerHTML = '<span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
    chatEl.appendChild(node);
    return node;
  }
  function removeTyping(node){ if(node && node.remove) node.remove(); }

  function setSending(s){
    document.getElementById('send').disabled = s;
    statusEl.textContent = s ? 'Sending…' : 'Ready';
  }
  function setStatus(s){ statusEl.textContent = s; }
  function scrollToBottom(){ chatEl.scrollTop = chatEl.scrollHeight; }
})();
