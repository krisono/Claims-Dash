
const manager = new ClaimManager();


SEED_CLAIMS.forEach(data => {
  manager.addClaim(new Claim(data));
});

manager._nextId = SEED_CLAIMS.length + 1;

const ui = new DashboardUI(manager);


ui.bindEvents();


ui.renderSummary(manager.getSummary());
ui.renderClaims(manager.claims, true);


const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

tl.fromTo('.page-header',
    { opacity: 0, y: -14 },
    { opacity: 1, y: 0, duration: 0.45 }
  )
  .to('.summary-card', {
    opacity:  1,
    y:        0,
    duration: 0.5,
    stagger:  0.08,
    ease:     'power3.out',
  }, '-=0.25')
  .fromTo('.controls-bar',
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
    '-=0.15'
  )
  .to('.claim-card', {
    opacity:  1,
    y:        0,
    duration: 0.38,
    stagger:  0.055,
    ease:     'power2.out',
  }, '-=0.1');
