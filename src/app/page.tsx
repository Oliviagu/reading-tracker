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
    setBooks([...books, book]);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-emerald-100 to-sky-100 animate-gradient" />

      <h1 className="text-3xl font-bold text-center mb-6 font-bricolage relative z-10">
        My Bookshelf
      </h1>

      {/* Frosted glass container */}
      <div className="w-[600px] h-[600px] bg-white/30 backdrop-blur-lg rounded-xl shadow-lg pt-8 px-6 pb-6 overflow-auto relative z-10">
        <div className="grid grid-cols-3 gap-x-2 gap-y-4 auto-rows-min">
          {/* Add Book Button */}
          <div
            onClick={() => {
              setSelectedBook(undefined);
              setIsDialogOpen(true);
            }}
            className="w-[160px] h-[240px] rounded-lg border-2 border-dashed border-gray-400 transition-transform hover:scale-105 mx-auto bg-gray-200/50 flex items-center justify-center cursor-pointer"
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
                className="w-[160px] h-[240px] rounded-lg shadow-md relative overflow-hidden cursor-pointer"
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

      {/* Add the animation keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
