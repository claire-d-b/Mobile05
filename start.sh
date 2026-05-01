npx create-expo-app@latest diary_app

cd diary_app

npm run reset-project

# go to android studio Projects -> More Actions -> SDK manager -> languages & Frameworks -> Android SDK
echo "export ANDROID_HOME=$HOME/Library/Android/sdk" >> ~/.zshrc
echo "export PATH=$PATH:$ANDROID_HOME/emulator" >> ~/.zshrc
echo "export PATH=$PATH:$ANDROID_HOME/platform-tools" >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"' >> ~/.zshrc
# brew services start postgresql@18

source $HOME/.zshrc

# Add these lines at the very top of start.sh (after the shebang)
#!/bin/zsh

# When you start a development server with npx expo start on the start developing page, press a to open the Android Emulator. Expo CLI will install Expo Go automatically.
# Open up the Mac App Store, search for Xcode, and click Install (or Update if you have it already).
# Open Xcode, choose Settings... from the Xcode menu (or press cmd ⌘ + ,). Go to the Locations and install the tools by selecting the most recent version in the Command Line Tools dropdown.

# To install an iOS Simulator, open Xcode > Settings... > Components, and under Platform Support > iOS ..., click Get.
brew update && brew install watchman

# npm run reset-project puts the example project in app-example folder

npx tailwindcss init

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

cat > global.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

touch metro.config.js

cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)
 
module.exports = withNativeWind(config, { input: './global.css' })
EOF

cat > app/index.tsx << 'EOF'
import "../global.css";
import { Text } from "react-native-paper";

export default function App() {
  return (
    <Text>HELLO WORLD</Text>
  );
}
EOF

if [ "$(uname)" = "Darwin" ]; then
  sed -i '' 's/import { Stack } from "expo-router";/import { Stack } from "expo-router";\nimport "..\/global.css";/' app/_layout.tsx
else
  sed -i 's/import { Stack } from "expo-router";/import { Stack } from "expo-router";\nimport "..\/global.css";/' app/_layout.tsx
fi

# if [ "$(uname)" = "Darwin" ]; then
#     sed -i '' 's/"web": {/"web": {\n      "bundler": "metro",/' app.json
# else
#     sed -i 's/"web": {/"web": {\n      "bundler": "metro",/' app.json
# fi
if [ "$(uname)" = "Darwin" ]; then
      sed -i '' 's/"android": {\n/"android": {\n"usesCleartextTraffic": true,\n'/g app.json
else
      sed -i 's/"android": {\n/"android": {\n"usesCleartextTraffic": true,\n'/g app.json
fi

touch nativewind-env.d.ts && echo "/// <reference types="nativewind/types" />" > nativewind-env.d.ts

npm install react-native-paper
npm install react-native-safe-area-context
npx pod-install # for iOS platform there is a requirement to link the native parts of the library
npm install @react-native-vector-icons/material-design-icons
npx expo install @react-native-community/slider

cat > babel.config.js << 'EOF'
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        env: {
            production: {
                plugins: ["react-native-paper/babel"],
            },
        },
    };
};
EOF

npm i
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11 babel-preset-expo

npm install mathjs

npm install expo-location react-native-maps expo-intent-launcher
npm install openmeteo
npm install react-native-chart-kit

npx expo install expo-auth-session expo-web-browser

brew install postgresql

# Verify
psql --version

echo "CREATE DATABASE diary_app" | psql postgres
echo "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, login TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());" | psql diary_app

mkdir -p backend
cd backend
npm init -y
npm install express pg cors dotenv
cd backend
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json'));p.type='module';fs.writeFileSync('package.json',JSON.stringify(p,null,2))"

cat << 'EOF' > server.js
import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  user: "claire",
  host: "localhost",
  database: "diary_app",
  password: "",
  port: 5432,
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.post("/users", async (req, res) => {
  const { email } = req.body;

  const result = await pool.query(
    "INSERT INTO users(email) VALUES($1) RETURNING *",
    [email]
  );

  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
EOF

echo "CREATE TABLE users (id SERIAL PRIMARY KEY, login TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())" | psql claire

cat << 'EOF' > server.js
import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "claire",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "diary_app",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT) || 5432,
});

// REGISTER USER
app.post("/user/register", async (req, res) => {
  const { login, password } = req.body;

  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users(login, password) VALUES($1, $2) RETURNING id, login",
      [login, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN USER
app.post("/user/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE login = $1",
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
EOF

cd ..
npx expo install expo-crypto
npm install bcrypt
npm install --save-dev @types/bcrypt

npm install @react-navigation/native
npm install @react-navigation/native-stack

npx expo install expo-crypto
npm install firebase
npx expo install firebase
npx expo install expo-dev-client

rm /Users/claire/Workspace/mobile_04/diary_app/android/app/debug.keystore
keytool -genkey -v \
  -keystore /Users/claire/Workspace/mobile_04/diary_app/android/app/debug.keystore \
  -alias androiddebugkey \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass android \
  -keypass android \
  -dname "CN=Android Debug,O=Android,C=FR"
keytool -list -v \
  -keystore /Users/claire/Workspace/mobile_04/diary_app/android/app/debug.keystore \
  -alias androiddebugkey \
  -storepass android

npm install --global eas-cli && eas init --id ebcd0a5d-28a0-4970-ac83-ec5cc109c0b9
npx expo install @react-native-google-signin/google-signin
npm install firebase

firebase login
firebase init
firebase deploy

brew install firebase-cli
npx firebase-tools login
npx firebase-tools projects:list

npx expo install @react-native-async-storage/async-storage
npm install react-native-paper-dates --save

npm install -D babel-plugin-module-resolver

npx expo run:android --device
npx expo start --dev-client
npx expo run:android
npx expo run:ios

cd android && ./gradlew signingReport
npx expo start

keytool -keystore android/app/debug.keystore -list -v # linux & ios
# When you start a development server with npx expo start on the start developing page, press i to open the iOS Simulator. Expo CLI will install Expo Go automatically.