// Real measurements from SKY130 CIM chip design
// Source: ~/workspace/sky130-cim/

export const CHIP = {
  name: "SKY130 SRAM-CIM Inference Tile",
  technology: "SkyWater SKY130 130nm CMOS",
  supply_v: 1.8,
  array_rows: 64,
  array_cols: 64,
  weight_bits: 1,
  input_bits: 4,
  output_bits: 6,
} as const;

export const BITCELL = {
  i_read_ua: 28.36,
  i_leak_na: 0.002,
  on_off_ratio: 14_855_624,
  snm_mv: 557,
  t_read_ns: 0.5,
  c_bl_cell_ff: 0.146,
  cell_area_um2: 1.383,
  energy_per_mac_pj: 1.93,
  data_retention_v: 0.6,
  // Transistor sizes
  Wp: 0.55,  // PMOS load width (µm)
  Lp: 0.15,  // PMOS load length (µm)
  Wn: 0.84,  // NMOS driver width (µm)
  Ln: 0.15,  // NMOS driver length (µm)
  Wax: 0.42, // Access transistor width (µm)
  Wrd: 0.42, // Read port width (µm)
  Lrd: 1.0,  // Read port length (µm)
  // PVT worst case
  pvt_worst_i_read_ua: 9.65,
  pvt_worst_i_leak_na: 0.31,
} as const;

export const PWM = {
  linearity_pct: 0.026,
  rise_time_ns: 0.148,
  fall_time_ns: 0.097,
  power_uw: 1.321,
  t_lsb_ns: 4.998,
  max_pulse_ns: 74.98,
  min_pulse_ns: 4.98,
  transistor_count: 6,
  total_area_um2: 3.45,
} as const;

export const ADC = {
  dnl_lsb: 0.000178,
  inl_lsb: 0.000178,
  enob: 6.0,
  conversion_time_ns: 108,
  power_uw: 5.136,
  cu_ff: 10.7,
  total_dac_cap_ff: 685,
  lsb_mv: 28.1,
  bits: 6,
} as const;

export const ARRAY = {
  compute_cycle_ns: 500,
  power_mw: 10,
  mvm_accuracy_pct: 90,
  mnist_accuracy_pct: 85,
  total_cells: 64 * 64,
  max_column_current_ma: 1.82,
} as const;

// Color palette
export const COLORS = {
  cyan: "#00f0ff",
  amber: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  purple: "#a855f7",
  bgPrimary: "#0a0f1e",
  bgSecondary: "#0d1526",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
} as const;
