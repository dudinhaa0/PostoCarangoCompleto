
<img width="738" height="1600" alt="WhatsApp Image 2026-11-06 at 14 22 56" src="https://github.com/user-attachments/assets/2f64a18f-26e6-4bfb-827d-18757a6d969f" />
<img width="738" height="1600" alt="WhatsApp Image 2026-11-06 at 14 22 21" src="https://github.com/user-attachments/assets/366bd0f1-b1b2-4a47-84c6-004623071a56" />
<img width="738" height="1600" alt="WhatsApp Image 2026-11-06 at 14 22 20" src="https://github.com/user-attachments/assets/8f55964a-67cc-4fa4-9fc0-7834920aac56" />




Uploading WhatsApp Video 2026-11-06 at 14.22.20.mp4…

https://github.com/user-attachments/assets/f3945e45-a30a-49a7-afd9-e46cd5b13a54



# ⛽ Posto Carango Combustível

Aplicativo Android acadêmico desenvolvido com React, Vite e Capacitor para a atividade **15 — Recursos de Hardware: Notificações Locais**, da disciplina PPDM2.

## Sobre o aplicativo

O Posto Carango ajuda o motorista a lembrar de cuidados preventivos com o veículo. A aplicação demonstra notificações locais para calibragem dos pneus e troca de óleo, incluindo agendamento de alertas e solicitação de permissões do Android.

## Funcionalidades

- Verificar a permissão de notificações com `checkPermissions()`.
- Solicitar autorização com `requestPermissions()` (Android 13+).
- Criar canal de notificações no Android.
- Enviar alerta de calibragem dos pneus (ID 240).
- Agendar lembrete de troca de óleo (ID 241).
- Desafio extra: agendar alerta para 5 segundos depois (ID 242).
- Consultar notificações pendentes e cancelar agendamentos.
- Exibir mensagens de sucesso, aviso e erro.
- Interface responsiva com identidade visual do Posto Carango.

## Tecnologias

- React
- Vite
- Capacitor 8
- `@capacitor/local-notifications`
- Lucide React

## Requisitos

- Node.js 22 (recomendado).
- Android Studio e Android SDK para compilar localmente.
- Celular Android para testar as notificações nativas.

## Como executar no computador

Abra o terminal na pasta do projeto:

```bash
npm install
npm run dev
```

A versão do navegador serve para visualizar a interface. Notificações locais nativas precisam ser testadas no aplicativo Android.

## Como gerar o APK

Se estiver adicionando Android pela primeira vez:

```bash
npm install
npm run build
npx cap add android
npm run android:prepare
npx cap open android
```

No Android Studio, aguarde a sincronização do Gradle e execute em um aparelho conectado. Para gerar APK pelo terminal no Windows, depois da plataforma Android criada:

```powershell
npm run build
npm run android:prepare
cd android
.\gradlew.bat assembleDebug
```

APK de depuração:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Permissões Android

O script `scripts/patch-android.mjs` confere e adiciona ao `AndroidManifest.xml`:

- `android.permission.POST_NOTIFICATIONS`
- `android.permission.SCHEDULE_EXACT_ALARM`

No Android 13 ou superior, o usuário precisa conceder a permissão de notificações em tempo de execução. O aplicativo faz a verificação e a solicitação pelo botão **Verificar / permitir**.

No Android 12 ou superior, a precisão dos alarmes pode depender da autorização de alarmes e lembretes nas configurações do sistema. O comportamento pode variar conforme a versão do Android e as configurações do aparelho.

## Gerar APK pelo GitHub Actions

O repositório inclui `.github/workflows/android-apk.yml`.

1. Envie o projeto para um repositório GitHub.
2. Abra a aba **Actions**.
3. Selecione **Gerar APK - Posto Carango**.
4. Clique em **Run workflow** (ou faça push na branch `main`/`master`).
5. Ao finalizar, abra a execução e baixe o artefato **Posto-Carango-APK**.

## Roteiro de teste e gravação

1. Instale e abra o APK no Android.
2. Toque em **Ativar notificações** ou **Verificar** e conceda a permissão.
3. Toque em **Notificar agora** e confira o alerta de calibragem.
4. Toque em **Agendar óleo** e aguarde cerca de 10 segundos.
5. Toque em **Agendar em 5s** e confira o desafio extra.
6. Mostre a lista de agendamentos pendentes.
7. Grave a tela do celular mostrando os alertas na central de notificações.

**Importante:** os prints, GIF e vídeo da entrega devem ser capturados no aparelho depois de executar os testes. Não inclua evidências simuladas.

## Apresentação

O **Posto Carango Combustível** é um aplicativo de manutenção preventiva que utiliza notificações locais para lembrar o usuário de cuidados importantes com o veículo. Ele oferece alertas sobre calibragem dos pneus e troca de óleo, permite agendar lembretes para horários futuros e solicita as permissões necessárias do sistema operacional. O desafio extra demonstra o disparo programado de uma notificação cinco segundos após a ação do usuário.

---

Atividade 15 • Recursos de Hardware — Notificações Locais  
PPDM2 • 4º Semestre
