/**
 * Waste-to-Energy Calculation Functions
 * Based on proven biogas conversion rates
 */

export interface CalculationResult {
  biogasLiters: number
  electricityKwh: number
  costSavingsInr: number
  co2ReductionKg: number
  fertilizerKg: number
  monthlyProjection: {
    biogas: number
    electricity: number
    savings: number
    co2: number
  }
}

/**
 * Calculate biogas production from kitchen and garden waste
 * @param kitchenKg - Kitchen waste in kg/day
 * @param gardenKg - Garden waste in kg/day
 * @returns Biogas in liters/day
 */
export function calculateBiogas(kitchenKg: number, gardenKg: number): number {
  const kitchenBiogas = kitchenKg * 0.4 // 1kg kitchen waste = 0.4L biogas
  const gardenBiogas = gardenKg * 0.3 // 1kg garden waste = 0.3L biogas
  return kitchenBiogas + gardenBiogas
}

/**
 * Calculate electricity from biogas
 * @param biogasLiters - Biogas in liters
 * @returns Electricity in kWh/month
 */
export function calculateElectricity(biogasLiters: number): number {
  const dailyElectricity = (biogasLiters / 1000) * 2 // 1m³ biogas = 2kWh
  return dailyElectricity * 30 // Monthly projection
}

/**
 * Calculate cost savings in Indian Rupees
 * @param electricityKwh - Electricity in kWh
 * @returns Cost savings in INR
 */
export function calculateCostSavings(electricityKwh: number): number {
  return electricityKwh * 8 // 1kWh = ₹8 savings (approximate)
}

/**
 * Calculate CO2 reduction
 * @param organicKg - Total organic waste in kg/day
 * @returns CO2 reduction in kg/year
 */
export function calculateCO2Reduction(organicKg: number): number {
  const dailyCO2 = organicKg * 0.3 // 1kg organic waste saves 0.3kg CO2
  return dailyCO2 * 365
}

/**
 * Calculate fertilizer output
 * @param organicKg - Total organic waste in kg/day
 * @returns Fertilizer in kg/month
 */
export function calculateFertilizer(organicKg: number): number {
  const dailyFertilizer = organicKg * 0.15 // 1kg organic waste = 0.15kg fertilizer
  return dailyFertilizer * 30
}

/**
 * Main calculation function
 */
export function performCalculations(
  kitchenKg: number,
  plasticKg: number,
  paperKg: number,
  gardenKg: number,
): CalculationResult {
  const organicKg = kitchenKg + gardenKg
  const biogasLiters = calculateBiogas(kitchenKg, gardenKg)
  const electricityKwh = calculateElectricity(biogasLiters)
  const costSavingsInr = calculateCostSavings(electricityKwh)
  const co2ReductionKg = calculateCO2Reduction(organicKg)
  const fertilizerKg = calculateFertilizer(organicKg)

  return {
    biogasLiters: Math.round(biogasLiters * 10) / 10,
    electricityKwh: Math.round(electricityKwh * 10) / 10,
    costSavingsInr: Math.round(costSavingsInr),
    co2ReductionKg: Math.round(co2ReductionKg * 10) / 10,
    fertilizerKg: Math.round(fertilizerKg * 10) / 10,
    monthlyProjection: {
      biogas: Math.round(biogasLiters * 30 * 10) / 10,
      electricity: electricityKwh,
      savings: Math.round(costSavingsInr),
      co2: Math.round((co2ReductionKg / 365) * 30 * 10) / 10,
    },
  }
}
