const typeorm = require('typeorm');

class Wallpaper {
  constructor(id, name, img) {
    this.id = id;
    this.name = name;
    this.img = img;
  }
}

const EntitySchema = require('typeorm').EntitySchema;

const WallpaperSchema = new EntitySchema({
  name: 'Wallpaper',
  target: Wallpaper,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      default: null,
    },
    img: {
      type: 'text',
    },
  },
});

async function getConnection() {
  return await typeorm.createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'wallpaper',
    synchronize: true,
    logging: false,
    entities: [WallpaperSchema],
  });
}

async function getAllWallpapers() {
  const connection = await getConnection();
  const wallpaperRepo = connection.getRepository(Wallpaper);
  const wallpaper = await wallpaperRepo.find();
  connection.close();
  return wallpaper;
}

async function insertWallpaper(name, img) {
  const connection = await getConnection();

  const wallpaper = new Wallpaper();
  wallpaper.name = name;
  wallpaper.img = img;

  const wallpaperRepo = connection.getRepository(Wallpaper);
  const res = await wallpaperRepo.save(wallpaper);
  console.log('saved', res);

  const allWallpapers = await wallpaperRepo.find();
  connection.close();
  return allWallpapers;
}

async function deleteWallpapers(id) {
  const connection = await getConnection();
  const wallpaperRepo = connection.getRepository(Wallpaper);
  const wallpaper = await wallpaperRepo.delete(id);
  connection.close();
  return wallpaper;
}

module.exports = {
  getAllWallpapers,
  insertWallpaper,
  deleteWallpapers,
};
