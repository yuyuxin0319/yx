03.08 00:47
// ========== 第二个手机的功能脚本 ==========
let target='', photos=[], selectMode=false, selected=[], currIdx=0;
const $ = id => document.getElementById(id);
// 时钟
setInterval(()=>{const d=new Date();$('clock').innerText=`${String(d.getHours()).padStart(2,0)}:${String(d.getMinutes()).padStart(2,0)}`},1000);
// 打开手机内置应用（非微信）
function openApp(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });
    $(id).classList.remove('hidden');
    $(id).classList.add('active');
    // 确保微信容器隐藏
    $('#wx-app').classList.remove('active');
}
function goHome() { openApp('home'); }
// 打开微信应用
function openWxApp() {
    // 隐藏所有手机屏幕
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
    });
    // 显示微信容器，并激活微信登录页
    $('#wx-app').classList.add('active');
    wxShowScreen('wx-login-screen');
}
// 美化换图
function setTarget(t){ target=t; $('file').click(); }
$('file').onchange = e => {
    const f = e.target.files[0]; if(!f) return;
    const u = URL.createObjectURL(f);
    if(target==='wallpaper') $('home').style.backgroundImage = `url(${u})`;
    if(target==='avatar') $(target).innerHTML = `<img src="${u}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    if(target==='clock') $(target).style.background = `url(${u}) center/cover`;
    if(target.startsWith('widget-')) $(target).innerHTML = `<img src="${u}" style="width:100%;height:100%;object-fit:cover;">`;
    $('file').value='';
    alert('宝宝，更换成功啦！');
};
// 相册相关函数
function render(){
    const g = $('photoGrid');
    g.innerHTML = '';
    photos.forEach((p,i)=>{
        const div = document.createElement('div');
        div.className = 'photo-item';
        if(selected.includes(i)) div.classList.add('selected');
        div.style.backgroundImage = `url(${p.url})`;
        div.onclick = () => selectMode ? toggle(i) : openDetail(i);
        g.appendChild(div);
    });
}
function toggleSelect(){ selectMode=!selectMode; selected=[]; document.querySelectorAll('.btn-red,.btn-green').forEach(b=>b.style.display=selectMode?'inline-block':'none'); render(); }
function toggle(i){ selected.includes(i) ? selected=selected.filter(x=>x!==i) : selected.push(i); render(); }
function delSelect(){
    if(!selected.length) return;
    if(!confirm('宝宝确定要删除嘛꒦ິ^꒦ິ？')) return;
    photos = photos.filter((_,i)=>!selected.includes(i));
    selected=[]; selectMode=false;
    document.querySelectorAll('.btn-red,.btn-green').forEach(b=>b.style.display='none');
    render();
}
function shareSelect(){ alert('宝宝，分享成功啦！'); }
function openDetail(i){
    currIdx=i;
    const p=photos[i];
    const t=new Date(p.time);
    $('showImg').src = p.url;
    $('showTime').innerText = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2,0)}`;
    $('photo-detail').classList.remove('hidden');
}
function closeDetail(){ $('photo-detail').classList.add('hidden'); }
function openFirstPhoto(){
    if(!photos.length){ alert('宝宝，相册里还没照片哦，快去添加几张吧~'); return; }
    openDetail(0);
}
function shareDetail(){ alert('宝宝，分享成功啦！'); }
function removeDetail(){
    if(!confirm('宝宝确定要移出嘛꒦ິ^꒦ິ？')) return;
    photos.splice(currIdx,1);
    closeDetail();
    render();
}
function delDetail(){
    if(!confirm('宝宝确定要删除嘛꒦ິ^꒦ິ？')) return;
    photos.splice(currIdx,1);
    closeDetail();
    render();
}
function setWallpaper(){
    if(!confirm('宝宝确定设为壁纸嘛🥺？')) return;
    $('home').style.backgroundImage = `url(${photos[currIdx].url})`;
    alert('宝宝，壁纸设置成功啦！');
}
$('galleryFile').onchange = e => {
    [...e.target.files].forEach(f => { photos.push({url: URL.createObjectURL(f), time: Date.now()}); });
    render();
    alert('宝宝，照片添加成功啦！');
    $('galleryFile').value = '';
};
// ========== 微信功能脚本 (加wx前缀) ==========
let wxUsers = JSON.parse(localStorage.getItem('wx_users')) || [{name:'雨雨欣', prompt:'我是雨雨欣，身高150，双鱼座。'}];
let wxBots = JSON.parse(localStorage.getItem('wx_bots')) || [{name:'小助手', prompt:'你是一个写代码的小助手。'}];
let wxCurrentUser = null, wxCurrentBot = null, wxLastScreen = 'wx-login-screen';
function wxShowScreen(id) {
    document.querySelectorAll('#wx-app .screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';
    if (id === 'wx-login-screen') wxRenderUsers();
    if (id === 'wx-main-screen') wxRenderBots();
}
function wxRenderUsers() {
    const list = document.getElementById('wx-userList');
    if (!list) return;
    list.innerHTML = wxUsers.map((u, i) => `
        <div class="item-card" onclick="wxLogin(${i})">
            <div class="avatar">${u.name[0]}</div>
            <div class="info"><div class="name">${u.name}</div><div class="desc">点击登录</div></div>
        </div>
    `).join('');
}
function wxRenderBots() {
    const list = document.getElementById('wx-botList');
    if (!list) return;
    list.innerHTML = wxBots.map((b, i) => `
        <div class="item-card" onclick="wxStartChat(${i})">
            <div class="avatar" style="background:#07c160">${b.name[0]}</div>
            <div class="info"><div class="name">${b.name}</div><div class="desc">点击开始聊天</div></div>
        </div>
    `).join('');
}
function wxLogin(i) {
    wxCurrentUser = wxUsers[i];
    wxShowScreen('wx-main-screen');
}
function wxStartChat(i) {
    wxCurrentBot = wxBots[i];
    document.getElementById('wx-chatTitle').innerText = wxCurrentBot.name;
    wxShowScreen('wx-chat-screen');
    wxRenderMessages();
}
let wxEditType = '';
function wxShowEditor(type) {
    wxEditType = type;
    wxLastScreen = document.querySelector('#wx-app .screen[style*="display: flex"]')?.id || 'wx-main-screen';
    document.getElementById('wx-editName').value = '';
    document.getElementById('wx-editPrompt').value = '';
    document.getElementById('wx-editorTitle').innerText = type === 'user' ? '创建我的身份' : '创建好友人设';
    wxShowScreen('wx-editor-screen');
}
function wxCloseEditor() {
    wxShowScreen(wxLastScreen);
}
function wxSaveEditor() {
    const obj = { name: document.getElementById('wx-editName').value, prompt: document.getElementById('wx-editPrompt').value };
    if (wxEditType === 'user') { wxUsers.push(obj); localStorage.setItem('wx_users', JSON.stringify(wxUsers)); }
    else { wxBots.push(obj); localStorage.setItem('wx_bots', JSON.stringify(wxBots)); }
    wxShowScreen(wxLastScreen);
}
function wxRenderMessages() {
    if (!wxCurrentUser || !wxCurrentBot) return;
    const key = `chat_${wxCurrentUser.name}_${wxCurrentBot.name}`;
    const msgs = JSON.parse(localStorage.getItem(key)) || [];
    const chatBox = document.getElementById('wx-chatBox');
    chatBox.innerHTML = msgs.map(m => `
        <div class="msg-row ${m.role === 'user' ? 'user' : 'bot'}">
            <div class="avatar" style="width:35px;height:35px;font-size:14px;background:${m.role==='user'?'var(--wx-pink)':'#07c160'}">${m.role==='user'?wxCurrentUser.name[0]:wxCurrentBot.name[0]}</div>
            <div class="msg-bubble">${m.content}</div>
        </div>
    `).join('');
    chatBox.scrollTop = chatBox.scrollHeight;
}
async function wxDoSend() {
    const input = document.getElementById('wx-msgInput');
    const val = input.value.trim();
    if (!val) return;
    if (!wxCurrentUser || !wxCurrentBot) return;
    const key = `chat_${wxCurrentUser.name}_${wxCurrentBot.name}`;
    let msgs = JSON.parse(localStorage.getItem(key)) || [];
    msgs.push({ role: 'user', content: val });
    input.value = '';
    localStorage.setItem(key, JSON.stringify(msgs));
    wxRenderMessages();
    const api_url = localStorage.getItem('wx_url');
    const api_key = localStorage.getItem('wx_key');
    const api_model = localStorage.getItem('wx_model');
    if (!api_key) {
        alert('请先在微信的设置中配置API Key');
        return;
    }
    try {
        const res = await fetch(api_url + '/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api_key}` },
            body: JSON.stringify({
                model: api_model,
                messages: [
                    { role: 'system', content: `你是${wxCurrentBot.name}。你的性格和背景是：${wxCurrentBot.prompt}。你正在和${wxCurrentUser.name}聊天，对方的人设是：${wxCurrentUser.prompt}` },
                    ...msgs
                ]
            })
        });
        const data = await res.json();
        msgs.push({ role: 'bot', content: data.choices[0].message.content });
        localStorage.setItem(key, JSON.stringify(msgs));
        wxRenderMessages();
    } catch (e) {
        alert('API错误:' + e.message);
    }
}
function wxSwitchTab(tab) {
    if (tab === 'main') {
        wxShowScreen('wx-main-screen');
    } else {
        wxShowScreen('wx-settings-screen');
    }
}
function wxEditCurrentBot() {
    if (!wxCurrentBot) return;
    wxEditType = 'bot';
    wxLastScreen = 'wx-chat-screen';
    document.getElementById('wx-editName').value = wxCurrentBot.name;
    document.getElementById('wx-editPrompt').value = wxCurrentBot.prompt;
    document.getElementById('wx-editorTitle').innerText = '编辑好友人设';
    wxShowScreen('wx-editor-screen');
}
function wxSaveConfig() {
    localStorage.setItem('wx_url', document.getElementById('wx-apiUrl').value);
    localStorage.setItem('wx_key', document.getElementById('wx-apiKey').value);
    localStorage.setItem('wx_model', document.getElementById('wx-apiModel').value);
    alert('微信配置已保存！');
}
function wxLogout() {
    wxCurrentUser = null;
    wxShowScreen('wx-login-screen');
}
// 初始化微信配置输入框
(function wxInit() {
    const urlInput = document.getElementById('wx-apiUrl');
    const keyInput = document.getElementById('wx-apiKey');
    const modelInput = document.getElementById('wx-apiModel');
    if (urlInput) urlInput.value = localStorage.getItem('wx_url') || 'https://api.openai.com/v1';
    if (keyInput) keyInput.value = localStorage.getItem('wx_key') || '';
    if (modelInput) modelInput.value = localStorage.getItem('wx_model') || 'gpt-3.5-turbo';
    wxRenderUsers();
})();
// 页面加载完成时，默认显示手机桌面
window.onload = () => {
    $('#wx-app').classList.remove('active');
    render();
};
