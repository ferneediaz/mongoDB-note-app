import Note from "../model/NoteModel.js";
import mongoose from "mongoose";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // -1 for descending order
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    res.status(201).json({
      message: "note created",
      note: newNote,
    });
    await newNote.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    // guard clause to check if the id is valid format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }

    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "note not found" });
    }
    res.status(200).json({
      message: "note updated successfully",
      note: { title, content },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    // guard clause to check if the id is valid format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "note not found" });
    }
    res
      .status(200)
      .json({ message: "note deleted successfully", note: deletedNote });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    // guard clause to check if the id is valid format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}
