export const getLineAttributes = (category: string, number: string): { bg: string; text: string } => {
  const cat = category ? category.toUpperCase() : '';
  const num = number ? number.replace(/\s/g, '') : '';

  // Zurich Tram Colors (VBZ)
  const tramColors: Record<string, string> = {
    '2': '#dc002e', // Red
    '3': '#006d3d', // Green
    '4': '#4a2374', // Purple
    '5': '#7a5131', // Brown
    '6': '#d27c23', // Orange
    '7': '#111111', // Black
    '8': '#82b727', // Light Green
    '9': '#4a2374', // Purple
    '10': '#d01479', // Pink
    '11': '#006d3d', // Green
    '12': '#009fe3', // Light Blue
    '13': '#f7d300', // Yellow
    '14': '#009fe3', // Light Blue
    '15': '#dc002e', // Red
    '17': '#a32338', // Maroon
    '20': '#dc002e', // Limmattalbahn Red
  };

  if (cat === 'T' || cat === 'TRAM') {
    if (tramColors[num]) {
      return { 
        bg: tramColors[num], 
        text: num === '13' ? '#000000' : '#ffffff' 
      };
    }
    return { bg: '#0078bf', text: '#ffffff' }; // Generic Tram Blue
  }

  // Buses
  if (cat === 'B' || cat === 'BUS' || cat === 'N') {
    // VBZ Trolleybuses and city buses are typically blue/white
    // PostBus is Yellow, but difficult to distinguish purely by category 'B' without operator.
    // We'll treat standard city lines (often 2 digits) as potentially VBZ Blue, others Gray.
    if (['31', '32', '33', '34', '46', '66', '67', '69', '72', '80', '83'].includes(num)) {
        return { bg: '#0078bf', text: '#ffffff' };
    }
    return { bg: '#64748b', text: '#ffffff' }; // Slate-500 Generic Bus
  }

  // S-Bahn
  if (cat === 'S' || cat === 'SN') {
    // ZVV S-Bahn lines have specific colors (Rainbow). 
    // Simplified mapping for major lines or a distinctive S-Bahn look.
    // We will use a bold Indigo as a default for S-Bahn to be distinct from Tram Blue.
    return { bg: '#4338ca', text: '#ffffff' }; 
  }
  
  // National/International Trains
  if (['IC', 'IR', 'EC', 'ICE', 'RE', 'RJX', 'TGV'].includes(cat)) {
    return { bg: '#dc002e', text: '#ffffff' }; // SBB Red
  }

  // Ships
  if (cat === 'BAT' || cat === 'SHIP') {
      return { bg: '#0ea5e9', text: '#ffffff' };
  }

  // Default
  return { bg: '#334155', text: '#ffffff' };
};
