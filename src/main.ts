import './style.css'
import { ACCESS_CODE, BRAND } from './config'
import eronLogo from './assets/eron-logo.svg'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('App root #app not found')
}

const navMarkup = `
  <nav class="nav">
    <div class="brand">
      <img src="${eronLogo}" alt="Eron International" />
      <span>Eron International</span>
    </div>
    <button class="nav-toggle" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#travel">Travel</a></li>
      <li><a href="#accommodation">Accommodation & Office</a></li>
      <li><a href="#corporate-card">Corporate Card</a></li>
      <li><a href="#agenda">Agenda</a></li>
      <li><a href="#party">Party</a></li>
      <li><a href="#contacts">Key Contacts</a></li>
    </ul>
  </nav>
`

const sectionsMarkup = `
  <header id="home" class="hero">
    <div class="hero-logo">
      <img src="${eronLogo}" alt="Eron International logo" />
    </div>
    <p class="eyebrow">Hub+Doers Fest · Montevideo</p>
    <h1>${BRAND.heroTitle}</h1>
    <p class="hero-subtitle">${BRAND.heroSubtitle}</p>
    <p class="hero-description">
      We’re excited to spend three days together in Montevideo — strengthening our connections and celebrating as one team.
    </p>
    <p class="hero-description">
      This guide summarizes the most important information about travel, agenda, venues, and contacts so you have everything in one place.
    </p>
    <div class="quick-links">
      <a href="#agenda">Agenda</a>
      <a href="#party">Party location</a>
      <a href="#contacts">Key contacts</a>
    </div>
  </header>

  <section id="travel" class="section">
    <div class="section-heading">
      <p class="section-label">Logistics</p>
      <h2>Travel</h2>
    </div>
    <div class="card-grid">
      <article class="card">
        <h3>Travel documents</h3>
        <ul>
          <li>Use the same ID or passport used for registration; tickets match that document.</li>
          <li>Doers from Brazil must carry their national ID and, if valid, their passport.</li>
        </ul>
      </article>
      <article class="card">
        <h3>Online check-in</h3>
        <ul>
          <li>Complete online check-in at least 24 hours before your scheduled flight.</li>
        </ul>
      </article>
      <article class="card">
        <h3>Luggage & clothing</h3>
        <ul>
          <li>Your ticket includes carry-on luggage only.</li>
          <li>Pack comfy clothes — include sneakers and sportswear.</li>
          <li>Dress code for Friday, Dec 12 celebration: Casual Chic in Black & White.</li>
        </ul>
      </article>
      <article class="card">
        <h3>Arrival & transfers</h3>
        <ul>
          <li>Groups arriving from Colombia, Buenos Aires, Curitiba, Mexico, or Spain will have transfers waiting.</li>
          <li>Individual arrivals should take a taxi or Uber.</li>
        </ul>
      </article>
    </div>
    <div class="info-box">
      <strong>Heads-up:</strong> Doers from Argentina and Brazil can link the corporate card to Uber or Cabify for rides from home to Buquebus or the airport.
    </div>
  </section>

  <section id="accommodation" class="section">
    <div class="section-heading">
      <p class="section-label">Stay & Work</p>
      <h2>Accommodation & Office</h2>
    </div>
    <div class="card-grid">
      <article class="card">
        <h3>Hotel After</h3>
        <p>Arturo Prat 3755 (visitors arriving from Dec 8 onward).</p>
        <div class="map-frame">
          <iframe
            title="Map of Hotel After"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Hotel+After+Montevideo&output=embed"
          ></iframe>
        </div>
      </article>
      <article class="card">
        <h3>Hotel Hilton</h3>
        <p>Montevideo Shopping.</p>
        <div class="map-frame">
          <iframe
            title="Map of Hilton Montevideo"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Hilton+Montevideo+Shopping&output=embed"
          ></iframe>
        </div>
      </article>
      <article class="card">
        <h3>Hotel Cottage Puerto Buceo</h3>
        <p>José Agustín Iturriaga 3568.</p>
        <div class="map-frame">
          <iframe
            title="Map of Hotel Cottage Puerto Buceo"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Hotel+Cottage+Puerto+Buceo&output=embed"
          ></iframe>
        </div>
      </article>
    </div>
    <p class="note">Your assigned hotel will be shared soon by HR.</p>

    <p class="note">We’ll share the same WTC campus — different towers, one House of Doers experience.</p>
    <div class="office-campus">
      <article class="office-card primary">
        <h3>House of Doers – WTC Free Zone</h3>
        <p>Luis Bonavita 1294, Office 1831, Tower 2, WTC Free Zone.</p>
        <ul>
          <li>The office is open 24/7.</li>
          <li>Bring laptop, chargers, and adapters in a carry-on or backpack.</li>
          <li>Keep equipment protected and powered off during the trip.</li>
          <li>Charge devices every night at the hotel.</li>
          <li>Request a temporary access card at reception and return it on your last day.</li>
        </ul>
        <div class="warning">Don’t forget to return your access card before leaving!</div>
      </article>
      <article class="office-card tower-card">
        <div class="tower-photo">
          <img src="/images/WTC-torre2.jpg" alt="WTC Free Zone Tower 2" loading="lazy" />
        </div>
        <div class="tower-body">
          <h4>WTC Free Zone · Tower 2 · 18th Floor</h4>
          <p>Primary Hub for IT, Product, Operations, Legal and HR teams.</p>
          <ul>
            <li>Wed Dec 10: IT / Product / Operations / Legal / HR</li>
            <li>Thu Dec 11: Finance / Commercial / Legal / Risk</li>
            <li>Fri Dec 12: Commercial / Product / Risk / HR / Legal / Operations</li>
          </ul>
        </div>
      </article>
      <article class="office-card tower-card">
        <div class="tower-photo">
          <img src="/images/WTC-torre4.jpg" alt="WTC Tower 4 – Tempus Room" loading="lazy" />
        </div>
        <div class="tower-body">
          <h4>WTC · Tower 4 · Tempus Room (Basement)</h4>
          <p>Additional collaboration space for cross-functional squads.</p>
          <ul>
            <li>Wed Dec 10: Finance / Commercial / Risk</li>
            <li>Thu Dec 11: IT / OPS / Product / HR</li>
            <li>Fri Dec 12: IT / Finance</li>
          </ul>
        </div>
      </article>
    </div>
    <div class="map-frame campus-map">
      <iframe
        title="Map of House of Doers campus"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps?q=Luis+Bonavita+1294+Montevideo&output=embed"
      ></iframe>
    </div>
  </section>

  <section id="corporate-card" class="section">
    <div class="section-heading">
      <p class="section-label">Expenses</p>
      <h2>Corporate Card</h2>
    </div>
    <div class="card">
      <p>
        During the Hub+Doers Fest, you’ll have a corporate card with an assigned budget. The Administration team will hand it over directly—no Jira ticket needed.
      </p>
      <div class="dos-donts">
        <div>
          <h3>What you CAN use it for</h3>
          <ul>
            <li>Food and transportation (to/from airport or port) if traveling alone.</li>
            <li>For visiting groups (Argentina, Brazil, Colombia, Spain), local transfers within Uruguay via assigned buses.</li>
            <li>Emergencies: get prior approval from your leader or a C-Level member.</li>
          </ul>
        </div>
        <div>
          <h3>What you CANNOT use it for</h3>
          <ul>
            <li>Personal purchases, gifts, transfers to other accounts, or cash withdrawals.</li>
          </ul>
        </div>
      </div>
      <div class="info-list">
        <h4>Important notes</h4>
        <ul>
          <li>Upload payment receipts and itemized invoices; the card slip alone isn’t valid.</li>
          <li>Unauthorized expenses will be flagged and become the Doer’s responsibility.</li>
          <li>Travel Policy available in BOB / Documents / Travel Policy.</li>
          <li>Doers in Uruguay receive USD 20/day (Wed–Fri) strictly for lunch.</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="agenda" class="section">
    <div class="section-heading">
      <p class="section-label">Schedule</p>
      <h2>Agenda</h2>
    </div>
    <div class="timeline">
      <article class="timeline-card">
        <h3>Wednesday · Dec 10</h3>
        <ul>
          <li><strong>Morning:</strong> Arrival in Montevideo.</li>
          <li><strong>Lunch:</strong> Connect with your team.</li>
          <li><strong>Afternoon:</strong> Cross-team networking.</li>
          <li><strong>Dinner:</strong> Plan group activities—most senior pays and keeps receipts.</li>
        </ul>
      </article>
      <article class="timeline-card">
        <h3>Thursday · Dec 11</h3>
        <ul>
          <li><strong>Morning (9:30–10:30):</strong> Guest speaker at WTC Tower 2 Auditorium (topic TBA).</li>
          <li><strong>After talk:</strong> Meet with your team and connect with other areas.</li>
          <li><strong>Lunch:</strong> Team lunch.</li>
          <li><strong>Afternoon:</strong> Team-building (buses depart 3:15 PM). Bring sportswear, proper shoes, insect repellent.</li>
          <li><strong>Dinner:</strong> Burgers on-site; return by 8:30 PM.</li>
        </ul>
      </article>
      <article class="timeline-card">
        <h3>Friday · Dec 12</h3>
        <ul>
          <li><strong>Morning:</strong> Hackathon Reloaded (9:15 AM–12:30 PM) on the 22nd floor of the same building.</li>
          <li><em>Note:</em> Not joining? Use the morning for meetings and cross-area time.</li>
          <li><strong>Lunch:</strong> Relaxed team lunch.</li>
          <li><strong>Afternoon:</strong> Networking and getting ready to celebrate!</li>
        </ul>
      </article>
    </div>
  </section>

  <section id="party" class="section party">
    <div class="section-heading">
      <p class="section-label">Celebration</p>
      <h2>It’s time to celebrate!</h2>
    </div>
    <p>
      This year’s party will take place at Charco – Complejo Plaza Mateo. Get ready for an unforgettable night — Doers rule the party!
    </p>
    <div class="card">
      <h3>Departure times</h3>
      <ul>
        <li>House of Doers & Hotel Hilton – 6:30 PM</li>
        <li>Hotel After – 6:30 PM</li>
        <li>Hotel Cottage Puerto Buceo – 6:40 PM</li>
      </ul>
      <div class="map-frame">
        <iframe
          title="Map of Charco – Complejo Plaza Mateo"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Charco+Complejo+Plaza+Mateo&output=embed"
        ></iframe>
      </div>
      <p class="map-note">Address: Rambla República del Perú S/N, Montevideo.</p>
    </div>
  </section>

  <section id="contacts" class="section">
    <div class="section-heading">
      <p class="section-label">Support</p>
      <h2>Key Contacts</h2>
    </div>
    <p>In case of emergency or questions, reach out to your assigned contact by area.</p>
    <div class="card-grid contacts">
      <article class="card">
        <h3>Commercial / Product / Operations</h3>
        <p>Avril Cardozo</p>
        <a href="tel:+34663439077">+34 663 43 90 77</a>
      </article>
      <article class="card">
        <h3>IT</h3>
        <p>Paulina Etcheverry</p>
        <a href="tel:+59895531237">+598 95 531 237</a>
      </article>
      <article class="card">
        <h3>Finance & Legal</h3>
        <p>Damasia Piccardo</p>
        <a href="tel:+5491161333514">+54 9 11 6133 3514</a>
      </article>
      <article class="card">
        <h3>Risk & PandaBlue / Tupay</h3>
        <p>Ivanna Moreira</p>
        <a href="tel:+59899777598">+598 99 777 598</a>
      </article>
      <article class="card">
        <h3>Guests</h3>
        <p>María Eugenia Silva</p>
        <a href="tel:+59899846546">+598 99 846 546</a>
      </article>
    </div>
  </section>

  <footer class="footer">
    <div>
      <p>See you soon — let’s make it epic!</p>
      <div class="footer-logo">
        <img src="${eronLogo}" alt="Eron International" />
      </div>
      <small>Internal event – Eron International.</small>
    </div>
  </footer>
`

const passwordGate = `
  <section class="lock-screen">
    <div class="lock-card">
      <p class="eyebrow">Access required</p>
      <h1>${BRAND.eventTitle}</h1>
      <p class="subtitle">${BRAND.eventSubtitle}</p>
      <form id="gate-form">
        <label for="password">Access code</label>
        <input id="password" type="password" placeholder="Enter password" autocomplete="one-time-code" required />
        <button type="submit">Enter</button>
        <p class="error-message" role="alert" aria-live="polite"></p>
      </form>
    </div>
  </section>
`

const renderApp = () => {
  root.innerHTML = `${navMarkup}<main class="content">${sectionsMarkup}</main>`

  const nav = root.querySelector('.nav')
  const toggle = root.querySelector<HTMLButtonElement>('.nav-toggle')
  const links = root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')

  toggle?.addEventListener('click', () => {
    nav?.classList.toggle('nav-open')
  })

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      const target = document.querySelector<HTMLElement>(link.getAttribute('href') || '')
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      nav?.classList.remove('nav-open')
    })
  })
}

const renderGate = () => {
  root.innerHTML = passwordGate
  const form = root.querySelector<HTMLFormElement>('#gate-form')
  const input = root.querySelector<HTMLInputElement>('#password')
  const errorMsg = root.querySelector<HTMLParagraphElement>('.error-message')

  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    if (input?.value.trim() === ACCESS_CODE) {
      sessionStorage.setItem('eronAccessGranted', 'true')
      renderApp()
    } else if (errorMsg) {
      errorMsg.textContent = 'Wrong password, try again.'
    }
  })
}

if (sessionStorage.getItem('eronAccessGranted') === 'true') {
  renderApp()
} else {
  renderGate()
}
