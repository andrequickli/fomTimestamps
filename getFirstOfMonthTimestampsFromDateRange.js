
function getFirstOfMonthTimestampsFromDateRange(o){
    /*        note: is accounting for leap years, but not accounting for the 100 year or 400 year condition.    */
    if(!o?.start_date) return null
    var end_date = (o.end_date || new Date().getTime());
        function getDateObjects(d,pre){
            let obj = {};
            let date = new Date(d);
            obj[`${pre}_date`] = date
            obj[`${pre}_year`] = date.getUTCFullYear();
            obj[`${pre}_month`] = date.getUTCMonth()+1;
            obj[`${pre}_day`] = date.getUTCDate();
            return obj;
        }
        function ymdFormat(d){
            let date = new Date(d);
            let yr = date.getUTCFullYear();
            let mo = date.getUTCMonth()+1;
            let day = date.getUTCDate();
            return `${yr}-${(mo < 10 ? '0'+mo.toString() : mo)}-${(day < 10 ? '0'+day.toString() : day)}`;
        }
        const everyNth = (i,n) => /\./.test((i/n).toString()) === false && i != 0;
    
        const {target_end_date,target_end_year,target_end_month,target_end_day} = getDateObjects(end_date,'target_end');
        const {target_start_date,target_start_year,target_start_month,target_start_day} = getDateObjects(o.start_date,'target_start');
    
    
        const month_days = [31,29,31,30,31,30,31,31,30,31,30,31];
    
        const daymonth = Array(12).fill().map((_,i)=> i+1).map((a,i,r)=> [1,a]);
    try{
        const every_day = Array(target_end_year-target_start_year+1).fill().map((_,i)=> i+target_start_year).map(yr=> daymonth.map(dm=> [...dm,...[yr]])).flat();
    
        const all_dates = every_day.map(dmy=> `${dmy[2]}-${(dmy[1] < 10 ? '0'+dmy[1].toString() : dmy[1])}-${(dmy[0] < 10 ? '0'+dmy[0].toString() : dmy[0])}`).map(dstring=> /\d+-02-29/.test(dstring) && !everyNth(parseInt(/^\d+/.exec(dstring)[0]),4) ? null : dstring).filter(i=> i).map(i=> new Date(i).getTime());
        const target_start_timestamp = new Date(o.start_date).getTime();
        const target_end_timestamp = new Date(end_date).getTime();
        return all_dates.filter(dd=> dd >= target_start_timestamp && dd<=target_end_timestamp)
    }
    catch(err){
        console.log(err)
        console.log(o)
        return null
    }
}
