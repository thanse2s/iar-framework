exports.add = async function (db,salesman){
    return (await db.collection('salesman').insertOne(salesman)).insertedId;
}

exports.get = async function(db,id){
    return db.collection('salesman').findOne({employee_id:id});
}

