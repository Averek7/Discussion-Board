const Discussion = require("../models/Discussion");

exports.createDiscussion = async (req, res) => {
  const { text, hashtags } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const newDiscussion = new Discussion({
      user: req.user.id,
      text,
      image,
      hashtags: hashtags.split(",").map((tag) => tag.trim()),
    });

    const discussion = await newDiscussion.save();

    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateDiscussion = async (req, res) => {
  const { text, hashtags } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    if (discussion.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { text, image, hashtags: hashtags.split(",").map((tag) => tag.trim()) },
      { new: true }
    );

    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteDiscussion = async (req, res) => {
  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    if (discussion.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Discussion.findByIdAndDelete(req.params.id);

    res.json({ msg: "Discussion removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getDiscussionsByTag = async (req, res) => {
  try {
    const discussions = await Discussion.find({ hashtags: req.params.tag });
    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getDiscussionsByText = async (req, res) => {
  try {
    const discussions = await Discussion.find({
      text: { $regex: req.params.text, $options: "i" },
    });
    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().populate("user", [
      "name",
      "email",
    ]);
    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.addComment = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    discussion.comments.unshift(newComment);

    await discussion.save();

    res.json(discussion.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    const comment = discussion.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    discussion.comments = discussion.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await discussion.save();

    res.json(discussion.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.editComment = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    let comment = discussion.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    comment = await Discussion.findOneAndUpdate(
      { "comments._id": req.params.comment_id },
      {
        $set: {
          "comments.$.text": req.body.text,
        },
      },
      { new: true }
    );

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

exports.likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    if (
      discussion.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Discussion already liked" });
    }

    discussion.likes.unshift({ user: req.user.id });

    await discussion.save();

    res.json(discussion.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.unlikeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    if (
      discussion.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Discussion has not yet been liked" });
    }

    discussion.likes = discussion.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await discussion.save();

    res.json(discussion.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.likeComment = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    const comment = discussion.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (
      comment.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Comment already liked" });
    }

    comment.likes.unshift({ user: req.user.id });

    await discussion.save();

    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    const comment = discussion.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (
      comment.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Comment has not yet been liked" });
    }

    comment.likes = comment.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await discussion.save();

    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.incrementViewCount = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    discussion.views += 1;

    await discussion.save();

    res.json(discussion.views);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
