03.08 14:03
document.addEventListener('DOMContentLoaded', () => {
    const appIcons = document.querySelectorAll('.ais[data-target]');
    const backBtns = document.querySelectorAll('.backBtn');
    const allScreens = document.querySelectorAll('.sc');
    const albumItems = document.querySelectorAll('.pi');
    const previewModal = document.getElementById('previewModal');
    const previewImg = document.getElementById('previewImg');
    const closePreview = document.getElementById('closePreview');
    const selectBtn = document.querySelector('.ds');
    let isSelectMode = false;
    // 页面切换核心函数
    function switchToScreen(targetId) {
        const targetScreen = document.getElementById(targetId);
        if (!targetScreen) return;
        allScreens.forEach(screen => {
            screen.classList.remove('sa');
            screen.classList.add('sh');
        });
        targetScreen.classList.remove('sh');
        targetScreen.classList.add('sa');
    }
    // 绑定APP图标点击事件
    appIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.getAttribute('data-target');
            switchToScreen(targetId);
        });
    });
    // 绑定返回按钮事件
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchToScreen('homeScreen');
        });
    });
    // 相册图片预览功能
    albumItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isSelectMode) return;
            const imgUrl = item.style.backgroundImage.replace(/url\(["']?(.*?)["']?\)/, '$1');
            previewImg.src = imgUrl;
            previewModal.classList.remove('hd');
        });
    });
    // 关闭预览弹窗
    closePreview.addEventListener('click', () => {
        previewModal.classList.add('hd');
    });
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.add('hd');
        }
    });
    // 相册图片选择功能
    selectBtn.addEventListener('click', () => {
        isSelectMode = !isSelectMode;
        selectBtn.textContent = isSelectMode ? '取消' : '选择';
        albumItems.forEach(item => {
            if (isSelectMode) {
                item.addEventListener('click', toggleSelect);
            } else {
                item.removeEventListener('click', toggleSelect);
                item.classList.remove('sd');
            }
        });
    });
    function toggleSelect(e) {
        e.stopPropagation();
        this.classList.toggle('sd');
    }
    // 修复移动端点击延迟
    document.addEventListener('touchstart', () => {}, { passive: true });
});
