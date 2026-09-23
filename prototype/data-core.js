/* Locke for Loomwork: core data. Prototype date is Tuesday 15 Sep 2026. */
window.LW = {
  today: '2026-09-15',
  lastVisit: '2026-09-10',
  client: { name: 'Loomwork', tagline: 'Series B · San Francisco' },
  stateNames: { CA: 'California', TX: 'Texas', VA: 'Virginia', PA: 'Pennsylvania', NJ: 'New Jersey', MD: 'Maryland', OH: 'Ohio', IL: 'Illinois', CO: 'Colorado' },

  people: {
    kevin: { name: 'Kevin Trejos', first: 'Kevin', short: 'K. Trejos', ini: 'KT', title: 'Policy Lead', org: 'locke' },
    chen: { name: 'Alexandra Chen', first: 'Alexandra', short: 'A. Chen', ini: 'AC', title: 'Counsel', org: 'locke' },
    bell: { name: 'Marcus Bell', first: 'Marcus', short: 'M. Bell', ini: 'MB', title: 'Government Contracts', org: 'locke' },
    maya: { name: 'Maya Okafor', first: 'Maya', short: 'M. Okafor', ini: 'MO', title: 'CEO and Co-founder', org: 'client' },
    daniel: { name: 'Daniel Reyes', first: 'Daniel', short: 'D. Reyes', ini: 'DR', title: 'Head of Government Sales', org: 'client' },
    priya: { name: 'Priya Natarajan', first: 'Priya', short: 'P. Natarajan', ini: 'PN', title: 'CISO and VP Engineering', org: 'client' }
  },

  saved: [
    { label: 'Interconnection automation', href: '#/legislative/federal?topic=interconnection' },
    { label: 'Large-load tariffs', href: '#/legislative/state?topic=largeload' },
    { label: 'DOE grid funding', href: '#/legislative/federal?topic=funding' }
  ],

  legIntro: {
    federal: 'Bills that change how the grid connects new load and generation, who pays for it, and which federal programs can fund grid software.',
    state: 'Legislatures in Loomwork’s markets. Most large-load cost and interconnection rules are being written here, then implemented by utility commissions.'
  },
  noHearings: {
    federal: 'No committee has noticed a grid, large-load, or AI infrastructure hearing yet. With the 3 Nov midterms seven weeks out, calendars are thin. Locke checks notices every morning.',
    state: 'No hearings noticed. California adjourned 31 Aug, and Texas is in its interim until January. Locke checks notices every morning.'
  },

  sources: {
    'ferc-sc': { label: 'FERC show cause, 18 Jun', title: 'FERC issues Section 206 show cause orders directing all six RTOs/ISOs to justify or reform large load integration rules', pub: 'McGuireWoods', url: 'https://www.mcguirewoods.com/client-resources/alerts/2026/6/ferc-issues-section-206-show-cause-orders-directing-all-six-rtos-isos-to-justify-or-reform-large-load-integration-rules/' },
    'ferc-rm26': { label: 'RM26-4', title: 'FERC to act on large load interconnection docket by June 2026', pub: 'FERC', url: 'https://www.ferc.gov/news-events/news/ferc-act-large-load-interconnection-docket-june-2026' },
    'stoel-abey': { label: 'Responses due 16 Nov', title: 'Energy regulatory update: show cause responses held in abeyance', pub: 'Stoel Rives', date: '2026-08-26', url: 'https://www.stoel.com/insights/reports/august-26-2026' },
    'miso-ud': { label: 'MISO filing, 28 Aug', title: 'Large loads face reliability requirements under MISO proposal', pub: 'Utility Dive', url: 'https://www.utilitydive.com/news/large-load-reliability-requirements-miso-ferc/829278/' },
    'ud-ferc': { label: 'Utility Dive', title: '6 takeaways from FERC’s data center interconnection decision', pub: 'Utility Dive', url: 'https://www.utilitydive.com/news/ferc-doe-data-center-interconnection/823360/' },
    'tapestry': { label: 'Tapestry at PJM', title: 'Google-backed Tapestry completes first deployment of AI platform for PJM interconnection application process', pub: 'Data Center Dynamics', url: 'https://www.datacenterdynamics.com/en/news/google-backed-tapestry-completes-first-deployment-of-ai-platform-for-pjm-interconnection-application-process/' },
    'automation': { label: 'Study automation', title: 'How grid operators can cut energy costs by automating interconnection studies', pub: 'Evergreen Collaborative', url: 'https://www.evergreencollaborative.com/policy-hub/how-grid-operators-can-cut-energy-costs-by-automating-interconnection-studies/' },

    's4559': { label: 'S. 4559', title: 'S. 4559, Energy Cost Fairness and Reliability Act of 2026', pub: 'Congress.gov', date: '2026-05-18', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/4559' },
    's4559-text': { label: 'S. 4559 text', title: 'Text of S. 4559 as introduced', pub: 'GovInfo', url: 'https://www.govinfo.gov/app/details/BILLS-119s4559is' },
    'hr9340': { label: 'H.R. 9340', title: 'H.R. 9340, Ratepayer Protection Act (text)', pub: 'Congress.gov', date: '2026-06-18', url: 'https://www.congress.gov/bill/119th-congress/house-bill/9340/text' },
    'ec-rpa': { label: '52-0 in committee', title: 'Ratepayer Protection Act advances from House Committee on Energy and Commerce', pub: 'House Energy and Commerce', date: '2026-07-20', url: 'https://energycommerce.house.gov/posts/ratepayer-protection-act-advances-from-house-committee-on-energy-and-commerce' },
    'ec-markup': { label: 'E&C markup', title: 'The House Committee on Energy and Commerce advances 17 bills to the full House', pub: 'House Energy and Commerce', date: '2026-07-20', url: 'https://energycommerce.house.gov/posts/the-house-committee-on-energy-and-commerce-advances-17-bills-to-the-full-house-of-representatives' },
    's5008': { label: 'S. 5008', title: 'S. 5008, Grid Connection and Congestion Management Act (text)', pub: 'GovInfo', date: '2026-07-16', url: 'https://www.govinfo.gov/app/details/BILLS-119s5008is' },
    'pv-s5008': { label: 'pv magazine', title: 'U.S. Senate bill would require grid operators to offer connect and manage interconnection', pub: 'pv magazine USA', date: '2026-07-20', url: 'https://pv-magazine-usa.com/2026/07/20/u-s-senate-bill-would-require-grid-operators-to-offer-connect-and-manage-interconnection/' },
    'hr1047': { label: 'H.R. 1047', title: 'H.R. 1047, GRID Power Act, all actions', pub: 'Congress.gov', url: 'https://www.congress.gov/bill/119th-congress/house-bill/1047/all-info' },
    'ud-gridpower': { label: 'Utility Dive', title: 'House passes bill to fast-track dispatchable generation interconnection', pub: 'Utility Dive', date: '2025-09-18', url: 'https://www.utilitydive.com/news/house-bill-dispatchable-generation-balderson/760632/' },
    'hr4776': { label: 'H.R. 4776', title: 'H.R. 4776, SPEED Act, as passed by the House', pub: 'Congressional Research Service', url: 'https://www.congress.gov/crs-product/IF13180' },
    'bhfs-speed': { label: 'Brownstein', title: 'Bipartisan permitting deal passes House, Senate up next with speed bumps ahead', pub: 'Brownstein', url: 'https://www.bhfs.com/insight/bipartisan-permitting-deal-passes-house-senate-up-next-with-speed-bumps-ahead/' },
    'ee-dems': { label: 'E&E News', title: 'Dems bet on transmission bill as bridge to permitting deal', pub: 'E&E News', url: 'https://www.eenews.net/articles/dems-bet-on-transmission-bill-as-bridge-to-permitting-deal/' },
    'ee-permit': { label: 'E&E News', title: 'Where the permitting talks stand', pub: 'E&E News', url: 'https://www.eenews.net/articles/where-the-permitting-talks-stand/' },
    'ew-house': { label: 'House Approps', title: 'Committee approves FY27 Energy and Water Development Appropriations Act', pub: 'House Appropriations Committee', url: 'https://appropriations.house.gov/news/press-releases/committee-approves-fy27-energy-and-water-development-appropriations-act' },
    'crs-ew': { label: 'CRS R48944', title: 'Energy and Water Development: FY2027 Appropriations', pub: 'Congressional Research Service', url: 'https://www.congress.gov/crs-product/R48944' },
    'cr27': { label: 'CR to 11 Dec', title: 'CR funds agencies at FY 2026 levels through Dec. 11', pub: 'GovCon Wire', date: '2026-09-02', url: 'https://www.govconwire.com/articles/continuing-resolution-fy2027-funding-signed' },
    'cr27-cra': { label: 'CRA update', title: 'FY27 appropriations update: Congress passes continuing resolution, punts FY27 to December', pub: 'Computing Research Association', url: 'https://cra.org/govaffairs/blog/2026/09/fy2027-sept-update/' },
    'sbir': { label: 'S. 3971', title: 'SBIR/STTR programs reauthorized after six-month lapse', pub: 'Crowell & Moring', date: '2026-04-13', url: 'https://www.crowell.com/en/insights/client-alerts/sbirsttr-programs-reauthorized-after-six-month-lapse' },
    'hr5388': { label: 'H.R. 5388', title: 'H.R. 5388, American Artificial Intelligence Leadership and Uniformity Act (text)', pub: 'Congress.gov', url: 'https://www.congress.gov/bill/119th-congress/house-bill/5388/text' },
    's4214': { label: 'S. 4214', title: 'S. 4214, Artificial Intelligence Data Center Moratorium Act', pub: 'Congress.gov', url: 'https://www.congress.gov/bill/119th-congress/senate-bill/4214' },
    'spark': { label: 'SPARK', title: 'Energy Department announces $1.9B investment in critical grid infrastructure', pub: 'U.S. Department of Energy', date: '2026-03-12', url: 'https://www.energy.gov/articles/energy-department-announces-19b-investment-critical-grid-infrastructure-reduce-electricity' },
    'spark-hk': { label: 'SPARK timeline', title: 'DOE releases $1.9 billion funding opportunity for grid upgrades and expansion', pub: 'Holland & Knight', url: 'https://www.hklaw.com/en/insights/publications/2026/03/doe-releases-1-9-billion-funding-opportunity-for-grid-upgrades' },
    'cmmc': { label: 'CMMC Phase 2 paused', title: 'Department of War immediately suspends CMMC Phase II requirements, launches 60-day reform review', pub: 'Crowell & Moring', date: '2026-07-13', url: 'https://www.crowell.com/en/insights/client-alerts/department-of-war-immediately-suspends-cmmc-phase-ii-requirements-launches-60-day-reform-review' },
    'farcui': { label: 'FAR CUI rule', title: 'RFO rulemaking gives contractors a second opportunity to comment on FAR CUI rule', pub: 'Greenberg Traurig', url: 'https://www.gtlaw.com/en/insights/2026/6/rfo-rulemaking-gives-contractors-a-second-opportunity-to-comment-on-far-cui-rule' },
    'nerc-l3': { label: 'NERC Level 3 alert', title: 'NERC signals rare Level 3 alert on large loads and data centers', pub: 'Davis Wright Tremaine', url: 'https://www.dwt.com/blogs/energy--environmental-law-blog/2026/05/nerc-level-3-alert-large-loads-data-centers' },
    'nerc-cle': { label: 'NERC registration', title: 'NERC releases proposed registration requirements for computational load customers', pub: 'Steptoe', url: 'https://www.steptoe.com/en/news-publications/nerc-releases-proposed-registration-requirements-for-computational-load-customers-signaling-major-shift-in-data-center-regulatory-risk.html' },
    'nerc-deadline': { label: 'FERC year-end deadline', title: 'FERC sets year-end deadline for NERC to finalize registry criteria and standards for computational loads', pub: 'NERC', url: 'https://www.nerc.com/newsroom/ferc-sets-year-end-deadline-for-nerc-to-finalize-registry-criteria-and-standards-for-computational-loads' },

    'ab2383': { label: 'AB 2383', title: 'AB 2383, Fair Share in Energy Act', pub: 'California Legislative Information', url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260AB2383' },
    'sb886': { label: 'SB 886', title: 'SB 886, California Technology Innovation and Ratepayer Protection Act, bill status', pub: 'California Legislative Information', url: 'https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB886' },
    'sb886-padilla': { label: 'Sen. S. Padilla', title: 'Nation-leading data center regulations head to Governor’s desk', pub: 'Office of Sen. Steve Padilla', url: 'https://sd18.senate.ca.gov/news/nation-leading-data-center-regulations-head-governors-desk' },
    'ca-dcd': { label: 'DCD', title: 'California lawmakers pass data center ratepayer protection bills, send to governor for approval', pub: 'Data Center Dynamics', url: 'https://www.datacenterdynamics.com/en/news/california-lawmakers-pass-data-center-ratepayer-protection-bills-send-to-governor-for-approval/' },
    'sb53': { label: 'SB 53', title: 'SB 53, Transparency in Frontier Artificial Intelligence Act', pub: 'California Legislative Information', url: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260SB53' },
    'sb6-gt': { label: 'SB 6 update', title: 'Texas Senate Bill 6 update: proposed interconnection standards for large loads', pub: 'Greenberg Traurig', url: 'https://www.gtlaw.com/en/insights/2026/3/texas-senate-bill-6-update-what-data-centers-large-load-customers-should-know-about-proposed-interconnection-standards' },
    'puct-58481': { label: 'PUCT 58481', title: 'Project No. 58481, proposal for publication of 16 TAC §25.194', pub: 'Public Utility Commission of Texas', date: '2026-03-12', url: 'https://interchange.puc.texas.gov/Documents/58481_122_1600475.PDF' },
    'abbott': { label: 'Abbott letter, 3 Aug', title: 'Letter from Gov. Abbott to PUCT Chairman Gleeson and ERCOT CEO Vegas on data centers', pub: 'Office of the Texas Governor', date: '2026-08-03', url: 'https://gov.texas.gov/uploads/files/press/Thomas_Gleeson_Pablo_Vegas_Data_Centers_Directive_Letter_to_PUCT_ERCOT_August_2026_.pdf' },
    'tx-ci': { label: '410 GW in queue', title: 'Texas House holds wide-ranging hearing on booming data center industry', pub: 'Community Impact', url: 'https://communityimpact.com/central-austin/texas-legislature/live-updates-ercot-will-complete-data-center-audit-in-late-2026-officials-say/' },
    'tx-trib': { label: 'Texas Tribune', title: 'Residents and industry leaders at odds over transmission lines at legislative hearing', pub: 'The Texas Tribune', date: '2026-08-19', url: 'https://www.texastribune.org/2026/08/19/texas-house-meeting-data-centers-transmission-lines-backlash/' },
    'tx-kxan': { label: 'KXAN', title: 'After hours of testimony, Texas leaders want controversial power line applications denied', pub: 'KXAN', url: 'https://www.kxan.com/energy-crossroads/after-hearing-hours-of-testimony-texas-leaders-want-controversial-power-line-applications-denied/' },
    'va-mercury': { label: 'VA package', title: 'Data center bills dominated this year’s General Assembly. Here’s what passed.', pub: 'Virginia Mercury', date: '2026-03-17', url: 'https://virginiamercury.com/2026/03/17/data-center-bills-dominated-this-years-general-assembly-heres-what-passed/' },
    'va-amend': { label: 'Governor’s amendments', title: 'Governor amends bills that shift costs onto data centers', pub: 'Virginia Mercury', date: '2026-04-16', url: 'https://virginiamercury.com/2026/04/16/lawmakers-dominion-say-spanbergers-amendments-weaken-bill-to-shift-costs-onto-data-centers/' },
    'pa-act21': { label: 'PA Act 21', title: 'Pennsylvania data centers face increased oversight under new law', pub: 'Utility Dive', url: 'https://www.utilitydive.com/news/pennsylvania-passes-budget-increasing-data-center-oversight/825177/' },
    'pa-puc': { label: 'PA PUC model tariff', title: 'PUC acts to protect ratepayers, guide data center growth with new large load tariff framework', pub: 'Pennsylvania PUC', url: 'https://www.puc.pa.gov/press-release/2026/puc-acts-to-protect-ratepayers-guide-data-center-growth-with-new-large-load-tariff-framework-4-30-26' },
    'nj-law': { label: 'NJ c.32', title: 'Governor Sherrill announces ratepayer relief, signs major legislation on energy', pub: 'State of New Jersey', date: '2026-07-07', url: 'https://www.nj.gov/governor/news/2026/20260707a.shtml' },
    'md-relief': { label: 'HB 1532', title: 'Moore signs Maryland energy bill aimed at cutting power costs', pub: 'Maryland Matters', date: '2026-05-12', url: 'https://marylandmatters.org/2026/05/12/moore-signs-utility-relief-act/' },
    'md-opc': { label: 'OPC summary', title: '2026 Utility RELIEF Act', pub: 'Maryland Office of People’s Counsel', url: 'https://opc.maryland.gov/Publications/Legislative-Work/2026-Utility-RELIEF-Act' },
    'oh-hb646': { label: 'OH HB 646', title: 'Ohio lawmakers introduce sweeping new data center legislation', pub: 'Ohio Capital Journal', date: '2026-06-10', url: 'https://ohiocapitaljournal.com/2026/06/10/ohio-lawmakers-introduce-sweeping-new-data-center-legislation/' },
    'il-pause': { label: 'IL incentive pause', title: 'Gov. Pritzker pauses new data center tax incentives', pub: 'Office of the Illinois Governor', url: 'https://gov-pritzker-newsroom.prezly.com/gov-pritzker-pauses-new-data-center-tax-incentives' },
    'il-power': { label: 'IL POWER Act', title: 'Pritzker announces two-year suspension of state tax incentives for new data center developments', pub: 'NRDC', url: 'https://www.nrdc.org/press-releases/pritzker-announces-two-year-suspension-state-tax-incentives-new-data-center' },
    'co-sb189': { label: 'CO SB 26-189', title: 'Colorado repeals and replaces its AI Act', pub: 'Skadden', url: 'https://www.skadden.com/insights/publications/2026/06/colorado-repeals-and-replaces-its-ai-act' },

    'enr-ferc': { label: 'ENR hearing', title: 'Oversight hearing on the Federal Energy Regulatory Commission', pub: 'Senate Energy and Natural Resources', date: '2026-07-22', url: 'https://www.energy.senate.gov/hearings/2026/7/oversight-hearing-on-the-federal-energy-regulatory-commission' },
    'ud-swett': { label: 'Swett on GETs', title: 'FERC eyes grid-enhancing technology incentives: Chairman Swett', pub: 'Utility Dive', url: 'https://www.utilitydive.com/news/ferc-grid-enhancing-technology-incentives-atts-senate-hearing/825992/' },
    'appa-enr': { label: 'APPA recap', title: 'Senate Energy & Natural Resources Committee holds FERC oversight hearing', pub: 'American Public Power Association', url: 'https://www.publicpower.org/periodical/article/senate-energy-natural-resources-committee-holds-ferc-oversight-hearing' },
    'ec-aigrid': { label: 'E&C hearing', title: 'AI and the Grid: Meeting Growing Power Demand While Protecting Ratepayers', pub: 'House Energy and Commerce', date: '2026-04-29', url: 'https://energycommerce.house.gov/events/energy-hearing-ai-and-the-grid-meeting-growing-power-demand-while-protecting-ratepayers' },
    'pjm-mills': { label: 'PJM CEO', title: 'PJM Board names David E. Mills as PJM President and CEO', pub: 'PJM Inside Lines', url: 'https://insidelines.pjm.com/pjm-board-names-david-e-mills-as-pjm-president-and-ceo/' },

    'bbg-newsom': { label: 'Bloomberg', title: 'Newsom can’t dodge California’s data-center backlash anymore', pub: 'Bloomberg Opinion', date: '2026-09-05', url: 'https://www.bloomberg.com/opinion/articles/2026-09-05/newsom-can-t-dodge-california-s-data-center-backlash-anymore' },
    'cnbc-rpa': { label: 'CNBC', title: 'Tech companies would have to pay AI data center energy costs under bill moving in Congress', pub: 'CNBC', date: '2026-06-24', url: 'https://www.cnbc.com/2026/06/24/ai-data-centers-tech-companies-congress-energy-costs.html' },
    'nj-vind': { label: 'Jersey Vindicator', title: 'Sherrill signs energy package targeting utilities and data centers, announces electric bill credits', pub: 'Jersey Vindicator', date: '2026-07-07', url: 'https://jerseyvindicator.org/2026/07/07/sherrill-signs-energy-package-targeting-utilities-and-data-centers-announces-electric-bill-credits/' },
    'lp-tariff': { label: 'Legal Planet', title: 'A tariff on data centers could help them pay their fair share', pub: 'Legal Planet', date: '2026-06-29', url: 'https://legal-planet.org/2026/06/29/a-tariff-on-data-centers-could-help-them-pay-their-fair-share/' },
    'lda': { label: 'LDA deadlines', title: 'Lobbying Disclosure Act guidance and filing deadlines', pub: 'Office of the Clerk, U.S. House', url: 'https://lobbyingdisclosure.house.gov/' }
  }
};
