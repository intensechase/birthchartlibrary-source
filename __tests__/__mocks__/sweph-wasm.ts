export async function loadSweph() {
  return {
    swe_calc_ut: jest.fn().mockReturnValue({ rc: 0, xx: [0, 0, 0, 0, 0, 0] }),
    swe_houses: jest.fn().mockReturnValue({ rc: 0, cusps: new Array(13).fill(0), ascmc: new Array(10).fill(0) }),
    swe_julday: jest.fn().mockReturnValue(2451545.0),
    swe_set_ephe_path: jest.fn(),
    swe_close: jest.fn(),
  }
}
