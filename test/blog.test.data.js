const mongoose = require("mongoose");
const blogs = [
  {
    _id: mongoose.Types.ObjectId(),
    body: "My name is Enosejolagbon, a backend software engineer in altschool",
    title: "Name",
    description: "description",
    tags: "#backend",
    state: "published",
  },
];

module.exports = blogs;
