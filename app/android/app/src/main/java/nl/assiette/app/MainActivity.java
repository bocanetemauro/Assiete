package nl.assiette.app;

import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (bridge != null) {
            bridge.setWebViewClient(new StaticExportWebViewClient(bridge));
        }
    }

    /**
     * De app draait op de statische export van de website (map `out/`), waarin elke
     * pagina een eigen `index.html` heeft. Capacitor serveert standaard voor élk pad
     * zonder extensie de start-`index.html`; daardoor zou bijvoorbeeld `/recepten/`
     * na een volledige paginalaad de homepage tonen. Deze client zet elk verzoek om
     * naar het juiste bestand:
     *
     *  - `/recepten/`                → `/recepten/index.html`
     *  - `/recepten/<eigen-recept>/` → `/recepten/_/index.html` (placeholder; de echte
     *    slug wordt in de app uit de URL gelezen, zie src/lib/native.ts)
     *  - onbekende pagina            → `/404.html`
     */
    static final class StaticExportWebViewClient extends BridgeWebViewClient {

        private static final Pattern DYNAMIC_ROUTE = Pattern.compile("^/(recepten|kookmodus)/([^/]+)(/.*)?$");
        private static final String PLACEHOLDER = "_";

        private final Bridge bridge;
        private final Map<String, Boolean> assetCache = new ConcurrentHashMap<>();

        StaticExportWebViewClient(Bridge bridge) {
            super(bridge);
            this.bridge = bridge;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            if ("localhost".equals(url.getHost()) && "GET".equalsIgnoreCase(request.getMethod())) {
                String path = url.getPath() == null ? "/" : url.getPath();
                String target = resolve(path, url.getLastPathSegment());
                if (target != null && !target.equals(path)) {
                    request = new RewrittenRequest(request, url.buildUpon().path(target).build());
                }
            }
            return super.shouldInterceptRequest(view, request);
        }

        private String resolve(String path, String lastSegment) {
            boolean isFile = lastSegment != null && lastSegment.contains(".");
            String candidate = isFile ? path : (path.endsWith("/") ? path : path + "/") + "index.html";
            String found = existing(candidate);
            if (found != null) return found;

            // Alleen iets ná de slug (index.html of een segmentbestand) is een recept-route;
            // een bestand direct onder /recepten/ is dat niet.
            Matcher match = DYNAMIC_ROUTE.matcher(candidate);
            if (match.matches() && match.group(3) != null && !PLACEHOLDER.equals(match.group(2))) {
                found = existing("/" + match.group(1) + "/" + PLACEHOLDER + match.group(3));
                if (found != null) return found;
            }

            if (!isFile && assetExists("/404.html")) return "/404.html";
            return null;
        }

        /** Het pad zelf, of de geneste variant van een segmentbestand, als dat bestaat. */
        private String existing(String path) {
            if (assetExists(path)) return path;
            String nested = nestedSegmentPath(path);
            return nested != null && assetExists(nested) ? nested : null;
        }

        /**
         * Next.js vraagt voorladen-bestanden op als `__next.recepten.$d$slug.__PAGE__.txt`,
         * maar de export schrijft ze genest weg: `__next.recepten/$d$slug/__PAGE__.txt`.
         */
        private static String nestedSegmentPath(String path) {
            int slash = path.lastIndexOf('/');
            String name = path.substring(slash + 1);
            if (!name.startsWith("__next.") || !name.endsWith(".txt")) return null;
            String[] parts = name.substring("__next.".length(), name.length() - ".txt".length()).split("\\.");
            if (parts.length < 2) return null;
            StringBuilder nested = new StringBuilder(path.substring(0, slash + 1)).append("__next.").append(parts[0]);
            for (int i = 1; i < parts.length; i++) nested.append('/').append(parts[i]);
            return nested.append(".txt").toString();
        }

        private boolean assetExists(String path) {
            Boolean cached = assetCache.get(path);
            if (cached != null) return cached;
            boolean found;
            try (InputStream stream = bridge.getContext().getAssets().open("public" + path)) {
                found = true;
            } catch (IOException e) {
                found = false;
            }
            assetCache.put(path, found);
            return found;
        }
    }

    /** Zelfde verzoek, ander pad. */
    static final class RewrittenRequest implements WebResourceRequest {

        private final WebResourceRequest original;
        private final Uri url;

        RewrittenRequest(WebResourceRequest original, Uri url) {
            this.original = original;
            this.url = url;
        }

        @Override
        public Uri getUrl() {
            return url;
        }

        @Override
        public boolean isForMainFrame() {
            return original.isForMainFrame();
        }

        @Override
        public boolean isRedirect() {
            return Build.VERSION.SDK_INT >= Build.VERSION_CODES.N && original.isRedirect();
        }

        @Override
        public boolean hasGesture() {
            return original.hasGesture();
        }

        @Override
        public String getMethod() {
            return original.getMethod();
        }

        @Override
        public Map<String, String> getRequestHeaders() {
            return original.getRequestHeaders();
        }
    }
}
