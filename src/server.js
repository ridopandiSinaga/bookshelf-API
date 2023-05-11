// Memuat library Hapi dan file routes
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Membuat fungsi async "init" untuk memulai server
const init = async () => {
  // Membuat instance server menggunakan library Hapi
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      // Mengaktifkan CORS untuk akses dari berbagai domain
      cors: {
        origin: ['*'],
      },
    },
  });
  // Menetapkan routing server sesuai dengan definisi di file routes
  server.route(routes);

  // Memulai server
  await server.start();
  // Menampilkan info bahwa server telah berhasil berjalan
  console.log(`Sedang berjalan pada ${server.info.uri}`);
};

//  memulai server
init();
