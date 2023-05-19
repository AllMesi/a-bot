module.exports = {
    stupitify: (input) => {
        var stupit = [];
        const str = input;
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            stupit.push(Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase());
        }
        return stupit.join("");
    },
    genRandLetters: (amt, cs = "abcdefghijklmnopqrstuvwxyz") => {
        var letters = [];
        for (let i = 0; i < amt; i++) {
            letters.push(cs.charAt(Math.floor(Math.random() * cs.length)));
        }
        return letters.join("");
    },
    reverse: (input) => {
        var letters = [];
        for (let i = 0; i < input.length; i++) {
            letters.push(input.charAt(i));
        }
        letters.reverse();
        return letters.join("");
    }
};