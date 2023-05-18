module.exports = function stupitify(input) {
    var stupit = [];
    const str = input;
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        stupit.push(Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase());
    }
    return stupit.join("");
};