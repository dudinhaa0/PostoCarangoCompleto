import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import {
  Bell, BellRing, CalendarClock, CheckCircle2, Clock3, Fuel,
  Gauge, Info, LoaderCircle, ShieldCheck, Timer, Wrench, XCircle
} from "lucide-react";

const CHANNEL_ID = "carango-manutencao";
const ALERTS = [
  { id: 240, label: "Calibragem dos pneus", type: "Pneus" },
  { id: 241, label: "Troca de óleo preventiva", type: "Óleo" },
  { id: 242, label: "Desafio extra — 5 segundos", type: "Teste" }
];

export default function App() {
  const native = Capacitor.isNativePlatform();
  const [permission, setPermission] = useState("Ainda não verificada");
  const [status, setStatus] = useState({ kind: "info", text: "Ative as notificações para começar a usar os lembretes." });
  const [loading, setLoading] = useState("");
  const [pending, setPending] = useState([]);
  const [lastAction, setLastAction] = useState("");

  useEffect(() => {
    if (native) {
      refreshPending();
      checkPermissionSilently();
    }
  }, [native]);

  async function checkPermissionSilently() {
    try {
      const result = await LocalNotifications.checkPermissions();
      setPermission(result.display);
    } catch (error) {
      setPermission("Indisponível");
    }
  }

  async function refreshPending() {
    try {
      const result = await LocalNotifications.getPending();
      setPending(result.notifications || []);
    } catch (error) {
      console.error("Erro ao consultar notificações pendentes:", error);
    }
  }

  async function ensurePermission() {
    if (!native) {
      setStatus({ kind: "warning", text: "As notificações nativas só funcionam no aplicativo instalado em um celular Android." });
      return false;
    }

    try {
      let result = await LocalNotifications.checkPermissions();
      if (result.display !== "granted") {
        result = await LocalNotifications.requestPermissions();
      }
      setPermission(result.display);

      if (result.display !== "granted") {
        setStatus({ kind: "warning", text: "Permissão não concedida. Ative as notificações nas configurações do Android." });
        return false;
      }

      await LocalNotifications.createChannel({
        id: CHANNEL_ID,
        name: "Manutenção do veículo",
        description: "Alertas de calibragem dos pneus e troca de óleo",
        importance: 4,
        visibility: 1,
        vibration: true
      });

      setStatus({ kind: "success", text: "Permissão concedida! O Posto Carango já pode enviar notificações." });
      return true;
    } catch (error) {
      console.error(error);
      setStatus({ kind: "error", text: `Falha ao solicitar permissão: ${error?.message || "erro desconhecido"}` });
      return false;
    }
  }

  async function handlePermission() {
    setLoading("permission");
    await ensurePermission();
    setLoading("");
  }

  async function scheduleNotification(id, title, body, delayMs, label) {
    setLoading(label);
    setLastAction(label);
    const allowed = await ensurePermission();
    if (!allowed) {
      setLoading("");
      return;
    }

    try {
      const scheduledAt = new Date(Date.now() + delayMs);
      await LocalNotifications.schedule({
        notifications: [{
          id,
          title,
          body,
          schedule: { at: scheduledAt },
          channelId: CHANNEL_ID,
          largeBody: body,
          summary: "Posto Carango Combustível",
          autoCancel: true
        }]
      });

      setStatus({
        kind: "success",
        text: delayMs <= 1500
          ? "Notificação imediata enviada ao sistema. Confira a central de notificações."
          : `Lembrete agendado para ${scheduledAt.toLocaleTimeString("pt-BR")}. Você pode deixar o app em segundo plano.`
      });
      await refreshPending();
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
      setStatus({ kind: "error", text: `Não foi possível criar o alerta: ${error?.message || "erro desconhecido"}` });
    } finally {
      setLoading("");
    }
  }

  function notifyTires() {
    return scheduleNotification(
      240,
      "Posto Carango",
      "Faz 30 dias que você não calibra os pneus! Confira a pressão recomendada para seu veículo.",
      1000,
      "tires"
    );
  }

  function scheduleOil() {
    return scheduleNotification(
      241,
      "Posto Carango — Troca de óleo",
      "Lembrete de manutenção preventiva: confira o nível e a data da próxima troca de óleo do motor.",
      10000,
      "oil"
    );
  }

  function scheduleFiveSeconds() {
    return scheduleNotification(
      242,
      "Posto Carango — Desafio extra",
      "Seu lembrete chegou! Confira a calibragem dos pneus e mantenha a manutenção em dia.",
      5000,
      "extra"
    );
  }

  async function cancelPending() {
    if (!pending.length) return;
    try {
      await LocalNotifications.cancel({
        notifications: pending.map((notification) => ({ id: notification.id }))
      });
      setStatus({ kind: "success", text: "Todos os lembretes pendentes foram cancelados." });
      await refreshPending();
    } catch (error) {
      setStatus({ kind: "error", text: `Erro ao cancelar: ${error?.message || error}` });
    }
  }

  const permissionLabel = permission === "granted" ? "Autorizada" :
    permission === "denied" ? "Negada" : permission;

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <div className="brand-icon"><Fuel size={27} strokeWidth={2.4} /></div>
          <div>
            <div className="brand-overline">COMBUSTÍVEL • CUIDADO • SEGURANÇA</div>
            <div className="brand-name">POSTO <span>CARANGO</span></div>
          </div>
        </div>
        <div className="header-pill"><span className="live-dot" /> APP DE ALERTAS</div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-tag"><Gauge size={14} /> MANUTENÇÃO PREVENTIVA</div>
            <h1>Seu carro em dia.<br /><span>Sua rotina tranquila.</span></h1>
            <p>Receba lembretes para cuidar dos pneus e do óleo do motor. Pequenos cuidados fazem a diferença.</p>
            <button className="hero-button" onClick={handlePermission} disabled={!!loading}>
              <BellRing size={17} /> Ativar notificações
            </button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="car-emoji">🚘</div>
            <div className="hero-stamp"><ShieldCheck size={17} /> CUIDE BEM</div>
          </div>
        </section>

        <section className="permission-strip">
          <div className="permission-icon"><ShieldCheck size={21} /></div>
          <div className="permission-text">
            <strong>Permissão do dispositivo</strong>
            <span>Notificações: <b className={permission === "granted" ? "granted" : ""}>{permissionLabel}</b></span>
          </div>
          <button className="small-button" onClick={handlePermission} disabled={!!loading}>
            {loading === "permission" ? <LoaderCircle className="spin" size={16} /> : "Verificar"}
          </button>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">CENTRAL DE NOTIFICAÇÕES</div>
              <h2>Seus lembretes</h2>
            </div>
            <span className="count-pill">03 ALERTAS</span>
          </div>

          <article className="alert-card">
            <div className="alert-symbol tire-symbol">◉</div>
            <div className="alert-info">
              <span className="card-kicker">SEGURANÇA</span>
              <h3>Calibragem dos pneus</h3>
              <p>Receba agora o aviso para conferir a pressão dos pneus.</p>
              <span className="alert-meta"><Bell size={13} /> Notificação imediata</span>
            </div>
            <button className="action-button yellow" onClick={notifyTires} disabled={!!loading}>
              {loading === "tires" ? <LoaderCircle className="spin" size={17} /> : <><BellRing size={16} /> Notificar agora</>}
            </button>
          </article>

          <article className="alert-card">
            <div className="alert-symbol oil-symbol"><Wrench size={25} /></div>
            <div className="alert-info">
              <span className="card-kicker">PREVENÇÃO</span>
              <h3>Troca de óleo</h3>
              <p>Programe um lembrete de manutenção preventiva para daqui a 10 segundos.</p>
              <span className="alert-meta"><CalendarClock size={13} /> Agendamento de teste</span>
            </div>
            <button className="action-button outline" onClick={scheduleOil} disabled={!!loading}>
              {loading === "oil" ? <LoaderCircle className="spin" size={17} /> : <><CalendarClock size={16} /> Agendar óleo</>}
            </button>
          </article>

          <article className="alert-card extra">
            <div className="alert-symbol timer-symbol"><Timer size={25} /></div>
            <div className="alert-info">
              <span className="card-kicker extra-kicker">DESAFIO EXTRA</span>
              <h3>Alerta em 5 segundos</h3>
              <p>Teste o agendamento rápido solicitado na atividade.</p>
              <span className="alert-meta"><Clock3 size={13} /> Disparo após 5 segundos</span>
            </div>
            <button className="action-button dark" onClick={scheduleFiveSeconds} disabled={!!loading}>
              {loading === "extra" ? <LoaderCircle className="spin" size={17} /> : <><Timer size={16} /> Agendar em 5s</>}
            </button>
          </article>
        </section>

        <section className={`status-box ${status.kind}`} aria-live="polite">
          <div className="status-icon">
            {status.kind === "success" ? <CheckCircle2 size={20} /> :
             status.kind === "error" ? <XCircle size={20} /> :
             status.kind === "warning" ? <Info size={20} /> : <Bell size={20} />}
          </div>
          <div><strong>Status do sistema</strong><p>{status.text}</p></div>
        </section>

        <section className="pending-box">
          <div className="pending-heading">
            <div><div className="eyebrow">CONTROLE</div><h3>Agendamentos pendentes</h3></div>
            <button className="refresh-button" onClick={refreshPending}>Atualizar</button>
          </div>
          {pending.length === 0 ? (
            <p className="empty-pending">Nenhuma notificação pendente no momento.</p>
          ) : (
            <>
              <div className="pending-list">
                {pending.map((item) => (
                  <div className="pending-item" key={item.id}>
                    <span className="pending-bullet" />
                    <span>{item.title || "Lembrete do Posto Carango"}</span>
                    <small>#{item.id}</small>
                  </div>
                ))}
              </div>
              <button className="cancel-button" onClick={cancelPending}>Cancelar lembretes pendentes</button>
            </>
          )}
        </section>

        {!native && (
          <div className="browser-note">
            <Info size={17} />
            <span>Você está na versão de navegador. Para testar as notificações, instale e abra o APK em um celular Android.</span>
          </div>
        )}
      </main>

      <footer>
        <div className="footer-brand"><Fuel size={18} /> POSTO CARANGO</div>
        <p>Atividade 15 • Recursos de Hardware • PPDM2</p>
        <p>4º Semestre — Projeto acadêmico</p>
      </footer>
    </div>
  );
}