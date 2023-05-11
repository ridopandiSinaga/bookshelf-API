// Mengimpor fungsi handler dari file "handler.js"
const {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

// Menentukan rute API yang akan di-handle dan fungsinya
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getDetailBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler,
  },
];

// Meng-export variabel "routes" agar dapat digunakan pada file lain
module.exports = routes;
