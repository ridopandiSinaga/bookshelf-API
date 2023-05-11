// Import dependensi Nanoid dan file books.js
const { nanoid } = require('nanoid');
const books = require('./books');

// Fungsi untuk menambahkan buku
const addBookHandler = (request, h) => {
  // Menyimpan data yang dikirimkan oleh client ke variabel
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Respon jika nama buku tidak diisi
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Respon Jika nilai readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Generate id buku baru dengan menggunakan Nanoid
  const id = nanoid(16);
  // Tentukan apakah buku sudah selesai dibaca atau belum
  const finished = pageCount == readPage;
  // Simpan tanggal dan waktu saat buku ditambahkan ke dalam variabel insertedAt dan updatedAt
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Buat objek buku baru dengan properti2 nya
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Tambahkan buku baru ke dalam array books
  books.push(newBook);
  // Cek apakah buku berhasil ditambahkan dengan cara mencari buku dengan id yang sama di dalam array books
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  // Respons body
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Fungsi untuk mendapatkan semua buku
const getAllBooksHandler = (request, h) => {
  // Menyimpan query parameter yang dikirimkan oleh client ke dalam variabel
  const { name, reading, finished } = request.query;

  // Jika terdapat data buku di dalam array books, lakukan filter berdasarkan query parameter yang dikirimkan
  if (books.length > 0) {
    let booksWithFilter = books;

    if (name) {
      booksWithFilter = booksWithFilter.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading) {
      booksWithFilter = booksWithFilter.filter((book) => book.reading == Number(reading));
    }

    if (finished) {
      booksWithFilter = booksWithFilter.filter((book) => book.finished == Number(finished));
    }

    // Response Body:
    const response = h.response({
      status: 'success',
      data: {
        books: booksWithFilter.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  response.code(200);
  return response;
};

// Mengambil detail buku berdasarkan id yang diminta oleh user
const getDetailBookByIdHandler = (request, h) => {
  // Menyimpan id yg direquest user
  const { id } = request.params;
  console.log(books);
  // Mencari buku dengan id yang sesuai
  const book = books.filter((book) => book.id === id)[0];
  // Response body:
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Fungsi untuk mengedit data buku berdasarkan id
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  // Mendapatkan data buku yang ingin diedit berdasarkan id
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Mencari index dari buku yang ingin diedit di dalam array books
  const index = books.findIndex((book) => book.id === id);
  // Respons body:
  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    // Jika data yang diberikan valid, maka akan dilakukan pengeditan data buku
    const finished = pageCount == readPage;
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    // Response body:
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// fungsi unntuk menghapus buku per id
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  // Cari index dari buku yang ingin dihapus
  const index = books.findIndex((book) => book.id === id);
  // Response body:
  if (index > -1) {
    // Hapus buku dari array books berdasarkan index yang ditemukan
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Export semua function handler
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
