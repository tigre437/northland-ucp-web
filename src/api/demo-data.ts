import type { Character, Me, Property, ServerInfo, Vehicle } from './types'

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
  onlinePlayers: null,
  maxPlayers: null,
}
