export class CountFormatter {
    static countAbbr(val: number, dep=1): string {
        let x = (''+val).length;
        const depp = Math.pow(10,dep);
        x -= x % 3
        return Math.round(val*depp/Math.pow(10,x))/depp+" kMGTPE"[x/3]
    }
    
}