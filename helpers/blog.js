const textTrim = (str, num) => {
  if (num >= str.length) {
    return str;
  }

  return str.slice(0, num) + "...";
};

module.exports = textTrim;
