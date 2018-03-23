export const parseDate = (datetime) => {
    const [date, time] = datetime.split(' ')
    const [year, month, day] = date.split('-')
    const [hour, minute, second] = time.split(':')

    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    }
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
export const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
export const getRelativePath = (url) => url.replace(/^.*[/]/, '') 