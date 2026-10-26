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

/** Traduce el nombre crudo de una mod a una etiqueta en español. */
export function modLabel(name: string): string {
  return MOD_KEY_LABELS[name] ?? MOD_TYPE_LABELS[name] ?? humanize(name)
}
