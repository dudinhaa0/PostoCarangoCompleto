import fs from "node:fs";
import path from "node:path";

const manifestPath = path.resolve("android/app/src/main/AndroidManifest.xml");
if (!fs.existsSync(manifestPath)) {
  console.error("AndroidManifest.xml não encontrado. Execute primeiro: npx cap add android");
  process.exit(1);
}

let xml = fs.readFileSync(manifestPath, "utf8");
const permissions = [
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.SCHEDULE_EXACT_ALARM"
];

for (const permission of permissions) {
  if (!xml.includes(`android:name="${permission}"`)) {
    xml = xml.replace(
      /<manifest([^>]*)>/,
      `<manifest$1>\\n    <uses-permission android:name="${permission}" />`
    );
  }
}

fs.writeFileSync(manifestPath, xml, "utf8");
console.log("Permissões de notificações conferidas no AndroidManifest.xml");
