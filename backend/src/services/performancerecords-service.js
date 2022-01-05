exports.add = async function (db, performancerecord){
    return (await db.collection('performance_records').insertOne(performancerecord)).insertedId;
}

exports.get = async function(db, employee_id, year){
    if(!isNaN(employee_id)) {
        if(!isNaN(year)) {
            return await db.collection('performance_records').findOne({employee_id:employee_id, year:year});
        } else {
            return await db.collection('performance_records').find({employee_id:employee_id}).toArray();
        }
    } else {
        if(!isNaN(year)) {
            return await db.collection('performance_records').find({year:year}).toArray();
        } else {
            return await db.collection('performance_records').find().toArray();
        }
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

exports.commit = async function(db, employee_id, year){
    return await db.collection('performance_records').updateOne(
        {employee_id:employee_id, year:year},
        {
            $set: {is_committed: true}
        });
}

exports.getCommitted = async function(db){
    return await db.collection('performance_records').find({is_committed: false}).toArray();
}