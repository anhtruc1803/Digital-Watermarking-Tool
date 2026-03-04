const API = 'http://localhost:3000/api/watermark';

export function bindUI() {
  const embedBtn = document.getElementById('embedBtn');
  const extractBtn = document.getElementById('extractBtn');

  embedBtn.onclick = async () => {
    const file = document.getElementById('embedFile').files[0];
    const message = document.getElementById('embedMsg').value;
    if (!file || !message) return alert('Thiếu file hoặc message');

    const fd = new FormData();
    fd.append('image', file);
    fd.append('message', message);

    const res = await fetch(`${API}/embed`, { method: 'POST', body: fd });
    if (!res.ok) return alert('Embed failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.getElementById('downloadLink');
    a.href = url;
    a.download = 'watermarked.png';
    a.style.display = 'inline';
    a.textContent = 'Download watermarked.png';
  };

  extractBtn.onclick = async () => {
    const file = document.getElementById('extractFile').files[0];
    if (!file) return alert('Thiếu file');
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API}/extract`, { method: 'POST', body: fd });
    const json = await res.json();
    document.getElementById('extractOut').textContent = JSON.stringify(json, null, 2);
  };
}
