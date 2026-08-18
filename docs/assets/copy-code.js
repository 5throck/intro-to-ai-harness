function copyCode(btn) {
  var text;
  var codes = btn.parentElement.querySelectorAll(':scope > code');
  if (codes.length > 1) {
    text = Array.from(codes).map(function (c) { return c.textContent; }).join('\n');
  } else {
    var pre = btn.previousElementSibling || btn.parentElement.querySelector('pre');
    text = pre ? pre.textContent : '';
  }
  if (!text) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      btn.setAttribute('aria-live', 'polite');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
        btn.removeAttribute('aria-live');
      }, 1500);
    }).catch(function () {
      btn.textContent = 'Failed';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    });
  } else {
    // Fallback for non-HTTPS contexts where clipboard API is unavailable
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    } catch (e) {
      btn.textContent = 'Failed';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    }
    document.body.removeChild(ta);
  }
}
