import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dns from 'dns';
import net from 'net';
import tls from 'tls';
import {defineConfig, Plugin} from 'vite';

// Invia email tramite Gmail API v1 (Progetto Google Cloud braciami-ancora 1057213419131)
async function sendViaGmailApi(
  toEmail: string,
  subject: string,
  htmlBody: string,
  accessToken?: string
): Promise<{ sent: boolean; detail: string }> {
  if (!accessToken) {
    return { sent: false, detail: 'Nessun OAuth token Gmail API fornito' };
  }
  const utf8Subject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
  const messageParts = [
    'From: "Braciami Ancora - Cento" <samantamanderioli083@gmail.com>',
    'Reply-To: <samantamanderioli083@gmail.com>',
    `To: <${toEmail}>`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody
  ];
  const rawMessage = Buffer.from(messageParts.join('\r\n'), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const res = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/samantamanderioli083@gmail.com/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: rawMessage })
      }
    );
    const data = (await res.json()) as any;
    if (res.ok && data.id) {
      return { sent: true, detail: `Delivered via Gmail API (Project 1057213419131 - Message ID: ${data.id})` };
    }
    return { sent: false, detail: `Gmail API: ${data?.error?.message || JSON.stringify(data)}` };
  } catch (err: any) {
    return { sent: false, detail: `Gmail API failure: ${err?.message || err}` };
  }
}

function sendAuthenticatedSmtpMail(
  toEmail: string,
  subject: string,
  htmlBody: string
): Promise<{ sent: boolean; detail: string }> {
  return new Promise((resolve) => {
    const socket = net.createConnection(587, 'smtp.gmail.com');
    let step = 0;
    let secureSocket: tls.TLSSocket | null = null;
    let resolved = false;

    const finish = (sent: boolean, detail: string) => {
      if (resolved) return;
      resolved = true;
      try {
        if (secureSocket) secureSocket.destroy();
        socket.destroy();
      } catch {}
      resolve({ sent, detail });
    };

    socket.setTimeout(8000, () => finish(false, 'SMTP timeout'));
    socket.on('error', (err) => finish(false, err.message));

    function handleData(chunk: Buffer, currentSock: net.Socket | tls.TLSSocket) {
      const resp = chunk.toString();
      const code = parseInt(resp.slice(0, 3), 10);
      if (code >= 400) {
        finish(false, resp.trim());
        return;
      }

      if (step === 0 && code === 220) {
        step = 1;
        currentSock.write('EHLO braciamiancora.it\r\n');
      } else if (step === 1 && code === 250) {
        step = 2;
        currentSock.write('STARTTLS\r\n');
      } else if (step === 2 && code === 220) {
        step = 3;
        secureSocket = tls.connect(
          { socket: socket, servername: 'smtp.gmail.com' },
          () => {
            secureSocket!.write('EHLO braciamiancora.it\r\n');
          }
        );
        secureSocket.on('data', (c) => handleData(c, secureSocket!));
        secureSocket.on('error', (err) => finish(false, err.message));
      } else if (step === 3 && code === 250) {
        step = 4;
        const authPlain = Buffer.from('\0admin@gevbologna.org\0ltyoidfalftpshgp').toString('base64');
        currentSock.write('AUTH PLAIN ' + authPlain + '\r\n');
      } else if (step === 4 && code === 235) {
        step = 5;
        currentSock.write('MAIL FROM:<admin@gevbologna.org>\r\n');
      } else if (step === 5 && code === 250) {
        step = 6;
        currentSock.write(`RCPT TO:<${toEmail}>\r\n`);
      } else if (step === 6 && code === 250) {
        step = 7;
        currentSock.write('DATA\r\n');
      } else if (step === 7 && code === 354) {
        step = 8;
        const msgId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@braciamiancora.it>`;
        const msg = [
          'From: "Braciami Ancora - Cento" <samantamanderioli083@gmail.com>',
          'Reply-To: <samantamanderioli083@gmail.com>',
          `To: <${toEmail}>`,
          `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`,
          `Message-ID: ${msgId}`,
          `Date: ${new Date().toUTCString()}`,
          'MIME-Version: 1.0',
          'Content-Type: text/html; charset=UTF-8',
          '',
          htmlBody,
          '.'
        ].join('\r\n');
        currentSock.write(msg + '\r\n');
      } else if (step === 8 && code === 250) {
        currentSock.write('QUIT\r\n');
        finish(true, 'Delivered with sender samantamanderioli083@gmail.com via Gmail Relay (250 OK)');
      }
    }

    socket.on('data', (c) => handleData(c, socket));
  });
}

function oauthOtpEmailMiddleware(): Plugin {
  return {
    name: 'oauth-otp-email-middleware',
    configureServer(server) {
      server.middlewares.use('/api/send-oauth-otp-email', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
          return;
        }
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const { to, subject, html, providerName, otpCode, verifyUrl, accessToken } = payload;
            const finalSubject = subject || `Conferma Registrazione ${providerName}`;
            const finalHtml = html || `<p>Caro ${to}, per confermare l'accesso con il tuo provider ${providerName || 'selezionato'}, inserisci il codice ${otpCode || ''}</p>`;

            let dispatchResult = { sent: false, detail: '' };

            // 1. Prova prima invio via Gmail API (Progetto Google Cloud braciami-ancora 1057213419131)
            if (accessToken || process.env.GMAIL_API_TOKEN) {
              dispatchResult = await sendViaGmailApi(
                to,
                finalSubject,
                finalHtml,
                accessToken || process.env.GMAIL_API_TOKEN
              );
              console.log(
                `[GMAIL API DISPATCH] To: ${to} | Provider: ${providerName} | Status: ${dispatchResult.sent} (${dispatchResult.detail})`
              );
            }

            // 2. Se non inviato via Gmail API, procedi con Gmail Relay (Mittente samantamanderioli083@gmail.com)
            if (!dispatchResult.sent) {
              dispatchResult = await sendAuthenticatedSmtpMail(to, finalSubject, finalHtml);
              console.log(
                `[GMAIL SENDER DISPATCH] Sender: samantamanderioli083@gmail.com | To: ${to} | Status: ${dispatchResult.sent} (${dispatchResult.detail})`
              );
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                ok: dispatchResult.sent,
                to,
                sender: 'samantamanderioli083@gmail.com',
                providerName,
                otpCode,
                verifyUrl,
                detail: dispatchResult.detail,
                timestamp: new Date().toISOString()
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err?.message || 'Internal error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), oauthOtpEmailMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
