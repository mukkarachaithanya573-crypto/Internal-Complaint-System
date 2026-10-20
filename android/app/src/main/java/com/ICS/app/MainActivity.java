package com.ICS.app;

import android.app.Dialog;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Message;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {
    // Standard Mobile Chrome User Agent string so Google OAuth does not block request with 403 disallowed_useragent
    private static final String CHROME_MOBILE_UA = 
        "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36";
    
    private Dialog oauthDialog;

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
                
                // 1. Set Chrome Mobile User Agent so Google Auth permits the request
                settings.setUserAgentString(CHROME_MOBILE_UA);
                
                // 2. Enable JavaScript, popups, and multiple windows
                settings.setJavaScriptEnabled(true);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setSupportMultipleWindows(true);
                
                // 3. Enable DOM storage & cookies for OAuth tokens
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                
                CookieManager cookieManager = CookieManager.getInstance();
                cookieManager.setAcceptCookie(true);
                cookieManager.setAcceptThirdPartyCookies(webView, true);

                // 4. Attach custom WebChromeClient extending BridgeWebChromeClient to preserve Capacitor's camera/file chooser
                webView.setWebChromeClient(new BridgeWebChromeClient(getBridge()) {
                    @Override
                    public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                        try {
                            if (oauthDialog != null && oauthDialog.isShowing()) {
                                oauthDialog.dismiss();
                            }

                            // Create child popup WebView for Google OAuth authentication
                            WebView popupWebView = new WebView(MainActivity.this);
                            WebSettings popupSettings = popupWebView.getSettings();
                            popupSettings.setJavaScriptEnabled(true);
                            popupSettings.setUserAgentString(CHROME_MOBILE_UA);
                            popupSettings.setDomStorageEnabled(true);
                            popupSettings.setDatabaseEnabled(true);
                            popupSettings.setSupportMultipleWindows(true);
                            popupSettings.setJavaScriptCanOpenWindowsAutomatically(true);
                            popupSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
                            popupSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

                            CookieManager cookieMgr = CookieManager.getInstance();
                            cookieMgr.setAcceptCookie(true);
                            cookieMgr.setAcceptThirdPartyCookies(popupWebView, true);
                            cookieMgr.flush();

                            // Container layout
                            LinearLayout root = new LinearLayout(MainActivity.this);
                            root.setOrientation(LinearLayout.VERTICAL);
                            root.setBackgroundColor(Color.parseColor("#070A0F"));

                            // Top Header with Title and Cancel Button
                            LinearLayout header = new LinearLayout(MainActivity.this);
                            header.setOrientation(LinearLayout.HORIZONTAL);
                            header.setGravity(Gravity.CENTER_VERTICAL);
                            header.setPadding(32, 24, 32, 24);
                            header.setBackgroundColor(Color.parseColor("#0C1117"));

                            TextView titleView = new TextView(MainActivity.this);
                            titleView.setText("Sign in with Google");
                            titleView.setTextColor(Color.WHITE);
                            titleView.setTextSize(16);
                            LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f
                            );
                            header.addView(titleView, titleParams);

                            Button closeBtn = new Button(MainActivity.this);
                            closeBtn.setText("✕ Cancel");
                            closeBtn.setTextColor(Color.parseColor("#94A3B8"));
                            closeBtn.setBackgroundColor(Color.TRANSPARENT);
                            closeBtn.setOnClickListener(v -> {
                                if (oauthDialog != null && oauthDialog.isShowing()) {
                                    oauthDialog.dismiss();
                                }
                            });
                            header.addView(closeBtn, new LinearLayout.LayoutParams(
                                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
                            ));

                            root.addView(header, new LinearLayout.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
                            ));

                            // Progress Bar
                            ProgressBar progressBar = new ProgressBar(MainActivity.this, null, android.R.attr.progressBarStyleHorizontal);
                            progressBar.setIndeterminate(true);
                            root.addView(progressBar, new LinearLayout.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT, 8
                            ));

                            // Add popup WebView
                            LinearLayout.LayoutParams webViewParams = new LinearLayout.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f
                            );
                            root.addView(popupWebView, webViewParams);

                            oauthDialog = new Dialog(MainActivity.this, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
                            oauthDialog.setContentView(root);
                            oauthDialog.setOnDismissListener(dialog -> {
                                try {
                                    popupWebView.destroy();
                                } catch (Exception ignored) {}
                            });

                            popupWebView.setWebChromeClient(new WebChromeClient() {
                                @Override
                                public void onCloseWindow(WebView window) {
                                    if (oauthDialog != null && oauthDialog.isShowing()) {
                                        oauthDialog.dismiss();
                                    }
                                }

                                @Override
                                public void onProgressChanged(WebView v, int newProgress) {
                                    if (newProgress >= 100) {
                                        progressBar.setVisibility(View.GONE);
                                    } else {
                                        progressBar.setVisibility(View.VISIBLE);
                                    }
                                }
                            });

                            final boolean[] hasVisitedGoogle = new boolean[]{false};

                            popupWebView.setWebViewClient(new WebViewClient() {
                                @Override
                                public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                                    return false; // Stay inside popup WebView
                                }

                                @SuppressWarnings("deprecation")
                                @Override
                                public boolean shouldOverrideUrlLoading(WebView v, String url) {
                                    return false;
                                }

                                @Override
                                public void onPageFinished(WebView v, String url) {
                                    super.onPageFinished(v, url);
                                    if (url != null) {
                                        if (url.contains("accounts.google.com")) {
                                            hasVisitedGoogle[0] = true;
                                        }
                                        // Once the user has signed in on Google and redirects back to Firebase auth handler or completion
                                        if (hasVisitedGoogle[0] && (url.contains("/__/auth/handler") || url.contains("close_window=true"))) {
                                            v.postDelayed(() -> {
                                                if (oauthDialog != null && oauthDialog.isShowing()) {
                                                    oauthDialog.dismiss();
                                                }
                                            }, 4000);
                                        }
                                    }
                                }
                            });

                            WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                            transport.setWebView(popupWebView);
                            resultMsg.sendToTarget();

                            oauthDialog.show();
                            return true;
                        } catch (Exception e) {
                            e.printStackTrace();
                            return false;
                        }
                    }

                    @Override
                    public void onCloseWindow(WebView window) {
                        super.onCloseWindow(window);
                        if (oauthDialog != null && oauthDialog.isShowing()) {
                            oauthDialog.dismiss();
                        }
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
