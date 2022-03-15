const mongoose = require("mongoose");
const schema = mongoose.Schema;

const settings_schema = new schema(
  {
    popup_text: { type: String, default: "" },
    homepage_big_banner: { type: String, default: "" },
    official_website_link: { type: String, default: "" },
    company_name: { type: String, default: "" },
    brand_name_1: { type: String, default: "" },
    buissness_model_1: { type: String, default: "" },
    brand_name_2: { type: String, default: "" },
    buissness_model_2: { type: String, default: "" },
    brand_name_3: { type: String, default: "" },
    buissness_model_3: { type: String, default: "" },
    brand_name_4: { type: String, default: "" },
    buissness_model_4: { type: String, default: "" },
    brand_name_5: { type: String, default: "" },
    buissness_model_5: { type: String, default: "" },
    brand_name_6: { type: String, default: "" },
    buissness_model_6: { type: String, default: "" },
    hint_text: { type: String, default: "" },
    current_stock_price: { type: Number, default: 0 },
    contact_email: { type: String, default: "" },
    is_join_form_enabled: { type: Boolean, default: false },
    transfers_enabled: { type: Boolean, default: false },
    app_links_enabled: { type: Boolean, default: false },
    free_stocks_to_give: { type: Number, default: 0 },
    referal_stocks: { type: Number, default: 0 },
    advertisement_image_1: { type: String, default: "" },
    advertisement_image_1_actual: { type: String, default: "" },
    advertisement_image_2: { type: String, default: "" },
    advertisement_image_3: { type: String, default: "" },
    home_banner_2: { type: String, default: "" },
    home_banner_2_link: { type: String, default: "" },
    home_banner_3: { type: String, default: "" },
    home_banner_3_link: { type: String, default: "" },
    stuff_page_banner: { type: String, default: "" },
    stuff_page_banner_link: { type: String, default: "" },
    join_form_close_duration: { type: String, default: "" },
  },
  {
    timeseries: true,
  }
);

const Settings = mongoose.model("settings", settings_schema);

module.exports = {
  Settings,
};
