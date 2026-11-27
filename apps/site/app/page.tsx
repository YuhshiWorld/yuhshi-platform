import { countriesAlphabetical, countryFlag } from '@yuhshi/geo';
import { PledgeForm } from './PledgeForm';

const steps = [
  { name: 'Discover', text: 'Find people, countries and cultures you have never met.' },
  { name: 'Exchange', text: 'Share one small thing from your world. Discover one from theirs. A Yuhshi takes about a minute.' },
  { name: 'Collect', text: 'Earn a stamp in your passport for every real exchange. All 195 countries count equally.' },
  { name: 'Share', text: 'Keep your Fusion keepsake, and share it only when you both agree.' },
  { name: 'Return', text: 'Learn a word, make a friend, and discover something new tomorrow.' },
];

const promises = [
  { title: 'Safe by design', text: 'Adults only, verified privately. Every step closer needs a yes from both of you. Leave, block or report in one tap.' },
  { title: 'Built for every phone', text: 'Works on low-cost phones and weak connections, with a light version and offline use.' },
  { title: 'No popularity contest', text: 'No follower counts, no rankings, no streaks. Just people.' },
  { title: 'Free to start', text: 'Exchanges, your passport and your phrasebook are free. Always.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Yuhshi',
  url: 'https://yuhshi.com',
  logo: 'https://yuhshi.com/brand/yuhshi-logo-light.svg',
  slogan: 'Don’t collect followers. Collect the world.',
  parentOrganization: { '@type': 'Organization', name: 'CruxOmni Group' },
};

export default function Home() {
  const countries = countriesAlphabetical('en').map((c) => ({ code: c.code, name: c.name, flag: countryFlag(c.code) }));
  const year = new Date().getFullYear();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="top">
        <picture>
          <source srcSet="/brand/yuhshi-logo-dark.svg" media="(prefers-color-scheme: dark)" />
          <img src="/brand/yuhshi-logo-light.svg" alt="Yuhshi" height={36} />
        </picture>
        <a className="secondary" href="#pledge">
          Get your free passport
        </a>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">Coming country by country</p>
          <h1 id="hero-title">The world is waiting. Collect all 195 countries.</h1>
          <p className="lead">Meet real people through one-minute cultural exchanges. Share a word, a sound or a breakfast from your world, discover theirs, and collect a stamp for every country you meet.</p>
          <a className="primary" href="#pledge">
            Get your free passport
          </a>
          <div className="fusion" aria-hidden="true" />
        </section>

        <section aria-labelledby="how-title" className="band">
          <h2 id="how-title">How Yuhshi works</h2>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.name}>
                <span className="num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="pledge" aria-labelledby="pledge-title" className="pledge-band">
          <h2 id="pledge-title">Bring Yuhshi to your country</h2>
          <p className="lead">Yuhshi opens country by country, when it is ready to be safe there. Pledge for yours, and we will email you on its opening day.</p>
          <PledgeForm countries={countries} />
        </section>

        <section aria-labelledby="promise-title" className="band">
          <h2 id="promise-title">Our promise</h2>
          <ul className="promises">
            {promises.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="foot">
        <p className="tagline">Don&rsquo;t collect followers. Collect the world.</p>
        <p className="legal">&copy; {year} CruxOmni Group. All rights reserved. Yuhshi is a product of CruxOmni Group.</p>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
