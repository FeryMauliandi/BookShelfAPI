const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
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

    if (name === undefined){
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    } else if ( readPage > pageCount ) {
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    } else {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        let finished = false;

        if ( pageCount == readPage ){
            finished = true;
        }
        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            insertedAt,
            updatedAt
        };
        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        
        if ( isSuccess ) {
            const response = h.response({
                status : "success",
                message : "Buku berhasil ditambahkan",
                data : {
                    bookId : id,
                },
            });
            response.code(201);
            return response;
        }
        const response = h.response({
            status : "fail",
            message : "Buku gagal ditambahkan",
        });
        response.code(400);
        return response;
    };
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    if ( reading !== undefined ) {
        if ( reading === "1" ) {
            const book = books.filter((n) => n.reading === true).map((res) => {
                return {
                    id: res.id,
                    name: res.name,
                    publisher: res.publisher,
                };
            });
            const response = h.response({
                status: "success",
                data: {
                    books: book,
                },
            });
            response.code(200);
            return response;
        } else if ( reading === "0" ){
            const book = books.filter((n) => n.reading === false).map((res) => {
                return {
                    id: res.id,
                    name: res.name,
                    publisher: res.publisher,
                };
            });
            const response = h.response({
                status: "success",
                data: {
                    books: book,
                },
            });
            response.code(200);
            return response;
        }
    };
    if ( finished !== undefined ) {
        if ( finished === "1" ) {
            const book = books.filter((n) => n.finished === true).map((res) => {
                return {
                    id: res.id,
                    name: res.name,
                    publisher: res.publisher,
                };
            });
            const response = h.response({
                status: "success",
                data: {
                    books: book,
                },
            });
            response.code(200);
            return response;
        } else if ( finished === "0" ) {
            const book = books.filter((n) => n.finished === false).map((res) => {
                return {
                    id: res.id,
                    name: res.name,
                    publisher: res.publisher,
                };
            });
            const response = h.response({
                status: "success",
                data: {
                    books: book,
                },
            });
            response.code(200);
            return response;
        }
    };
    if ( name !== undefined ) {
        const book = books.filter((n) => n.name.toUpperCase().includes(name.toUpperCase()))
            .map((res) => {
                return {
                    id: res.id,
                    name: res.name,
                    publisher: res.publisher,
                };
            });
        const response = h.response({
            status: "success",
            data: {
                books: book,
            },
        });
        response.code(200);
        return response;
    };

    const allBook = books.map((book) => {
        return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        };
    });
    
    const response = h.response({
        status: "success",
        data: {
            books : allBook,
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const dataBook = books.filter((book) => book.id === id)[0];
    if (dataBook === undefined) {
      const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
      });
      response.code(404);
      return response; 
    }

    const response = h.response({
      status: "success",
      data: {
        book: dataBook,
      },
    });
    response.code(200);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    if ( id === undefined ) {
        const response = h.response({
            status : "fail",
            message : "Gagal memperbarui buku. Id tidak ditemukan",
        });
        response.code(404);
        return response;
    }
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

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if ( index !== -1 ) {
        books[index]  = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        if ( name === undefined ) {
            const response = h.response({
                status : "fail",
                message : "Gagal memperbarui buku. Mohon isi nama buku",
            });
            response.code(400);
            return response;
        };

        if ( readPage > pageCount ) {
            const response = h.response({
                status : "fail",
                message : "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            });
            response.code(400);
            return response;
        };

        const response = h.response({
            status : "success",
            message : "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;

};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);
  
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};



module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };