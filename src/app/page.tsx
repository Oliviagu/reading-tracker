"use client";

import { useState, useEffect } from "react";
import { Book } from "@/types/book";
import AddBookDialog from "@/components/AddBookDialog";
import { motion } from "framer-motion";

const STORAGE_KEY = "reading-tracker-books";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();

  // Load books from local storage on initial render
  useEffect(() => {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks));
      } catch (error) {
        console.error("Error loading books from local storage:", error);
      }
    }
  }, []);

  // Save books to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const handleAddBook = (newBook: Omit<Book, "id">) => {
    const book: Book = {
      ...newBook,
      id: Date.now().toString(), // Simple ID generation
    };
    setBooks([book, ...books]);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#FFF5E6]">
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 font-bricolage relative z-10">
        My Bookshelf
      </h1>
      <div className="flex relative">
        <div className="absolute left-[-180px] bottom-[-50px] md:bottom-0 h-[700px]">
          <img
            src="/lamp.png"
            alt="Decorative lamp"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-0 right-[-200px] h-[400px] z-0 md:z-11">
          <img
            src="/monstera.png"
            alt="Decorative monstera plant"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Frosted glass container */}
        <div className="w-[350px] md:w-[600px] h-[600px] bg-white/30 backdrop-blur-lg rounded-xl shadow-lg pt-6 md:pt-8  px-4 md:px-6 pb-6 overflow-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4 auto-rows-min">
            {/* Add Book Button */}
            <div
              onClick={() => {
                setSelectedBook(undefined);
                setIsDialogOpen(true);
              }}
              className="w-[150px] md:w-[160px] h-[225px] md:h-[240px] rounded-lg border-2 border-dashed border-gray-400 transition-transform hover:scale-105 mx-auto bg-gray-200/50 flex items-center justify-center cursor-pointer"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">+</div>
                <div className="text-sm font-medium">Add a new book</div>
              </div>
            </div>

            {/* Book Covers */}
            {books.map((book) => (
              <div key={book.id} className="flex flex-col items-center">
                <motion.div
                  onClick={() => handleBookClick(book)}
                  className="w-[150px] md:w-[160px] h-[225px] md:h-[240px] rounded-lg shadow-md relative overflow-hidden cursor-pointer"
                  initial={{ rotate: 0 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: Math.random() > 0.5 ? 4 : -4,
                    transition: { duration: 0.3 },
                  }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={book.coverImageUrl}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="mt-2 text-sm font-medium font-bricolage">
                  ⭐ {book.rating}/5
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Add/Edit Book Dialog */}
      <AddBookDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedBook(undefined);
        }}
        onAddBook={handleAddBook}
        onUpdateBook={handleUpdateBook}
        existingBook={selectedBook}
      />
    </div>
  );
}
