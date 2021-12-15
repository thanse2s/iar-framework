exports.add = async function (db, performancerecord){
    return (await db.collection('performance_records').insertOne(performancerecord)).insertedId;
}

exports.get = async function(db, employee_id, year){
    if(!isNaN(year)) {
        return await db.collection('performance_records').findOne({employee_id:employee_id, year:year});
    } else {
        return await db.collection('performance_records').find({employee_id:employee_id}).toArray();
    }
}

exports.update = async function(db, performancerecord){
    return await db.collection('performance_records').updateOne(
        {employee_id:performancerecord.employee_id, year:performancerecord.year},
        {
            $set: {social_performance: performancerecord.social_performance,
                orders_evaluation: performancerecord.orders_evaluation}
        });
}

exports.delete = async function(db, employee_id, year){
    return await db.collection('performance_records')
        .deleteMany({employee_id:employee_id, year:year});
}
