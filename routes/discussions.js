const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  auth,
  upload.single("image"),
  discussionController.createDiscussion
);

router.put(
  "/:id",
  auth,
  upload.single("image"),
  discussionController.updateDiscussion
);

router.delete("/:id", auth, discussionController.deleteDiscussion);

router.get("/tag/:tag", discussionController.getDiscussionsByTag);

router.get("/text/:text", discussionController.getDiscussionsByText);

router.get("/", discussionController.getDiscussions);

router.post("/comment/:id", auth, discussionController.addComment);

router.delete(
  "/comment/:id/:comment_id",
  auth,
  discussionController.deleteComment
);

router.put("/like/:id", auth, discussionController.likeDiscussion);

router.put("/unlike/:id", auth, discussionController.unlikeDiscussion);

router.put(
  "/comment/like/:id/:comment_id",
  auth,
  discussionController.likeComment
);

router.put(
  "/comment/unlike/:id/:comment_id",
  auth,
  discussionController.unlikeComment
);

router.put("/view/:id", discussionController.incrementViewCount);

module.exports = router;
