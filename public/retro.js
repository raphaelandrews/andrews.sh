var RETRO_LAST_UPDATED = '16 Nov 2026';

var RETRO_NAV_ROWS = [
    [['/', 'home'], ['/about.html', 'about'], ['/now.html', 'now'], ['/journal.html', 'journal'], ['/music.html', 'music'], ['/anime.html', 'anime'], ['/setup.html', 'my setup'], ['/webcam.html', 'webcam']],
    [['/buttons.html', 'buttons'], ['/links.html', 'links'], ['/downloads.html', 'downloads'], ['/gifs.html', 'gifs'], ['/awards.html', 'awards']],
    [['/guestbook.html', 'guestbook'], ['/shoutbox.html', 'shoutbox'], ['/poll.html', 'poll'], ['/pet.html', 'virtual pet'], ['/quiz.html', 'quiz'], ['/faq.html', 'faq'], ['/sitemap.html', 'site map'], ['/credits.html', 'credits']]
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

var RETRO_POLL_LABELS = {
    linux: 'linux',
    windows: 'windows',
    macos: 'macOS',
    bsd: 'BSD',
    other: 'other'
};

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
        '★ welcome to andrews.sh ★ sign my guestbook ★ new: shoutbox, poll + virtual pet ★ best viewed at 1024x768 ★' +
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
        ' · 3 users online · <a href="/journal.xml">rss</a>' +
        '<br>site opened 2003 · not hosted on neocities, spiritually yes' +
        '<br><span class="effect-links">sparkles: <a href="#" onclick="toggleSparkles(); return false;">on/off</a>' +
        ' · snow: <a href="#" onclick="toggleSnow(); return false;">on/off</a>' +
        ' · rain: <a href="#" onclick="toggleRain(); return false;">on/off</a></span>';

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

function initSiteProfile() {
    var target = document.getElementById('site-profile');
    if (!target) {
        return;
    }

    target.className = 'wrapper site-profile';
    target.innerHTML =
        '<img class="profile-avatar" src="/images/gifs/sailor-moon-cat.gif" alt="avatar" width="64" height="64">' +
        '<div class="profile-name">andrews</div>' +
        '<div class="profile-handle">andrews.sh · spiritual neocities resident</div>' +
        '<table class="profile-table">' +
        '<tr><th>joined</th><td>2003</td></tr>' +
        '<tr><th>views</th><td><span id="profile-views">000000</span></td></tr>' +
        '<tr><th>followers</th><td>42</td></tr>' +
        '<tr><th>status</th><td><span class="online-dot">●</span> online</td></tr>' +
        '</table>' +
        '<a href="/about.html">about me</a> · <a href="/guestbook.html">guestbook</a>';
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

function initSnow() {
    if (getCookie('snow') !== 'on') {
        return;
    }

    // Snow and rain are mutually exclusive; snow wins if both cookies exist.
    if (getCookie('rain') === 'on') {
        setCookie('rain', 'off', 365);
    }

    var container = document.createElement('div');
    container.id = 'snow-container';
    document.body.appendChild(container);

    for (var i = 0; i < 24; i++) {
        var flake = document.createElement('span');
        flake.className = 'snowflake';
        flake.innerHTML = '❄';
        flake.style.left = Math.floor(Math.random() * 100) + '%';
        flake.style.animationDuration = (5 + Math.random() * 8) + 's';
        flake.style.animationDelay = '-' + Math.floor(Math.random() * 8) + 's';
        flake.style.fontSize = (8 + Math.floor(Math.random() * 10)) + 'px';
        container.appendChild(flake);
    }
}

function toggleSnow() {
    var enabling = getCookie('snow') !== 'on';
    setCookie('snow', enabling ? 'on' : 'off', 365);

    if (enabling) {
        setCookie('rain', 'off', 365);
    }

    window.location.reload();
}

function initRain() {
    if (getCookie('rain') !== 'on') {
        return;
    }

    // If both are somehow enabled, snow takes over and rain stays off.
    if (getCookie('snow') === 'on') {
        setCookie('rain', 'off', 365);
        return;
    }

    var container = document.createElement('div');
    container.id = 'rain-container';
    document.body.appendChild(container);

    for (var i = 0; i < 48; i++) {
        var drop = document.createElement('span');
        drop.className = 'raindrop';
        drop.innerHTML = '|';
        drop.style.left = Math.floor(Math.random() * 100) + '%';
        drop.style.animationDuration = (4.5 + Math.random() * 4.5) + 's';
        drop.style.animationDelay = '-' + (Math.floor(Math.random() * 40) / 10) + 's';
        drop.style.fontSize = (10 + Math.floor(Math.random() * 8)) + 'px';
        drop.style.opacity = 0.3 + Math.random() * 0.5;
        container.appendChild(drop);
    }
}

function toggleRain() {
    var enabling = getCookie('rain') !== 'on';
    setCookie('rain', enabling ? 'on' : 'off', 365);

    if (enabling) {
        setCookie('snow', 'off', 365);
    }

    window.location.reload();
}

function initRandomBanner() {
    var target = document.getElementById('random-banner');
    if (!target) {
        return;
    }

    var file = RETRO_BANNERS[Math.floor(Math.random() * RETRO_BANNERS.length)];
    target.innerHTML = '<a href="/buttons.html"><img src="/images/buttons/' + file + '" alt="' + file + '" width="88" height="31"></a>';
}

function initMoodBox() {
    var target = document.getElementById('mood-box');
    if (!target) {
        return;
    }

    target.className = 'mood-box';
    target.innerHTML =
        '<strong>mood:</strong> nostalgic<br>' +
        '<strong>listening:</strong> Jinjer — Macro<br>' +
        '<strong>reading:</strong> nothing<br>' +
        '<strong>working on:</strong> this website';
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

function renderPoll() {
    var target = document.getElementById('poll-widget');
    if (!target) {
        return;
    }

    xhrGet('/api/poll', function (data) {
        if (!data || !data.options) {
            target.innerHTML = '<p>the poll is asleep.</p>';
            return;
        }

        var options = data.options;
        var total = 0;
        var i;

        for (i = 0; i < options.length; i++) {
            total += options[i].votes;
        }

        var html = '<h3>Poll: what OS do you use?</h3>';
        for (i = 0; i < options.length; i++) {
            var percent = total ? Math.round(options[i].votes * 100 / total) : 0;
            html += '<div class="poll-row">' +
                '<div class="poll-label"><span>' + (RETRO_POLL_LABELS[options[i].option] || options[i].option) + '</span> ' +
                '<span class="poll-count">' + options[i].votes + ' (' + percent + '%)</span></div>' +
                '<div class="poll-bar" style="width:' + percent + '%"></div>' +
                '</div>';
        }

        if (getCookie('poll_voted') === '1') {
            html += '<p class="poll-thanks">thanks for voting!</p>';
        } else {
            html += '<form class="poll-form" onsubmit="return submitPoll(this);">';
            for (i = 0; i < options.length; i++) {
                html += '<label><input type="radio" name="poll-option" value="' + options[i].option + '"> ' +
                    (RETRO_POLL_LABELS[options[i].option] || options[i].option) + '</label>';
            }
            html += '<button type="submit">vote</button></form>';
        }

        target.innerHTML = html;
    });
}

function submitPoll(form) {
    var inputs = form.getElementsByTagName('input');
    var option = '';

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            option = inputs[i].value;
        }
    }

    if (!option) {
        alert('pick one!');
        return false;
    }

    xhrPost('/api/poll', { option: option }, function (data) {
        if (data) {
            setCookie('poll_voted', '1', 365);
            renderPoll();
        } else {
            alert('the poll is asleep. try again later.');
        }
    });

    return false;
}

function initPoll() {
    if (document.getElementById('poll-widget')) {
        renderPoll();
    }
}

function initLastFm() {
    var target = document.getElementById('lastfm-widget');
    if (!target) {
        return;
    }

    xhrGet('/api/lastfm', function (data) {
        if (!data || !data.tracks || !data.tracks.length) {
            target.innerHTML = '<h3>Last.fm</h3><p>Last.fm is sleeping. (add LASTFM_API_KEY + LASTFM_USER to wake it up)</p>';
            return;
        }

        var html = '<h3>Last.fm — recently scrobbled</h3><div class="lastfm-list">';
        for (var i = 0; i < data.tracks.length; i++) {
            var track = data.tracks[i];
            html += '<div class="lastfm-track">' +
                (track.nowPlaying ? '<span class="live-badge">NOW</span> ' : '') +
                '<a href="' + escapeHtml(track.url) + '" target="_blank">' + escapeHtml(track.name) + '</a>' +
                ' — ' + escapeHtml(track.artist) +
                '</div>';
        }
        html += '</div>';
        target.innerHTML = html;
    });
}

function initRetro() {
    renderNav();
    initSiteProfile();
    renderFooter();
    initSparkles();
    initSnow();
    initRain();
    initRandomBanner();
    initMoodBox();
    initShoutbox();
    initPoll();
    initLastFm();
}

addOnload(initRetro);
