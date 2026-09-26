export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '96px 24px' }}>
      <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 12, opacity: 0.6 }}>
        Rize
      </p>
      <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: '16px 0' }}>
        Sell anything in Discord.
        <br />
        Get paid in crypto or card.
      </h1>
      <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 520 }}>
        Native checkout inside your server. Non-custodial Solana payments, Stripe for cards, instant
        delivery, five-minute setup.
      </p>
      <p style={{ marginTop: 48, fontSize: 14, opacity: 0.5 }}>
        Dashboard coming in milestone M3 — see docs/ROADMAP.md.
      </p>
    </main>
  );
}
