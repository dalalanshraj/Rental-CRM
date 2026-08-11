import Note from "../models/Note.js";

// ===============================
// CREATE NOTE
// ===============================
export const createNote = async (req, res) => {
  try {
    const { text, lead, organization } = req.body;

    const count = await Note.countDocuments();

    const note = await Note.create({
      text,
      lead: lead || null,
      organization: organization || null,
      createdBy: req.user.id,
      order: count + 1,
    });

    const populated = await Note.findById(note._id)
      .populate("createdBy", "name")
      .populate("lead", "name")
      .populate("organization", "name");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// GET NOTES
// ===============================
export const getNotes = async (req, res) => {
  try {
    const { lead, organization } = req.query;

    let filter = {};

    if (lead) {
      filter.lead = lead;
    }

    if (organization) {
      filter.organization = organization;
    }

   const notes = await Note.find(filter)
  .populate("createdBy", "name")
  .sort({
    pinned: -1,
    createdAt: -1,
  });

 

res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// UPDATE NOTE
// ===============================
export const updateNote = async (req, res) => {
  try {

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.text = req.body.text;

    // NEW
    note.edited = true;
    note.editedAt = new Date();

    await note.save();

    const updated = await Note.findById(note._id)
      .populate("createdBy", "name");

    res.json(updated);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// ===============================
// DELETE NOTE
// ===============================
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      id: req.params.id,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// PIN / UNPIN
// ===============================
export const pinNote = async (req, res) => {
  try {

    console.log("Clicked:", req.params.id);

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    console.log("Before:", note.pinned);

    note.pinned = !note.pinned;

    note.pinnedAt = note.pinned
      ? new Date()
      : null;

    await note.save();

    const updated = await Note.findById(note._id)
      .populate("createdBy", "name");

    console.log("After:", updated.pinned);

    return res.json(updated);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
};
