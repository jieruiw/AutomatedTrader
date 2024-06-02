class Config {
    constructor() {
        this.zacks = 0.25;
        this.technical = 0.5;
        this.analyst = 0.25;
        this.maxCap = 0.1;
    }
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
    set(zacks, technical, analyst, maxCap) {
        this.zacks = zacks;
        this.technical = technical;
        this.analyst = analyst;
        this.maxCap = maxCap;
    }
    toJSON() {
        return {
            zacks: this.zacks,
            technical: this.technical,
            analyst: this.analyst,
            maxCap: this.maxCap
        };
    }
    fromJSON(json) {
        const instance = Config.getInstance();
        instance.zacks = json.zacks;
        instance.technical = json.technical;
        instance.analyst = json.analyst;
        instance.maxCap = json.maxCap;
        return instance;
    }
}
const instance = Config.getInstance();
export default instance;
