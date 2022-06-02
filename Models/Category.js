const mongoose = require("mongoose");

const Category = mongoose.model("Track", {
  category_type: {
    cat_1: "Reggae",
    cat_2: "Dancehall",
    cat_3: "Rap",
    cat_4: "Zouk",
    cat_5: "Kompa",
    cat_6: "Soca",
    cat_7: "Bèlè ( Bel Air )",
    cat_8: "Jazz Caribéen",
  },
});

module.exports = Category;
