MERGE (c:Company {name: 'Namco', location: 'Japan', eployees: 7000 , yearFundation: 1955})
RETURN c

MERGE (c:Company {name: 'Naughty Dog', location: 'USA', eployees: 400 , yearFundation: 1984})
RETURN c

MERGE (c:Company {name: 'The Game Kitchen', location: 'Spain', eployees: 50 , yearFundation: 2010})
RETURN c

MERGE (c:Company {name: 'Yacht Club Games', location: 'USA', eployees: 15 , yearFundation: 2011})
RETURN c

MERGE (c:Company {name: 'Square Enix', location: 'Japan', eployees: 5377 , yearFundation: 2003})
RETURN c




MERGE (s:Store {name: 'Amazon', mobileApp: true, userCount: 300000000 , url: 'https://www.amazon.com'})
RETURN s

MERGE (s:Store {name: 'PlayStation Plus', mobileApp: true, userCount: 14100000 , url: 'https://www.playstation.com/es-gt/ps-plus/'})
RETURN s

MERGE (s:Store {name: 'Steam', mobileApp: true, userCount: 39200000 , url: 'https://store.steampowered.com'})
RETURN s

MERGE (s:Store {name: 'Microsoft Store', mobileApp: true, userCount: 132000000 , url: 'https://apps.microsoft.com/home?hl=es-es&gl=ES'})
RETURN s

MERGE (s:Store {name: 'Nintendo eShop', mobileApp: false, userCount: 146000000 , url: 'https://www.nintendo.com/es-es/Nintendo-eShop/Nintendo-eShop-1806894.html?srsltid=AfmBOoo_rFZakbNIJko3Xo_9qD61F7lQpoocjeJyfTopKhroYGlHJRCq'})
RETURN s