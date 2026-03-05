const API = `${window.location.origin}/api/watermark`;

const $ = (id) => document.getElementById(id);

function setStatus(el, msg, type = '') {
  el.textContent = msg;
  el.className = `status ${type}`.trim();
}

function previewFile(file, imgEl) {
  if (!file) {
    imgEl.removeAttribute('src');
    return;
  }
  const url = URL.createObjectURL(file);
  imgEl.src = url;
}

async function apiEmbed(file, message, algo) {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('message', message);
  fd.append('algo', algo);
  const res = await fetch(`${API}/embed`, { method: 'POST', body: fd });
  if (!res.ok) {
    let error = 'Embed failed';
    try {
      const json = await res.json();
      if (json?.error) error = json.error;
    } catch {}
    throw new Error(error);
  }
  return await res.blob();
}

async function apiExtract(file, algo) {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('algo', algo);
  const res = await fetch(`${API}/extract`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Extract failed');
  return json;
}

export function bindUI() {
  const embedFile = $('embedFile');
  const embedMsg = $('embedMsg');
  const embedBtn = $('embedBtn');
  const algoSelect = $('algoSelect');
  const embedStatus = $('embedStatus');
  const embedPreview = $('embedPreview');
  const downloadLink = $('downloadLink');

  const extractFile = $('extractFile');
  const extractBtn = $('extractBtn');
  const extractOut = $('extractOut');
  const extractPreview = $('extractPreview');

  embedFile.addEventListener('change', () => previewFile(embedFile.files[0], embedPreview));
  extractFile.addEventListener('change', () => previewFile(extractFile.files[0], extractPreview));

  embedBtn.onclick = async () => {
    const file = embedFile.files[0];
    const message = embedMsg.value.trim();
    if (!file || !message) {
      setStatus(embedStatus, 'Thiếu file hoặc message.', 'err');
      return;
    }

    embedBtn.disabled = true;
    setStatus(embedStatus, 'Đang nhúng watermark...');

    try {
      const blob = await apiEmbed(file, message, algoSelect.value);
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = 'watermarked.png';
      downloadLink.style.display = 'inline';
      downloadLink.textContent = 'Download watermarked.png';
      setStatus(embedStatus, 'Nhúng watermark thành công.', 'ok');
    } catch (e) {
      setStatus(embedStatus, `Lỗi: ${e.message}`, 'err');
    } finally {
      embedBtn.disabled = false;
    }
  };

  extractBtn.onclick = async () => {
    const file = extractFile.files[0];
    if (!file) {
      setStatus(extractOut, 'Thiếu file để extract.', 'err');
      return;
    }

    extractBtn.disabled = true;
    setStatus(extractOut, 'Đang đọc watermark...');
    try {
      const json = await apiExtract(file, algoSelect.value);
      setStatus(extractOut, JSON.stringify(json, null, 2), 'ok');
    } catch (e) {
      setStatus(extractOut, `Lỗi: ${e.message}`, 'err');
    } finally {
      extractBtn.disabled = false;
    }
  };
}
