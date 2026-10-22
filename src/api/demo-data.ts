import type {
  ActivityStats,
  Agency,
  Business,
  Character,
  CharacterRecord,
  Finances,
  Invoice,
  LicenseDoc,
  Me,
  Property,
  ServerInfo,
  UcpNotification,
  Vehicle,
} from './types'

/**
 * Datos de demostración. Solo se usan cuando VITE_API_MODE=demo.
 * La interfaz marca visualmente que son datos de prueba.
 */

export const demoMe: Me = {
  discord: {
    id: '474332573703864330',
    username: 'tigre437',
    globalName: 'Tigre437',
    avatarUrl: null,
  },
  link: {
    linked: true,
    license: 'license2:35f1…4ed',
    fivemUsername: 'Tigre437',
  },
  session: {
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  csrfToken: 'demo',
}

export const demoCharacters: Character[] = [
  {
    citizenid: 'J6ZI2KS2',
    cid: 0,
    firstname: 'Tigre',
    lastname: 'Dev',
    nationality: 'US',
    birthdate: '1995-10-07',
    gender: 0,
    phone: '9491987012',
    job: {
      name: 'police',
      label: 'LSPD',
      type: 'leo',
      gradeName: 'Officer',
      gradeLevel: 1,
      onDuty: true,
      payment: 75,
    },
    gang: null,
    money: { cash: 0, bank: 620754, crypto: 0 },
    licenses: { driver: true, weapon: false, id: true, fishing: false },
    callsign: 'NO CALLSIGN',
    photoUrl: null,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    lastLoggedOut: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    citizenid: 'Z8899N2Y',
    cid: 2,
    firstname: 'Tigre',
    lastname: 'Dev',
    nationality: 'AF',
    birthdate: '1995-10-07',
    gender: 0,
    phone: '7832929284',
    job: {
      name: 'unemployed',
      label: 'Civilian',
      type: null,
      gradeName: 'Freelancer',
      gradeLevel: 0,
      onDuty: false,
      payment: 10,
    },
    gang: null,
    money: { cash: 500, bank: 5000, crypto: 0 },
    licenses: { driver: true, weapon: false, id: true, fishing: false },
    callsign: null,
    photoUrl: null,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    lastLoggedOut: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
]

export const demoProperties: Property[] = [
  {
    kind: 'apartment',
    id: 'morningwood_blvd_b227',
    label: 'Morningwood Blvd 227',
    ownerCitizenid: 'J6ZI2KS2',
    ownerName: 'Tigre Dev',
    rented: null,
    rentPrice: null,
    price: null,
    tier: null,
    detail: 'Apartamento',
  },
]

export const demoVehicles: Vehicle[] = [
  {
    id: 1,
    citizenid: 'J6ZI2KS2',
    ownerName: 'Tigre Dev',
    plate: '00GLY025',
    model: 'sheriff2',
    tag: 'La Bestia',
    garage: 'Hayes Autos',
    state: 'impound',
    fuel: 56,
    engine: 1000,
    body: 1000,
    type: 'vehicle',
    favorite: false,
    jobVehicle: false,
  },
]

export const demoServerInfo: ServerInfo = {
  name: 'Northland community',
  description: 'Servidor de roleplay rural en el norte del condado.',
  discordInvite: null,
  onlinePlayers: 23,
  maxPlayers: 64,
}

export const demoInvoices: Invoice[] = [
  {
    id: 1,
    reference: 'INV-2026-0341',
    status: 'pending',
    category: 'fine',
    issuerName: 'Blaine County Sheriff',
    issuerJob: 'police',
    society: 'police',
    targetCitizenid: 'J6ZI2KS2',
    targetName: 'Tigre Dev',
    subtotal: 1500,
    taxTotal: 0,
    discountTotal: 0,
    total: 1500,
    paidAmount: 0,
    currency: 'USD',
    lines: [{ label: 'Exceso de velocidad en Ruta 68', amount: 1500 }],
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    paidAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    reference: 'INV-2026-0298',
    status: 'paid',
    category: 'service',
    issuerName: 'Speed Tune',
    issuerJob: 'mechanic',
    society: 'mechanic',
    targetCitizenid: 'J6ZI2KS2',
    targetName: 'Tigre Dev',
    subtotal: 800,
    taxTotal: 80,
    discountTotal: 0,
    total: 880,
    paidAmount: 880,
    currency: 'USD',
    lines: [{ label: 'Reparación de motor', amount: 800 }],
    dueAt: null,
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
]

export const demoFinances: Finances = {
  accounts: [
    {
      id: 'US03QBX3781850569',
      amount: 620754,
      isFrozen: false,
      transactions: [
        { type: 'deposit', amount: 2500, date: '2026-10-18' },
        { type: 'withdraw', amount: -800, date: '2026-10-19' },
      ],
    },
  ],
  cards: [
    { id: 1, cardNumber: '•••• 9012', ownerName: 'Tigre Dev', valid: '12/28', cardType: 'visa', active: true },
  ],
  loans: [
    {
      id: 1,
      status: 'active',
      amount: 50000,
      total: 52500,
      paid: 10000,
      instalments: 21,
      paidInstalments: 4,
      missed: 1,
      reason: 'Casa',
      house: 'Mirror Park 1',
      nextPayment: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(),
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    },
  ],
  history: [
    { id: 1, amount: 2500, type: 'deposit', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
    { id: 2, amount: -800, type: 'withdraw', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    { id: 3, amount: 12400, type: 'deposit', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
  ],
}

export const demoRecords: CharacterRecord[] = [
  {
    citizenid: 'J6ZI2KS2',
    profilePic: null,
    dangerous: false,
    wanted: false,
    badges: [{ job: 'sheriff', badge: 'BCSO-104' }],
    penalties: [
      {
        id: 1,
        job: 'police',
        appliedBy: 'Oficial Ejemplo',
        totalFine: 2500,
        payed: false,
        totalMonths: 0,
        charges: [{ label: 'Conducción temeraria', fine: 2500, months: 0 }],
        appliedAt: '2026-10-19',
      },
    ],
    reports: [
      {
        id: 1,
        title: 'Informe de incidente en Ruta 68',
        content: 'El implicado fue interceptado tras una persecución…',
        job: 'police',
        location: 'Paleto Bay',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
    ],
    prison: { inPrison: false, months: null, remainingMonths: null },
  },
  {
    citizenid: 'Z8899N2Y',
    profilePic: null,
    dangerous: false,
    wanted: false,
    badges: [],
    penalties: [],
    reports: [],
    prison: { inPrison: false, months: null, remainingMonths: null },
  },
]

export const demoLicenses: LicenseDoc[] = [
  {
    id: 1,
    citizenid: 'J6ZI2KS2',
    templateId: 'id_Card',
    templateName: 'Identification Card',
    status: 'active',
    issuedBy: 'System',
    generatedId: 'ID-1368339',
    issuedAt: '2026-10-20T21:22:48Z',
    expiresAt: '2027-10-20T23:59:59Z',
    photoUrl: null,
    points: 0,
  },
  {
    id: 2,
    citizenid: 'J6ZI2KS2',
    templateId: 'driver_license',
    templateName: 'Driver License',
    status: 'active',
    issuedBy: 'System',
    generatedId: 'DMV-1369877',
    issuedAt: '2026-10-20T21:22:49Z',
    expiresAt: '2027-10-20T23:59:59Z',
    photoUrl: null,
    points: 0,
  },
]

export const demoBusinesses: Business[] = [
  { kind: 'shop', id: '30', label: 'Ammunation Paleto', role: 'owner', balance: 43250, detail: 'Tigre Dev', isOpen: null },
  { kind: 'shop', id: '31', label: "Ray's Electronics", role: 'employee', balance: null, detail: 'Tigre Dev', isOpen: null },
  { kind: 'restaurant', id: '3', label: 'yellow jack', role: 'owner', balance: 0, detail: null, isOpen: true },
  { kind: 'mechanic', id: '590589', label: 'Speed Tune', role: 'owner', balance: 5125, detail: 'Tigre Dev', isOpen: null },
  { kind: 'motel', id: '1', label: 'Richman Motel', role: 'owner', balance: 12500, detail: null, isOpen: null },
]

export const demoAgencies: Agency[] = [
  {
    id: 1,
    name: 'northland_realty',
    label: 'Northland Realty',
    isBoss: true,
    rankName: 'Realtor',
    salesCount: 7,
    totalCommission: 84000,
    listings: [
      { id: 1, houseName: 'paleto_ranch_2', listPrice: 200000, status: 'active', soldPrice: null, listedAt: '2026-10-20', soldAt: null },
      { id: 2, houseName: 'mirrorpark_1', listPrice: 160000, status: 'sold', soldPrice: 155000, listedAt: '2026-10-01', soldAt: '2026-10-15' },
    ],
  },
]

export const demoStats: ActivityStats = {
  jobs: [
    { kind: 'fisher', citizenid: 'J6ZI2KS2', level: 20, experience: 6156, totalExperience: 6156, totalEarnings: 1200, dailyExperience: 0, dailyEarnings: 0 },
    { kind: 'truckdriver', citizenid: 'J6ZI2KS2', level: 3, experience: 107, totalExperience: 2207, totalEarnings: 2510, dailyExperience: 276, dailyEarnings: 281 },
    { kind: 'miner', citizenid: 'J6ZI2KS2', level: 1, experience: 525, totalExperience: 525, totalEarnings: 400, dailyExperience: 0, dailyEarnings: 0 },
    { kind: 'hunter', citizenid: 'J6ZI2KS2', level: 1, experience: 295, totalExperience: 295, totalEarnings: 840, dailyExperience: 0, dailyEarnings: 0 },
    { kind: 'taxi', citizenid: 'J6ZI2KS2', level: 1, experience: 810, totalExperience: 810, totalEarnings: 466, dailyExperience: 0, dailyEarnings: 0 },
  ],
  gym: { citizenid: 'J6ZI2KS2', strength: 35, stamina: 60, membershipActive: false },
  racing: { name: 'Tigre', tag: 'TGR', elo: 1250, races: 34 },
  workHours: [
    { citizenid: 'J6ZI2KS2', job: 'sheriff', sessions: 6, totalSeconds: 8 * 3600 + 12 * 60 },
    { citizenid: 'J6ZI2KS2', job: 'miner', sessions: 2, totalSeconds: 2 * 3600 + 30 * 60 },
    { citizenid: 'J6ZI2KS2', job: 'hunter', sessions: 1, totalSeconds: 47 * 60 },
  ],
}

export const demoNotifications: UcpNotification[] = [
  {
    kind: 'invoice',
    severity: 'warn',
    title: 'Factura pendiente · INV-2026-0341',
    description: 'Blaine County Sheriff — 1500 USD',
    href: '/facturas',
  },
  {
    kind: 'impound',
    severity: 'alert',
    title: 'Vehículo incautado · 00GLY025',
    description: 'La Bestia (sheriff2)',
    href: '/vehiculos',
  },
  {
    kind: 'loan',
    severity: 'warn',
    title: 'Préstamo con cuotas impagadas',
    description: '1 cuota vencida — 10000/52500 pagado',
    href: '/economia',
  },
]
