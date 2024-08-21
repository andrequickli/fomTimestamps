
function getFirstOfMonthTimestampsFromDateRange(o){
    var {end_date,school_end_time,employment_end_time,endDate,end_timestamp,job_end_timestamp,cert_end_timestamp,proj_end_timestamp,
        start_date,school_start_time,employment_start_time,startDate,start_timestamp,job_start_timestamp,cert_start_timestamp,proj_start_timestamp}=o;
    var end_check = (o?.end_date || endDate || school_end_time || employment_end_time||  end_timestamp ||job_end_timestamp || cert_end_timestamp || proj_end_timestamp)
    var end_date_o = end_check == 'Infinity' || !end_check ? new Date().getTime() : end_check;
    var start_date_o = (o?.start_date || startDate || school_start_time || employment_start_time || start_timestamp ||job_start_timestamp || cert_start_timestamp ||proj_start_timestamp);
    /*        note: is accounting for leap years, but not accounting for the 100 year or 400 year condition.    */
    //flip dates if end is before start.
    var end_date = end_date_o < start_date_o ? start_date_o : end_date_o;
    var start_date = end_date_o < start_date_o ? end_date_o : start_date_o;
    if(!start_date_o) return null
    // var end_date = (o.end_date || new Date().getTime());
        function getDateObjects(d,pre){
            let obj = {};
            let date = new Date(d);
            obj[`${pre}_date`] = date
            obj[`${pre}_year`] = date.getUTCFullYear();
            obj[`${pre}_month`] = date.getUTCMonth()+1;
            obj[`${pre}_day`] = date.getUTCDate();
            return obj;
        }
        const everyNth = (i,n) => /\./.test((i/n).toString()) === false && i != 0;
        const {target_end_date,target_end_year,target_end_month,target_end_day} = getDateObjects(end_date,'target_end');
        const {target_start_date,target_start_year,target_start_month,target_start_day} = getDateObjects(start_date,'target_start');
        const month_days = [31,29,31,30,31,30,31,31,30,31,30,31];    
        const daymonth = Array(12).fill().map((_,i)=> i+1).map((a,i,r)=> [1,a]);
    try{
        const every_day = Array(target_end_year-target_start_year+1).fill().map((_,i)=> i+target_start_year).map(yr=>daymonth.map(dm=> [...dm,...[yr]])).flat();
    
        const all_dates = every_day.map(dmy=> `${dmy[2]}-${(dmy[1] < 10 ? '0'+dmy[1].toString() : dmy[1])}-${(dmy[0] < 10 ? '0'+dmy[0].toString() : dmy[0])}`).map(dstring=> /\d+-02-29/.test(dstring) &&!everyNth(parseInt(/^\d+/.exec(dstring)[0]),4) ? null : dstring).filter(i=> i).map(i=> new Date(i).getTime());
        const target_start_timestamp = new Date(start_date).getTime();
        const target_end_timestamp = new Date(end_date).getTime();
        var fom_timestamps = all_dates.filter(dd=> dd >= target_start_timestamp && dd<=target_end_timestamp)
        if(end_check == 'Infinity') fom_timestamps.push('Infinity');
        return fom_timestamps
    }
    catch(err){
        console.log(err)
        console.log(o)
        return null
    }
}
