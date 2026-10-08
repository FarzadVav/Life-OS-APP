import Script from "next/script";

const script = `
  (function() {
    window.__pwaPrompt = null;
    window.addEventListener('beforeinstallprompt', function(e) {
      e.preventDefault();
      window.__pwaPrompt = e;
      window.dispatchEvent(new CustomEvent('pwa-prompt-captured'));
    });
    window.addEventListener('appinstalled', function() {
      window.__pwaPrompt = null;
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    });
  })();
`;

function PwaScript() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="pwa-prompt-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: script,
      }}
    />
  );
}

export default PwaScript;
