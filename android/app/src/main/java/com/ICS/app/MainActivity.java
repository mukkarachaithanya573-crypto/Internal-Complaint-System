package com.ICS.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureWebView();
    }

    @Override
    public void onResume() {
        super.onResume();
        configureWebView();
    }

    private void configureWebView() {
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                WebView webView = getBridge().getWebView();
                WebSettings settings = webView.getSettings();
                
                // 1. Remove '; wv' and 'Version/4.0' so Google OAuth does not block it as an embedded webview
                String ua = settings.getUserAgentString();
                if (ua != null) {
                    String cleanUa = ua.replace("; wv", "").replace(";  wv", "").replace("Version/4.0 ", "");
                    settings.setUserAgentString(cleanUa);
                }
                
                // 2. Enable window popup support for OAuth popup/redirect flows
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setSupportMultipleWindows(true);
                
                // 3. Enable DOM storage for cross-origin OAuth tokens and session recovery
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
