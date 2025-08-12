// California Cities Coordinates and Boundaries Data
// Sources: OpenStreetMap, US Census, USGS

export interface CityCoordinate {
  name: string
  lat: number
  lng: number
  population?: number
  county?: string
  // Approximate boundary box [minLat, minLng, maxLat, maxLng]
  bounds?: [number, number, number, number]
}

export const CALIFORNIA_CITIES: Record<string, CityCoordinate> = {
  // Major Cities
  'Los Angeles': { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3898747, county: 'Los Angeles', bounds: [33.7037, -118.6682, 34.3373, -118.1553] },
  'San Diego': { name: 'San Diego', lat: 32.7157, lng: -117.1611, population: 1386932, county: 'San Diego', bounds: [32.5343, -117.2822, 33.1143, -116.9099] },
  'San Jose': { name: 'San Jose', lat: 37.3382, lng: -121.8863, population: 1013240, county: 'Santa Clara', bounds: [37.1248, -122.0456, 37.4688, -121.5893] },
  'San Francisco': { name: 'San Francisco', lat: 37.7749, lng: -122.4194, population: 873965, county: 'San Francisco', bounds: [37.7034, -122.5147, 37.8124, -122.3549] },
  'Fresno': { name: 'Fresno', lat: 36.7378, lng: -119.7871, population: 542107, county: 'Fresno', bounds: [36.6563, -119.8853, 36.8516, -119.6488] },
  'Sacramento': { name: 'Sacramento', lat: 38.5816, lng: -121.4944, population: 513624, county: 'Sacramento', bounds: [38.4375, -121.5593, 38.6856, -121.3616] },
  'Long Beach': { name: 'Long Beach', lat: 33.7701, lng: -118.1937, population: 466742, county: 'Los Angeles', bounds: [33.7320, -118.2484, 33.8853, -118.0632] },
  'Oakland': { name: 'Oakland', lat: 37.8044, lng: -122.2712, population: 433031, county: 'Alameda', bounds: [37.6325, -122.3556, 37.8854, -122.1139] },
  'Bakersfield': { name: 'Bakersfield', lat: 35.3733, lng: -119.0187, population: 384145, county: 'Kern', bounds: [35.2134, -119.2205, 35.4342, -118.8729] },
  'Anaheim': { name: 'Anaheim', lat: 33.8366, lng: -117.9143, population: 346824, county: 'Orange', bounds: [33.7880, -117.9897, 33.8766, -117.7322] },
  
  // Silicon Valley / Bay Area
  'Palo Alto': { name: 'Palo Alto', lat: 37.4419, lng: -122.1430, population: 65364, county: 'Santa Clara', bounds: [37.3859, -122.1878, 37.4689, -122.0749] },
  'Mountain View': { name: 'Mountain View', lat: 37.3861, lng: -122.0839, population: 82376, county: 'Santa Clara', bounds: [37.3565, -122.1134, 37.4695, -122.0323] },
  'Cupertino': { name: 'Cupertino', lat: 37.3230, lng: -122.0322, population: 60381, county: 'Santa Clara', bounds: [37.2922, -122.0863, 37.3370, -121.9959] },
  'Sunnyvale': { name: 'Sunnyvale', lat: 37.3688, lng: -122.0363, population: 155805, county: 'Santa Clara', bounds: [37.3515, -122.0569, 37.4345, -121.9879] },
  'Santa Clara': { name: 'Santa Clara', lat: 37.3541, lng: -121.9552, population: 127647, county: 'Santa Clara', bounds: [37.3243, -121.9829, 37.4044, -121.9297] },
  'Redwood City': { name: 'Redwood City', lat: 37.4852, lng: -122.2364, population: 85925, county: 'San Mateo', bounds: [37.4498, -122.2781, 37.5548, -122.1811] },
  'San Mateo': { name: 'San Mateo', lat: 37.5630, lng: -122.3255, population: 105661, county: 'San Mateo', bounds: [37.5247, -122.3652, 37.5964, -122.2688] },
  'Berkeley': { name: 'Berkeley', lat: 37.8715, lng: -122.2730, population: 124321, county: 'Alameda', bounds: [37.8499, -122.3355, 37.9057, -122.2348] },
  'Fremont': { name: 'Fremont', lat: 37.5483, lng: -121.9886, population: 241110, county: 'Alameda', bounds: [37.4534, -122.0968, 37.6100, -121.8872] },
  'Hayward': { name: 'Hayward', lat: 37.6688, lng: -122.0808, population: 162954, county: 'Alameda', bounds: [37.6022, -122.1418, 37.6989, -122.0090] },
  'San Leandro': { name: 'San Leandro', lat: 37.7249, lng: -122.1561, population: 91008, county: 'Alameda', bounds: [37.6966, -122.1909, 37.7425, -122.1101] },
  'Milpitas': { name: 'Milpitas', lat: 37.4323, lng: -121.9066, population: 84196, county: 'Santa Clara', bounds: [37.4092, -121.9308, 37.4750, -121.8608] },
  'Pleasanton': { name: 'Pleasanton', lat: 37.6624, lng: -121.8747, population: 79871, county: 'Alameda', bounds: [37.6321, -121.9297, 37.7028, -121.8237] },
  'Walnut Creek': { name: 'Walnut Creek', lat: 37.9101, lng: -122.0652, population: 70166, county: 'Contra Costa', bounds: [37.8848, -122.0898, 37.9434, -122.0259] },
  'Concord': { name: 'Concord', lat: 37.9779, lng: -122.0311, population: 129295, county: 'Contra Costa', bounds: [37.9283, -122.0786, 38.0186, -121.9189] },
  'Richmond': { name: 'Richmond', lat: 37.9358, lng: -122.3477, population: 116448, county: 'Contra Costa', bounds: [37.8892, -122.3962, 37.9914, -122.2964] },
  
  // Southern California
  'Irvine': { name: 'Irvine', lat: 33.6846, lng: -117.8265, population: 307670, county: 'Orange', bounds: [33.6297, -117.8715, 33.7477, -117.6911] },
  'Santa Ana': { name: 'Santa Ana', lat: 33.7455, lng: -117.8677, population: 310227, county: 'Orange', bounds: [33.6987, -117.9337, 33.7742, -117.8371] },
  'Riverside': { name: 'Riverside', lat: 33.9533, lng: -117.3962, population: 314998, county: 'Riverside', bounds: [33.8730, -117.5176, 34.0090, -117.2715] },
  'Chula Vista': { name: 'Chula Vista', lat: 32.6401, lng: -117.0842, population: 275487, county: 'San Diego', bounds: [32.5739, -117.1426, 32.6953, -116.9357] },
  'Santa Monica': { name: 'Santa Monica', lat: 34.0195, lng: -118.4912, population: 93076, county: 'Los Angeles', bounds: [33.9962, -118.5263, 34.0373, -118.4422] },
  'Beverly Hills': { name: 'Beverly Hills', lat: 34.0736, lng: -118.4004, population: 32701, county: 'Los Angeles', bounds: [34.0486, -118.4301, 34.0901, -118.3798] },
  'Pasadena': { name: 'Pasadena', lat: 34.1478, lng: -118.1445, population: 138699, county: 'Los Angeles', bounds: [34.1178, -118.1981, 34.2515, -118.0657] },
  'Glendale': { name: 'Glendale', lat: 34.1425, lng: -118.2551, population: 196543, county: 'Los Angeles', bounds: [34.0884, -118.3167, 34.2239, -118.1774] },
  'Burbank': { name: 'Burbank', lat: 34.1808, lng: -118.3090, population: 107337, county: 'Los Angeles', bounds: [34.1421, -118.3752, 34.2233, -118.2806] },
  'Torrance': { name: 'Torrance', lat: 33.8358, lng: -118.3406, population: 147067, county: 'Los Angeles', bounds: [33.7866, -118.3712, 33.8681, -118.2809] },
  'Costa Mesa': { name: 'Costa Mesa', lat: 33.6412, lng: -117.9187, population: 111918, county: 'Orange', bounds: [33.6256, -117.9529, 33.6769, -117.8866] },
  'Newport Beach': { name: 'Newport Beach', lat: 33.6189, lng: -117.9289, population: 85239, county: 'Orange', bounds: [33.5891, -117.9588, 33.6580, -117.8234] },
  'Huntington Beach': { name: 'Huntington Beach', lat: 33.6595, lng: -117.9988, population: 198711, county: 'Orange', bounds: [33.6237, -118.0796, 33.7283, -117.9487] },
  'Garden Grove': { name: 'Garden Grove', lat: 33.7743, lng: -117.9380, population: 171949, county: 'Orange', bounds: [33.7334, -117.9715, 33.7887, -117.8982] },
  'Orange': { name: 'Orange', lat: 33.7878, lng: -117.8531, population: 139911, county: 'Orange', bounds: [33.7617, -117.8844, 33.8286, -117.7943] },
  'Fullerton': { name: 'Fullerton', lat: 33.8703, lng: -117.9253, population: 142824, county: 'Orange', bounds: [33.8401, -117.9873, 33.9126, -117.8873] },
  'Pomona': { name: 'Pomona', lat: 34.0551, lng: -117.7500, population: 151713, county: 'Los Angeles', bounds: [34.0224, -117.8336, 34.0874, -117.6881] },
  'Ontario': { name: 'Ontario', lat: 34.0633, lng: -117.6509, population: 175265, county: 'San Bernardino', bounds: [34.0086, -117.6879, 34.0875, -117.5329] },
  'Corona': { name: 'Corona', lat: 33.8753, lng: -117.5664, population: 157136, county: 'Riverside', bounds: [33.8053, -117.6764, 33.9384, -117.4833] },
  'Murrieta': { name: 'Murrieta', lat: 33.5539, lng: -117.2139, population: 110949, county: 'Riverside', bounds: [33.5024, -117.2558, 33.5793, -117.1420] },
  'Temecula': { name: 'Temecula', lat: 33.4936, lng: -117.1484, population: 110003, county: 'Riverside', bounds: [33.4523, -117.1786, 33.5487, -117.0663] },
  'San Bernardino': { name: 'San Bernardino', lat: 34.1083, lng: -117.2898, population: 222101, county: 'San Bernardino', bounds: [34.0309, -117.3960, 34.1847, -117.2247] },
  'Fontana': { name: 'Fontana', lat: 34.0922, lng: -117.4350, population: 208393, county: 'San Bernardino', bounds: [34.0406, -117.5134, 34.1431, -117.3874] },
  'Rancho Cucamonga': { name: 'Rancho Cucamonga', lat: 34.1064, lng: -117.5931, population: 174305, county: 'San Bernardino', bounds: [34.0692, -117.6548, 34.1547, -117.5075] },
  
  // Central California
  'Modesto': { name: 'Modesto', lat: 37.6391, lng: -120.9969, population: 218464, county: 'Stanislaus', bounds: [37.5963, -121.0397, 37.6819, -120.9290] },
  'Stockton': { name: 'Stockton', lat: 37.9577, lng: -121.2908, population: 320804, county: 'San Joaquin', bounds: [37.8779, -121.3686, 38.0376, -121.2129] },
  'Visalia': { name: 'Visalia', lat: 36.3302, lng: -119.2921, population: 141384, county: 'Tulare', bounds: [36.2883, -119.3712, 36.3721, -119.2130] },
  'Santa Barbara': { name: 'Santa Barbara', lat: 34.4208, lng: -119.6982, population: 91686, county: 'Santa Barbara', bounds: [34.3967, -119.7643, 34.4500, -119.6400] },
  'Santa Maria': { name: 'Santa Maria', lat: 34.9530, lng: -120.4357, population: 109707, county: 'Santa Barbara', bounds: [34.9143, -120.4744, 34.9917, -120.3970] },
  'Ventura': { name: 'Ventura', lat: 34.2746, lng: -119.2290, population: 110763, county: 'Ventura', bounds: [34.2357, -119.3092, 34.3135, -119.1789] },
  'Thousand Oaks': { name: 'Thousand Oaks', lat: 34.1706, lng: -118.8376, population: 126966, county: 'Ventura', bounds: [34.1389, -118.9282, 34.2372, -118.7912] },
  'Simi Valley': { name: 'Simi Valley', lat: 34.2694, lng: -118.7815, population: 126356, county: 'Ventura', bounds: [34.2431, -118.8528, 34.3174, -118.7039] },
  'Oxnard': { name: 'Oxnard', lat: 34.1975, lng: -119.1771, population: 202063, county: 'Ventura', bounds: [34.1425, -119.2391, 34.2392, -119.1344] },
  'Salinas': { name: 'Salinas', lat: 36.6777, lng: -121.6555, population: 163542, county: 'Monterey', bounds: [36.6308, -121.7024, 36.7246, -121.6086] },
  'Santa Cruz': { name: 'Santa Cruz', lat: 36.9741, lng: -122.0308, population: 64608, county: 'Santa Cruz', bounds: [36.9552, -122.0650, 36.9930, -121.9966] },
  'Santa Rosa': { name: 'Santa Rosa', lat: 38.4404, lng: -122.7141, population: 178127, county: 'Sonoma', bounds: [38.3911, -122.7968, 38.4897, -122.6314] },
  'Vallejo': { name: 'Vallejo', lat: 38.1041, lng: -122.2566, population: 126090, county: 'Solano', bounds: [38.0681, -122.3127, 38.1401, -122.2005] },
  'Fairfield': { name: 'Fairfield', lat: 38.2494, lng: -122.0400, population: 119881, county: 'Solano', bounds: [38.2101, -122.1573, 38.2887, -121.9227] },
  'Napa': { name: 'Napa', lat: 38.2975, lng: -122.2869, population: 79246, county: 'Napa', bounds: [38.2712, -122.3377, 38.3238, -122.2361] },
  
  // Northern California
  'Redding': { name: 'Redding', lat: 40.5865, lng: -122.3917, population: 93611, county: 'Shasta', bounds: [40.5302, -122.4636, 40.6428, -122.3198] },
  'Chico': { name: 'Chico', lat: 39.7285, lng: -121.8375, population: 101475, county: 'Butte', bounds: [39.6875, -121.8894, 39.7695, -121.7856] },
  'Eureka': { name: 'Eureka', lat: 40.8021, lng: -124.1637, population: 26512, county: 'Humboldt', bounds: [40.7761, -124.1897, 40.8281, -124.1377] },
  
  // Desert Cities
  'Palm Springs': { name: 'Palm Springs', lat: 33.8303, lng: -116.5453, population: 44552, county: 'Riverside', bounds: [33.7707, -116.5885, 33.8899, -116.5021] },
  'Palm Desert': { name: 'Palm Desert', lat: 33.7222, lng: -116.3745, population: 51163, county: 'Riverside', bounds: [33.6911, -116.4199, 33.7533, -116.3291] },
  'Lancaster': { name: 'Lancaster', lat: 34.6868, lng: -118.1542, population: 173516, county: 'Los Angeles', bounds: [34.6297, -118.2405, 34.7439, -118.0679] },
  'Palmdale': { name: 'Palmdale', lat: 34.5794, lng: -118.1165, population: 169450, county: 'Los Angeles', bounds: [34.5223, -118.2028, 34.6365, -118.0302] },
  'Victorville': { name: 'Victorville', lat: 34.5362, lng: -117.2928, population: 134810, county: 'San Bernardino', bounds: [34.4431, -117.3803, 34.5993, -117.2053] },
  
  // Additional Cities
  'El Cajon': { name: 'El Cajon', lat: 32.7948, lng: -116.9625, population: 106215, county: 'San Diego', bounds: [32.7628, -117.0016, 32.8268, -116.9234] },
  'Carlsbad': { name: 'Carlsbad', lat: 33.1581, lng: -117.3506, population: 114746, county: 'San Diego', bounds: [33.0850, -117.3744, 33.1781, -117.2471] },
  'Oceanside': { name: 'Oceanside', lat: 33.1959, lng: -117.3795, population: 174068, county: 'San Diego', bounds: [33.1559, -117.4347, 33.2793, -117.2470] },
  'Vista': { name: 'Vista', lat: 33.2000, lng: -117.2436, population: 101638, county: 'San Diego', bounds: [33.1675, -117.2912, 33.2325, -117.1960] },
  'Escondido': { name: 'Escondido', lat: 33.1192, lng: -117.0864, population: 151038, county: 'San Diego', bounds: [33.0742, -117.1437, 33.1642, -117.0291] },
  'San Marcos': { name: 'San Marcos', lat: 33.1434, lng: -117.1661, population: 94833, county: 'San Diego', bounds: [33.1184, -117.2247, 33.1684, -117.1075] },
  'Encinitas': { name: 'Encinitas', lat: 33.0370, lng: -117.2920, population: 62007, county: 'San Diego', bounds: [33.0155, -117.3207, 33.0885, -117.2578] },
  'National City': { name: 'National City', lat: 32.6781, lng: -117.0992, population: 56173, county: 'San Diego', bounds: [32.6455, -117.1242, 32.6881, -117.0692] },
  'La Mesa': { name: 'La Mesa', lat: 32.7678, lng: -117.0231, population: 61121, county: 'San Diego', bounds: [32.7428, -117.0481, 32.7928, -116.9981] },
  'Santee': { name: 'Santee', lat: 32.8384, lng: -116.9739, population: 60037, county: 'San Diego', bounds: [32.8134, -117.0119, 32.8634, -116.9359] },
  'Poway': { name: 'Poway', lat: 32.9629, lng: -117.0359, population: 48841, county: 'San Diego', bounds: [32.9379, -117.0809, 32.9879, -116.9909] },
  
  // More Bay Area Cities
  'Daly City': { name: 'Daly City', lat: 37.6879, lng: -122.4702, population: 104901, county: 'San Mateo', bounds: [37.6629, -122.5002, 37.7079, -122.4202] },
  'San Rafael': { name: 'San Rafael', lat: 37.9735, lng: -122.5311, population: 61271, county: 'Marin', bounds: [37.9485, -122.5611, 37.9985, -122.5011] },
  'Novato': { name: 'Novato', lat: 38.1074, lng: -122.5697, population: 53225, county: 'Marin', bounds: [38.0574, -122.6197, 38.1574, -122.5197] },
  'Petaluma': { name: 'Petaluma', lat: 38.2324, lng: -122.6367, population: 59776, county: 'Sonoma', bounds: [38.2074, -122.6667, 38.2574, -122.6067] },
  'San Bruno': { name: 'San Bruno', lat: 37.6305, lng: -122.4111, population: 43908, county: 'San Mateo', bounds: [37.6055, -122.4411, 37.6555, -122.3811] },
  'South San Francisco': { name: 'South San Francisco', lat: 37.6547, lng: -122.4077, population: 66105, county: 'San Mateo', bounds: [37.6297, -122.4377, 37.6797, -122.3777] },
  'Alameda': { name: 'Alameda', lat: 37.7652, lng: -122.2416, population: 78280, county: 'Alameda', bounds: [37.7402, -122.3216, 37.7902, -122.2116] },
  'Union City': { name: 'Union City', lat: 37.5933, lng: -122.0438, population: 70143, county: 'Alameda', bounds: [37.5683, -122.0738, 37.6183, -122.0138] },
  'Castro Valley': { name: 'Castro Valley', lat: 37.6942, lng: -122.0864, population: 66441, county: 'Alameda', bounds: [37.6692, -122.1164, 37.7192, -122.0564] },
  'Newark': { name: 'Newark', lat: 37.5297, lng: -122.0402, population: 47529, county: 'Alameda', bounds: [37.5047, -122.0702, 37.5547, -122.0102] },
  'Livermore': { name: 'Livermore', lat: 37.6819, lng: -121.7681, population: 87955, county: 'Alameda', bounds: [37.6319, -121.8181, 37.7319, -121.7181] },
  'Dublin': { name: 'Dublin', lat: 37.7022, lng: -121.9358, population: 72589, county: 'Alameda', bounds: [37.6772, -121.9658, 37.7272, -121.9058] },
  'San Ramon': { name: 'San Ramon', lat: 37.7799, lng: -121.9780, population: 84605, county: 'Contra Costa', bounds: [37.7299, -122.0280, 37.8299, -121.9280] },
  'Antioch': { name: 'Antioch', lat: 38.0049, lng: -121.8058, population: 115291, county: 'Contra Costa', bounds: [37.9549, -121.8558, 38.0549, -121.7558] },
  'Pittsburg': { name: 'Pittsburg', lat: 38.0280, lng: -121.8847, population: 76416, county: 'Contra Costa', bounds: [38.0030, -121.9147, 38.0530, -121.8547] },
  'Brentwood': { name: 'Brentwood', lat: 37.9319, lng: -121.6958, population: 64292, county: 'Contra Costa', bounds: [37.9069, -121.7258, 37.9569, -121.6658] },
  'Martinez': { name: 'Martinez', lat: 38.0194, lng: -122.1341, population: 37287, county: 'Contra Costa', bounds: [37.9944, -122.1641, 38.0444, -122.1041] },
  'Pleasant Hill': { name: 'Pleasant Hill', lat: 37.9480, lng: -122.0608, population: 34613, county: 'Contra Costa', bounds: [37.9230, -122.0908, 37.9730, -122.0308] },
  'Lafayette': { name: 'Lafayette', lat: 37.8858, lng: -122.1180, population: 25391, county: 'Contra Costa', bounds: [37.8608, -122.1480, 37.9108, -122.0880] },
  'Orinda': { name: 'Orinda', lat: 37.8771, lng: -122.1797, population: 19514, county: 'Contra Costa', bounds: [37.8521, -122.2097, 37.9021, -122.1497] },
  'Moraga': { name: 'Moraga', lat: 37.8350, lng: -122.1297, population: 16896, county: 'Contra Costa', bounds: [37.8100, -122.1597, 37.8600, -122.0997] },
  'Danville': { name: 'Danville', lat: 37.8216, lng: -121.9999, population: 43582, county: 'Contra Costa', bounds: [37.7966, -122.0299, 37.8466, -121.9699] },
  'San Pablo': { name: 'San Pablo', lat: 37.9621, lng: -122.3456, population: 32127, county: 'Contra Costa', bounds: [37.9371, -122.3756, 37.9871, -122.3156] },
  'El Cerrito': { name: 'El Cerrito', lat: 37.9161, lng: -122.3108, population: 25962, county: 'Contra Costa', bounds: [37.8911, -122.3408, 37.9411, -122.2808] },
  'Hercules': { name: 'Hercules', lat: 38.0171, lng: -122.2886, population: 26016, county: 'Contra Costa', bounds: [37.9921, -122.3186, 38.0421, -122.2586] },
  'Pinole': { name: 'Pinole', lat: 38.0044, lng: -122.2989, population: 19022, county: 'Contra Costa', bounds: [37.9794, -122.3289, 38.0294, -122.2689] },
  
  // Central Valley Cities
  'Tracy': { name: 'Tracy', lat: 37.7397, lng: -121.4253, population: 93000, county: 'San Joaquin', bounds: [37.7147, -121.4553, 37.7647, -121.3953] },
  'Manteca': { name: 'Manteca', lat: 37.7974, lng: -121.2161, population: 83498, county: 'San Joaquin', bounds: [37.7724, -121.2461, 37.8224, -121.1861] },
  'Lodi': { name: 'Lodi', lat: 38.1302, lng: -121.2725, population: 66348, county: 'San Joaquin', bounds: [38.1052, -121.3025, 38.1552, -121.2425] },
  'Turlock': { name: 'Turlock', lat: 37.4947, lng: -120.8466, population: 73631, county: 'Stanislaus', bounds: [37.4697, -120.8766, 37.5197, -120.8166] },
  'Merced': { name: 'Merced', lat: 37.3022, lng: -120.4830, population: 86333, county: 'Merced', bounds: [37.2772, -120.5130, 37.3272, -120.4530] },
  'Clovis': { name: 'Clovis', lat: 36.8252, lng: -119.7029, population: 120124, county: 'Fresno', bounds: [36.8002, -119.7329, 36.8502, -119.6729] },
  'Madera': { name: 'Madera', lat: 36.9614, lng: -120.0607, population: 66224, county: 'Madera', bounds: [36.9364, -120.0907, 36.9864, -120.0307] },
  'Hanford': { name: 'Hanford', lat: 36.3275, lng: -119.6457, population: 57232, county: 'Kings', bounds: [36.3025, -119.6757, 36.3525, -119.6157] },
  'Porterville': { name: 'Porterville', lat: 36.0652, lng: -119.0157, population: 62623, county: 'Tulare', bounds: [36.0402, -119.0457, 36.0902, -118.9857] },
  'Tulare': { name: 'Tulare', lat: 36.2077, lng: -119.3473, population: 68875, county: 'Tulare', bounds: [36.1827, -119.3773, 36.2327, -119.3173] },
  'Delano': { name: 'Delano', lat: 35.7688, lng: -119.2471, population: 51428, county: 'Kern', bounds: [35.7438, -119.2771, 35.7938, -119.2171] },
  'Vacaville': { name: 'Vacaville', lat: 38.3566, lng: -121.9877, population: 102386, county: 'Solano', bounds: [38.3316, -122.0177, 38.3816, -121.9577] },
  'Davis': { name: 'Davis', lat: 38.5449, lng: -121.7405, population: 66850, county: 'Yolo', bounds: [38.5199, -121.7705, 38.5699, -121.7105] },
  'Woodland': { name: 'Woodland', lat: 38.6785, lng: -121.7733, population: 61032, county: 'Yolo', bounds: [38.6535, -121.8033, 38.7035, -121.7433] },
  'Roseville': { name: 'Roseville', lat: 38.7521, lng: -121.2880, population: 147773, county: 'Placer', bounds: [38.7271, -121.3180, 38.7771, -121.2580] },
  'Folsom': { name: 'Folsom', lat: 38.6780, lng: -121.1761, population: 80454, county: 'Sacramento', bounds: [38.6530, -121.2061, 38.7030, -121.1461] },
  'Elk Grove': { name: 'Elk Grove', lat: 38.4088, lng: -121.3716, population: 176124, county: 'Sacramento', bounds: [38.3838, -121.4016, 38.4338, -121.3416] },
  'Citrus Heights': { name: 'Citrus Heights', lat: 38.7071, lng: -121.2810, population: 87583, county: 'Sacramento', bounds: [38.6821, -121.3110, 38.7321, -121.2510] },
  'Rocklin': { name: 'Rocklin', lat: 38.7907, lng: -121.2358, population: 71601, county: 'Placer', bounds: [38.7657, -121.2658, 38.8157, -121.2058] },
  'Lincoln': { name: 'Lincoln', lat: 38.8918, lng: -121.2930, population: 49757, county: 'Placer', bounds: [38.8668, -121.3230, 38.9168, -121.2630] },
  'Yuba City': { name: 'Yuba City', lat: 39.1404, lng: -121.6169, population: 70117, county: 'Sutter', bounds: [39.1154, -121.6469, 39.1654, -121.5869] },
  'Marysville': { name: 'Marysville', lat: 39.1457, lng: -121.5914, population: 12598, county: 'Yuba', bounds: [39.1207, -121.6214, 39.1707, -121.5614] },
  
  // More cities to ensure comprehensive coverage
  'West Sacramento': { name: 'West Sacramento', lat: 38.5804, lng: -121.5302, population: 53915, county: 'Yolo', bounds: [38.5554, -121.5602, 38.6054, -121.5002] },
  'Ceres': { name: 'Ceres', lat: 37.5950, lng: -120.9577, population: 49302, county: 'Stanislaus', bounds: [37.5700, -120.9877, 37.6200, -120.9277] },
  'La Habra': { name: 'La Habra', lat: 33.9320, lng: -117.9462, population: 63097, county: 'Orange', bounds: [33.9070, -117.9762, 33.9570, -117.9162] },
  'Monterey Park': { name: 'Monterey Park', lat: 34.0625, lng: -118.1228, population: 61096, county: 'Los Angeles', bounds: [34.0375, -118.1528, 34.0875, -118.0928] },
  'Gardena': { name: 'Gardena', lat: 33.8884, lng: -118.3090, population: 61027, county: 'Los Angeles', bounds: [33.8634, -118.3390, 33.9134, -118.2790] },
  'Paramount': { name: 'Paramount', lat: 33.8895, lng: -118.1598, population: 53733, county: 'Los Angeles', bounds: [33.8645, -118.1898, 33.9145, -118.1298] },
  'Montebello': { name: 'Montebello', lat: 34.0165, lng: -118.1138, population: 62640, county: 'Los Angeles', bounds: [33.9915, -118.1438, 34.0415, -118.0838] },
  'Downey': { name: 'Downey', lat: 33.9401, lng: -118.1332, population: 114355, county: 'Los Angeles', bounds: [33.9151, -118.1632, 33.9651, -118.1032] },
  'Norwalk': { name: 'Norwalk', lat: 33.9022, lng: -118.0817, population: 102773, county: 'Los Angeles', bounds: [33.8772, -118.1117, 33.9272, -118.0517] },
  'West Covina': { name: 'West Covina', lat: 34.0686, lng: -117.9390, population: 109501, county: 'Los Angeles', bounds: [34.0436, -117.9690, 34.0936, -117.9090] },
  'El Monte': { name: 'El Monte', lat: 34.0686, lng: -118.0276, population: 109450, county: 'Los Angeles', bounds: [34.0436, -118.0576, 34.0936, -117.9976] },
  'Whittier': { name: 'Whittier', lat: 33.9792, lng: -118.0328, population: 87438, county: 'Los Angeles', bounds: [33.9542, -118.0628, 34.0042, -118.0028] },
  'Alhambra': { name: 'Alhambra', lat: 34.0953, lng: -118.1270, population: 82868, county: 'Los Angeles', bounds: [34.0703, -118.1570, 34.1203, -118.0970] },
  'San Gabriel': { name: 'San Gabriel', lat: 34.0961, lng: -118.1058, population: 39568, county: 'Los Angeles', bounds: [34.0711, -118.1358, 34.1211, -118.0758] },
  'Arcadia': { name: 'Arcadia', lat: 34.1397, lng: -118.0353, population: 56681, county: 'Los Angeles', bounds: [34.1147, -118.0653, 34.1647, -118.0053] },
  'Monrovia': { name: 'Monrovia', lat: 34.1443, lng: -118.0019, population: 38800, county: 'Los Angeles', bounds: [34.1193, -118.0319, 34.1693, -117.9719] },
  'Azusa': { name: 'Azusa', lat: 34.1336, lng: -117.9076, population: 50000, county: 'Los Angeles', bounds: [34.1086, -117.9376, 34.1586, -117.8776] },
  'Covina': { name: 'Covina', lat: 34.0900, lng: -117.8903, population: 51268, county: 'Los Angeles', bounds: [34.0650, -117.9203, 34.1150, -117.8603] },
  'Baldwin Park': { name: 'Baldwin Park', lat: 34.0853, lng: -117.9609, population: 72176, county: 'Los Angeles', bounds: [34.0603, -117.9909, 34.1103, -117.9309] },
  'La Puente': { name: 'La Puente', lat: 34.0200, lng: -117.9495, population: 38062, county: 'Los Angeles', bounds: [33.9950, -117.9795, 34.0450, -117.9195] },
  'Upland': { name: 'Upland', lat: 34.0975, lng: -117.6484, population: 79040, county: 'San Bernardino', bounds: [34.0725, -117.6784, 34.1225, -117.6184] },
  'Claremont': { name: 'Claremont', lat: 34.0967, lng: -117.7198, population: 37266, county: 'Los Angeles', bounds: [34.0717, -117.7498, 34.1217, -117.6898] },
  'La Verne': { name: 'La Verne', lat: 34.1008, lng: -117.7678, population: 31334, county: 'Los Angeles', bounds: [34.0758, -117.7978, 34.1258, -117.7378] },
  'San Dimas': { name: 'San Dimas', lat: 34.1067, lng: -117.8067, population: 34326, county: 'Los Angeles', bounds: [34.0817, -117.8367, 34.1317, -117.7767] },
  'Diamond Bar': { name: 'Diamond Bar', lat: 34.0286, lng: -117.8103, population: 55072, county: 'Los Angeles', bounds: [34.0036, -117.8403, 34.0536, -117.7803] },
  'Walnut': { name: 'Walnut', lat: 34.0203, lng: -117.8653, population: 28430, county: 'Los Angeles', bounds: [33.9953, -117.8953, 34.0453, -117.8353] },
  'Glendora': { name: 'Glendora', lat: 34.1361, lng: -117.8653, population: 52558, county: 'Los Angeles', bounds: [34.1111, -117.8953, 34.1611, -117.8353] },
  'Chino': { name: 'Chino', lat: 34.0122, lng: -117.6889, population: 91403, county: 'San Bernardino', bounds: [33.9872, -117.7189, 34.0372, -117.6589] },
  'Chino Hills': { name: 'Chino Hills', lat: 33.9898, lng: -117.7326, population: 78411, county: 'San Bernardino', bounds: [33.9648, -117.7626, 34.0148, -117.7026] },
  'Montclair': { name: 'Montclair', lat: 34.0775, lng: -117.6897, population: 37865, county: 'San Bernardino', bounds: [34.0525, -117.7197, 34.1025, -117.6597] },
  'Rialto': { name: 'Rialto', lat: 34.1064, lng: -117.3703, population: 103526, county: 'San Bernardino', bounds: [34.0814, -117.4003, 34.1314, -117.3403] },
  'Colton': { name: 'Colton', lat: 34.0739, lng: -117.3137, population: 54724, county: 'San Bernardino', bounds: [34.0489, -117.3437, 34.0989, -117.2837] },
  'Loma Linda': { name: 'Loma Linda', lat: 34.0483, lng: -117.2611, population: 24791, county: 'San Bernardino', bounds: [34.0233, -117.2911, 34.0733, -117.2311] },
  'Redlands': { name: 'Redlands', lat: 34.0556, lng: -117.1825, population: 73168, county: 'San Bernardino', bounds: [34.0306, -117.2125, 34.0806, -117.1525] },
  'Highland': { name: 'Highland', lat: 34.1283, lng: -117.2086, population: 56999, county: 'San Bernardino', bounds: [34.1033, -117.2386, 34.1533, -117.1786] },
  'Yucaipa': { name: 'Yucaipa', lat: 34.0336, lng: -117.0431, population: 54358, county: 'San Bernardino', bounds: [34.0086, -117.0731, 34.0586, -117.0131] },
  'Hesperia': { name: 'Hesperia', lat: 34.4264, lng: -117.3009, population: 99818, county: 'San Bernardino', bounds: [34.4014, -117.3309, 34.4514, -117.2709] },
  'Apple Valley': { name: 'Apple Valley', lat: 34.5008, lng: -117.1859, population: 75791, county: 'San Bernardino', bounds: [34.4758, -117.2159, 34.5258, -117.1559] },
  'Adelanto': { name: 'Adelanto', lat: 34.5828, lng: -117.4092, population: 38046, county: 'San Bernardino', bounds: [34.5578, -117.4392, 34.6078, -117.3792] },
  'Barstow': { name: 'Barstow', lat: 34.8958, lng: -117.0173, population: 25415, county: 'San Bernardino', bounds: [34.8708, -117.0473, 34.9208, -116.9873] },
  
  // Wine Country
  'St. Helena': { name: 'St. Helena', lat: 38.5052, lng: -122.4697, population: 5438, county: 'Napa', bounds: [38.4802, -122.4997, 38.5302, -122.4397] },
  'Calistoga': { name: 'Calistoga', lat: 38.5788, lng: -122.5797, population: 5228, county: 'Napa', bounds: [38.5538, -122.6097, 38.6038, -122.5497] },
  'Yountville': { name: 'Yountville', lat: 38.4015, lng: -122.3608, population: 2982, county: 'Napa', bounds: [38.3765, -122.3908, 38.4265, -122.3308] },
  'Sonoma': { name: 'Sonoma', lat: 38.2919, lng: -122.4580, population: 10739, county: 'Sonoma', bounds: [38.2669, -122.4880, 38.3169, -122.4280] },
  'Healdsburg': { name: 'Healdsburg', lat: 38.6105, lng: -122.8692, population: 11340, county: 'Sonoma', bounds: [38.5855, -122.8992, 38.6355, -122.8392] },
  'Sebastopol': { name: 'Sebastopol', lat: 38.4021, lng: -122.8239, population: 7379, county: 'Sonoma', bounds: [38.3771, -122.8539, 38.4271, -122.7939] },
  'Windsor': { name: 'Windsor', lat: 38.5471, lng: -122.8164, population: 26344, county: 'Sonoma', bounds: [38.5221, -122.8464, 38.5721, -122.7864] },
  'Rohnert Park': { name: 'Rohnert Park', lat: 38.3396, lng: -122.7011, population: 44390, county: 'Sonoma', bounds: [38.3146, -122.7311, 38.3646, -122.6711] },
  'Cotati': { name: 'Cotati', lat: 38.3274, lng: -122.7094, population: 7265, county: 'Sonoma', bounds: [38.3024, -122.7394, 38.3524, -122.6794] },
  'Cloverdale': { name: 'Cloverdale', lat: 38.8055, lng: -123.0172, population: 8618, county: 'Sonoma', bounds: [38.7805, -123.0472, 38.8305, -122.9872] },
  
  // Coastal Cities
  'Half Moon Bay': { name: 'Half Moon Bay', lat: 37.4636, lng: -122.4286, population: 11795, county: 'San Mateo', bounds: [37.4386, -122.4586, 37.4886, -122.3986] },
  'Pacifica': { name: 'Pacifica', lat: 37.6138, lng: -122.4869, population: 38640, county: 'San Mateo', bounds: [37.5888, -122.5169, 37.6388, -122.4569] },
  'Capitola': { name: 'Capitola', lat: 36.9752, lng: -121.9533, population: 9938, county: 'Santa Cruz', bounds: [36.9502, -121.9833, 37.0002, -121.9233] },
  'Watsonville': { name: 'Watsonville', lat: 36.9102, lng: -121.7569, population: 52590, county: 'Santa Cruz', bounds: [36.8852, -121.7869, 36.9352, -121.7269] },
  'Marina': { name: 'Marina', lat: 36.6844, lng: -121.8022, population: 22359, county: 'Monterey', bounds: [36.6594, -121.8322, 36.7094, -121.7722] },
  'Seaside': { name: 'Seaside', lat: 36.6111, lng: -121.8513, population: 32366, county: 'Monterey', bounds: [36.5861, -121.8813, 36.6361, -121.8213] },
  'Monterey': { name: 'Monterey', lat: 36.6002, lng: -121.8947, population: 30218, county: 'Monterey', bounds: [36.5752, -121.9247, 36.6252, -121.8647] },
  'Carmel-by-the-Sea': { name: 'Carmel-by-the-Sea', lat: 36.5552, lng: -121.9233, population: 3220, county: 'Monterey', bounds: [36.5302, -121.9533, 36.5802, -121.8933] },
  'Pacific Grove': { name: 'Pacific Grove', lat: 36.6177, lng: -121.9166, population: 15090, county: 'Monterey', bounds: [36.5927, -121.9466, 36.6427, -121.8866] },
  'Morro Bay': { name: 'Morro Bay', lat: 35.3658, lng: -120.8499, population: 10757, county: 'San Luis Obispo', bounds: [35.3408, -120.8799, 35.3908, -120.8199] },
  'Pismo Beach': { name: 'Pismo Beach', lat: 35.1428, lng: -120.6413, population: 8072, county: 'San Luis Obispo', bounds: [35.1178, -120.6713, 35.1678, -120.6113] },
  'San Luis Obispo': { name: 'San Luis Obispo', lat: 35.2828, lng: -120.6596, population: 47063, county: 'San Luis Obispo', bounds: [35.2578, -120.6896, 35.3078, -120.6296] },
  'Paso Robles': { name: 'Paso Robles', lat: 35.6264, lng: -120.6910, population: 31490, county: 'San Luis Obispo', bounds: [35.6014, -120.7210, 35.6514, -120.6610] },
  'Atascadero': { name: 'Atascadero', lat: 35.4894, lng: -120.6707, population: 30444, county: 'San Luis Obispo', bounds: [35.4644, -120.7007, 35.5144, -120.6407] },
  'Arroyo Grande': { name: 'Arroyo Grande', lat: 35.1186, lng: -120.5907, population: 18441, county: 'San Luis Obispo', bounds: [35.0936, -120.6207, 35.1436, -120.5607] },
  'Grover Beach': { name: 'Grover Beach', lat: 35.1216, lng: -120.6213, population: 12701, county: 'San Luis Obispo', bounds: [35.0966, -120.6513, 35.1466, -120.5913] },
  'Carpinteria': { name: 'Carpinteria', lat: 34.3989, lng: -119.5185, population: 13264, county: 'Santa Barbara', bounds: [34.3739, -119.5485, 34.4239, -119.4885] },
  'Goleta': { name: 'Goleta', lat: 34.4358, lng: -119.8276, population: 32690, county: 'Santa Barbara', bounds: [34.4108, -119.8576, 34.4608, -119.7976] },
  'Lompoc': { name: 'Lompoc', lat: 34.6392, lng: -120.4579, population: 44444, county: 'Santa Barbara', bounds: [34.6142, -120.4879, 34.6642, -120.4279] },
  'Solvang': { name: 'Solvang', lat: 34.5958, lng: -120.1377, population: 6126, county: 'Santa Barbara', bounds: [34.5708, -120.1677, 34.6208, -120.1077] },
  'Buellton': { name: 'Buellton', lat: 34.6136, lng: -120.1928, population: 5161, county: 'Santa Barbara', bounds: [34.5886, -120.2228, 34.6386, -120.1628] },
  'Guadalupe': { name: 'Guadalupe', lat: 34.9716, lng: -120.5719, population: 7080, county: 'Santa Barbara', bounds: [34.9466, -120.6019, 34.9966, -120.5419] },
  'Camarillo': { name: 'Camarillo', lat: 34.2164, lng: -119.0376, population: 70741, county: 'Ventura', bounds: [34.1914, -119.0676, 34.2414, -119.0076] },
  'Port Hueneme': { name: 'Port Hueneme', lat: 34.1478, lng: -119.1951, population: 21723, county: 'Ventura', bounds: [34.1228, -119.2251, 34.1728, -119.1651] },
  'Fillmore': { name: 'Fillmore', lat: 34.3992, lng: -118.9181, population: 16419, county: 'Ventura', bounds: [34.3742, -118.9481, 34.4242, -118.8881] },
  'Santa Paula': { name: 'Santa Paula', lat: 34.3542, lng: -119.0593, population: 30657, county: 'Ventura', bounds: [34.3292, -119.0893, 34.3792, -119.0293] },
  'Ojai': { name: 'Ojai', lat: 34.4480, lng: -119.2429, population: 7637, county: 'Ventura', bounds: [34.4230, -119.2729, 34.4730, -119.2129] },
  'Moorpark': { name: 'Moorpark', lat: 34.2856, lng: -118.8821, population: 36284, county: 'Ventura', bounds: [34.2606, -118.9121, 34.3106, -118.8521] }
}

// Helper function to get city coordinates
export function getCityCoordinates(cityName: string): [number, number] | null {
  const city = CALIFORNIA_CITIES[cityName]
  if (city) {
    return [city.lat, city.lng]
  }
  return null
}

// Helper function to get city bounds
export function getCityBounds(cityName: string): [[number, number], [number, number]] | null {
  const city = CALIFORNIA_CITIES[cityName]
  if (city && city.bounds) {
    return [
      [city.bounds[0], city.bounds[1]], // southwest
      [city.bounds[2], city.bounds[3]]  // northeast
    ]
  }
  // Generate approximate bounds if not specified
  if (city) {
    const offset = 0.05 // Default offset for cities without specific bounds
    return [
      [city.lat - offset, city.lng - offset],
      [city.lat + offset, city.lng + offset]
    ]
  }
  return null
}

// Helper function to search cities by partial name
export function searchCities(query: string): CityCoordinate[] {
  const searchTerm = query.toLowerCase()
  return Object.values(CALIFORNIA_CITIES).filter(city => 
    city.name.toLowerCase().includes(searchTerm)
  )
}

// Helper function to get all city names
export function getAllCityNames(): string[] {
  return Object.keys(CALIFORNIA_CITIES)
}

// Helper function to get cities by county
export function getCitiesByCounty(county: string): CityCoordinate[] {
  return Object.values(CALIFORNIA_CITIES).filter(city => 
    city.county?.toLowerCase() === county.toLowerCase()
  )
}

// Helper function to get nearby cities
export function getNearbyCities(cityName: string, radiusInMiles: number = 25): CityCoordinate[] {
  const city = CALIFORNIA_CITIES[cityName]
  if (!city) return []
  
  const radiusInDegrees = radiusInMiles / 69 // Approximate conversion
  
  return Object.values(CALIFORNIA_CITIES).filter(c => {
    if (c.name === cityName) return false
    const distance = Math.sqrt(
      Math.pow(c.lat - city.lat, 2) + 
      Math.pow(c.lng - city.lng, 2)
    )
    return distance <= radiusInDegrees
  })
}