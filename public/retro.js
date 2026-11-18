var RETRO_LAST_UPDATED = '16 Nov 2026';

if (window.console && console.log) {
  console.log('☕ the owls are not what they seem. type "coffee" if you know.');
}

var RETRO_NAV_ROWS = [
  [['/', 'home'], ['/about.html', 'about'], ['/now.html', 'now'], ['/music.html', 'music'], ['/buttons.html', 'buttons'], ['/gifs.html', 'gifs'], ['/guestbook.html', 'guestbook'], ['/shoutbox.html', 'shoutbox'], ['/sitemap.html', 'site map']]
];

var RETRO_BANNERS = [
  'free-msn.gif',
  'netscape-now.gif',
  'page-contains-js.png',
  'web-design-passion.gif',
  'best-enjoyed-cola.gif',
  'neocities.gif',
  'get-java.gif',
  'aol.gif',
  'steam.gif',
  'winamp.gif',
  'icq.gif',
  'source-powered.png'
];

function addOnload(callback) {
  var previous = window.onload;
  window.onload = function () {
    if (previous) {
      previous();
    }
    callback();
  };
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name) {
  var parts = document.cookie.split(';');
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].replace(/^\s+|\s+$/g, '');
    if (part.indexOf(name + '=') === 0) {
      return decodeURIComponent(part.substring(name.length + 1));
    }
  }
  return '';
}

function xhrGet(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }
    var parsed = null;
    try {
      parsed = JSON.parse(xhr.responseText);
    } catch (e) {
      parsed = null;
    }
    callback(xhr.status >= 200 && xhr.status < 300 ? parsed : null, xhr.status);
  };
  xhr.send();
}

function xhrPost(url, data, callback) {
  var body = '';
  for (var key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (body) {
        body += '&';
      }
      body += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }
    var parsed = null;
    try {
      parsed = JSON.parse(xhr.responseText);
    } catch (e) {
      parsed = null;
    }
    callback(xhr.status >= 200 && xhr.status < 300 ? parsed : null, xhr.status);
  };
  xhr.send(body);
}

function padNumber(value, length) {
  var text = String(value);
  while (text.length < length) {
    text = '0' + text;
  }
  return text;
}

function renderNav() {
  var target = document.getElementById('retro-nav');
  if (!target) {
    return;
  }

  var html = '';
  for (var row = 0; row < RETRO_NAV_ROWS.length; row++) {
    html += '<div class="retro-nav-row">';
    for (var i = 0; i < RETRO_NAV_ROWS[row].length; i++) {
      if (i > 0) {
        html += ' · ';
      }
      html += '<a href="' + RETRO_NAV_ROWS[row][i][0] + '">' + RETRO_NAV_ROWS[row][i][1] + '</a>';
    }
    html += '</div>';
  }

  html += '<div class="retro-marquee"><marquee scrollamount="3" behavior="scroll">' +
    '🌴 welcome to andrews.sh 🌴 sign my guestbook 🌴 new: shoutbox + gif wall 🌴 best viewed at 1024x768 🌴' +
    '</marquee></div>';

  target.innerHTML = html;
}

function renderFooter() {
  var target = document.getElementById('retro-footer');
  if (!target) {
    return;
  }

  target.innerHTML =
    '<div class="retro-badges">' +
    '<img src="/images/buttons/netscape-now.gif" alt="netscape now" width="88" height="31">' +
    '<img src="/images/buttons/free-msn.gif" alt="free msn" width="88" height="31">' +
    '<img src="/images/buttons/get-java.gif" alt="get java" width="88" height="31">' +
    '<a href="https://neocities.org" target="_blank"><img src="/images/buttons/neocities.gif" alt="neocities" width="88" height="31"></a>' +
    '</div>' +
    '© 2003–2026 andrews.sh · last updated ' + RETRO_LAST_UPDATED +
    '<br>best viewed in netscape navigator at 1024x768 · made with notepad · valid html 4.01' +
    '<br>you are visitor <span class="hit-counter" id="hit-counter">000000</span>' +
    '<br>site opened 2003' +
    '<br><span class="effect-links">sparkles: <a href="#" onclick="toggleSparkles(); return false;">on/off</a>' +
    '</span>';

  initCounter();
}

function counterHtml(value) {
  var text = padNumber(value, 6);
  var html = '';

  for (var i = 0; i < text.length; i++) {
    html += '<span class="counter-digit">' + text.charAt(i) + '</span>';
  }

  return html;
}

function initCounter() {
  var target = document.getElementById('hit-counter');
  if (!target) {
    return;
  }

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/counter', false);
    xhr.send();
    if (xhr.status >= 200 && xhr.status < 300) {
      var data = JSON.parse(xhr.responseText);
      target.innerHTML = counterHtml(data.hits);
      updateProfileViews(data.hits);
      return;
    }
  } catch (e) {
    target.innerHTML = counterHtml(0);
  }
}

function updateProfileViews(hits) {
  var target = document.getElementById('profile-views');
  if (target) {
    target.innerHTML = padNumber(hits, 6);
  }
}

function initSparkles() {
  if (getCookie('sparkles') === 'off') {
    return;
  }

  var last = 0;
  document.onmousemove = function (event) {
    var now = new Date().getTime();
    if (now - last < 40) {
      return;
    }
    last = now;

    var sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '✦';
    sparkle.style.left = (event.clientX + 6) + 'px';
    sparkle.style.top = (event.clientY + 6) + 'px';
    document.body.appendChild(sparkle);

    setTimeout(function () {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 700);
  };
}

function toggleSparkles() {
  var enabled = getCookie('sparkles') !== 'off';
  setCookie('sparkles', enabled ? 'off' : 'on', 365);

  if (enabled) {
    document.onmousemove = null;
  } else {
    initSparkles();
  }
}

function initRandomBanner() {
  var target = document.getElementById('random-banner');
  if (!target) {
    return;
  }

  var file = RETRO_BANNERS[Math.floor(Math.random() * RETRO_BANNERS.length)];
  target.innerHTML = '<a href="/buttons.html"><img src="/images/buttons/' + file + '" alt="' + file + '" width="88" height="31"></a>';
}

function renderShoutbox(targetId, limit) {
  var target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  xhrGet('/api/shoutbox', function (data) {
    var entries = data && data.entries ? data.entries : [];
    if (!entries.length) {
      target.innerHTML = '<p>no shouts yet. be the first!</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < entries.length && i < limit; i++) {
      var entry = entries[i];
      html += '<div class="shoutbox-entry"><strong>' + escapeHtml(entry.name) + '</strong> ' +
        escapeHtml(entry.message) +
        '<div class="shout-time">' + escapeHtml(entry.created_at) + '</div></div>';
    }
    target.innerHTML = html;
  });
}

function initShoutbox() {
  var widget = document.getElementById('shoutbox-widget');
  if (!widget) {
    return;
  }

  widget.innerHTML =
    '<h3>Shoutbox</h3>' +
    '<div class="shoutbox-list" id="shoutbox-list">loading...</div>' +
    '<form class="shout-form" onsubmit="return postShout(this);">' +
    '<input type="text" id="shout-name" placeholder="name" maxlength="30">' +
    '<input type="text" id="shout-message" placeholder="say something" maxlength="200">' +
    '<input type="text" name="url2" class="honeypot" tabindex="-1" autocomplete="off">' +
    '<button type="submit">shout!</button>' +
    '</form>';

  renderShoutbox('shoutbox-list', 6);
}

function postShout(form) {
  var name = document.getElementById('shout-name').value;
  var message = document.getElementById('shout-message').value;
  var honeypot = form.elements.url2 ? form.elements.url2.value : '';

  xhrPost('/api/shoutbox', { name: name, message: message, url2: honeypot }, function (data) {
    if (data) {
      document.getElementById('shout-message').value = '';
      renderShoutbox('shoutbox-list', 10);
    } else {
      alert('the shoutbox is asleep. try again later.');
    }
  });

  return false;
}

var redRoomBuffer = '';

function initRedRoom() {
  if (document.getElementById('red-room')) {
    return;
  }

  var overlay = document.createElement('div');
  overlay.id = 'red-room';
  overlay.style.display = 'none';
  overlay.innerHTML = '<div class="red-room-box">' +
    '<p class="red-room-kicker">meanwhile, in the red room...</p>' +
    '<img src="/images/gifs/twin-peaks-2.gif" alt="the red room">' +
    '<p>the owls are not what they seem.</p>' +
    '<p><strong>damn fine coffee.</strong></p>' +
    '<p><a href="#" onclick="hideRedRoom(); return false;">← back to reality</a></p>' +
    '</div>';

  overlay.onclick = function (event) {
    if (event.target === overlay) {
      hideRedRoom();
    }
  };

  document.body.appendChild(overlay);

  if (window.location.hash === '#redroom') {
    showRedRoom();
  }

  document.onkeypress = function (event) {
    var target = event.target || event.srcElement;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : '';

    if (tag === 'input' || tag === 'textarea') {
      return;
    }

    var code = event.keyCode || event.which;
    if (!code) {
      return;
    }

    redRoomBuffer = (redRoomBuffer + String.fromCharCode(code).toLowerCase()).slice(-20);
    if (redRoomBuffer.indexOf('coffee') !== -1) {
      redRoomBuffer = '';
      showRedRoom();
    }
  };

  document.onkeydown = function (event) {
    if (event.keyCode === 27) {
      hideRedRoom();
    }
  };
}

function showRedRoom() {
  var overlay = document.getElementById('red-room');
  if (overlay) {
    overlay.style.display = 'block';
  }
}

function hideRedRoom() {
  var overlay = document.getElementById('red-room');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function initRetro() {
  renderNav();
  renderFooter();
  initSparkles();
  initRandomBanner();
  initShoutbox();
  initRedRoom();
}

addOnload(initRetro);
