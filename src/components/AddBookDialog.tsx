"use client";

import { useState, useEffect } from "react";
import { Book } from "@/types/book";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Omit<Book, "id">) => void;
  onUpdateBook?: (book: Book) => void;
  existingBook?: Book;
}

export default function AddBookDialog({
  isOpen,
  onClose,
  onAddBook,
  onUpdateBook,
  existingBook,
}: AddBookDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    coverImageUrl: "",
    rating: 0,
    notes: "",
  });

  // Update form data when existing book changes
  useEffect(() => {
    if (existingBook) {
      setFormData({
        title: existingBook.title,
        author: existingBook.author,
        coverImageUrl: existingBook.coverImageUrl,
        rating: existingBook.rating,
        notes: existingBook.notes || "",
      });
    } else {
      setFormData({
        title: "",
        author: "",
        coverImageUrl: "",
        rating: 0,
        notes: "",
      });
    }
  }, [existingBook]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingBook && onUpdateBook) {
      onUpdateBook({ ...existingBook, ...formData });
    } else {
      onAddBook(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-bricolage)" }}>
            {existingBook ? "Edit Book" : "Add a New Book"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              type="url"
              required
              value={formData.coverImageUrl}
              onChange={(e) =>
                setFormData({ ...formData, coverImageUrl: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              required
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              {existingBook ? "Update Book" : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
