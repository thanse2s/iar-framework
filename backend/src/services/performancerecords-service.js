exports.add = async function (db, performancerecord){
    return (await db.collection('performance_records').insertOne(performancerecord)).insertedId;
}

exports.get = async function(db, employee_id, year){
    if(!isNaN(employee_id)) {
        if(!isNaN(year)) {
            console.log("check");
            return await db.collection('performance_records').findOne(
                {employee_id:employee_id, year:year},
                {projection:{_id: 0}});
        } else {
            return await db.collection('performance_records').find(
                {employee_id:employee_id},
                {projection:{_id: 0}}).toArray();
        }
    } else {
        if(!isNaN(year)) {
            return await db.collection('performance_records').find(
                {year:year},
                {projection:{_id: 0}}).toArray();
        } else {
            return await db.collection('performance_records').find({}, {projection:{_id: 0}}).toArray();
        }
    }
}

exports.update = async function(db, performancerecord){
    return await db.collection('performance_records').updateOne(
        {
            employee_id:performancerecord.employee_id,
            year:performancerecord.year
        },
        {
            $set: {social_performance: performancerecord.social_performance,
                orders_evaluation: performancerecord.orders_evaluation,
                is_committed: false}
        },
        {
            upsert: true
        });
}

exports.delete = async function(db, employee_id, year){
    return await db.collection('performance_records')
        .deleteMany({employee_id:employee_id, year:year});
}

exports.commit = async function(db, employee_id, year){
    return await db.collection('performance_records').updateOne(
        {
            employee_id:employee_id,
            year:year
        },
        {
            $set: {is_committed: true}
        });
}

exports.getCommitted = async function(db){
    return await db.collection('performance_records').find({is_committed: false}, {projection:{_id: 0}}).toArray();
}

exports.checkOrderEvaluationIsPresent= async function (db, employee_id, year, orderEvaluation) {
    let result = await db.collection('performance_records').findOne(
        {
            employee_id: employee_id,
            year: year,
            orders_evaluation: orderEvaluation
        },
        {
            projection:{_id: 0}
        });
    return result !== null;
}