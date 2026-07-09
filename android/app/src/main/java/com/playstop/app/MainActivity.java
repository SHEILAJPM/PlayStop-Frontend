package com.playstop.app;

import android.os.Bundle;
import android.webkit.CookieManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // El backend vive en otro dominio (onrender.com) que el WebView de la
        // app (origen https://localhost de Capacitor), asi que la cookie de
        // sesion que llega tras el login es "de terceros" para Android. Sin
        // esto, WebView la descarta en silencio: el login responde 200 pero
        // la siguiente peticion no lleva cookie y el usuario queda deslogueado.
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(getBridge().getWebView(), true);
    }
}
