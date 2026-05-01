import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect } from "react";

// WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "264287288047-pengrcigquvvtgv0864cgv7vs17tr5s8.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params; // ← id_token, pas accessToken

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((result) => {
          setUser(result.user);
          console.log("Connecté :", result.user.email);
        })
        .catch(console.error);
    }
  }, [response]);

  return { request, promptAsync, user };
}
