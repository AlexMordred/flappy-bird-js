class Fx
{
    constructor(collection) {
        this.collection = collection;

        for (let name in this.collection) {
            const audio = new Audio();
            audio.src = this.collection[name];

            this.collection[name] = audio;
        }
    }

    /**
     * Play a sound from the collection by its name
     * @param {string} name 
     */
    play(name) {
        if (this.collection[name].paused) {
            this.collection[name].play();
        } else {
            this.collection[name].pause();
            this.collection[name].currentTime = 0;
            this.collection[name].play();
        }
    }
}

export default Fx;