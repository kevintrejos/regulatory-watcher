'use strict';
/* Bodies with real regulatory power, beyond utility commissions.

   The first pass equated "regulatory body" with "utility commission",
   which is wrong and leaves most of a client's exposure unwatched. A data
   centre is permitted by a state environmental agency, sited by a siting
   board, its backup generators licensed by an air district and its cooling
   water by a water board. A defence client lives under FAA, export
   controls and CFIUS. None of that is a PUC.

   Each row is [id, name, jurisdiction, type, url, authority, topics]. */

const FEDERAL = [
  ['fcc','Federal Communications Commission','US','commission','https://www.fcc.gov/','Communications Act of 1934',['telecom','spectrum']],
  ['ftc','Federal Trade Commission','US','commission','https://www.ftc.gov/','FTC Act of 1914',['competition','privacy','ai']],
  ['sec','Securities and Exchange Commission','US','commission','https://www.sec.gov/','Securities Exchange Act of 1934',['markets','disclosure']],
  ['cftc','Commodity Futures Trading Commission','US','commission','https://www.cftc.gov/','Commodity Exchange Act',['markets','energy']],
  ['ntia','National Telecommunications and Information Administration','US','agency','https://www.ntia.gov/','NTIA Organization Act',['telecom','spectrum','ai']],
  ['bis','Bureau of Industry and Security','US','agency','https://www.bis.doc.gov/','Export Control Reform Act of 2018',['export-controls','semiconductors','ai']],
  ['cisa','Cybersecurity and Infrastructure Security Agency','US','agency','https://www.cisa.gov/','CISA Act of 2018',['cyber','critical-infrastructure']],
  ['nist','National Institute of Standards and Technology','US','agency','https://www.nist.gov/','NIST Act',['standards','ai','cyber']],
  ['faa','Federal Aviation Administration','US','agency','https://www.faa.gov/','Federal Aviation Act of 1958',['aviation','uas','drones']],
  ['blm','Bureau of Land Management','US','agency','https://www.blm.gov/','Federal Land Policy and Management Act of 1976',['siting','public-lands']],
  ['fws','U.S. Fish and Wildlife Service','US','agency','https://www.fws.gov/','Endangered Species Act',['permitting','environment']],
  ['nmfs','NOAA Fisheries','US','agency','https://www.fisheries.noaa.gov/','Magnuson-Stevens Act; ESA',['permitting','offshore']],
  ['usbr','Bureau of Reclamation','US','agency','https://www.usbr.gov/','Reclamation Act of 1902',['water','hydropower']],
  ['usace','U.S. Army Corps of Engineers','US','agency','https://www.usace.army.mil/','Clean Water Act section 404; Rivers and Harbors Act',['permitting','water','siting']],
  ['arpae','ARPA-E','US','agency','https://arpa-e.energy.gov/','America COMPETES Act of 2007',['energy','rd']],
  ['gsa','General Services Administration','US','agency','https://www.gsa.gov/','Federal Property and Administrative Services Act of 1949',['procurement']],
  ['oira','OIRA, Office of Management and Budget','US','agency','https://www.reginfo.gov/public/','Executive Order 12866',['rulemaking','review']],
  ['diu','Defense Innovation Unit','US','agency','https://www.diu.mil/','DoD directive',['defense','procurement']],
  ['phmsa','Pipeline and Hazardous Materials Safety Administration','US','agency','https://www.phmsa.dot.gov/','Pipeline Safety Act',['pipelines','safety']],
  ['stb','Surface Transportation Board','US','board','https://www.stb.gov/','ICC Termination Act of 1995',['rail','coal']],
  ['usitc','U.S. International Trade Commission','US','commission','https://www.usitc.gov/','Tariff Act of 1930',['trade','tariffs']],
  ['treasury','U.S. Department of the Treasury, CFIUS','US','agency','https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius','Defense Production Act section 721',['foreign-investment','national-security']],
  ['farcouncil','FAR Council','US','council','https://www.acquisition.gov/','Office of Federal Procurement Policy Act',['procurement','cui']],
  ['regulations','Regulations.gov, the federal docket system','US','agency','https://www.regulations.gov/','E-Government Act of 2002',['rulemaking']]
];

/* NERC delegates enforcement to six regional entities. Each sets and
   enforces reliability standards in its footprint, which is real authority
   that no bill tracker carries. */
const NERC_REGIONAL = [
  ['re-mro','Midwest Reliability Organization','US','ero','https://www.mro.net/','Delegated authority under FPA section 215',['reliability']],
  ['re-npcc','Northeast Power Coordinating Council','US','ero','https://www.npcc.org/','Delegated authority under FPA section 215',['reliability']],
  ['re-rf','ReliabilityFirst','US','ero','https://www.rfirst.org/','Delegated authority under FPA section 215',['reliability']],
  ['re-serc','SERC Reliability Corporation','US','ero','https://www.serc1.org/','Delegated authority under FPA section 215',['reliability']],
  ['re-texasre','Texas Reliability Entity','TX','ero','https://www.texasre.org/','Delegated authority under FPA section 215',['reliability']],
  ['re-wecc','Western Electricity Coordinating Council','US','ero','https://www.wecc.org/','Delegated authority under FPA section 215',['reliability']]
];

const STATE_ENV = [
  ['AL','Alabama Department of Environmental Management','https://adem.alabama.gov/'],
  ['AK','Alaska Department of Environmental Conservation','https://dec.alaska.gov/'],
  ['AZ','Arizona Department of Environmental Quality','https://www.azdeq.gov/'],
  ['AR','Arkansas Division of Environmental Quality','https://www.adeq.state.ar.us/'],
  ['CA','California Environmental Protection Agency','https://calepa.ca.gov/'],
  ['CO','Colorado Department of Public Health and Environment','https://cdphe.colorado.gov/'],
  ['CT','Connecticut Department of Energy and Environmental Protection','https://portal.ct.gov/deep'],
  ['DE','Delaware DNREC','https://dnrec.delaware.gov/'],
  ['DC','DC Department of Energy and Environment','https://doee.dc.gov/'],
  ['FL','Florida Department of Environmental Protection','https://floridadep.gov/'],
  ['GA','Georgia Environmental Protection Division','https://epd.georgia.gov/'],
  ['HI','Hawaii Department of Health, Environmental Management','https://health.hawaii.gov/epo/'],
  ['ID','Idaho Department of Environmental Quality','https://www.deq.idaho.gov/'],
  ['IL','Illinois Environmental Protection Agency','https://epa.illinois.gov/'],
  ['IN','Indiana Department of Environmental Management','https://www.in.gov/idem/'],
  ['IA','Iowa Department of Natural Resources','https://www.iowadnr.gov/'],
  ['KS','Kansas Department of Health and Environment','https://www.kdhe.ks.gov/'],
  ['KY','Kentucky Energy and Environment Cabinet','https://eec.ky.gov/'],
  ['LA','Louisiana Department of Environmental Quality','https://deq.louisiana.gov/'],
  ['ME','Maine Department of Environmental Protection','https://www.maine.gov/dep/'],
  ['MD','Maryland Department of the Environment','https://mde.maryland.gov/'],
  ['MA','Massachusetts Department of Environmental Protection','https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection'],
  ['MI','Michigan EGLE','https://www.michigan.gov/egle'],
  ['MN','Minnesota Pollution Control Agency','https://www.pca.state.mn.us/'],
  ['MS','Mississippi Department of Environmental Quality','https://www.mdeq.ms.gov/'],
  ['MO','Missouri Department of Natural Resources','https://dnr.mo.gov/'],
  ['MT','Montana Department of Environmental Quality','https://deq.mt.gov/'],
  ['NE','Nebraska Department of Environment and Energy','https://dee.nebraska.gov/'],
  ['NV','Nevada Division of Environmental Protection','https://ndep.nv.gov/'],
  ['NH','New Hampshire Department of Environmental Services','https://www.des.nh.gov/'],
  ['NJ','New Jersey Department of Environmental Protection','https://dep.nj.gov/'],
  ['NM','New Mexico Environment Department','https://www.env.nm.gov/'],
  ['NY','New York Department of Environmental Conservation','https://dec.ny.gov/'],
  ['NC','North Carolina Department of Environmental Quality','https://www.deq.nc.gov/'],
  ['ND','North Dakota Department of Environmental Quality','https://deq.nd.gov/'],
  ['OH','Ohio Environmental Protection Agency','https://epa.ohio.gov/'],
  ['OK','Oklahoma Department of Environmental Quality','https://www.deq.ok.gov/'],
  ['OR','Oregon Department of Environmental Quality','https://www.oregon.gov/deq/'],
  ['PA','Pennsylvania Department of Environmental Protection','https://www.dep.pa.gov/'],
  ['RI','Rhode Island Department of Environmental Management','https://dem.ri.gov/'],
  ['SC','South Carolina Department of Environmental Services','https://des.sc.gov/'],
  ['SD','South Dakota DANR','https://danr.sd.gov/'],
  ['TN','Tennessee Department of Environment and Conservation','https://www.tn.gov/environment.html'],
  ['TX','Texas Commission on Environmental Quality','https://www.tceq.texas.gov/'],
  ['UT','Utah Department of Environmental Quality','https://deq.utah.gov/'],
  ['VT','Vermont Department of Environmental Conservation','https://dec.vermont.gov/'],
  ['VA','Virginia Department of Environmental Quality','https://www.deq.virginia.gov/'],
  ['WA','Washington Department of Ecology','https://ecology.wa.gov/'],
  ['WV','West Virginia Department of Environmental Protection','https://dep.wv.gov/'],
  ['WI','Wisconsin Department of Natural Resources','https://dnr.wisconsin.gov/'],
  ['WY','Wyoming Department of Environmental Quality','https://deq.wyoming.gov/']
];

/* Where a large generator or a data centre actually gets sited. In many
   states this is a separate board from the PUC, and it is the body that
   says yes or no. */
const SITING = [
  ['siting-oh','Ohio Power Siting Board','OH','board','https://opsb.ohio.gov/','ORC 4906',['siting']],
  ['siting-wa','Washington EFSEC','WA','council','https://www.efsec.wa.gov/','RCW 80.50',['siting']],
  ['siting-ct','Connecticut Siting Council','CT','council','https://portal.ct.gov/csc','CGS 16-50g',['siting']],
  ['siting-ny','New York ORES','NY','office','https://ores.ny.gov/','Accelerated Renewable Energy Growth Act',['siting']],
  ['siting-ma','Massachusetts Energy Facilities Siting Board','MA','board','https://www.mass.gov/orgs/energy-facilities-siting-board','MGL c.164 s.69H',['siting']],
  ['siting-nh','New Hampshire Site Evaluation Committee','NH','committee','https://www.nhsec.nh.gov/','RSA 162-H',['siting']],
  ['cec-ca','California Energy Commission','CA','commission','https://www.energy.ca.gov/','Warren-Alquist Act',['siting','energy','efficiency']],
  ['carb-ca','California Air Resources Board','CA','board','https://ww2.arb.ca.gov/','Health and Safety Code division 26',['air','climate']]
];

/* Backup generation at a data centre is an air permit, and in California
   that is a district decision, not a state one. */
const AIR_WATER = [
  ['aqmd-south-coast','South Coast Air Quality Management District','CA','district','https://www.aqmd.gov/','California Health and Safety Code',['air','permitting']],
  ['aqmd-bay-area','Bay Area Air Quality Management District','CA','district','https://www.baaqmd.gov/','California Health and Safety Code',['air','permitting']],
  ['aqmd-san-joaquin','San Joaquin Valley Air Pollution Control District','CA','district','https://ww2.valleyair.org/','California Health and Safety Code',['air','permitting']],
  ['aqmd-sacramento','Sacramento Metropolitan Air Quality Management District','CA','district','https://www.airquality.org/','California Health and Safety Code',['air','permitting']],
  ['swrcb-ca','California State Water Resources Control Board','CA','board','https://www.waterboards.ca.gov/','Porter-Cologne Water Quality Control Act',['water','permitting']],
  ['twdb-tx','Texas Water Development Board','TX','board','https://www.twdb.texas.gov/','Texas Water Code',['water']],
  ['adwr-az','Arizona Department of Water Resources','AZ','agency','https://www.azwater.gov/','Arizona Groundwater Management Act of 1980',['water']],
  ['srbc','Susquehanna River Basin Commission','US','compact','https://www.srbc.gov/','Susquehanna River Basin Compact',['water','permitting']],
  ['drbc','Delaware River Basin Commission','US','compact','https://www.nj.gov/drbc/','Delaware River Basin Compact',['water','permitting']],
  ['glc','Great Lakes Commission','US','compact','https://www.glc.org/','Great Lakes Basin Compact',['water']]
];

module.exports = { FEDERAL, NERC_REGIONAL, STATE_ENV, SITING, AIR_WATER };
