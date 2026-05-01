import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";

// WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({});

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "GOOGLE_CLIENT_ID",
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: "code",
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      // 👉 Envoie le code à ton backend ici
      console.log("Authorization code:", code);
    }
  }, [response]);

  return { promptAsync };
};

export default useGoogleAuth;
