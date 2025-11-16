import Note from "../models/Note.js";

function isOwner(note, userId) {
  if (!note) return false;
  return String(note.userId) === String(userId);
}

export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    if (!notes) {
      return res.status(404).json({ message: "No notes found" });
    }
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getting all notes", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content, userId: req.user.userId });
    const savedNote = await newNote.save();
    if (!savedNote) {
      return res.status(400).json({ message: "Failed to create note" });
    }

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in creating note", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (!isOwner(note, req.user.userId)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    const updated = await note.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updating note", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (!isOwner(note, req.user.userId)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleting note", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (!isOwner(note, req.user.userId)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getting note by ID", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
