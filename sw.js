// ══ BusOps Service Worker — Réseau requis ════════════════════════════════
// Rôle : installation PWA uniquement.
// Aucune mise en cache — BusOps nécessite une connexion active à tout moment.

const SW_VERSION = 'busops-v2-network-only';

// ── Installation : vider tout cache existant ──────────────────────────────
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
  self.skipWaiting();
});

// ── Activation : supprimer tous les anciens caches ────────────────────────
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// ── Fetch : RÉSEAU UNIQUEMENT — aucun cache, jamais ──────────────────────
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(function() {
      // Pas de réseau → page d'erreur claire
      if (e.request.mode === 'navigate') {
        return new Response(
          `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BusOps — Connexion requise</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0 }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0d0820;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }
  .card {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  .icon { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
  h1 { font-size: 1.375rem; font-weight: 800; margin-bottom: .75rem; }
  p {
    color: rgba(255,255,255,.5);
    line-height: 1.7;
    font-size: .925rem;
    margin-bottom: 2rem;
  }
  .btn {
    display: inline-block;
    padding: .875rem 2rem;
    background: linear-gradient(135deg, #7C54DE, #5b3fbf);
    color: #fff;
    border: none;
    border-radius: .875rem;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 6px 20px rgba(124,84,222,.4);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    background: rgba(239,68,68,.15);
    border: 1px solid rgba(239,68,68,.3);
    color: #fca5a5;
    font-size: .78rem;
    font-weight: 700;
    padding: .375rem 1rem;
    border-radius: 999px;
    margin-bottom: 1.5rem;
  }
</style>
</head>
<body>
  <div class="card">
    <span class="icon">📶</span>
    <div class="badge">
      <span style="width:.5rem;height:.5rem;border-radius:50%;background:#ef4444;display:inline-block"></span>
      Hors ligne
    </div>
    <h1>Connexion requise</h1>
    <p>
      BusOps nécessite une connexion internet active.<br>
      Vérifiez votre réseau Wi-Fi ou mobile et réessayez.
    </p>
    <button class="btn" onclick="window.location.reload()">
      🔄 Réessayer
    </button>
  </div>
</body>
</html>`,
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      }
      // Pour les autres ressources (images, scripts) : erreur réseau silencieuse
      return new Response('', { status: 503 });
    })
  );
});
