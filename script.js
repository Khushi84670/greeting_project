
// Swiper.js initialization for carousel and button controls
let swiperInstance;
window.addEventListener('DOMContentLoaded', function() {
    swiperInstance = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        allowTouchMove: true,
    });
    // Button controls
    document.getElementById('carouselPrevBtn').onclick = function() {
        swiperInstance.slidePrev();
    };
    document.getElementById('carouselNextBtn').onclick = function() {
        swiperInstance.slideNext();
    };
});

// Editing actions
let selectedTextDiv = null;
let textBoxCounter = 0;
function showAddText() {
    const overlay = document.getElementById('canvas-overlay');
    const textDiv = document.createElement('div');
    textDiv.className = 'draggable-text';
    textDiv.setAttribute('data-id', 'text-' + (++textBoxCounter));
    textDiv.contentEditable = true;
    textDiv.innerText = 'Edit me!';
    // Add delete button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '&times;';
    delBtn.className = 'delete-text-btn';
    delBtn.title = 'Delete';
    delBtn.onclick = function(e) {
        e.stopPropagation();
        textDiv.remove();
        hideTextControls();
    };
    textDiv.appendChild(delBtn);
    textDiv.style.position = 'absolute';
    textDiv.style.left = '40px';
    textDiv.style.top = '40px';
    textDiv.style.minWidth = '80px';
    textDiv.style.minHeight = '40px';
    textDiv.style.width = '180px';
    textDiv.style.height = '60px';
    textDiv.style.padding = '8px 14px';
    textDiv.style.background = 'transparent';
    textDiv.style.border = '2px solid #0078d7';
    textDiv.style.borderRadius = '8px';
    textDiv.style.cursor = 'move';
    textDiv.style.resize = 'both';
    textDiv.style.overflow = 'auto';
    textDiv.style.zIndex = 10;
    textDiv.style.wordBreak = 'break-word';
    textDiv.style.whiteSpace = 'pre-wrap';
    textDiv.style.boxSizing = 'border-box';
    textDiv.setAttribute('tabindex', '0');
    textDiv.style.fontFamily = 'Roboto, sans-serif';
    textDiv.style.fontSize = '24px';
    textDiv.style.color = '#ffffff';
    overlay.appendChild(textDiv);
    makeDraggableResizable(textDiv, overlay);
    textDiv.focus();
    selectedTextDiv = textDiv;
    showTextControls(textDiv);

    // Deselect logic: only hide controls if click is outside any textDiv and controls
    function handleDocumentClick(e) {
        const controls = document.getElementById('text-controls');
        const allTextDivs = Array.from(document.querySelectorAll('.draggable-text'));
        const clickedTextDiv = allTextDivs.some(div => div.contains(e.target));
        if (!clickedTextDiv && !controls.contains(e.target)) {
            allTextDivs.forEach(div => div.style.border = 'none');
            selectedTextDiv = null;
            hideTextControls();
            document.removeEventListener('mousedown', handleDocumentClick);
        }
    }
    setTimeout(() => {
        document.addEventListener('mousedown', handleDocumentClick);
    }, 0);

    textDiv.addEventListener('focus', function() {
        // Remove border from all others
        document.querySelectorAll('.draggable-text').forEach(div => {
            if (div !== textDiv) div.style.border = 'none';
        });
        textDiv.style.border = '2px solid #0078d7';
        selectedTextDiv = textDiv;
        showTextControls(textDiv);
    });
    textDiv.addEventListener('mousedown', function() {
        // Remove border from all others
        document.querySelectorAll('.draggable-text').forEach(div => {
            if (div !== textDiv) div.style.border = 'none';
        });
        textDiv.style.border = '2px solid #0078d7';
        selectedTextDiv = textDiv;
        showTextControls(textDiv);
    });
    textDiv.addEventListener('blur', function() {
        textDiv.style.border = 'none';
    });
}

function showTextControls(textDiv) {
    const controls = document.getElementById('text-controls');
    controls.style.display = 'block';
    // Set controls to match selected textDiv
    document.getElementById('fontSelect').value = textDiv.style.fontFamily;
    document.getElementById('fontSizeInput').value = parseInt(textDiv.style.fontSize);
    document.getElementById('fontColorInput').value = rgbToHex(textDiv.style.color);
}

function hideTextControls() {
    document.getElementById('text-controls').style.display = 'none';
}

// Font controls event listeners
window.addEventListener('DOMContentLoaded', function() {
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const fontColorInput = document.getElementById('fontColorInput');
    [fontSelect, fontSizeInput, fontColorInput].forEach(ctrl => {
        ctrl.addEventListener('input', function() {
            if (!selectedTextDiv) return;
            if (ctrl === fontSelect) selectedTextDiv.style.fontFamily = fontSelect.value;
            if (ctrl === fontSizeInput) selectedTextDiv.style.fontSize = fontSizeInput.value + 'px';
            if (ctrl === fontColorInput) selectedTextDiv.style.color = fontColorInput.value;
        });
    });
});

// Helper to convert rgb/rgba to hex
function rgbToHex(color) {
    if (!color) return '#222222';
    if (color.startsWith('#')) return color;
    const rgb = color.match(/\d+/g);
    if (!rgb) return '#222222';
    return '#' + rgb.slice(0,3).map(x => (+x).toString(16).padStart(2,'0')).join('');
}

function showAddImage() {
    alert('Add Images: Feature coming soon!');
}

// Draggable and resizable logic (confined to overlay)
function makeDraggableResizable(el, container) {
    let isDragging = false, startX, startY, startLeft, startTop;
    el.addEventListener('mousedown', function(e) {
        // Only drag if not resizing or clicking delete
        if (e.target !== el) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(el.style.left);
        startTop = parseInt(el.style.top);
        document.body.style.userSelect = 'none';
        el.focus();
    });
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        let newLeft = Math.max(0, Math.min(startLeft + dx, container.offsetWidth - el.offsetWidth));
        let newTop = Math.max(0, Math.min(startTop + dy, container.offsetHeight - el.offsetHeight));
        el.style.left = newLeft + 'px';
        el.style.top = newTop + 'px';
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
    });
    // Resizing is handled by CSS 'resize: both', but we confine it with an observer
    const resizeObserver = new ResizeObserver(() => {
        let maxWidth = container.offsetWidth - el.offsetLeft;
        let maxHeight = container.offsetHeight - el.offsetTop;
        el.style.maxWidth = maxWidth + 'px';
        el.style.maxHeight = maxHeight + 'px';
        // If resized out of bounds, snap back
        if (el.offsetWidth > maxWidth) el.style.width = maxWidth + 'px';
        if (el.offsetHeight > maxHeight) el.style.height = maxHeight + 'px';
    });
    resizeObserver.observe(el);
}

// Initialize
showImage(0);
