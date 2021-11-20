exports.add = async function (db,performancerecord){
    return (await db.collection('performance_records').insertOne(performancerecord)).insertedId;
}

exports.get = async function(db,employee_id,year){
    return db.collection('performance_records').findOne({employee_id:employee_id, year:year});
}
