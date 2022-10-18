export enum TimeEpoch {
    year = 60*60*24*30*365,
    month = 60*60*24*30,
    day = 60*60*24,
    hour = 60*60,
    minute = 60,
    second = 1,
}


export class TimeFormatter {
    static timeSince(date: Date): string {
        const  seconds = Math.floor((new Date().getTime()-date.getTime()) / 1000);
        const generateUnit  = (interval: number, unit: string)=>{
            const val =  Math.floor(interval)
            return `${val} ${unit}${val > 1? 's': ''} ago`
        }
        const units = ['year', 'month', 'day', 'hour', 'minute', 'second']
        let result = ''
        for (const unit of units) {
            let  interval = seconds / TimeEpoch[unit];
            if (interval > 1 || !TimeEpoch[unit]) {
                result =  generateUnit(interval, unit)
                break
            }
        }
        return result
    }
}
