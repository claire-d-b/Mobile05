import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

const useGithubAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "GITHUB_CLIENT_ID",
      scopes: ["read:user", "user:email"],
      redirectUri: AuthSession.makeRedirectUri({}),
      responseType: "code",
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      // 👉 Envoie le code à ton backend
      console.log("GitHub code:", code);
    }
  }, [response]);

  return { promptAsync };
};

export default useGithubAuth;
