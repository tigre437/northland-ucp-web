/**
 * Nombres de modificaciones de vehículo de GTA/qs-mechaniccreator
 * traducidos a español. Las claves llegan en crudo desde
 * modificationsList: o bien camelCase ('windowTint') o bien el id
 * numérico del modType de GTA ('48', '11'…).
 */

// Claves por nombre (tal cual llegan en modificationsList / props)
const MOD_KEY_LABELS: Record<string, string> = {
  windowTint: 'Tinte de ventanas',
  neonLights: 'Luces de neón',
  neonColor: 'Color de neón',
  xenonColor: 'Color de xenón',
  tyreSmokeColor: 'Color del humo de ruedas',
  interiorColor: 'Color del interior',
  dashboardColor: 'Color del salpicadero',
  pearlescentColor: 'Color nacarado',
  primaryColorMaterial: 'Acabado de pintura principal',
  secondaryColorMaterial: 'Acabado de pintura secundaria',
  wheelColor: 'Color de llantas',
  wheelSize: 'Tamaño de rueda',
  wheelWidth: 'Anchura de rueda',
  wheels: 'Tipo de ruedas',
  driftTyres: 'Neumáticos de drift',
  bulletProofTyres: 'Neumáticos antibalas',
  modSmokeEnabled: 'Humo de ruedas',
  neonEnabled: 'Neón',
  modXenon: 'Faros de xenón',
  plateIndex: 'Estilo de matrícula',
  livery: 'Vinilo',
  color1: 'Color principal',
  color2: 'Color secundario',
  primaryColor: 'Pintura principal',
  secondaryColor: 'Pintura secundaria',
  primaryColour: 'Pintura principal',
  secondaryColour: 'Pintura secundaria',
  respray: 'Pintura completa',
  resprayPrimary: 'Pintura principal',
  respraySecondary: 'Pintura secundaria',
  resprayPearlescent: 'Color nacarado',
  resprayWheels: 'Pintura de llantas',
  resprayPrimaryColor: 'Pintura principal',
  respraySecondaryColor: 'Pintura secundaria',
  resprayPearlescentColor: 'Color nacarado',
  resprayWheelColor: 'Pintura de llantas',
  resprayPrimaryMaterial: 'Acabado de pintura principal',
  respraySecondaryMaterial: 'Acabado de pintura secundaria',
  neon: 'Neón',
  neonFront: 'Neón delantero',
  neonBack: 'Neón trasero',
  neonLeft: 'Neón izquierdo',
  neonRight: 'Neón derecho',
  tyreSmoke: 'Humo de neumáticos',
  tireSmoke: 'Humo de neumáticos',
  smokeEnabled: 'Humo de ruedas',
  xenon: 'Faros de xenón',
  turbo: 'Turbo',
  engine: 'Motor',
  brakes: 'Frenos',
  transmission: 'Transmisión',
  suspension: 'Suspensión',
  armor: 'Blindaje',
  spoilers: 'Alerón',
  frontBumper: 'Paragolpes delantero',
  rearBumper: 'Paragolpes trasero',
  sideSkirt: 'Faldones laterales',
  exhaust: 'Escape',
  frame: 'Chasis / jaula',
  grille: 'Parrilla',
  hood: 'Capó',
  fender: 'Aleta izquierda',
  rightFender: 'Aleta derecha',
  roof: 'Techo',
  horn: 'Claxon',
  frontWheels: 'Ruedas delanteras',
  backWheels: 'Ruedas traseras',
  plateHolder: 'Porta-matrícula',
  vanityPlate: 'Matrícula decorativa',
  trim: 'Molduras',
  trimA: 'Molduras',
  trimB: 'Molduras B',
  ornaments: 'Ornamentos',
  dashboard: 'Salpicadero',
  dial: 'Cuadrante',
  doorSpeaker: 'Altavoces de puerta',
  seats: 'Asientos',
  steeringWheel: 'Volante',
  shifterLeavers: 'Palanca de cambios',
  plaques: 'Placas',
  speakers: 'Altavoces',
  trunk: 'Maletero',
  hydrolics: 'Suspensión hidráulica',
  hydraulics: 'Suspensión hidráulica',
  engineBlock: 'Bloque de motor',
  airFilter: 'Filtro de aire',
  struts: 'Amortiguadores',
  archCover: 'Cubrearcos',
  aerials: 'Antenas',
  tank: 'Depósito',
  lightbar: 'Barra de luces',
  lightBar: 'Barra de luces',
  customTires: 'Neumáticos personalizados',
  customTyres: 'Neumáticos personalizados',
  modCustomTiresF: 'Neumáticos delanteros personalizados',
  modCustomTiresR: 'Neumáticos traseros personalizados',
  repair: 'Reparación',
  repairs: 'Reparación',
  performance: 'Rendimiento',
  cosmetics: 'Estética',
  service: 'Servicio',
  inspection: 'Inspección',
  extras: 'Extras',
  doors: 'Puertas',
  windows: 'Ventanas',
  tyres: 'Neumáticos',
}

// Ids numéricos de modType de GTA V
const MOD_TYPE_LABELS: Record<string, string> = {
  '0': 'Alerón',
  '1': 'Paragolpes delantero',
  '2': 'Paragolpes trasero',
  '3': 'Faldones laterales',
  '4': 'Escape',
  '5': 'Chasis / jaula',
  '6': 'Parrilla',
  '7': 'Capó',
  '8': 'Aleta izquierda',
  '9': 'Aleta derecha',
  '10': 'Techo',
  '11': 'Motor',
  '12': 'Frenos',
  '13': 'Transmisión',
  '14': 'Claxon',
  '15': 'Suspensión',
  '16': 'Blindaje',
  '18': 'Turbo',
  '20': 'Humo de neumáticos',
  '22': 'Faros de xenón',
  '23': 'Ruedas delanteras',
  '24': 'Ruedas traseras',
  '25': 'Porta-matrícula',
  '26': 'Matrícula decorativa',
  '27': 'Molduras',
  '28': 'Ornamentos',
  '29': 'Salpicadero',
  '30': 'Cuadrante',
  '31': 'Altavoces de puerta',
  '32': 'Asientos',
  '33': 'Volante',
  '34': 'Palanca de cambios',
  '35': 'Placas',
  '36': 'Altavoces',
  '37': 'Maletero',
  '38': 'Suspensión hidráulica',
  '39': 'Bloque de motor',
  '40': 'Filtro de aire',
  '41': 'Amortiguadores',
  '42': 'Cubrearcos',
  '43': 'Antenas',
  '44': 'Molduras B',
  '45': 'Techo',
  '46': 'Depósito',
  '47': 'Ventanas',
  '48': 'Vinilo',
}

function humanize(key: string): string {
  const spaced = key
    .replace(/^mod/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim()
  if (!spaced) return key
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

// Índice normalizado: "Primary Color" / "primaryColor" / "primary_color"
// resuelven a la misma etiqueta.
const NORMALIZED: Record<string, string> = {}
for (const [k, v] of [
  ...Object.entries(MOD_KEY_LABELS),
  ...Object.entries(MOD_TYPE_LABELS),
]) {
  NORMALIZED[k.toLowerCase().replace(/[\s_]/g, '')] = v
}

/** Traduce el nombre crudo de una mod a una etiqueta en español. */
export function modLabel(name: string): string {
  const key = name.toLowerCase().replace(/[\s_]/g, '')
  return NORMALIZED[key] ?? humanize(name)
}
