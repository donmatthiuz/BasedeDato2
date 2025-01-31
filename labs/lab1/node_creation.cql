// Creación de nodos 'Game'
CREATE (n: Game {gameName:"Pacman", launchYear:1980, ageRating:6, gameGenre: "maze"})
CREATE (n1: Game {gameName:"The Last Of Us", launchYear:2013, ageRating:12, gameGenre: "action"})
CREATE (n2: Game {gameName:"Blasphemous", launchYear:2019, ageRating:18, gameGenre: "fight"})
CREATE (n3: Game {gameName:"Final Fantasy", launchYear:1987, ageRating:18, gameGenre: "rol"})
CREATE (n4: Game {gameName:"Shovel Knignt", launchYear:2014, ageRating:6, gameGenre: "maze"})

// Creación de nodos 'Company'
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

// Creación de nodos 'Store'
MERGE (s:Store {name: 'Amazon', mobileApp: true, userCount: 300000000 , url: 'https://www.amazon.com'})
RETURN s

MERGE (s:Store {name: 'PlayStation Plus', mobileApp: true, userCount: 14100000 , url: 'https://www.playstation.com/es-gt/ps-plus/'})
RETURN s

MERGE (s:Store {name: 'Steam', mobileApp: true, userCount: 39200000 , url: 'https://store.steampowered.com'})
RETURN s

MERGE (s:Store {name: 'Microsoft Store', mobileApp: true, userCount: 132000000 , url: 'https://apps.microsoft.com/home?hl=es-es&gl=ES'})
RETURN s

MERGE (s:Store {name: 'Nintendo eShop', mobileApp: false, userCount: 146000000 , url: 'https://acortar.link/GZyLgd'})
RETURN s

// Creación de nodos 'Platform'
CREATE(n:Platform {name:'Atari2600', year:1977, country:'USA', company:'Atari'});
CREATE(n:Platform {name:'Playstation 3', year:2006, country:'Japan', company:'Sony Computer Entretainment'});
CREATE(n:Platform {name:'Xbox One', year:2013, country:'USA', company:'Microsoft'});
CREATE(n:Platform {name:'Playstation 1', year:1994, country:'Japan', company:'Sony Computer Entretainment'});
CREATE(n:Platform {name:'Nintendo 3DS', year:2011, country:'Japan', company:'Nintendo'});
