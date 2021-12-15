exports.add = async function (db, performancerecord){
    return (await db.collection('performance_records').insertOne(performancerecord)).insertedId;
}

exports.get = async function(db,employee_id,year){
    console.log(await db.collection('performance_records').findOne({employee_id:66, year:2021}));
    return await db.collection('performance_records').findOne({employee_id:employee_id, year:year});
}

exports.update = async function(db, performancerecord){
    return await db.collection('performance_records').updateOne(
        {employee_id:performancerecord.employee_id, year:performancerecord.year}, performancerecord);
}

exports.delete = async function(db, employee_id, year){
    return await db.collection('performance_records')
        .deleteMany({employee_id:employee_id, year:year});
}
