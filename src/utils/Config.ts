class Config {
    private static instance: Config;
    public zacks: number = 0.25;
    public technical: number = 0.5;
    public analyst: number = 0.25;
    public maxCap: number = 0.1;

    private constructor() {

}

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    public set(zacks: number, technical: number, analyst: number, maxCap: number): void {
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

    fromJSON(json: any): Config {
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