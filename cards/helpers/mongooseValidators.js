const URL = {
  type: String,
  match: RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
  ),
  trim: true,
  lowercase: true,
};

const CONFIG256 = {
  type: String,
  required: true,
  minLength: 2,
  maxLength: 256,
  trim: true,
  lowercase: true,
};

exports.URL = URL;
exports.CONFIG256 = CONFIG256;
